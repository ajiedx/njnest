const {NjSuper} = require('njsuper')

class NjGhost extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        this.ghost513()
    }

    ghost513() {
        this.ghost13 = [2,3,5], this.m = false, this.ghost5 = [], this.x2x32 = Math.pow(2, 32)
        let a = 3, i = 5, n = 3, z = 0
        while (z < 64) {

            this.m = true
            if (i % 21 == 0) n = n + 1
            
            if (i % 3 != 0) {
                if (i % 5 != 0) {
                    if (n > 3) {
                        if (i % 7 != 0) {
                            if (n > 5) {
                                if (i % 11 != 0) {
                                if (n > 6) {
                                if ( i % 13 != 0) {
                                    if (n > 9) {
                                    if (i % 17 == 0) {
                                        this.m = false
                                    } 
                                    }
                                } else this.m = false 
                                }
                                } else this.m = false
                            }
                        } else this.m = false
                    }
                } else this.m = false 
            } else this.m = false 

            if (this.m) {
                if (z < 8) this.ghost5[z] = Math.pow(this.ghost13[z], .5) * this.x2x32 | 0
                this.ghost13[z] = Math.pow(this.ghost13[z], 1/3) * this.x2x32 | 0
                z++
                if (a < 64) this.ghost13[a] = i
            } else a--
            a++; i+=2
        }
    }

    sha256(string) {
        this.str8 = 8 * string.length
        for (string += '\x80'; string.length % 64 - 56;) string += '\x00'
        let di = [], ch, l = [], s, di16
        for (let d = 0; d < string.length; d++) {
            if (ch = string.charCodeAt(d), ch >> 8) return
            di[d >> 2] |= ch << (3 - d) % 4 * 8
        }
        di[di.length] = this.str8 / this.x2x32 | 0
        di[di.length] = this.str8
        this.cygr = []
        for (let i = 0; i < di.length; ) {
            di16 = di.slice(i, i+=16)
            
            for (let index = 0; index < 8; index++) {
                this.cygr[index] = this.ghost5[index]
            }
            
            for (let l = 0; l < 64; l++) {
                s = this.ghost5[7] + ((this.ghost5[4] >>> 6 | this.ghost5[4] << 32 - 6) 
                    ^ (this.ghost5[4] >>> 11 | this.ghost5[4] << 32 - 11)
                         ^ (this.ghost5[4] >>> 25 | this.ghost5[4] << 32 - 25))
                            + (this.ghost5[4] & this.ghost5[5] ^ ~this.ghost5[4] & this.ghost5[6])
                            + this.ghost13[l]
                            + (di16[l] = 16 > l ? di16[l] : di16[l - 16]
                                +  ((di16[l - 15] >>> 7 | di16[l - 15] << 32 - 7)
                                    ^ (di16[l - 15] >>> 18 | di16[l - 15] << 32 - 18)
                                    ^ (di16[l - 15] >>> 3))
                                + di16[l - 7]
                                + ((di16[l - 2] >>> 17 | di16[l - 2] << 32 - 17)
                                    ^ (di16[l - 2] >>> 19 | di16[l - 2] << 32 - 19)
                                    ^ (di16[l - 2] >>> 10))  | 0 )

                this.sx = [s + ((this.ghost5[0] >>> 2 | this.ghost5[0] << 32 - 2)
                    ^ (this.ghost5[0] >>> 13 | this.ghost5[0] << 32 - 13)
                    ^ (this.ghost5[0] >>> 22 | this.ghost5[0] << 32 - 22))
                    + (this.ghost5[0] & this.ghost5[1] ^ this.ghost5[0] & this.ghost5[2] ^ this.ghost5[1] & this.ghost5[2]) | 0]
                this.addArray(this.sx, this.ghost5)
                this.ghost5 = this.sx
                this.ghost5[4] = this.ghost5[4] + s | 0
            }
            for (let z = 0; z < 8; z++) {
                this.ghost5[z] = this.ghost5[z] + this.cygr[z] | 0
            }
        }
        let sh256 = ''
        for (let i = 0; i < 8; i++) {
            for (let a = 3; a + 1; a--) {
                var y = this.ghost5[i] >> 8 * a & 255
                sh256 += (16 > y ? 0 : '') + y.toString(16)
            }
        }
        console.log(sh256)
    }   
}

const sha256 = new NjGhost()
sha256.sha256('d9s0xcA')
module.exports = { NjGhost }