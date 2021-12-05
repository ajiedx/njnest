
const { NjSuper } = require('njsuper')
const { JinLoad } = require('../jinload/jinload')

class NjResponse extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        this.unicode = 'charset=utf-8'
        this.jinload = new JinLoad()
    }

    head(code, contype) {

        this.inside = ''
        if (code === 401) {
            this.status = ' Unathorized'
        } else if (code === 200) {
            this.status = ' OK'
        } else if (code === 400) {
            this.status = ' Bad Request'
        }

        this.response = this.httpVersion + code + this.status + '\r\n\
Access-Control-Allow-Origin: *\r\n\
Connection: Keep-Alive\r\n\
Content-Type: ' + contype + '; ' + this.unicode + '\r\n\
Keep-Alive: timeout=5, max=1000 \r\n\
'
        if (code === 401) {
            this.inside = 'WWW-Authenticate: Basic realm="Login request.", charset= "UTF-8"\r\n'
        }

        if (this.cookie) {
            this.inside = this.inside + this.cookie + '\r\n'
        }

        this.response = this.response + this.inside

       
        return this.response + '\r\n'
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

    async load(text) {
        if (this.ext === 'css') {
            this.response = this.codeRes(200, '*/*', this.jinload.css(text))
        } else {
            this.response = this.codeRes(200, '*/*', text.content)
        }
    }

    async qualify(url) {

        if (url.status == true) {
            if (url.activated) {
                if (url.activated.headers) {
                    this.assign('this', url.activated.headers)
                }

                this.response = this.codeRes(200, this.ext, url.activated.rsp(this.request))
                url.status = false
                url.activated = false
            } 

        }
    }

}


module.exports = { NjResponse }