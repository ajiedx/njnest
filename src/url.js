const { NjUrlResponse } = require('./url/response')
const { NjParser } = require('./parse')
const { JinLoad } = require('./jinload/jinload')
const { NjFiles, NjFile } = require('njfile')

class NjUrl extends NjParser {
    constructor(dt, objx, t) {
        super(dt, objx, t)

        this.objx = NjUrlResponse
        this.JinLoad = {}
        if (this.urlpth) {
            let cwd = process.cwd()
            const path = require( 'path' );
            const { readdirSync } = require('fs')
            for (var i in this.urlpth) {
                if (this.isEnd('.js', this.urlpth[i])) {
                    let name = this.urlpth[i].split('/'), ps = ''
                    if (name[0] === '.') ps = name.slice(1, name.length)
                    else ps = name.slice(0, name.length)
                    name = name[name.length - 1].split('.')[0]
                    this[name] = require('../../../'+ps.join('/'))
                    this.urlRspfy(name, this[name])
                } else {
                    let pi = [cwd]
                    this.urlpth[i] = this.urlpth[i].split('/')
                    let ps = []
                    if (this.urlpth[i][0] === '.') {
                        for (var c = 1; c < this.urlpth[i].length; c++) {
                            pi.push(this.urlpth[i][c])
                            ps.push(this.urlpth[i][c])
                        }
                    } else {
                        for (var c = 0; c < this.urlpth[i].length; c++) {
                            pi.push(this.urlpth[i][c])
                            ps.push(this.urlpth[i][c])
                        }
                    }

                    this.urlpth[i] = pi.join(path.sep)
                    let dir = readdirSync(this.urlpth[i], {withFileTypes: true})
                    for (const i in dir) {
                        if (this.isEnd('.js', dir[i].name)) {
                            let rqir = pi; rqir.push(dir[i].name)
                            let name = dir[i].name.split('.')[0]
                            this[name] = require('../../../'+ps.join('/')+'/'+dir[i].name)
                            this.urlRspfy(name, this[name])

                        }
                    }
                }
            }
        }

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
                    console.log(this.njfile[i].url)
                    this.on(this.njfile[i].url, {
                        rsp: () => {
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
                        rsp: () => {
                            return this.jsScripts[i].content
                        }
                    })
                }
            }
            this.on('/favicon.ico', {
                rsp: () => {
                    const { readFileSync, statSync } = require('fs')
                    console.log(__dirname)
                    const file = readFileSync('./public/favicon.ico').toString()
                    console.log(file)
                    return file
                }
            })
        }

        if (this.cssLinks) {
            for (const i in this.cssLinks) {
                if(this.cssLinks[i] instanceof NjFile) {
                    this.cssLinks[i].toString()
                    const path = this.cssLinks[i].path.slice(1, this.cssLinks[i].path.length)
                    this.on(path, {
                        rsp: () => {
                            return this.cssLinks[i].content
                        }
                    })
                }
            }
        }

    }

    urlRspfy(name, options) {
        let path, url
        options.name = name
        if (options.url) path = options.url
        else if (options.path)  path = options.path
        if (options.JINLOAD && !path.includes('.')) this.JinLoad = new JinLoad({lastLoads: options.JINLOAD}, this.JinLoad); delete options.JINLOAD
        if (this.url) url = {path: this.url + path}
        else url = {path}

        if (this.jsDir && !path.includes('.')) options.html = this.html
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
        } else if (options.name && !path.includes('.')) {

            if (path === '/') this.__INDEX = options.name
            this[options.name] = this.resolveObject(options.name, url)
        }
    }

    on(path, options) {
        let name
        if (!options.name) {
            name = path.split('/')
            name = name[name.length - 1]
            if(name.includes('.')) name = name.split('.')[0]
        } else name = options.name
        options.path = path
        this.urlRspfy(name, options)
    }

    check(req, loop) {
        if (req.path.includes('.')) {
            if (this.paths) {
                for (const i in this.paths) {
                    if(this.paths[i].path === req.path) {
                        this.status = true
                        this.activated = this.paths[i]
                        console.log(this.activated, 'kkkkkkkkkkkkkkkkkkkk')
                        break
                    } else {
                        this.status = false
                    }
                }
            }
        } else if(req.path.includes('/')) {
            let count = this.countChars(req.path, '/')
            let paths = req.path.split('/')
            console.log(req.path, count)
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
                    console.log(this.activated)

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

    }


}

module.exports = { NjUrl }
