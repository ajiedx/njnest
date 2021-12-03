const { NjSuper } = require('njsuper')


class NjController extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

    }

    setId(id) {
        this.idx = id
    }

    crsp(rsp, req) {

        if (this.html) {
            return rsp(this, req).html.dt
        } else if (this.sql) {
            return rsp(this, req).exec(req)
        }

    }
}

module.exports = { NjController }