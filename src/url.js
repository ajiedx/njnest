const { NjUrlResponse } = require('./url/response')
const { NjParser } = require('./parse')

const { NjFiles, NjFile } = require('njfile')

class NjUrl extends NjParser {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.objx = NjUrlResponse
        this.paths = {}
        this.active = 0
        this.status = false
        this.head = 200

        if (this.jsDir) {
            this.onScriptsLinks()

        }
        this.noImageScriptsWorkersDocs = ['script', 'worker', 'image', 'document']
    }
    onScriptsLinks() {
        if (this.jinload) {
            for (const i in this.njfile) {
                if(this.njfile[i] instanceof NjFile) {
                    this.on(this.njfile[i].url, {
                        response: () => {
                            return this.njfile[i].content
                        }
                    })
                }
            }
        }

        if (this.jsScripts) {
            for (const i in this.jsScripts) {
                if(this.jsScripts[i] instanceof NjFile) {
                    this.jsScripts[i].toString()
                    const path = this.jsScripts[i].path.slice(1, this.jsScripts[i].path.length)
                    this.on(path, {
                        response: () => {
                            return this.jsScripts[i].content
                        }
                    })
                }
            }
        }

        if (this.cssLinks) {
            for (const i in this.cssLinks) {
                if(this.cssLinks[i] instanceof NjFile) {
                    this.cssLinks[i].toString()
                    const path = this.cssLinks[i].path.slice(1, this.cssLinks[i].path.length)
                    this.on(path, {
                        response: () => {
                            return this.cssLinks[i].content
                        }
                    })
                }
            }
        }


    }


    on(path, options) {
        if (!options.name) {
            options.name = path.split('/')
            options.name = options.name[options.name.length - 1]
            if(options.name.includes('.')) options.name = options.name.split('.')[0]
        }

        let url
        if (this.url) url = {path: this.url + path}
        else url = {path}

        if (this.jsDir) options.html = this.html
        if (options.idx) options.id = options.idx

        if (this.sql) {
            options.sql = this.sql.copy(this.sql)
            options.sqlName = this.sqlName
            if(this.sqlRequest) options.sqlRequest = this.sqlRequest
            else console.log('Provide SQL Request connection function for ' + this.sqlName + ' syntax.')
        }
        Object.assign(url, options)

        if (path.includes('.')) { // REGEX
            let length = 0
            for (const i in this.paths)
                length = length + 1
            let symbolpath = this.resolveObject(path, url)
            Object.assign(this.paths, { [length]: symbolpath })
        } else if (options.name) {
            if (path === '/') this.__INDEX = options.name
            this[options.name] = this.resolveObject(options.name, url)
        }
    }

    check(req, loop) {

        if(req.path.includes('/')) {
            let count = this.countChars(req.path, '/')
            let paths = req.path.split('/')

            if (count > 1) {
                if(this.url) {
                    let url = this.url.slice(1, this.url.length)
                    paths = paths.filter(path => url !== path)
                }

                for (let i = 1; i < paths.length; i++) {
                    if (this[paths[i]]) {
                        if (this[paths[i]].idx) {
                            this.activated = this[paths[i]]
                            this.activated.setId(paths[i + 1])
                            break
                        } else if (this[paths[i]].views) {
                            if (!this.valueInArray(req.headers['Sec-Fetch-Dest'], this.noImageScriptsWorkersDocs)) {
                                this.activated = this[paths[i]]
                                this.activated = this.activated.activateView(paths[i])
                                break
                            }
                        }
                    }
                }

                if (this.activated) this.status = true
                else this.status = false

            } else if (this[paths[1]]) {
                this.activated = this[paths[1]]
                this.status = true
            } else if (req.path === '/') {
                this.activated = this[this.__INDEX] ? this[this.__INDEX] : false
                this.status = true
            } else if (!this.valueInArray(req.headers['Sec-Fetch-Dest'], this.noImageScriptsWorkersDocs) && this.__INDEX) {
                if (this[this.__INDEX].views) {
                    console.log('\x1b[33m%s\x1b[0m', req)
                    console.log('\x1b[34m%s\x1b[0m', req)
                    this.activated = this[this.__INDEX].activateView(paths[1])
                    if (this.activated) this.status = true
                    else this.status = false
                }

            } else {
                this.status = false
            }


        }

        if (loop) {
            if (this.paths) {
                for (const i in this.paths) {
                    // console.log(this.paths[i].path, rqs.url)
                    if(this.paths[i].path === req.path) {
                        this.activated = this.paths[i]

                        this.status = true
                        // this.head = 200
                        // if(this.paths[i].head) {
                        //     this.head = this.paths[i].head
                        // }

                    }
                    // else {
                    //     this.status = 404
                    //     this.head = 404
                    //     this.active = 404

                    // }
                }

            }
        }






    }


}

module.exports = { NjUrl }
