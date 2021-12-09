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

    }

    async rqs(data) {
        const [firstLine, ...otherLines] = data.toString().split('\n')
        const [perspective, path, network] = firstLine.trim().split(' ')

        if(this.compareBegining('HTTP', network)) {
            this.httpVersion = network + ' '
            const headers = Object.fromEntries(otherLines.filter(_=>_)
            .map(line=>line.split(':').map(part=>part.trim()))
            .map(([name, ...rest]) => [name, rest.join(' ')]))

            this.request = {
                perspective,
                path,
                network,
                headers,
            }
        }
        // if (!this.compareBegining('image', this.request.headers.Accept)) {
        //     if (!path.includes('js') || !path.includes('css')) {
        //         console.log('\x1b[33m%s\x1b[0m', this.request)
        //         console.log('\x1b[34m%s\x1b[0m', this.request.headers)
        //     }
        // }
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
        if (this.compareBegining('RELOAD', perspective)) {
            if (this.compareBegining('/jinload', path)) {
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
        } else if (this.compareBegining('/jinload', path)) {
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

                }

            }



        } else {
            this.check(data)
        }
    }

    async check(data) {
        this.rqs(data)

        for(const i in this.urls) {

            if (this.urls[i].jsDir) {
                if (this.compareBegining('text/html', this.request.headers.Accept)) {

                    this.ext = 'html'

                } else if (this.compareBegining('text/js', this.request.headers.Accept)) {
                    
                    this.ext = 'js'
                } else if (this.compareBegining('text/css', this.request.headers.Accept)) {
                    this.ext = 'css'
                }

                this.urls[i].check(this.request)
                if (!this.urls[i].activated) {
                    this.urls[i].check(this.request, true)
                }
                
                if (this.urls[i].activated instanceof NjUrlResponse) {
                    this.qualify(this.urls[i])
                } else if (this.urls[i].activated instanceof NjView) {
                    // console.log(this.urls[i].activated, '_____')
                    this.ext = '*/*'
                    this.qualify(this.urls[i])
                    console.log(this.response)
                } else {
                    this.response = this.codeRes(400, this.ext, 'Not Found')
                    this.urls[i].status = false
                }
            } else if (this.urls[i].sql) {
                
                if (!this.compareBegining('image', this.request.headers.Accept)) {
                    this.urls[i].check(this.request)
                    if (this.urls[i].activated instanceof NjUrlResponse) {

                        this.response = this.codeRes(200, this.ext, this.urls[i].activated.rsp(this.request))
                    }
                }

            }


        }


        // else {
        //     for(const i in this.urls) {
        //         if (this.urls[i].type !== 'web') {
        //             this.urls[i].check(this.request.path)
        //             this.qualify(this.urls[i])
        //         }
        //     }
        // }

    }

}

module.exports = { NjCheck }
