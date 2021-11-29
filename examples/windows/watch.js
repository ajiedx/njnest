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
      batch: 'reload.bat'
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



const conn = new NjNest('njnest', options)

conn.start()
  