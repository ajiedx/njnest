const { NjUrlResponse } = require('./url/response')
const { NjParser } = require('./parse')
const { NjFiles, NjFile } = require('njfile')

class NjUrl extends NjParser {
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

        if (this.type == 'web') {
            this.onScriptsLinks()
            // console.log(this.paths)
        }
        
    }

    onScriptsLinks() {
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


    on(path, opt) {
  
        if (!opt.name) {
            opt.name = path.split('/')
            opt.name = opt.name[opt.name.length - 1]
            if(opt.name.includes('.')) {
                opt.name = opt.name.split('.')[0]
            }
            
        }


        if(opt instanceof NjUrlResponse) {
            this[opt.name] = this.resolveObject(opt.name, opt)
            Object.assign(this.paths, { [opt.id]: {
                path: opt.path
            } })
        } else {
            const url = {path}

            if (this.type == 'web') {
                opt.web = true
                opt.html = this.html
            } else if (this.type == 'api') {
                opt.api = true
            }

            

            Object.assign(url, opt)

            let length = 0

            if (!url.length) {
                for (const i in this.paths) {
                    length = length + 1
                }
            } else {
                length = url.length
            }
            
            if (opt.name) {
                Object.assign(url, {id: length})
                this[opt.name] = this.resolveObject(opt.name, url)
            }
            
    
            Object.assign(this.paths, { [length]: this[opt.name] })

        }


    }


    check(rqs) {

        for (const i in this.paths) {
            
            if(this.paths[i].path === rqs.url) {

                this.status = true
    
                if(this.paths[i].head) {
                    this.head = this.paths[i].head  
                }
                this.active = i

            } 
            
            // else {
            //     this.status = 404
            //     this.head = 404
            //     this.active = 404
            // }
        }

    }


}

module.exports = { NjUrl }