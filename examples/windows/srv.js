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


const conn = new NjNest('njnest', options)

conn.start()
