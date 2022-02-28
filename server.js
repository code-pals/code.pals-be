const app = require('./lib/app');
const pool = require('./lib/utils/pool');

const socket = require('socket.io');
const color = require('colors');

const {
  joinUser,
  getCurrentUser,
  deleteUser,
} = require('./lib/chatroom/dummyData');

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

const server = app.listen(PORT, () => {
  console.log(`🚀  Server started on ${API_URL}:${PORT}`);
});

const io = socket(server);

//initializing socket io connection
io.on('connection', (socket) => {
  //new user joining
  socket.on('joinRoom', ({ user_id, roomname }) => {
    //create user
    const chatUser = joinUser(socket.id, user_id, roomname);
    socket.join(chatUser.room);

    //display a welcome message
    socket.emit('message', {
      userId: chatUser.id,
      user_id: chatUser.id,
      text: `Welcome ${chatUser.user_id}`,
    });
    //display join message for all minus the one joining
    socket.broadcast.to(chatUser.room).emit('message', {
      userId: chatUser.id,
      user_id: chatUser.id,
      text: `${chatUser.id} has joined the chat!`,
    });
    //user sending message
    socket.on('chat', (text) => {
      //gets the room user + message sent
      const chatUser = getCurrentUser(socket.id);

      io.to(chatUser.room).emit('message', {
        userId: chatUser.id,
        user_id: chatUser.id,
        text,
      });
    });
    //when user exits
    socket.on('disconnect', () => {
      //user is deleted from array and displays a left message
      const chatUser = deleteUser(socket.id);

      if (chatUser) {
        io.to(chatUser.room).emit('message', {
          userId: chatUser.id,
          user_id: chatUser.id,
          text: `${chatUser.id} has left the chat!`,
        });
      }
    });
  });
});

process.on('exit', () => {
  console.log('👋  Goodbye!');
  pool.end();
});
