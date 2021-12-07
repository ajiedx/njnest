const { JinCss } = require('./jincss')
const { NjSuper } = require('njsuper')

class JinLoad extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

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

module.exports = {JinLoad}