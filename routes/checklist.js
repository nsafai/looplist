var express = require('express');
var router = express.Router();

const auth = require('./helpers/auth');

// GET ALL Checklists
router.get('/lists', auth.requireLogin, (req, res, next) => {
  res.render('checklists/index');
});

// GET NEW Checklist
router.get('/new', auth.requireLogin, (req, res, next) => {
  res.render('checklists/new');
});

module.exports = router;
