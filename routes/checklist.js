var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');

// GET Default List
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
        // console.log(currentListTodos);
        res.render('checklists/index', {
          currentList: currentList,
          currentListTodos: currentListTodos,
          lists: lists
        });
      });
    }
  }).sort([
    ['updatedAt', -1] // change this to change how it sorts
  ]);
});

// GET SPECIFIC List
router.get('/lists/:id', auth.requireLogin, (req, res, next) => {
  // console.log(req.params.id);
  selectedListId = req.params.id;
  Checklist.findById(selectedListId, function(err, selectedList) {
    if (err) { console.error(err) }
    selectedList.updatedAt = Date.now();
    // selectedList.save();
    selectedList.save(function(err, updatedList) {
      if (err) {
        console.error(err)
      };
      Checklist.find({}, function(err, lists) {
        if (err) { console.error(err) }
        else {
          Todo.find({'_id': {
            $in: selectedList.todoItems
          }}, function(err, selectedListTodos) {
            // console.log(selectedListTodos);
            res.render('checklists/index', {
              currentList: selectedList,
              currentListTodos: selectedListTodos,
              lists: lists
            });
          });
        }
      }).sort([
        ['updatedAt', -1] // change this to change how it sorts
      ]);
    });
  });
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
router.post('/save-list-name', auth.requireLogin, function(req, res, next) {
  console.log(req.body);
  checklistId = req.body.currentListId;
  newListName = req.body.newListName;

  Checklist.findByIdAndUpdate(
    checklistId, {
      $set: { title: newListName }
    },
    function(err) {
      if (err) { console.error(err) };
    });
});

// DELETE checklist
router.delete('/lists', function(req, res, next) {
  listId = req.query.id;
  console.log('got a delete request with: ' + listId);
  Checklist.findByIdAndRemove(listId, function(err){
    if(err){res.send(err);}
    return res.send('successfully deleted a checklist with Id: ' + listId);
  });
});


module.exports = router;
