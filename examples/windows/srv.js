const http = require('http')
const { api, webapp } = require('./app')
const { NjNest } = require('../../njnest')

const options = {
  serverOptions: {
    watcher: true,
    host: 'localhost',
    port: 8000,
    // key: fs.readFileSync('localhost.decrypted.key'),
    // cert: fs.readFileSync('localhost.crt'),
  },
  urls: {webapp, api},
}

options.serverOptions.agent = new http.Agent(options.serverOptions)


const conn = new NjNest(http, options)

conn.start()
