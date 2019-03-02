var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// TOGGLE todo
router.post('/toggle-todo', auth.requireLogin, function(req, res, next) {
  const todosToUpdate = req.body.todosToUpdate;
  console.log(todosToUpdate);

  todosToUpdate.forEach((todo) => {
    console.log(todo);
    let todoId = todo.id;
    console.log(todoId);
    let todoCompletion = todo.completed;
    console.log(todoCompletion);
    console.log('toggling todos with ID: ' + todoId + ' / status: ' + todoCompletion);

    Todo.findByIdAndUpdate(todoId, {
      // TODO: change to findOneAndUpdate
        $set: { completed: todoCompletion }
      },
      function(err) {
        if (err) { console.error(err) };
      });
  })
    return res.send('hey finished toggling all todosToUpdate');
})

// RESET ALL todos
router.post('/reset-all-todos', auth.requireLogin, function(req, res, next) {
  console.log('got a request to reset all todos');
  const checklistId = req.body.checklistId;
  Checklist.findById(checklistId, function(err, checklist){
    if(err) { res.send(err) }
    let todosArray = checklist.todoItems;
    // TODO: FIND TODOS with todosArray and set completed = false
    todosArray.forEach((todo) => {
      Todo.findByIdAndUpdate(todo._id, {
          $set: {
            completed: false
          }
        },
        function(err) {
          if (err) { console.error(err) };
        });
    });
    console.log('todos were reset');
    return res.send('todo items were reset.');
  });
})

module.exports = router;
