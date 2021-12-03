const { NjSuper } = require('njsuper')

class NjMysqlField extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        delete this.dt
    }

}

module.exports = { NjMysqlField }