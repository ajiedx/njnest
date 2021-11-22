const { NjUrlSuper } = require('./url/super')
const { NjHtml } = require('./parse/html')

const { NjFile } = require('njfile')
       
class NjParser extends NjUrlSuper {
    constructor(dt, objx) {
        super(dt, objx)
        
        if (this.type == 'web') {
            this.htmlOpt = {
                closedTag:'<TAG>CONTENT</TAG>',
                bodyTag: '<body>CONTENT</body>',
                metaTag: '<meta name="META" content="CONTENT">',
                metaReg: '\\<meta name="REGEX"[\\s\\S]+?[\\>]{1}',
                closedReg: '\\<REGEX\\>[\\s\\S]+\\<\\/REGEX>',
                headReg: new RegExp('<\\/head>', 'g'),
            }
            
            this.html = new NjHtml('defaultHtml', this.htmlOpt)

            for (const i in this.htmlMeta) { 
                this.html.replaceMeta(i, this.htmlMeta[i])

            }

            this.html.addLinkScripts('css', this.cssLinks)
            this.html.addLinkScripts('js', this.jsScripts)

            this.defaultBody = '<h1>Body</h1>'
            this.html.replaceBody(this.defaultBody)

        }
    }

}

module.exports = { NjParser }