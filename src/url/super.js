const { NjSuper } = require('njsuper')
const { NjUrlResponse } = require('./response')
const { NjFile, NjFiles } = require('njfile')

class NjUrlSuper extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
        if (this.type == 'web') {
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