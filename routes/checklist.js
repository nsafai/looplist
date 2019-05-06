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

          if (req.header('Content-Type') === 'application/json') {
            return res.send({ lists, user: res.locals.user._id })
          }

          return res.render('checklists/index', {
            currentList,
            currentListTodos,
            lists,
          })
        }).sort([['index', 1]])
      } else {
        // users who have no lists yet
        return res.render('checklists/index')
      }
    }
  }).sort([['updatedAt', -1]])
})

// GET SPECIFIC CHECKLIST BY ID + ITS TODOS
router.get('/lists/:id', auth.requireLogin, (req, res) => {
  if (req.header('Content-Type') === 'application/json') {
    Checklist.findById(req.params.id, (err, selectedList) => {
      if (err) { return res.send(err) }
      if (selectedList) {
        // eslint-disable-next-line no-param-reassign
        selectedList.updatedAt = Date.now()
        selectedList.save()
        Todo.find({
          _id: {
            $in: selectedList.todoItems,
          },
        }, (error, selectedListTodos) => {
          if (error) return res.send(error)
          return res.send({
            currentList: selectedList,
            currentListTodos: selectedListTodos,
          })
        })
      } else {
        console.log('no list found')
      }
    })
  }
})

// UPDATE A SPECIFIC TODO
router.post('/todos/toggle/:id', auth.requireLogin, (req, res) => {
  if (req.header('Content-Type') === 'application/json') {
    Todo.findOne({ _id: req.params.id }, (err, todo) => {
      if (err) { return console.log(err) }
      // eslint-disable-next-line no-param-reassign
      todo.completed = !todo.completed
      todo.save()
        .then(res.send(todo))
        .catch(error => res.send(error))
    });
  }
})

// RESET ALL TODOS ON SPECIFIC CHECKLIST
router.post('/lists/reset/:id', auth.requireLogin, (req, res) => {
  if (req.header('Content-Type') === 'application/json') {
    // Find checklist by ID
    Checklist.findById(req.params.id, (err, checklist) => {
      if (err) return res.send(err)
      // get checklist todoIds
      const todoIds = checklist.todoItems
      Todo.find({
        _id: { $in: todoIds },
      }, (error, todos) => {
        if (error) return res.send(error)
        todos.forEach((todo) => {
          Todo.findByIdAndUpdate(todo._id, {
            $set: { completed: false },
          }, (errUpdating) => {
            if (errUpdating) return res.send(errUpdating)
          })
          // eslint-disable-next-line no-param-reassign
          todo.completed = false;
        })
        return res.send(todos)
      })
    })
  }
})

module.exports = router
