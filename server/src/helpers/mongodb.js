require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
  const mongoURI = process.env.REACT_APP_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/shorturl'
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log('[MongoDB] Successfully connected to database.')
  } catch (err) {
    console.error('[MongoDB] Connection error:', err.message)
  }
}

module.exports = { connectDB }