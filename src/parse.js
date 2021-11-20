const { NjSuper } = require('njsuper')
const { NjFiles, NjFile } = require('njfile')

class NjParser extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

        this.files = new NjFiles('default', {dirs: ['./templates'], ext: ['js', 'html', 'css']})
        // this.files.setDir(this.files.dirs[0], {name: 'templates'})
        //     for()
        // if (this.dt === 'html') {
            
        // }

        console.log(this.files)
    }

    htmlWrapper(html) {
        console.log(this.indexHtml)
    }
}

module.exports = { NjParser }