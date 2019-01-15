var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const Todo = require('../models/todo');
const auth = require('./helpers/auth');


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
          // console.log(todosString);
          const todosJson = JSON.stringify(todosString);
          // console.log(todosJson);
          res.render('checklists/index', {
            currentList,
            currentListTodos,
            lists,
            todosJson
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

// GET SPECIFIC List
router.get('/lists/:id', auth.requireLogin, (req, res, next) => {
  // console.log(req.params.id);
  selectedListId = req.params.id;
  Checklist.findById(selectedListId, function(err, selectedList) {
    if (err) { console.error(err) }
    selectedList.updatedAt = Date.now();
    // selectedList.save();
    selectedList.save(function(err) {
      if (err) { console.error(err) };
      Checklist.find({
          ownerUserId: res.locals.user._id
        }, function(err, lists) {
        if (err) { console.error(err) }
        else {
          Todo.find({'_id': {
            $in: selectedList.todoItems
          }}, function(err, selectedListTodos) {
            const todosString = selectedListTodos.map((item) => {
              const { id, name, completed } = item

              return { id: id.toString(), name, completed }
            });
            // console.log(todosString);
            const todosJson = JSON.stringify(todosString);
            // console.log(todosJson);
            res.render('checklists/index', {
              currentList: selectedList,
              currentListTodos: selectedListTodos,
              lists,
              todosJson
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
