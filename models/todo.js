/* eslint-disable key-spacing */
// eslint-disable-next-line import/newline-after-import
const mongoose = require('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
  name           : { type: String },
  checklistId    : { type: String, required: true },
  todoIndex      : { type: Number },
  completed      : { type: Boolean, default: false, required: true },
  createdAt      : { type: Date, default: Date.now },
});

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
