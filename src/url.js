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

        if (this.reload == true) {
            for (const i in this.njfile) {
                if(this.njfile[i] instanceof NjFile) {
                    const path = this.njfile[i].url

                    this.on(path, {
                        response: () => {
                            return this.njfile[i].content
                        }
                    })
                }
                
            }

            this.on('/jinload', {
 
                response: (ctrl, req, res) => {
                    const raw = req.rawHeaders
                    // console.log(this.js)
                    if (raw.includes('jinreload')) {

                        this.updatefile = raw[raw.indexOf('jinreload') + 1]
                    } else {
                        if (raw.includes('jinload')) {
  
                            this.loadfile = raw[raw.indexOf('jinload') + 1]

                            for (const i in this.js) {
                                if (this.js[i] instanceof NjFiles) {
                                    for (const l in this.js[i]) {
                                        if (this.js[i][l] instanceof NjFile) {

                                            if (this.js[i][l].name === this.loadfile) {
                                                this.js[i][l].updateFile()
                                                this.js[i][l].toString()

                                                return this.js[i][l].content

                                            }
                                        }
                                    }
                                }
                            }

                            // return rsp({file: this.loadfile})

                        }
                
                        if (raw.includes('jinupdate')) {
                            if (this.updatefile) {
                                return this.updatefile
                            } else {
                                return 'No updates found'
                            }
                            
                        }
                
                        
                    }

                }
            })
        }   

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

        if (this.paths) {
            for (const i in this.paths) {
                // console.log(this.paths[i].path, rqs.url)
                if(this.paths[i].path === rqs.url) {
                    this.paths[i].status = true
                    this.status = true
                    // this.head = 200
                    // if(this.paths[i].head) {
                    //     this.head = this.paths[i].head  
                    // }
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


}

module.exports = { NjUrl }