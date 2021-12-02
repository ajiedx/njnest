const { NjSuper } = require('njsuper')
const path = require('path')
const { NjFile, NjFiles } = require('njfile')

class NjHtml extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        if(!this.template) {
            const template = __dirname + path.sep + 'templates' + path.sep + 'html5.html'
            this.template = new NjFile('html5', {path: template, string: true})
            this.dt = this.template.content
        } 
        
    }


    addLinkScripts(jsorcss, scriptsorlinks) {

        
        for (const i in scriptsorlinks) {
            if(scriptsorlinks[i] instanceof NjFile) {
                
                const path = scriptsorlinks[i].path
                

                var brackets = '<?'
                if (jsorcss === 'js') {
                    brackets = '<script src="'+path+'"></script>\n</head>'
                } else {
                    brackets = '<link rel="stylesheet" href="'+path+'">\n</head>'
                }

                this.dt = this.dt.replace(this.headReg, brackets)
                 
            } else {
                if (jsorcss === 'js') {
                    if (this.typeof(scriptsorlinks) == 'array') {
                        const path = scriptsorlinks[i]
                        const brackets = '<script src="'+path+'"></script>\n</head>'
                        this.dt = this.dt.replace(this.headReg, brackets)
                    }
                    
                }
            }
        }

        // return new NjHtml(this.dt, this)
    }

    replaceBody(value) {
        let reg = new RegExp(this.closedReg.replaceAll('REGEX', 'body'), 'g')
        let vl = this.bodyTag.replace('CONTENT', value)
        this.replace(reg, vl)
    }

    replaceMeta(name, value) {
        const metaReg = this.metaReg.replace('REGEX', name)
        const closedReg = this.closedReg.replaceAll('REGEX', name)

        if (name == 'title') {
            const reg = new RegExp(closedReg, 'g') 

            const vl = this.closedTag.replaceAll('TAG', name).replace('CONTENT', value)
            this.replace(reg, vl)
        } else {
            const reg = new RegExp(metaReg, 'g')

            const vl = this.metaTag.replace('META', name).replace('CONTENT', value)
            this.replace(reg, vl)
        }
    }

    replace(reg, value) {
        this.dt = this.dt.replace(reg, value)
        return new NjHtml(this.dt, this)
    }
}

       

module.exports = { NjHtml }