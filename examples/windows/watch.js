const { NjNest } = require('../../njnest')

const njreload = {
    front: { dirs: ['./src'], ext: ['js', 'css'],
    reloader: 'jinreload'
  }, 
    back: { 
      dirs: ['./srca', './srcb'], 
      ext: ['js'],
      reloader: 'njreload',
      batch: 'reload.bat'
    },
    afterback: {
      dirs: ['./srcb'],
      ext: ['js'],
      response: (file) => {
        console.log('We have restarted NjNest server on ./srcb ' + file.name)
      }
    }
  }

const options = {
    serverOptions: {
      host: 'localhost',
      port: 8000,
    // key: fs.readFileSync('localhost.decrypted.key'),
    // cert: fs.readFileSync('localhost.crt'),
    },
    njreload,
}



const conn = new NjNest('njnest', options)

conn.start()
  