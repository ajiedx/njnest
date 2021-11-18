const { NjConnection } = require('./connection')
const { NjUrl } = require('./url')
const { NjReloader } = require('njreloader')
const { NjSuper } = require('njsuper')

class NjNest extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.conn = new NjConnection(dt, objx)
    }
    
    startWatcher() {
        setTimeout(() => {
            for (const i in this.watcherSettings) {
                this.watcher.start()
            }

            this.startWatcher()
        }, 2000)
    }

    startClient(name) {
        if (name === 'watcher') {
            this.startWatcher()
        }

    }
    
    start() {
        if (this.env === 'dev') {
            // if (this.watcher) {
            if (!this.watcher) {
                console.log(isMainThread)
                
                this.conn.startServer(true)
            } else {
                console.log('asd')
                this.watcher = new NjReloader(this.watcherSettings, {conn: this.conn})

                this.watcher.set('front', (file) => {
                    console.log('Hey')
                })

                this.watcher.set('back', 'restartServer', this.conn)
                this.startClient('watcher')
            }
            // }
        } else {
            this.conn.startServer()
        }
    }
}

module.exports = { NjNest, NjConnection, NjUrl }