const app = require('./lib/app');
const pool = require('./lib/utils/pool');
const color = require('colors');

const API_URL = process.env.API_URL || 'http://localhost';
const PORT = process.env.PORT || 7890;

const server = require('http').createServer(app);
server.listen(PORT, () => {});

const io = require('socket.io')(server, {
  cors: {
    origin: [
      'https://codepals.netlify.app',
      'https://codepalz.herokuapp.com',
      'http://localhost:7890',
      'http://localhost:7891',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

const {
  joinUser,
  getCurrentUser,
  deleteUser,
} = require('./lib/chatroom/dummyData');

// const io = socket(server, { cors: { origin: 'http://localhost:7891' } });

//initializing socket io connection
io.on('connection', (socket) => {
  //new user joining
  socket.on('joinRoom', ({ username, roomname }) => {
    //create user

    const chatUser = joinUser(socket.id, username, roomname);
    socket.join(chatUser.room);

    //display a welcome message
    socket.emit('message', {
      userId: chatUser.id,
      username: chatUser.username,
      text: '',
    });
    //display join message for all minus the one joining
    socket.broadcast.to(chatUser.room).emit('message', {
      userId: chatUser.id,
      username: chatUser.username,
      text: `${chatUser.username} has joined the chat!`,
    });
    //user sending message
    socket.on('chat', (text) => {
      //gets the room user + message sent
      const chatUser = getCurrentUser(socket.id);

      io.to(chatUser.room).emit('message', {
        userId: chatUser.id,
        username: chatUser.username,
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
          username: chatUser.username,
          text: `${chatUser.username} has left the chat!`,
        });
      }
    });
  });
});

process.on('exit', () => {
  console.log('👋  Goodbye!');
  pool.end();
});
