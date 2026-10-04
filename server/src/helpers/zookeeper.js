require('dotenv').config()
const zookeeper = require('node-zookeeper-client')

const zkHost = process.env.ZOOKEEPER_HOST || 'zookeeper-server:2181'
const zkClient = zookeeper.createClient(zkHost)

const range = {
  start: 0,
  end: 0,
  curr: 0
}

const BASE62_CHARSET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const hashGenerator = (num) => {
  if (num === 0) return BASE62_CHARSET[0]
  let result = ''
  let n = num
  while (n > 0) {
    result += BASE62_CHARSET[n % 62]
    n = Math.floor(n / 62)
  }
  return result
}

const setTokenRange = async (token) => {
  const dataToSet = Buffer.from(String(token), 'utf8')
  zkClient.setData('/token', dataToSet, (error) => {
    if (error) {
      console.error('[ZooKeeper] Failed to set token data:', error.stack)
      return
    }
    console.log('[ZooKeeper] Counter range token updated.')
  })
}

const getTokenRange = async () => {
  return new Promise((resolve, reject) => {
    zkClient.getData('/token', (error, data) => {
      if (error) {
        console.error('[ZooKeeper] Error fetching token range:', error.stack)
        return reject(error)
      }

      const val = parseInt(data.toString()) || 0
      range.start = val + 1000000
      range.curr = val + 1000000
      range.end = val + 2000000

      setTokenRange(range.start)
      resolve(range)
    })
  })
}

const createToken = async () => {
  const buffer = Buffer.from('0', 'utf8')
  zkClient.create('/token', buffer, zookeeper.CreateMode.PERSISTENT, (error, path) => {
    if (error) {
      console.error('[ZooKeeper] Node creation error:', error.stack)
      return
    }
    console.log('[ZooKeeper] Distributed token znode created at: %s', path)
  })
}

const checkIfTokenExists = async () => {
  zkClient.exists('/token', (error, stat) => {
    if (error) {
      console.error('[ZooKeeper] Exists check error:', error.stack)
      return
    }

    if (stat) {
      console.log('[ZooKeeper] Distributed token znode exists.')
    } else {
      createToken()
    }
  })
}

const removeToken = async () => {
  zkClient.remove('/token', (error) => {
    if (error) {
      console.error('[ZooKeeper] Delete token node error:', error.stack)
      return
    }
    console.log('[ZooKeeper] Token znode deleted successfully.')
  })
}

const connectZK = async () => {
  zkClient.once('connected', async () => {
    console.log('[ZooKeeper] Connected to ZooKeeper ensemble successfully.')
    await checkIfTokenExists()
    await getTokenRange()
  })

  zkClient.connect()
}

module.exports = {
  range,
  hashGenerator,
  setTokenRange,
  getTokenRange,
  createToken,
  checkIfTokenExists,
  removeToken,
  connectZK
}