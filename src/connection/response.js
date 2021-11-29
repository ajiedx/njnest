
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

    async qualify(contmp) {
        
        if (contmp.status == true) {
            if (contmp.paths[contmp.active].status == true) {

                this.response = this.codeRes(200, this.ext, contmp.paths[contmp.active].rsp(this.request))
                contmp.status = false
                contmp.paths[contmp.active].status = false

            }
        }
    }

}


module.exports = { NjResponse }