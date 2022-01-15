const { NjSuper } = require('njsuper')
const { NjViews } = require('../nest/views')

class NjUrlController extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

        if (objx.views) {
            this.views = new NjViews('', {views: this.views, parent: this.name, construct: true})
            if (objx.VIEWS) {
                this.views.append(this.VIEWS)
            }
        } else if (objx.VIEWS) {
            this.views = new NjViews('', {views: this.VIEWS, parent: this.name, construct: true})
        }


    }

    setId(id) {
        this.idx = id
        this[id] = {}
    }

    crsp(rsp, req) {
        if (this.html) {
            return rsp(this, req).html.dt
        } else if (this.sql) {
            return rsp(this, req).exec(req)
        }

    }
}

module.exports = { NjUrlController }
