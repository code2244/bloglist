require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URL = process.env.MONGODB_URL

if (process.env.NODE_ENV === 'test') {
  MONGODB_URL = process.env.TES_MONGODB_URL
}

module.exports = {
  PORT,
  MONGODB_URL
}