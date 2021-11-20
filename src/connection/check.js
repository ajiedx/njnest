const { NjSuper } = require('njsuper')

class NjCheck extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.defaultMsg = 'Hello World!'
    }

    
    checkWatcher(raw) {
        if(raw.includes('watcher')) {
            if (raw[raw.indexOf('watcher') + 1] === 'restartServer') {
                throw Error
            }
        }
    }

    checkDefault(rqs, rsp) {
        if (this.serverOptions.watcher) {
            this.checkWatcher(rqs.rawHeaders)
        } 
        for (const i in this.urls) {
            this.urls[i].check(rqs)

            if(this.urls[i].status === true) {
                this.response = this.urls[i].paths[this.urls[i].active].rsp()
            } else {
                this.response = 'Hello World'
            }
            this.head = 200
            this.urls[i].status = false
        }
        
    }

}

module.exports = { NjCheck }