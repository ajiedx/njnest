const { NjCheck } = require('./connection/check')
const net = require('net')

class NjConnection extends NjCheck {
    constructor(dt, objx, t) {
        super(dt, objx, t)
 
        // this.head = 200
    }

    startServer() {
        console.log('\x1b[33m%s\x1b[0m', 'Server is running on',
        this.serverOptions.host + ':' + this.serverOptions.port)

        // if (this.env === 'dev') {

        // }

        try {


            const serverOptions = {
                host: this.serverOptions.host,
                port: this.serverOptions.port,
                signal: this.controller.signal
            }


            this.conn = net.createServer(socket => {
                socket.on('data', data => {
                    this.checkReload(data)

                    socket.write(this.response)
                    socket.end()
                    // socket.end((err)=> {console.log(err)})
                })
                // console.log(socket)
                
            }).on('error', (err) => {
                
                console.log(err)
                throw err
                // if (err.code === 'EADDRINUSE') {
                //     console.log('Address in use, retrying...')
                //     setTimeout(() => {
                //         this.conn.close()
                //         this.conn.listen(serverOptions)
                //     }, 1000)
                // }
            })


            this.conn.listen({
                host: this.serverOptions.host,
                port: this.serverOptions.port,
                signal: this.controller.signal
            })


        } catch (err) {
            console.log(err)
        }

    }

}


module.exports = { NjConnection }