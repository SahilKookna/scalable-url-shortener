require('dotenv').config()
const redis = require('redis')
const ShortURL = require('../models/url')

class VisitQueue {
  constructor() {
    this.items = []
  }

  enqueue = async (element) => {
    if (this.size() < 10) {
      this.items.push(element)
    } else {
      while (!this.isEmpty()) {
        const hash = this.dequeue()
        try {
          await ShortURL.findOneAndUpdate({ Hash: hash }, { $inc: { Visits: 1 } })
        } catch (err) {
          console.error('[VisitQueue] Error updating visit count:', err)
        }
      }
    }
  }

  dequeue() {
    return this.items.shift()
  }

  isEmpty() {
    return this.items.length === 0
  }

  size() {
    return this.items.length
  }
}

const jobQueue = new VisitQueue()

const connectRedis = async () => {
  const host = process.env.REACT_APP_REDIS_HOST || 'redis-server'
  const port = process.env.REACT_APP_REDIS_PORT || 6379

  const client = redis.createClient({ host, port })
  client.on('error', (err) => console.error('[Redis] Client error:', err))
  client.on('connect', () => console.log('[Redis] Client connected.'))
  
  return client
}

module.exports = { jobQueue, connectRedis }