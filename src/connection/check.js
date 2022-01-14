const { NjResponse } = require('./response')
const { NjFiles } = require('njfile')
const { NjUrlResponse } = require('../url/response')
const { NjView } = require('../nest/views')

class NjCheck extends NjResponse {


    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.defaultMsg = 'Hello World!'
        this.reloaded = true
        this.controller = new AbortController()
        this.docSrciptsViewsImage = ['script', 'document', 'image', 'worker']
    }

    async rqs(data) {
        let sort
        this.request = {}
        if (data[0] == 80 && data[1] == 79) {
            data = data.toString().split('\n\r\n')
            this.request = {body: data[1]}
            data = data[0].split('\n')
        } else {
            data = data.toString().split('\n')
        }

        const [perspective, path, network] = data[0].trim().split(' ')
        if(this.isIntro('HTTP', network)) this.httpVersion = network + ' '
        Object.assign(this.request, {perspective, path, network})
        this.headers = {}
        for (let i = 1; i < data.length; i++) {
            sort = this.splitOnceChars(data[i], ':', 'diss') 
            this.headers[sort[0]] = sort[1].trim()
        }
        
        Object.assign(this.request, {headers: this.headers})
        this.perspective = perspective
    }

    async updateReload() {
        if (this.reloaded) {
            this.response = this.codeRes(200, '*/*', 'Reload Browser')
            this.reloaded = false
        } else if (this.reloadFile) {
            this.response = this.codeRes(200, '*/*', this.reloadFile)
        } else {
            this.response =  this.codeRes(200, '*/*', 'No Updates Found')
        }
    }

    async checkReload(data) {
        const [firstLine, ...otherLines] = data.toString().split('\n')
        const [perspective, path, network] = firstLine.trim().split(' ')
        if (this.isIntro('RELOAD', perspective)) {
            if (this.isIntro('/jinload', path)) {
                this.reloadFile = path.split('/')
                this.reloadFile = this.reloadFile[2] + '/' + this.reloadFile[3]
                this.response = '\r\n'
            } else {
                this.controller.abort()
                this.response = 'Aborted..\r\n'
                for (const i in this.urls) {
                    if(this.urls[i].sqlRequest) {
                        this.urls[i].sqlRequest('', function () {})

                    }
                }
            }
        } else if (this.isIntro('/jinload', path)) {
            if ('/jinload.js' === path) {
                this.check(data)
            } else {
                const jinload = path.split('/')
                if (jinload[2] === 'update') {
                    this.updateReload()
                } else {
                    const file = jinload[2].split('.')
                    for (const i in this.urls) {
                        if (this.urls[i][file[1]]) {
                            for (const l in this.urls[i][file[1]]) {
                                if (this.urls[i][file[1]][l] instanceof NjFiles) {
                                    if (this.urls[i][file[1]][l][file[0]]) {
                                        this.urls[i][file[1]][l][file[0]].updateFile()
                                        this.urls[i][file[1]][l][file[0]].toString()
                                        this.ext = file[1]
                                        this.load(this.urls[i][file[1]][l][file[0]])
                                    }
                                }
                            }
                        }
                    }

                    if (!this.response) {this.response = '\r\n Not Found'}

                }

            }
        } else {
            this.check(data)
        }
    }

    async check(data) {
        this.rqs(data)
        for(const i in this.urls) {
            if (!this.valueInArray(this.headers['Sec-Fetch-Dest'], this.docSrciptsViewsImage) && this.headers['JinLoad'] !== 'views' && !this.headers.JinLoadName) {
                if (!this.urls[i].jsDir) {
                    this.urls[i].check(this.request)
                    this.response = this.codeRes(200, '*/*', this.urls[i].activated.rsp(this.request))
                }
            } else {
                if (this.urls[i].jsDir) {
                    if (this.headers['JinLoad']) {
                        if (this.headers['Event'] === 'load') {
                            if (this.headers['JinLoadName']) {
                                if (this.headers['JinLoadName'] === 'views') {
                                    this.headers['JinLoadName'] = 'default'
                                    this.urls[i].status = true
                                    this.urls[i].activated = this.urls[i][this.urls[i].__INDEX].activateView('default')
                                    this.ext = 'incomplete-*/*'
                                    this.qualify(this.urls[i])
                                } else {
                                    this.response = this.codeRes(200, 'incomplete-*/*', this.urls[i].JinLoad.rsp(this.headers['JinLoadName']))
                                }
                                
                                if (!this.response) {
                                    this.response = this.codeRes(400, this.ext, 'Not Found')
                                }
                            }
                            this.urls[i].status = false
                            this.urls[i].activated = false
                        }
                    }
                    if (!this.response) {
    
                        if (this.isIntro('text/html', this.request.headers.Accept)) {
                            this.ext = 'html'
                        } else if (this.isIntro('script', this.request.headers['Sec-Fetch-Dest'])) {
                            this.ext = 'javascript'
                        } else if (this.isIntro('text/css', this.request.headers.Accept)) {
                            this.ext = 'css'
                        }  else if (this.request.headers['Sec-Fetch-Dest'] === 'image' && this.isIntro('image/avif',  this.request.headers.Accept)) {
                            if (this.request.path === '/favicon.ico') this.ext = 'image/x-icon'
                            else this.ext = 'image/*'
                        }
                        this.urls[i].check(this.request)
    
                        if (this.urls[i].activated instanceof NjUrlResponse) {
                            this.qualify(this.urls[i])
                        } else if (this.urls[i].activated instanceof NjView) {
                            this.ext = 'incomplete-*/*'
                            this.qualify(this.urls[i])
                            
                        } else {
                            this.response = this.codeRes(400, this.ext, 'Not Found')
                            this.urls[i].status = false
                        }
                    }
                }
                

            }
            
           
        }
    }

}

module.exports = { NjCheck }
