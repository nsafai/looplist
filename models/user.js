/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-else-return */
/* eslint-disable key-spacing */
/* eslint-disable no-use-before-define */
// eslint-disable-next-line import/newline-after-import
const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');

const UserSchema = new Schema({
  email           : { type: mongoose.SchemaTypes.Email, unique: true },
  password        : { type: String, required: true },
  name            : { type: String, required: true },
  isAdmin         : { type: Boolean, default: false },
  createdAt       : { type: Date, default: Date.now },
});

UserSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

UserSchema.pre('save', function (next) {
  // before saving
  const user = this;

  bcrypt.hash(user.password, 12, (err, hash) => {
    if (err) return next(err);
    user.password = hash;
    next();
  })
});

UserSchema.statics.authenticate = function (email, password, next) {
  User.findOne({
    email,
  })
    .exec((err, user) => {
      if (err) {
        return next(err)
      } if (!user) {
        const error = new Error('User not found.');
        error.status = 401;
        return next(error);
      }
      bcrypt.compare(password, user.password, (error, result) => {
        if (error) return next(error)
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
