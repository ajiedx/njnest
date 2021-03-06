
const { NjSuper } = require('njsuper')
const { NJinLoads } = require('jinload')

class NjResponse extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        this.unicode = 'charset=utf-8'
        this.jinload = new NJinLoads()
        this.rspHeaders = []
    }

    head(num, type) {
        this.inside = ''
        let contype = ''
        if (num === 401) {
            this.status = ' Unathorized'
        } else if (num === 200) {
            this.status = ' OK'
        } else if (num === 400) {
            this.status = ' Bad Request'
        }

        if (type.includes('-')) {
            [contype, type] = type.split('-')
        }

        this.response = this.httpVersion + num + this.status + '\r\n\
Access-Control-Allow-Origin: *\r\n\
Connection: Keep-Alive\r\n\
Content-Type: ' + type + '; ' + this.unicode + '\r\n\
Keep-Alive: timeout=5, max=1000 \r\n\
'
        if (this.rspHeaders.length > 0) {
            for (const i in this.rspHeaders) {
                this.response = this.response + this.rspHeaders[i] + '\r\n'
            }
            this.rspHeaders = []
        }

        if (num === 401) {
            this.inside = 'WWW-Authenticate: Basic realm="Login request.", charset= "UTF-8"\r\n'
        }

        if (this.cookie) {
            this.inside = this.inside + this.cookie + '\r\n'
        }

        this.response = this.response + this.inside
        if (contype === 'incomplete') {
            return this.response
        } else {
            return this.response + '\r\n'
        }


    }

    codeRes(num, ext, rsp) {
        
        let conext = ''
        if (ext === 'javascript' || ext === 'css' || ext === 'html') {
            conext = 'text/'+ext
        } else {
            conext = ext
        }

        if (!rsp) return false
        else return this.head(num, conext) + rsp
    }

    async load(text) {
        if (this.ext === 'css') {
            this.rspHeaders.push('JinLoad: UpdateCss')
            this.response = this.codeRes(200, 'incomplete-text/css', this.jinload.css(text))

        } else {
            this.response = this.codeRes(200, '*/*', text.content)

        }
    }

    async qualify(url) {

        if (url.status == true) {
            if (url.activated) {
                if (url.activated.headers) this.assign('this', url.activated.headers)
                this.response = this.codeRes(200, this.ext, url.activated.rsp(this.request))
                url.status = false
                url.activated = false
            }

        }
    }

}


module.exports = { NjResponse }
