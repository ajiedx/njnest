const { NjSuper } = require('njsuper')

class JinCss extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

    }

    json(css) {
        this.response = ''
        let line = ''
        let index = 0
        let bi = 2
        let li = css.length - 1

        for (const i in css) {
            if (i == li) {
                line = '"'+css[i]+'": ' + css[i-2] 
                this.response = this.response + line + ' }\r\n'
                line = ''
            } else if (bi == i) {
                line = '"'+css[i]+'": ' + css[i-2] 
                bi = bi + 3
                this.response = this.response + line + ',\r\n'
                line = ''
            } else if (i == 0) {
                this.response = '{ '
            } 
            
        }

    }

    cut() {
        let line = ''
        if (this.recss) {
            let cindex = 2
            let index = 0
            this.incss = []
            for (const i in this.loadcss) {
                if (i == cindex) {
                    if (this.loadcss[i].length != this.recss[i].length) {
                        this.incss[index] = this.loadcss[i - 2]
                        this.incss[index + 1] = this.loadcss[i - 1]
                        this.incss[index + 2] = this.loadcss[i]
                        index = index + 1
                    } else if (this.loadcss[i] !== this.recss[i]) {
                        this.incss[index] = this.loadcss[i - 2]
                        this.incss[index + 1] = this.loadcss[i - 1]
                        this.incss[index + 2] = this.loadcss[i]
                        index = index + 1
                    }
                    cindex = cindex + 3
                }
            }
            console.log(this.incss)
            this.recss = this.loadcss
            this.json(this.incss)
        } else {
            this.recss = []
            let re = 1
            for (const i in this.loadcss) {
                if (re == i) {
                    this.recss[re] = 0
                    re = re + 3
                } else {
                    this.recss[i] = this.loadcss[i]
                }
            }
            this.json(this.recss)
        }
    }

    indexifyCss(file) {
        this.loadcss = []
        let double = ''
        let index = 0
        let rindex = 0
        for (const i in file) {
            if (file[i] === '}') {
                this.loadcss[index] = rindex
                this.loadcss[index+1] = 0
                double = double  + '}'
                this.loadcss[index+2] = double.replaceAll('   ', '') // :D
                double = ''
                index = index + 3
                rindex = rindex + 1
            } else if(!file[i].match(/[\n\r\t]/)) {
                double = double + file[i]
            } 
            
        }

        this.cut()

    }
}


module.exports = {JinCss}