const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
  Hash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  OriginalUrl: {
    type: String,
    required: true
  },
  Visits: {
    type: Number,
    default: 0
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
  ExpiresAt: {
    type: Date
  }
})

module.exports = mongoose.model('URL', urlSchema)