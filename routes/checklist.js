/* eslint-disable consistent-return */
/* eslint-disable quote-props */
/* eslint-disable comma-dangle */
const express = require('express')

const router = express.Router()
const Checklist = require('../models/checklist')
const Todo = require('../models/todo')
const auth = require('./helpers/auth')


// GET ALL LISTS
router.get('/lists', auth.requireLogin, (req, res, next) => {
  console.log(res.locals.user._id)
  Checklist.find({
    ownerUserId: res.locals.user._id
  }, (err, lists) => {
    if (err) {
      console.error(err)
    } else {
      const currentList = lists[0] // default

      if (typeof currentList !== 'undefined') {
        console.log('currentList not empty!')
        Todo.find({
          '_id': {
            $in: currentList.todoItems
          }
        }, (error, currentListTodos) => {
          if (error) next(error)

          res.render('checklists/index', {
            currentList,
            currentListTodos,
            lists,
          })
        }).sort([['index', 1]])
      } else {
        // users who have no lists yet
        res.render('checklists/index')
      }
    }
  }).sort([['updatedAt', -1]])
})

module.exports = router
