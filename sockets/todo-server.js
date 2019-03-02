/* eslint-disable consistent-return */
/* eslint-disable padded-blocks */
/* eslint-disable global-require */
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
  *     CREATE TODO
  ***********************/
  socket.on('create-todo', (currentListId) => {
    console.log(`got a create todo request for checklistId: ${currentListId}`);
    const todo = new Todo({
      name: '',
      checklistId: currentListId,
    });
    todo.save((err, todoInDB) => {
      if (err) { console.error(err) }
      Checklist.findByIdAndUpdate(currentListId, {
        $addToSet: { todoItems: todoInDB.id },
      }, (error) => {
        if (error) { console.error(error) }
        console.log(`successfully created new todo: ${todoInDB}`);
        socket.emit('create-todo', todoInDB.id)
      });
    });
  })

  /***********************
  *       SAVE TODO
  ***********************/
  socket.on('save-todo', (todoData) => {
    const { todoId, todoInputValue } = todoData;
    console.log(`got a save request for todo.id: ${todoId}`);
    Todo.findByIdAndUpdate(
      todoId, {
        $set: { name: todoInputValue },
      }, (err) => {
        if (err) return console.error(err);
      },
    );
    console.log(`successfully saved todo.id: ${todoId}`);
  })


  /***********************
  *     DELETE TODO
  ***********************/
  socket.on('delete-todo', (todoId) => {
    console.log(`got a delete request for todo.id: ${todoId}`);
    Todo.findByIdAndRemove(todoId, (err, todo) => {
      if (err) return console.log(err);
      console.log('found todo to delete');
      if (todo) {
        Checklist.findByIdAndUpdate(todo.checklistId, { $pull: { todoItems: todoId } }, (error) => {
          if (error) return console.log(error)
          console.log(`todo item with id: ${todoId} was successfully deleted and removed from checklist`);
          socket.emit('delete-todo', todoId);
        });
      }
    });
  })

  /***********************
  *     TOGGLE TODO
  ***********************/
  socket.on('toggle-todo', (todosToUpdate) => {
    todosToUpdate.forEach((todo) => {
      const todoId = todo.id;
      const todoCompletion = todo.completed;
      Todo.findByIdAndUpdate(todoId, { // TODO: change to findOneAndUpdate
        $set: { completed: todoCompletion },
      }, (err) => {
        if (err) return console.error(err);
      });
    })
    socket.emit('toggle-todo');
  })

  /***********************
  *    RESET ALL TODOS
  ***********************/

  // RESET ALL todos
  socket.on('reset-all-todos', (checklistId) => {
    console.log('got a request to reset all todos');
    Checklist.findById(checklistId, (err, checklist) => {
      if (err) return console.log(err);
      const todosArray = checklist.todoItems;
      todosArray.forEach((todo) => {
        Todo.findByIdAndUpdate(todo.id, {
          $set: { completed: false },
        }, (error) => {
          if (error) return console.error(err);
        });
      });
      socket.emit('reset-all-todos');
    });
  })
}
