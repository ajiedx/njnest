const { NjSuper } = require('njsuper')

class NjJson extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

        delete this.dt
    }
}

module.exports = { NjJson }