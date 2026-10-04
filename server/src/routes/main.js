require('dotenv').config()
const express = require('express')
const { urlPost, urlGet, tokenDelete } = require('../controllers/zkController')

const router = express.Router()

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'scalable-url-shortener', timestamp: new Date() })
})

router.post('/url', urlPost)
router.get('/url/:identifier', urlGet)
router.get('/del', tokenDelete)

module.exports = router