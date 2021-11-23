const { NjSuper } = require('njsuper')
const { NjCheck } = require('./connection/check')

class NjConnection extends NjCheck {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        // this.head = 200
    }

    startServer() {
        try {
            this.srv = this.dt.createServer(this.serverOptions, (rqs, rsp) => {
                this.checkDefault(rqs, rsp)

                rsp.writeHead(this.head)
                rsp.end(this.response)
                
            }).listen('8000')
        } catch (err) {
            console.log(err)
        }

    }

}


module.exports = { NjConnection }