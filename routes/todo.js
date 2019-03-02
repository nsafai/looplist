var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

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
