var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const auth = require('./helpers/auth');

// GET ALL Checklists
router.get('/lists', auth.requireLogin, (req, res, next) => {
  Checklist.find({}, function(err, lists) {
    if (err) {
      console.error(err);
    } else {
      const defaultList = lists[0];
      console.log(defaultList);
      res.render('checklists/index', {
        defaultList: defaultList,
        lists: lists
      });
    }
  }).sort([
    ['createdAt', 1]
  ]);
});

// POST/CREATE Checklist
router.post('/lists', function(req, res, next) {
  // console.log('user id: ' + res.locals.user._id);
  // console.log('req body: ' + req.body);
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
    res.send('Got a DELETE request at /user');
  });
});


module.exports = router;
