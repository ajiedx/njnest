const { NjSuper } = require('njsuper')
const { NjUrlResponse } = require('./response')
const { NjFile, NjFiles } = require('njfile')


class NjUrlSuper extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        this.urlpth = []
        
        if (objx.paths) this.addArray(this.urlpth, objx.paths)
        if (objx.urls) this.addArray(this.urlpth, objx.urls)

        if (!this.urlpth[0]) delete this.urlpth
        if (this.reload == true) {
            const path = require('path')
            let dirname = __dirname.split(path.sep)
            dirname = dirname.slice(0, dirname.length - 2)
            this.njnestdir = dirname.join(path.sep)
            if (dirname[dirname.length - 2] == 'node_modules') {
                dirname = dirname.slice(0, dirname.length - 1)
            } else {
                dirname.push('node_modules')
            }
            this.nodemodulesdir = dirname.join(path.sep)

            this.njfile = new NjFiles('njfile', {construct: false})

            this.njfile.defineFile('jinload', {path: this.nodemodulesdir + path.sep +'jinload'+path.sep+'jinload.js.build', url: '/jinload.js', string: true})
            this.njfile.defineFile('jinupdate', {path: this.nodemodulesdir + path.sep +'jinload'+path.sep+'src'+path.sep+'update.js', url: '/jinupdate.js', string: true})

            let jsloads = ["document.onreadystatechange = function () { \r\n \
                if(document.readyState === 'complete') {\r\n \
                onJinLoad('ready')\r\n "]

            if (this.jinload) {
                for (const i in this.jinload) {
                    if (this.jinload[i].includes('js')) {
                        jsloads.push("        jinload.js('"+this.jinload[i].split('.')[0]+"')\r\n")
                    }
                }
            }

            jsloads.push("onJinLoad('jinReload')}}")
            let jsloadrn = ''
            for (const i in jsloads) {
                jsloadrn = jsloadrn + jsloads[i]
            }

            this.njfile.jinload.content = this.njfile.jinload.content + jsloadrn
        }

        if (this.jsDir) {
            this.js = new NjFiles('js', {dirs: this.jsDir, ext: ['js'], dir: false})

        }

        if (this.jsScripts) {
            const scripts = this.jsScripts
            this.jsScripts = new NjFiles('jscripts', {construct: false})
            for (const i in scripts) {
                var name = scripts[i].split('/').pop().slice(0, -3)
                this.jsScripts.defineFile(name, { path: scripts[i] })

            }
        }

        if (this.cssDir) {
            this.css = new NjFiles('css', {dirs: this.cssDir, ext: ['css'], dir: false})
        }

        if (this.cssLinks) {
            const links = this.cssLinks
            this.cssLinks = new NjFiles('csslinks', {construct: false})
            for (const i in links) {
                var name = links[i].split('/').pop().slice(0, -4)
                this.cssLinks.defineFile(name, { path: links[i]})

            }
        }

        if (this.sql === 'mysql') {
            const { NjMysql } = require('../sql/mysql')
            this.sql = new NjMysql()
            this.sqlName = 'mysql'
        }


    }


}


module.exports = { NjUrlSuper }
