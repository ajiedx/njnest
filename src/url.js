const { NjUrlResponse } = require('./url/response')
const { NjUrlSuper } = require('./url/super')
const { NjParser } = require('./parse')

class NjUrl extends NjUrlSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.objx = NjUrlResponse;
        this.paths = {}
        this.active = 0
        this.status = false
        this.head = 200
        if(this.wrapper) {
            this.wrap = this.wrapper
        }
    }

    wrap(html) {
        if(!this.parser) {
            if(this.type === 'web') {
                this.parser = new NjParser('html')
                return this.parser.htmlWrapper(html)
            }
        }
    }

    check(rsp) {
        for (const i in this.paths) {
            if(this.paths[i].path === rsp.url) {
                this.status = true
                if(this.paths[i].head) {
                    this.head = this.paths[i].head  
                }
                this.active = i

            }
        }

    }


}

module.exports = { NjUrl }