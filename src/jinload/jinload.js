const { NjSuper } = require('njsuper')

class JinLoad extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

    }

    css (file) {
        console.log(file)
        return file
    }

}

module.exports = {JinLoad}