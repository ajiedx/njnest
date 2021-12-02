
const { NjSuper } = require('njsuper')

class NjResponse extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        
        this.unicode = 'charset=utf-8\r\n\r\n'
    }
    

    head(code, contype) {
        return this.httpVersion + code  + ' OK\r\nContent-Type: ' + contype + '; ' + this.unicode
    }

    codeRes(code, ext, rsp) {
        let conext = ''
        if (ext === 'js' || ext === 'css' || ext === 'html') {
            conext = 'text/'+ext
        } else {
            conext = ext
        }

        
        return this.head(code, conext) + rsp
    }

    async qualify(url) {
        if (url.status == true) {
            if (url.activated) {
                this.response = this.codeRes(200, this.ext, url.activated.rsp(this.request))
                url.status = false
                url.activated = false
            } 

        }
    }

}


module.exports = { NjResponse }