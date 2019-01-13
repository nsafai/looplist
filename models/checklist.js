const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// var uniqueValidator = require('mongoose-unique-validator');

const ChecklistSchema = new Schema({
  title          : { type: String, required: true },
  ownerUserId    : { type: String, required: true },
  todoItems      : { type: Array },
  createdAt      : { type: Date, default: Date.now }
});

// ChecklistSchema.plugin(uniqueValidator);

const Checklist = mongoose.model('Checklist', ChecklistSchema);
module.exports = Checklist;
