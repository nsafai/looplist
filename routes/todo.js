var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// POST/CREATE Todo
router.post('/create-todo', auth.requireLogin, function(req, res, next) {

  const currentListId = req.body.currentListId;

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
  const todoId = req.body.todoId;
  const todoInputValue = req.body.todoInputValue;

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
  const todoId = req.query.id;
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

  const todoId = req.body.todoId;
  const completed = req.body.completed;
  console.log('toggling todoId: ' + todoId + ' / status: ' + completed);

  Todo.findByIdAndUpdate(todoId, {
    // TODO: change to findOneAndUpdate
      $set: {
        completed: completed
      }
    },
    function(err) {
      if (err) { console.error(err) };
    });
    return res.send('hey finished toggling todo');
})

// RESET ALL todos
router.post('/reset-all-todos', auth.requireLogin, function(req, res, next) {
  // console.log()
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
        // res.render('/lists');
    });
    console.log('todos were reset');
    return res.send('todo items were reset.');
  });
})

module.exports = router;
