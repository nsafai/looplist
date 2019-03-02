/**********************************************
*         SERVER SOCKET "CHECKLIST"         
**********************************************/

// SOCKET.io Reminders:
// io.emit sends data to all clients on the connection.
// socket.emit sends data to the client that sent the original data to the server.

module.exports = (io, socket) => {
  const Checklist = require('../models/checklist');
  const Todo = require('../models/todo');

  // // SOCKET.IO ROUTES
  io.on('connection', () => {
    console.log('inside checklist socket route');
  })

  /***********************
  *       GET LIST         
  ***********************/
 socket.on('get-list', (id) => {
  console.log('someone requesting lid with id', id);
  Checklist.findById(id, function(err, selectedList) {
    if (err) { console.error(err) }
    if (selectedList) {
      selectedList.updatedAt = Date.now();
      selectedList.save();
      Todo.find({'_id': {
        $in: selectedList.todoItems
      }}, function(err, selectedListTodos) {
        if (err) return console.log(err);
        const listData = {
          currentList: selectedList,
          currentListTodos: selectedListTodos,
        }
        socket.emit('get-list', listData)
      });
    } else {
      console.log('no list found')
    }
  });
 })
}