// const { NjUrlResponse } = require('njnest/src/url/response')
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

    async checkDefault(rqs, rsp) {
        if (this.serverOptions.watcher) {
            this.checkWatcher(rqs.rawHeaders)
        }
        // console.log(this.urls)
        for (const i in this.urls) {
            this.urls[i].check(rqs)
            // console.log(i)
            if(this.urls[i].status == true) {
                // console.log(this.urls[i].paths[this.urls[i].active].status, 'asdasdadas')
                
                if (this.urls[i].paths[this.urls[i].active].status == true) {
                    
                    // console.log(this.urls[i].paths[this.urls[i].active], 'active urls')
                    if (this.urls[i].paths) {

                        if (this.urls[i].paths[this.urls[i].active].status == true) {
                            try {
                                this.head = 200 // this.urls[i].paths[i].head

                                this.response = this.urls[i].paths[this.urls[i].active].rsp(rqs, rsp)
                                this.urls[i].status = false
                                this.urls[i].paths[this.urls[i].active].status = false
                            } catch (error) {
                                console.error(error)
                                this.head = 200
                            }
                        }


    
                    }


                } 
                

            } 

            

            // else {
            //     this.response = 'hello world'
            //     this.head = 200
            //     this.urls[i].status = false
            // }

        }
    }

}

module.exports = { NjCheck }