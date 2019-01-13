var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// POST/CREATE Todo
router.post('/todos', function(req, res, next) {

  currentListId = req.body.currentListId;

  let todo = new Todo({
    name: '',
    checklistId: currentListId
  });
  // console.log('todo: ' + todo);

  todo.save(function(err, todo) {
    if (err) {
      console.error(err)
    };
    Checklist.findByIdAndUpdate(
      currentListId, {
        $addToSet: {
          todoItems: todo._id
        }
      },
      function(err, event) {
        if (err) {
          console.error(err)
        };
        return res.send(todo);
      });
  });
});

module.exports = router;
