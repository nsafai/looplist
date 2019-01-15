var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// POST/CREATE Todo
router.post('/create-todo', auth.requireLogin, function(req, res, next) {
  const currentListId = req.body.currentListId;
  console.log('got a create todo request for checklistId: ' + currentListId);
  let todo = new Todo({
    name: '',
    checklistId: currentListId
  });
  todo.save(function(err, todo) {
    if (err) { console.error(err) };
    Checklist.findByIdAndUpdate(currentListId, {
        $addToSet: { todoItems: todo._id } },
      function(err, checklist) {
        if (err) { console.error(err) }
        console.log('successfully created new todo with ID: ' + todo._id);
        return res.send(todo);
      });
  });
});

// PUT / EDIT / SAVE / UPDATE todo
router.post('/save-todo', auth.requireLogin, function(req, res, next) {
  // console.log(req.body.todoId);
  const todoId = req.body.todoId;
  const todoInputValue = req.body.todoInputValue;
  console.log('got a save request for todo.id: ' + todoId);
  Todo.findByIdAndUpdate(
    todoId, {
      $set: {
        name: todoInputValue
      }
    },
    function(err) {
      if (err) { console.error(err) };
    });
    console.log('successfully saved todo.id: ' + todoId);
});

// DELETE todos
router.delete('/delete-todo', auth.requireLogin, function(req, res, next) {
  const todoId = req.query.id;
  console.log('got a delete request for todo.id: ' + todoId);
  Todo.findByIdAndRemove(todoId, function(err, todo) {
    if(err) { res.send(err) }
    console.log('found todo to delete');
    Checklist.findByIdAndUpdate(todo.checklistId, {
          $pull: { todoItems: todoId }}, function(err, checklist) {
          if (err) { res.send(err) };
          console.log('found checklist to update');
          console.log('todo item with id: ' + todoId + ' was successfully deleted and removed from checklist');
          return res.send('todo item with id: ' + todoId + ' was successfully deleted');
        });
  });
});

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
