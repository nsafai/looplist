const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const ChecklistSchema = new Schema({
  title          : { type: String, unique: true, required: true },
  ownerUserId    : { type: Number, unique: true, required: true },
  createdAt      : { type: Date, default: Date.now }
});

ChecklistSchema.plugin(uniqueValidator);

const Checklist = mongoose.model('Checklist', ChecklistSchema);
module.exports = Checklist;
