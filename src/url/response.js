const { NjSuper } = require('njsuper')

class NjUrlResponse extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
    }

    update() {
        this.urls.setUrl(this.path, this)
    }
}

module.exports = { NjUrlResponse }