const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET signup
router.get('/signup', (req, res, next) => {
  res.render('users/signup');
});

// GET login
router.get('/login', (req, res, next) => {
  res.render('users/login');
});

// POST signup
router.post('/signup', (req, res) => {
  // console.log('inside signup route');
  const user = new User(req.body);
  // console.log('user details at /signup are: ' + user);
  user.save().then((user) => {
    // console.log('inside save on /signup');
    console.log(req);
    req.session.user = user;
    // console.log('req session user is: ' + req.session.user);
    res.redirect('/');
  }).catch((err) => {
    // console.log('inside catch err on /signup');
    return res.status(400).send({
      err
    });
  });
});

// POST login
router.post('/login', (req, res, next) => {
  User.authenticate(req.body.email, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error("Email or password incorrect");
      next_error.status = 401;
      return next(next_error);
    } else {
      // user authenticated correctly
      req.session.user = user;
      return res.redirect('/lists');
    }
  });
});

// logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }
  return res.redirect('/');
});

module.exports = router;
