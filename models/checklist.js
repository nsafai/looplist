const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChecklistSchema = new Schema({
  title          : { type: String, required: true },
  ownerUserId    : { type: String, required: true },
  todoItems      : { type: Array },
  createdAt      : { type: Date, default: Date.now },
  updatedAt      : { type: Date, default: Date.now }
});

ChecklistSchema.pre('save', function(next) {
  // before saving
  let list = this;
  list.updatedAt = Date.now();
  next();
});

const Checklist = mongoose.model('Checklist', ChecklistSchema);
module.exports = Checklist;
