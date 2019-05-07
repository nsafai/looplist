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

  const Checklist = require('../models/checklist')
  const Todo = require('../models/todo')

  /***********************
  *     CREATE TODO
  ***********************/
  socket.on('create-todo', ({ currentListId, todoIndex }) => {
    console.log(`got a create todo request for checklistId: ${currentListId}`)
    const newTodo = new Todo({
      name: '',
      index: todoIndex,
      checklistId: currentListId,
    })
    newTodo.save((err, todo) => {
      if (err) { console.error(err) }
      Checklist.findByIdAndUpdate(currentListId, {
        $addToSet: { todoItems: todo.id },
      }, (error) => {
        if (error) { console.error(error) }
        // eslint-disable-next-line no-param-reassign
        console.log(`successfully created new todo: ${todo}`)
        socket.emit('create-todo', todo)
      })
    })
  })
  /***********************
  *       SAVE TODO
  ***********************/
  socket.on('save-todo', ({ todoId, todoInputValue, todoIndex }) => {
    console.log(`got a save request for todo.id: ${todoId}`)
    Todo.findByIdAndUpdate(
      todoId, {
        $set: { name: todoInputValue, index: todoIndex },
      }, (err) => {
        if (err) return console.error(err)
      },
    )
    console.log(`successfully saved todo.id: ${todoId}`)
  })


  /***********************
  *     DELETE TODO
  ***********************/
  socket.on('delete-todo', (todoId) => {
    console.log(`got a delete request for todo.id: ${todoId}`)
    Todo.findByIdAndRemove(todoId, (err, todo) => {
      if (err) return console.log(err)
      console.log('found todo to delete')
      if (todo) {
        Checklist.findByIdAndUpdate(todo.checklistId, { $pull: { todoItems: todoId } }, (error) => {
          if (error) return console.log(error)
          console.log(`todo item with id: ${todoId} was successfully deleted and removed from checklist`)
          socket.emit('delete-todo', todoId)
        })
      }
    })
  })

  /***********************
  *     TOGGLE TODO
  ***********************/
  socket.on('toggle-todo', ({ todoId, completed }) => {
    console.log('inside toggle todo!')
    Todo.findByIdAndUpdate(
      { _id: todoId }, { $set: { completed } },
      { new: true }, (err, updatedTodo) => { // { new: true } option returns updated object
        console.log('SUCCESS! UPDATED THE OBJECT:', updatedTodo)
        if (err) return console.error(err)
        socket.emit('toggle-todo', updatedTodo)
      },
    )
  })

  /***********************
  *    RESET ALL TODOS
  ***********************/
  socket.on('reset-all-todos', (checklistId) => {
    console.log('got a request to reset all todos on list', checklistId)
    Checklist.findById(checklistId, (err, checklist) => {
      if (err) return console.log(err)
      const todosArray = checklist.todoItems
      console.log('todosArray', todosArray)
      todosArray.forEach((todoId) => {
        Todo.findByIdAndUpdate(todoId, {
          $set: { completed: false },
        }, (error) => {
          if (error) return console.error(error)
        })
      })
    }).then(() => {
      socket.emit('reset-all-todos')
    })
  })
}
