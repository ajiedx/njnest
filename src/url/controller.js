const { NjSuper } = require('njsuper')
const { NjViews } = require('../nest/views')
const { JinLoad } = require('../jinload/jinload')
class NjController extends NjSuper {
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

        if (objx.JINLOAD) {
            this.jin__LOAD = new JinLoad('', {loads: this.JINLOAD, construct: true})
        }
        
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