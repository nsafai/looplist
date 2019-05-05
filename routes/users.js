/* eslint-disable consistent-return */
const express = require('express')

const router = express.Router()
const User = require('../models/user')

// GET signup
router.get('/signup', (req, res) => {
  res.render('users/signup')
})

// GET login
router.get('/login', (req, res) => {
  res.render('users/login')
})

// POST signup
router.post('/signup', (req, res, next) => {
  const user = new User(req.body)

  user
    .save()
    .then((savedUser) => {
      req.session.user = savedUser
      if (req.header('Content-Type') === 'application/json') {
        return res.send(req.session)
      }
      return res.redirect('/lists')
    })
    .catch((err) => {
      if (req.header('Content-Type') === 'application/json') {
        return res.send(err)
      }
      return next(err)
    })
})

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err || !user) {
      if (req.header('Content-Type') === 'application/json') {
        return res.send(err)
      }
      return next(err)
    }
    // else user authenticated correctly
    req.session.user = user
    if (req.header('Content-Type') === 'application/json') {
      return res.send(req.session)
    }
    return res.redirect('/lists')
  })
})

// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err)
    })
  }
  return res.redirect('/')
})

module.exports = router;
