const { NjUrlResponse } = require('njnest/src/url/response')
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
        // console.log(this.urls)
        for (const i in this.urls) {
            this.urls[i].check(rqs)

            if(this.urls[i].status == true) {
                
                if (this.urls[i].paths[this.urls[i].active] instanceof NjUrlResponse) {
                    this.head = 200
                    // console.log(this.urls[i].paths[this.urls[i].active])
                    this.response = this.urls[i].paths[this.urls[i].active].rsp(rqs, rsp)
                    this.urls[i].status = false
                } else {
                    this.response = 'hello world'
                    this.head = 200
                }
                
                
            } 
            


        }
        
    }

}

module.exports = { NjCheck }