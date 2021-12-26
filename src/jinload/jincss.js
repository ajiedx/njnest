const { NjSuper } = require('njsuper')

class JinCss extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        this.dri = 0
        this.del = []
    }

    json(css, state) {
        this.response = 'JinCss: '+state+'\r\n\r\n { '
        let line = ''
        let index = 0
        let li = css.length - 1
        for (const i in css) {
            if (i == li) {
                line = '"'+css[i][2]+'": ' + css[i][1] 
                this.response = this.response + line + ' }\r\n'
                line = ''
            }  else {
                line = '"'+css[i][2]+'": ' + css[i][1] 
                this.response = this.response + line + ',\r\n'
                line = ''
            }
        }
    }

    newifyCut() {
        let line = '', state = false, check = false
        this.innew = [], this.incss = []
        if (this.inold ) {
            let it = 0, id = 1, ii = 2, ix = 0, iw = 0
            if (this.liold !== this.lin) {
                if (this.liold > this.lin) {
                    for (const i in this.inold) {
                        if (this.loadcss[i]) {
                            if (this.inold[i][1] == this.loadcss[i][1]) {
                                if (this.inold[i][0] !== this.loadcss[i][0]) {
                                    // NEW
                                    for (let index = i+1; index < 4; index++) {
                                        if (this.loadcss[index]) {
                                            if (this.inold[i][0] === this.loadcss[index][0]) {
                                                check = true
                                                if (this.inold[i][2] !== this.loadcss[index][2]) {
                                                    this.incss[ix] = this.loadcss[index]
                                                    this.incss[ix][1] = this.inold[i][1]
                                                    this.innew[iw] = this.incss[ix]
                                                    iw = iw + 1
                                                }
                                                this.loadcss[index] = []
                                                break
                                            } 
                                        } else break
                                        
                                        
                                    }
                                
                                    if (!check) {
                                        this.innew[iw] = this.inold[i]
                                        this.inold[i][2] = Number ('-'+this.inold[i][1])
                                        this.del[i] = this.inold[i]
                                        this.del[i][3] = i
                                        this.dri = this.dri + 1
                                        iw = iw + 1
                                        check = false
                                    } 
                                } else if (this.inold[i][2] !== this.loadcss[i][2]) {
                                    // CHANGED
                                    this.inold[i][2] = this.loadcss[i][2]
                                    this.innew[iw] = this.loadcss[i]
                                    this.innew[iw][1] = this.inold[i][1]
                                    iw = iw + 1
                                }
                            } 
                        } else {
                            this.innew[iw] = this.inold[i]
                            this.inold[i][2] = Number ('-'+this.inold[i][1])
                            this.del[i] = this.inold[i]
                            this.del[i][3] = i
                            this.dri = this.dri + 1
                            iw = iw + 1
                        }
                       
                    }

                    this.json(this.innew, 'Decremental')
                    
                } else {
                    for (const i in this.loadcss) {
                        if (i > this.liold - 1) {
                            this.inold[i] = this.loadcss[i]
                            this.innew[iw] = this.inold[i]
                            this.liold = this.liold + 1
                            iw = iw + 1
                        } else if (this.inold[i][2] !== this.loadcss[i][2]) {
                            this.innew[iw] = this.loadcss[i]
                            iw = iw + 1
                        }
                    }
                    if (this.innew[0] != undefined) this.json(this.innew, 'In Change')
                    else this.response = 'JinCss: No Change\r\n\r\n'
                }
            } else {
                for (const i in this.loadcss) {
                    if (this.inold[i][2] !== this.loadcss[i][2]) {
                        if (this.del[i]) {
                            delete this.del[i]
                        }
                        this.inold[i][0] = this.loadcss[i][0]
                        this.inold[i][2] = this.loadcss[i][2]
                        this.innew[iw] = this.inold[i]
                        iw = iw + 1
                    }
                }
                if (this.innew[0] != undefined) this.json(this.innew, 'In Change')
                else this.response = 'JinCss: No Change\r\n\r\n'
            }

        } else {
            this.inold = this.loadcss
            this.liold = this.lin
            this.json(this.loadcss, 'First Load')
        }
        console.log(this.inold, 'inold ++++++++++++++++++++++++++++++++++++++++')
    }

    indexifyCss(file) {
        this.loadcss = [], this.lin = 0, this.newmerge = []
        if (this.dri > 0) {
            this.loadcss = this.del
        }
        console.log(this.del)
        let double = '', rindex = 0, mindex = 0, down = false, brackets = 1
        for (const i in file) {
            if (file[i] === '{') {
                if (brackets == 1) {
                    if (this.del[this.lin]) {
                        if (this.del[this.lin][0] !== double) {
                            this.lin = this.lin + 1
                            for (let s = this.lin; s < this.del.length; s++) {
                                if (this.del[s][3] === this.lin) this.lin = this.lin + 1
                            }
                            this.loadcss[this.lin] = []
                            this.loadcss[this.lin][0] = double
                        } else {
                            console.log(double, 'asdasd')
                            delete this.del[this.lin]
                            this.loadcss[this.lin] = []
                            this.loadcss[this.lin][0] = double
                            
                        }
                    } else if (this.inold) {

                        if (this.inold[this.lin]) {
                            if (this.inold[this.lin][0] !== double) {
                                down = true
                                this.newmerge[mindex] = []
                                this.newmerge[mindex][0] = double
                            } else {
                                
                                this.loadcss[this.lin] = []
                                this.loadcss[this.lin][0] = double
                            }
                        } else {
                            this.loadcss[this.lin] = []
                            this.loadcss[this.lin][0] = double
                        }
                    } else {
                        this.loadcss[this.lin] = []
                        this.loadcss[this.lin][0] = double
                    }
                    
                    brackets = 2
                } else {
                    brackets = 0
                    break
                }
                
            }
            if (file[i] === '}') {
                if (brackets == 2) {
                    if (down) {
                        this.newmerge[mindex][1] = mindex
                        this.newmerge[mindex][2] = double  + '}'
                        double = ''
                        mindex = mindex + 1
                        down = false
                    } else {
                        this.loadcss[this.lin][1] = rindex
                        this.loadcss[this.lin][2] = double  + '}'
                        this.lin = this.lin + 1
                        double = ''
                        rindex = rindex + 1
                    }
                    brackets = 1
                } else {
                    brackets = 0
                    break
                }
                
            }  else if(!file[i].match(/[\n\r\t]/)) {
                double = double + file[i]
            } 
            
        }

        if (mindex > 0) {
            for (const i in this.newmerge) {
                this.loadcss[this.lin] = this.newmerge[i]
                this.loadcss[this.lin][1] = rindex
                rindex = rindex + 1
                this.lin = this.lin + 1
            }
        }
        console.log(this.loadcss, 'loadcss __________________________________')
        // console.log(this.incss, 'incss')
        // console.log(this.innew, 'innew')
        console.log(this.inold, 'inold')
        this.lin = this.lin - 1
        if (brackets != 0) this.newifyCut()
        else this.response = 'JinCss: No Brackets\r\n\r\n', console.log('Close The Brackets')
    }
}


module.exports = {JinCss}