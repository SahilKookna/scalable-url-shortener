const cors = require('cors')
const express = require('express')
const mainRoute = require('./src/routes/main')
const purgeAliases = require('./src/workers/purgeAliases')
require('./src/helpers/mongodb').connectDB()
require('./src/helpers/redis').connectRedis()
require('./src/helpers/zookeeper').connectZK()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', mainRoute)

app.get('*', (req, res) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

const PORT = process.env.PORT || 8081

app.listen(PORT, () => {
  console.log(`[Server] Scalable URL Shortener service running on port ${PORT}`)
  purgeAliases()
})