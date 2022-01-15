const { NjUrlController } = require('../url/controller')

class NjController extends NjUrlController {
    constructor(dt, objx) {
        super(dt, objx)
    }

    requfy(req) {
        this.perspective = req.perspective
        if (req.body) this.body = req.body
        if (this.idx) console.log(this.idx)

    }

    crsp(rsp, req) {
        this.requfy(req)
        if (this.sql) {
            if (this.perspective === 'GET') {
                if (this.idx) {
                    return rsp(this, req).exec('showIdx')
                }
            } else if (this.perspective === 'POST') {
                if (this.idx && this.body) {
                    return rsp(this, req).exec('newIdx')
                }
            } else if (this.perspective === 'DELETE') {
                if (this.idx) {
                    return rsp(this, req).exec('deleteIdx')
                }
            } else if (this.perspective === 'PATCH') {
                if (this.idx) {
                    return rsp(this, req).exec('updateIdx')
                }
            }
            return rsp(this, req).exec(req)
        }

    }
}

module.exports = {NjController}
