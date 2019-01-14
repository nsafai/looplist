var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// POST/CREATE Todo
router.post('/todos', auth.requireLogin, function(req, res, next) {

  currentListId = req.body.currentListId;

  let todo = new Todo({
    name: '',
    checklistId: currentListId
  });
  // console.log('todo: ' + todo);

  todo.save(function(err, todo) {
    if (err) { console.error(err) };
    Checklist.findByIdAndUpdate(
      currentListId, {
        $addToSet: {
          todoItems: todo._id
        }
      },
      function(err, checklist) {
        if (err) { console.error(err) }
        return res.send(todo);
      });
  });
});

// PUT / EDIT / SAVE / UPDATE todo
router.post('/save-todo', auth.requireLogin, function(req, res, next) {
  // console.log(req.body.todoId);
  todoId = req.body.todoId;
  todoInputValue = req.body.todoInputValue;

  Todo.findByIdAndUpdate(
    todoId, {
      $set: {
        name: todoInputValue
      }
    },
    function(err) {
      if (err) { console.error(err) };
    });
});

// DELETE todos
router.delete('/delete-todo', auth.requireLogin, function(req, res, next) {
  todoId = req.query.id;
  console.log('got a delete request with: ' + todoId);
  Todo.findByIdAndRemove(todoId, function(err, todo) {
    if(err) { res.send(err) }
    Checklist.findByIdAndUpdate(todo.checklistId, function(err, checklist){
      if(err) { res.send(err) }
      
      return res.send('todo item with id: ' + todoId + ' was successfully deleted');
    });
  });
});

// TOGGLE todo
router.post('/toggle-todo', auth.requireLogin, function(req, res, next) {
  todoId = req.body.todoId;
  Todo.findOne({ _id: todoId }, function(err, todo) {
    todo.completed = !todo.completed;
    todo.save(function(err, updatedTodo) {} );
  });
})

module.exports = router;
