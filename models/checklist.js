/* eslint-disable key-spacing */
// eslint-disable-next-line import/newline-after-import
const mongoose = require('mongoose')
const { Schema } = mongoose

const ChecklistSchema = new Schema({
  title          : { type: String },
  ownerUserId    : { type: String, required: true },
  todoItems      : { type: Array },
  createdAt      : { type: Date, default: Date.now },
  updatedAt      : { type: Date, default: Date.now },
})

ChecklistSchema.pre('save', (next) => {
  // before saving
  const list = this
  list.updatedAt = Date.now()
  next()
})

const Checklist = mongoose.model('Checklist', ChecklistSchema)
module.exports = Checklist
