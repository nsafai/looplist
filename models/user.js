const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

const UserSchema = new Schema({
  email           : { type: mongoose.SchemaTypes.Email, unique: true },
  password        : { type: String, required: true },
  name            : { type: String, required: true },
  isAdmin         : { type: Boolean, default: false },
  createdAt       : { type: Date, default: Date.now }
});

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });


UserSchema.pre('save', function(next) {
  // console.log('inside pre save');
  // before saving
  let user = this;
  // console.log('user details are: ' + user);

  bcrypt.hash(user.password, 12, function(err, hash) {
    // console.log('inside hash function');
    if (err) return next(err);
    user.password = hash;
    // console.log(user.password);
    next();
  })
});

UserSchema.statics.authenticate = function(email, password, next) {
  User.findOne({
      email: email
    })
    .exec(function(err, user) {
      if (err) {
        return next(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return next(err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result === true) {
          return next(null, user);
        } else {
          return next();
        }
      });
    });
}

const User = mongoose.model('User', UserSchema);
module.exports = User;
