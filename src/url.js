const { NjUrlResponse } = require('./url/response')
const { NjParser } = require('./parse')
const { NjViews } = require('./nest/views')
const { NjFiles, NjFile } = require('njfile')

class NjUrl extends NjParser {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.objx = NjUrlResponse;
        this.paths = {}
        this.active = 0
        this.status = false
        this.head = 200

        if (this.jsDir) {  
            this.onScriptsLinks()

        }


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
            let url
            
            if (this.url) {
                url = {path: this.url + path}
            } else {
                url = {path}
            }


            if (this.jsDir) {
                opt.html = this.html
            }

            if (opt.idx) {
                opt.id = opt.idx
            }
            
            if (this.sql) {
                opt.sql = this.sql.copy(this.sql)
                opt.sqlName = this.sqlName
                if(this.sqlRequest) {
                    opt.sqlRequest = this.sqlRequest
                } else {
                    console.log('Provide SQL Request connection function for ' + this.sqlName + ' syntax.')
                }
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
                Object.assign(url, {pathid: length})
                if (path === '/') {
                    Object.assign(this.paths, { index: opt.name })
                }
                this[opt.name] = this.resolveObject(opt.name, url)
            }

            Object.assign(this.paths, { [length]: this[opt.name] })

        }
    }


    check(req, loop) {

        if(req.path.includes('/')) {
            let count = 0
            for (const i in req.path) {
                if (req.path[i] === '/') {
                    count = count + 1
                }
            }

            let paths = req.path.split('/')

            if (count > 1) {
                if(this.url) {
                    let clone = []
                    let url = this.url.slice(1, this.url.length)
                    for (const i in paths) {
                        if (url !== paths[i]) {
    
                            clone.push(paths[i])
                        }
                    }
                    paths = clone

                }

                if (this[paths[1]]) {

                    this.activated = this[paths[1]]

                    for (let index = 1; index < paths.length; index++) {
                        if (this.activated.idx) {
                            this.activated.setId(paths[index + 1])
                            break
                        }
                        this.activated = this.activated[paths[i]]
                        i = i + 1
                        
                    }

                    console.log(path)
                    this.status = true
                } else {
                    this.status = false
                }
            } else if (this[paths[1]]) {
                this.activated = this[paths[1]]
                this.status = true
            } else if (req.path === '/') {
                this.activated = this[this.paths.index]
                this.status = true
            } else if (this.paths.index) {
                if (this[this.paths.index].views) {
                    
                    if (this[this.paths.index].controller) {
                        if (this[this.paths.index].controller.views[paths[1]]) {
                            // console.log(this[this.paths.index].controller.views[paths[1]], paths[1])
                            this.activated = this[this.paths.index].controller.views[paths[1]]
                            this.status = true
                        } else {
                            for (const i in this[this.paths.index].controller.views) {
                                if (this[this.paths.index].controller.views[i] instanceof NjViews) {
                                    if (this[this.paths.index].controller.views[i][paths[1]]) {
                                        this.activated = this[this.paths.index].controller.views[i][paths[1]]
                                        this.status = true
                                    }
                                }
                            }
                        }
                    }
                  
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