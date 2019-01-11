var express = require('express');
var router = express.Router();
const Checklist = require('../models/checklist');
const auth = require('./helpers/auth');

// GET ALL Checklists
router.get('/lists', auth.requireLogin, (req, res, next) => {
  res.render('checklists/index');
});

// POST/CREATE Checklist
router.post('/lists', function(req, res, next) {
  console.log(req.body);
  let list = new Checklist(req.body);
  list.save(function(err, list) {
    if (err) {
      console.error(err)
    };
    // return res.redirect('/lists');
  });
});
//
// /* GET EDIT prop form. */
// router.get('/admin/props/:id/edit', function(req, res, next) {
//   Proposition.findById(req.params.id, function(err, prop) {
//     if (err) {
//       console.error(err)
//     };
//     res.render('props/edit', {
//       prop: prop
//     });
//   });
// });
//
// // PUT/EDIT prop
// router.post('/admin/props/:id', function(req, res, next) {
//   //findByIdAndUpdate
//   //update with request object.body
//   let updatedProp = new Proposition(req.body);
//
//   Proposition.findByIdAndUpdate(
//     req.params.id, {
//       $set: {
//         name: updatedProp.name,
//         summary: updatedProp.summary,
//         pros: updatedProp.pros,
//         cons: updatedProp.cons,
//         readMoreUrl: updatedProp.readMoreUrl,
//         area: updatedProp.area
//       }
//     },
//     function(err, prop) {
//       if (err) {
//         console.error(err)
//       };
//       res.redirect('/admin');
//     });
// });

module.exports = router;
