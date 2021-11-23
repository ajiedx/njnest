const http = require('http');
const { NjNest } = require('../../njnest')

const watcherSettings = {
    front: { dirs: ['./src'], ext: ['js'],
    host: 'localhost',
    port: 8000
  }, 
    back: { 
      dirs: ['./srca', './srcb'], 
      ext: ['js'],
      host: 'localhost',
      port: 8000,
      batch: 'run.bat'
    }
  }

const options = {
    serverOptions: {
    // key: fs.readFileSync('localhost.decrypted.key'),
    // cert: fs.readFileSync('localhost.crt'),
    },
    watcher: true,
    watcherSettings,
    env: 'dev'
}

options.serverOptions.agent = new http.Agent(options.serverOptions)


const conn = new NjNest(http, options)

conn.start()
  