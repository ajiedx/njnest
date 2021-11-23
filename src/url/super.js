const { NjSuper } = require('njsuper')
const { NjUrlResponse } = require('./response')
const { NjFile, NjFiles } = require('njfile')

class NjUrlSuper extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        if (this.type == 'web') {

            if (this.reload == true) {
                const path = require('path')
                let dirname = __dirname.split(path.sep)
                dirname = dirname.slice(0, dirname.length - 2)
                this.njnestdir = dirname.join(path.sep)
                dirname.push('node_modules')
                this.nodemodulesdir = dirname.join(path.sep)

                this.njfile = new NjFiles('njfile', {construct: false})

                this.njfile.defineFile('njsuper', {path: this.nodemodulesdir + path.sep +'njsuper'+path.sep+'njsuper.js', string: true})
                let load = ['', 'src', 'jinload', 'load.js']
                let update = ['', 'src', 'jinload', 'update.js']

                let njsupercontent = this.njfile.njsuper.content
                njsupercontent = njsupercontent.split('\n')
                njsupercontent = njsupercontent.slice(0, njsupercontent.length - 2)
                this.njfile.njsuper.content = njsupercontent.join('\n')

                load = load.join(path.sep)
                update = update.join(path.sep)

                this.njfile.defineFile('jinload', {path: this.njnestdir + load, url: '/jinload.js', string: true})
                this.njfile.defineFile('jupdate', {path: this.njnestdir + update, url: '/jinupdate.js', string: true})

                this.njfile.jinload.content = this.njfile.njsuper.content + this.njfile.jinload.content
                this.njfile.jupdate.content = this.njfile.njsuper.content + this.njfile.jupdate.content
                delete this.njfile.njsuper
                


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
        }

    }


}


module.exports = { NjUrlSuper }