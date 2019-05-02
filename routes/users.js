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

  user.save()
      .then((savedUser) => {
        req.session.user = savedUser
        res.redirect('/lists')
      })
      .catch(() => {
        const nextError = new Error('Email address already taken. Did you mean to login?')
        nextError.status = 401
        return next(nextError)
      })
})

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err || !user) {
      const nextError = new Error('Email or password incorrect')
      nextError.status = 401
      return next(nextError)
    }
    // user authenticated correctly
    req.session.user = user
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

module.exports = router
