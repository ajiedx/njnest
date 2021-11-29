const { NjConnection } = require('./connection')
const { NjUrl } = require('./url')
const { NjWatcher } = require('./nest/watcher')
const { NjReload } = require('njreload')
const { NjSuper } = require('njsuper')
const { NjParser } = require('./parse')

class NjNest extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.conn = new NjConnection(dt, objx)
    }
    

    start() {
        if (this.env === 'dev') {
            // if (this.watcher) {
            if (!this.watcher) {

                if (this.conn) {
                    this.conn.startServer(true)
                }

                
            } else {
                this.reloader = new NjReload(this.watcherSettings, {conn: this.conn})

                this.reloader.set('front', 'jinupdate', this.conn)

                this.reloader.set('back', 'restartServer', this.conn)
                this.startClient('watcher')
            }
            // }
        } else {
            this.conn.startServer()
        }
    }

    startClient(name) {
        if (name === 'watcher') {
            this.startWatcher()
        }

    }
    
    startWatcher() {
        if (this.reloader instanceof NjReload) {
            this.watcher = new NjWatcher(this.reloader, {enitity: this.watcherSettings})

        }

        this.watcher.start()
    }
}

module.exports = { NjNest, NjConnection, NjUrl, NjParser }