const { NjConnection } = require('./connection')
const { NjController } = require('./url/controller')
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

        if (this.njreload) {
            this.reload = new NjReload(this.njreload)
            for (const i in this.reload.dt) {
                this.reload.assign(i, {host: this.serverOptions.host, port: this.serverOptions.port})
                if (this.reload.dt[i].reloader) {
                    if (this.typeof(this.reload.dt[i].reloader) === 'string') {
                        if (this.reload.dt[i].reloader === 'jinreload') {
                            this.reload.set(i, 'jinupdate')
                        } else if (this.reload.dt[i].reloader === 'njreload') {
                            this.reload.set(i, 'restartServer')
                        }
                    } 
                } else {
                    this.reload.set(i)
                }
            }
            this.startClient('watcher')
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
        if (this.reload instanceof NjReload) {
            this.watcher = new NjWatcher(this.reload, {enitity: this.watcherSettings})

        }

        this.watcher.start()
    }
}

module.exports = { NjNest, NjConnection, NjUrl, NjParser, NjController }