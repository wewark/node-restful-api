if (process.env.NODE_ENV == 'developement' ||
    process.env.NODE_ENV == 'test') {
    require('dotenv').config()
}

const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port)

module.exports = server
