const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const TodoSchema = new Schema({
  name           : { type: String, unique: true, required: true },
  checklistId    : { type: Number, required: true },
  completed      : { type: Boolean, default: false, required: true },
  createdAt      : { type: Date, default: Date.now }
});

TodoSchema.plugin(uniqueValidator);

const Todo = mongoose.model('Todo', TodoSchema);
module.exports = Todo;
