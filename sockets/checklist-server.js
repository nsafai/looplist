/**********************************************
*         SERVER SOCKET "CHECKLIST"         
**********************************************/

// SOCKET.io Reminders:
// io.emit sends data to all clients on the connection.
// socket.emit sends data to the client that sent the original data to the server.

module.exports = (io, socket) => {
  const Checklist = require('../models/checklist');
  const Todo = require('../models/todo');

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

  /***********************
  *       NEW LIST         
  ***********************/
  socket.on('new-list', (currentUserId) => {
    console.log('someone trying to create a new list');
    let list = new Checklist({
      title: '',
      ownerUserId: currentUserId
    });
    console.log('list: ' + list);
    list.save(function(err, savedList) {
      if (err) return console.error(err);
      socket.emit('new-list', savedList);
    });
  })

  /***********************
  *      DELETE LIST         
  ***********************/
  socket.on('delete-list', (listId) => {
    console.log('got a delete request with: ' + listId);
    Checklist.findByIdAndRemove(listId, (err) => {
      if (err) return console.log(err); 
      socket.emit('delete-list', listId);
    });
  })

  /***********************
  *     SAVE LIST NAME         
  ***********************/
  socket.on('save-list-name', (listData) => {
    const { currentListId, newListName } = listData;
    Checklist.findByIdAndUpdate(
      currentListId, {
        $set: { title: newListName }
      },
      function(err) {
        if (err) return console.error(err);
      });
  })
}