const cron = require('cron')
const URL = require('../models/url')

module.exports = () => {
  // Cron job running daily at midnight to purge expired URLs
  const job = new cron.CronJob('0 0 * * *', async () => {
    try {
      const now = new Date()
      const result = await URL.deleteMany({ ExpiresAt: { $lt: now } })
      if (result.deletedCount > 0) {
        console.log(`[PurgeWorker] Purged ${result.deletedCount} expired URL records from database.`)
      }
    } catch (err) {
      console.error('[PurgeWorker] Error during alias purge background job:', err)
    }
  }, null, true)
}
