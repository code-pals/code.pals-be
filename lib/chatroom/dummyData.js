const users = [];
//c_user

//joins the user to specific chatroom
function joinUser(user_id, room) {
  const chatUser = { user_id, room };

  users.push(chatUser);

  return chatUser;
}

//get a particular user id to return current user
function getCurrentUser(id) {
  return users.find((chatUser) => chatUser.id === id);
}

//calls when user leaves the chat and deletes them from the array
function deleteUser(id) {
  const index = users.findIndex((chatUser) => chatUser === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
module.exports = { joinUser, getCurrentUser, deleteUser };
