var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');


// GET ALL LISTS
router.get('/lists', auth.requireLogin, (req, res, next) => {
  console.log(res.locals.user._id);
  Checklist.find({
      ownerUserId: res.locals.user._id
    }, function(err, lists) {
    if (err) {
      console.error(err);
    } else {
      const currentList = lists[0]; // default

      if (typeof currentList !== 'undefined') {
        console.log('currentList not empty!');
        Todo.find({
          '_id': {
            $in: currentList.todoItems
          }
        }, function(err, currentListTodos) {
          // console.log(currentListTodos);
          const todosString = currentListTodos.map((item) => {
            const { id, name, completed } = item

            return { id: id.toString(), name, completed }
          });

          res.render('checklists/index', {
            currentList,
            currentListTodos,
            lists,
          });
        });
      } else {
        // users who have no lists yet
        res.render('checklists/index');
      }
    }
  }).sort([
    ['updatedAt', -1] // change this to change how it sorts
  ]);
});

module.exports = router;
