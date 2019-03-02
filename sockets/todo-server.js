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
  socket.on('create-todo', (currentListId, sender) => {
    console.log('got a create todo request for checklistId: ' + currentListId);
    let todo = new Todo({
      name: '',
      checklistId: currentListId
    });
    todo.save(function(err, todo) {
      if (err) { console.error(err) };
      Checklist.findByIdAndUpdate(currentListId, {
          $addToSet: { todoItems: todo._id } 
        }, (err) => {
          if (err) { console.error(err) }
          console.log('successfully created new todo with ID: ' + todo._id);
          socket.emit('create-todo', { 
            todo,
            sender,
          })
        });
    });
  })

  /***********************
  *       SAVE TODO         
  ***********************/
  socket.on('save-todo', (todoData) => {
    const { todoId, todoInputValue } = todoData;
    console.log('got a save request for todo.id: ' + todoId);
    Todo.findByIdAndUpdate(
      todoId, { 
        $set: { name: todoInputValue } 
      }, (err) => {
        if (err) return console.error(err);
      });
      console.log('successfully saved todo.id: ' + todoId);
  })


  /***********************
  *     DELETE TODO         
  ***********************/
  socket.on('delete-todo', (todoId) => {
    console.log('got a delete request for todo.id: ' + todoId);
    Todo.findByIdAndRemove(todoId, (err, todo) => {
      if (err) return console.log(err);
      console.log('found todo to delete');
      Checklist.findByIdAndUpdate(todo.checklistId, {
        $pull: { todoItems: todoId }}, (err) => {
          if (err) { res.send(err) };
          console.log('todo item with id: ' + todoId + ' was successfully deleted and removed from checklist');
          socket.emit('delete-todo', todoId);
        });
    });
  })

  /***********************
  *     TOGGLE TODO         
  ***********************/
  socket.on('toggle-todo', (todosToUpdate) => {
    todosToUpdate.forEach((todo) => {
      let todoId = todo.id;
      let todoCompletion = todo.completed;
      Todo.findByIdAndUpdate(todoId, { // TODO: change to findOneAndUpdate
          $set: { completed: todoCompletion }
        }, (err) => {
          if (err) return console.error(err);
        });
    })
    socket.emit('toggle-todo');
  })
}