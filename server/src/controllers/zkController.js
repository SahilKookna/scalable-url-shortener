const ShortURL = require('../models/url')
const { connectRedis, jobQueue } = require('../helpers/redis')
const { range, hashGenerator, getTokenRange, removeToken } = require('../helpers/zookeeper')

let urlPost = async (req, res) => {
  try {
    const originalUrl = req.body.OriginalUrl || req.body.originalUrl
    if (!originalUrl) {
      return res.status(400).json({ error: 'OriginalUrl is required' })
    }

    if (range.curr < range.end - 1 && range.curr !== 0) {
      range.curr++
    } else {
      await getTokenRange()
      range.curr++
    }

    const redisClient = await connectRedis()

    redisClient.get(originalUrl, async (err, cachedHash) => {
      if (err) {
        console.error('[Controller] Redis fetch error:', err)
      }

      if (cachedHash) {
        return res.json(cachedHash)
      }

      try {
        const existingUrl = await ShortURL.findOne({ OriginalUrl: originalUrl })
        if (existingUrl) {
          redisClient.setex(originalUrl, 600, existingUrl.Hash)
          return res.json(existingUrl.Hash)
        }

        const generatedHash = hashGenerator(range.curr - 1)
        const newUrl = await ShortURL.create({
          Hash: generatedHash,
          OriginalUrl: originalUrl,
          Visits: 0,
          CreatedAt: new Date(),
          ExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        })

        redisClient.setex(originalUrl, 600, newUrl.Hash)
        return res.json(newUrl.Hash)
      } catch (dbErr) {
        console.error('[Controller] MongoDB query error:', dbErr)
        return res.status(500).json({ error: 'Failed to process URL shortening request' })
      }
    })
  } catch (error) {
    console.error('[Controller] urlPost error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

let urlGet = async (req, res) => {
  try {
    const { identifier } = req.params
    const urlRecord = await ShortURL.findOne({ Hash: identifier })

    if (urlRecord) {
      jobQueue.enqueue(urlRecord.Hash)
      return res.redirect(urlRecord.OriginalUrl)
    } else {
      return res.status(404).send('URL not found')
    }
  } catch (error) {
    console.error('[Controller] urlGet error:', error)
    return res.status(500).send('Internal server error')
  }
}

let tokenDelete = async (req, res) => {
  try {
    await removeToken()
    return res.json({ message: 'ZooKeeper token removed' })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove token' })
  }
}

module.exports = { urlPost, urlGet, tokenDelete }