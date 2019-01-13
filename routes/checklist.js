var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// GET ALL Checklists
router.get('/lists', auth.requireLogin, (req, res, next) => {
  Checklist.find({}, function(err, lists) {
    if (err) {
      console.error(err);
    } else {
      const currentList = lists[0]; // default

      Todo.find({
        '_id': {
          $in: currentList.todoItems
        }
      }, function(err, currentListTodos) {
        console.log(currentListTodos);
        res.render('checklists/index', {
          currentList: currentList,
          currentListTodos: currentListTodos,
          lists: lists
        });
      });
    }
  }).sort([
    ['createdAt', 1] // change this to change how it sorts
  ]);
});

// POST/CREATE Checklist
router.post('/lists', function(req, res, next) {
  currentUserId = res.locals.user._id;

  let list = new Checklist({
    title: 'New List',
    ownerUserId: currentUserId
  });
  console.log('list: ' + list);
  list.save(function(err, list) {
    if (err) {
      console.error(err)
    };
    return res.send(list);
  });
});

// PUT / EDIT / UPDATE checklist

// DELETE checklist
router.delete('/lists', function(req,res, next) {
  listId = req.query.id;
  console.log('got a delete request with: ' + listId);
  Checklist.findByIdAndRemove(listId, function(err){
    if(err){res.send(err);}
  });
});


module.exports = router;
