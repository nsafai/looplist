const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

const ChecklistSchema = new Schema({
  name           : { type: mongoose.SchemaTypes.Email, unique: true },
  todo          : { type: Array },
  createdAt      : { type: Date, default: Date.now }
});


ChecklistSchema.plugin(uniqueValidator);

const Checklist = mongoose.model('Checklist', ChecklistSchema);
module.exports = Checklist;
