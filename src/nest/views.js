const { NjSuper } = require('njsuper')

class NjView extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        
    }

    rsp (req) {
        if (this.response) {
            return this.rn('NjViewName: '+this.dt) + this.response(this, req)
        } else if (this.x1) {
            return this.rn('NjViewName: '+this.dt, 'NjViewSyntax: x1') + this.x1
        } else if (this.html) {
            return this.rn('NjViewName: '+this.dt, 'NjViewSyntax: x1') + this.html
        }
    }
}

class NjViews extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        if (this.construct) {
            for (const i in this.views) {
                this[i] = new NjViews(i, this.views[i])
            }

            delete this.views
        }
    }

    append(views, parent) {
        for (const i in views) {
            this[i] = new NjView(i, views[i])
        }
    }

    view(name, objx) {
        this[name] = new NjView(name, objx)
    }
}

module.exports = { NjViews, NjView }