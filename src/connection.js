const { NjSuper } = require('njsuper')

class NjConnection extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.defaultMsg = 'Hello World!'

    }

    checkWatcher(raw) {
        console.log(raw)
        if(raw.includes('watcher')) {
            if (raw[raw.indexOf('watcher') + 1] === 'restartServer') {
                throw Error
            }
            console.log(raw[raw.indexOf('watcher') + 1])
        }
    }

    check(rqs, rsp) {
        if (this.serverOptions.watcher) {
            this.checkWatcher(rqs.rawHeaders)
        } 
        for (const i in this.urls) {
            this.urls[i].check(rqs)
            console.log(this.urls[i])
            if(this.urls[i].status === true) {
                
                this.response = this.urls[i].paths[this.urls[i].active].rsp()
            } else {
                console.log(rqs.rawHeaders)
                this.response = 'Hello World'
            }
            this.head = 200
            this.urls[i].status = false
        }
        
    }

    startServer() {
        try {
            this.srv = this.dt.createServer(this.serverOptions, (rqs, rsp) => {
                this.check(rqs, rsp)
                rsp.writeHead(this.head)
                rsp.end(this.response)
            }).listen('8000')
        } catch (err) {
            console.log(err)
        }

    }

}


module.exports = { NjConnection }