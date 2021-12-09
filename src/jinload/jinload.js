const { JinCss } = require('./jincss')
const { NjSuper } = require('njsuper')

class JinLoad extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

        if (objx.load) {
            for (const i in this.load) {
                this[i] = this.load[i]
            }

        }
    }
}

class JinLoads extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        if (this.construct) {
            for (const i in this.loads) {
                this[i] = new JinLoad(i, {load: this.loads[i]})
            }

            delete this.loads
        }
    }

    css (file) {
        if (this[file.name]) {
            this[file.name].indexifyCss(file.content)
            return this[file.name].response
        } else {
            this[file.name] = new JinCss(file.name)
            this[file.name].indexifyCss(file.content)
            return this[file.name].response
        }
    }

}

module.exports = {JinLoads, JinLoad}