const { NjCheck } = require('./connection/check')

class NjConnection extends NjCheck {
    constructor(dt, objx, t) {
        super(dt, objx, t)

        // this.head = 200
    }

    startServer() {
        console.log('\x1b[33m%s\x1b[0m', 'Server is running on',
        this.serverOptions.host + ':' + this.serverOptions.port)
        try {
            this.srv = this.dt.createServer(this.serverOptions, (rqs, rsp) => {
                this.checkDefault(rqs, rsp)

                rsp.writeHead(this.head)
                rsp.end(this.response)
                
            }).listen(this.port)

        } catch (err) {
            console.log(err)
        }

    }

}


module.exports = { NjConnection }