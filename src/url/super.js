const { NjSuper } = require('njsuper')
const { NjUrlResponse } = require('./response')

class NjUrlSuper extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
    }

    setUrl(path, opt) {
        if (!opt.name) {
            opt.name = path.split('/')
            opt.name = opt.name[opt.name.length - 1]
        }
        if(opt instanceof NjUrlResponse) {
            this[opt.name] = this.resolveObject(opt.name, opt)
            Object.assign(this.paths, { [opt.id]: {
                path: opt.path
            } })
        } else {
            const url = {path}
            Object.assign(url, opt)
            let length = 0

            if (!url.length) {
                for (const i in this.paths) {
                    length = length + 1
                }
            } else {
                length = url.length
            }
    
            Object.assign(this.paths, { [length]: {path} })
    
            if (opt.name) {
                Object.assign(url, {id: length, urls: this})
                this[opt.name] = this.resolveObject(opt.name, url)
            }
            
        }
    }

    on(path, opt) {
        if(this.typeof(opt.response) === 'object') {
            Object.assign(opt, opt.response)
            this.setUrl(path, opt)
        } else {
            this.setUrl(path, opt)
        }

    }
}


module.exports = { NjUrlSuper }