const { NjSuper } = require('njsuper')


class NjController extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

    }

    crsp(rsp, req, res) {
        this.ctrl = rsp({html: this.html}, req, res)

        return this.ctrl.html.dt
    }
}

module.exports = { NjController }