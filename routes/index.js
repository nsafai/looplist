const express = require('express');

const router = express.Router();

// set layout variables
router.use((req, res, next) => {
  // set website title
  res.locals.title = 'looplist: re-usable lists';
  // so we can check if user is logged in
  res.locals.user = req.session.user;
  next();
});

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: res.locals.title,
    user: res.locals.user,
  });
});

module.exports = router;
