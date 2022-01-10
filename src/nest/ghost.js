const {NjSuper} = require('njsuper')

class NjGhost extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        this.ghost513()
        this.strings = {}

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
                if (z < 8) this.ghost5[~((z-8))] = Math.pow(this.ghost13[z], .5) * this.x2x32 | 0
                this.ghost13[z] = Math.pow(this.ghost13[z], 1/3) * this.x2x32 | 0
                z++
                if (a < 64) this.ghost13[a] = i
            } else a--
            a++; i+=2
        }
    }

    update(string) {
        let str = ''; this.pin(this.strings, {key: string})
        if (this.strings.hasOwnProperty('0')) for (const i in this.strings) str += this.strings[i].key
        return this.sha256(str+string)
    }

    digest(type) {
        let sha256 = ''
        let x = this.ghost.length - 1
        for (; ; ) {
            if (x > this.gl - 1) {
                for (let a = 3; a + 1; a--) {
                    var y = this.ghost[x] >> 8 * a & 255
                    sha256 += (16 > y ? 0 : '') + y.toString(16)
                }
            } else break 
            x--
        } if (this.typeof(type) !== 'number' || !type) this.strings = {}
        return sha256
    }
    
    sha256() {
        Object.defineProperty(this, 'ghost', { value: this.ghost5.slice(this.ghost5.length -8, this.ghost5.length), configurable: true,
            writable: true, enumerable: true })
        let string = '', ll
        for (var i = 0; i < arguments.length; i++) {
            if (this.typeof(arguments[i]) === 'string') {
                string +=arguments[i]
                this.pin(this.strings, {key: arguments[i]})
            } 
        }
        
        this.str8 = 8 * string.length
        if (string.length % 2 == 0) string += '\x80\x00', this.strl = string.length
        else string += '\x80', this.strl = string.length
        let di = [], ch,  di16, sl44 = (this.strl + this.strl % 4) / 4, sl14 = 14, div, s = sl44, h, h64
        if (this.strl > 56){
            div = Number(String(this.strl / 64)[0])
            sl14 = (sl14 * (div + 1)) + (2 * div == 0 ? 1 : div) + 1
        } else sl14 = sl14 - sl44 + 2
        for (let d = 0; d < this.strl + sl14 - sl44 ; d++) {
            if (d < this.strl) {
                if (ch = string.charCodeAt(d), ch >> 8) return
                di[d >> 2] |= ch << (3 - d) % 4 * 8
            } else di[s++] = 0
        }

        di[di.length] = this.str8 / this.x2x32 | 0
        di[di.length] = this.str8
        for (let d = 0; d < di.length; ) {
            if (d == 0) h = 0, h64 = 64
            else h = this.ghost.length - 8, h64 = h + 64
            di16 = di.slice(d, d+=16)
            this.ghosted = this.ghost.slice(this.ghost.length - 8, this.ghost.length)
            for (let l = h, z = 0; l < h64; l++) {
                s = this.ghost[l] + ((this.ghost[l+3] >>> 6 | this.ghost[l+3] << 32 - 6) 
                    ^ (this.ghost[l+3] >>> 11 | this.ghost[l+3] << 32 - 11)
                            ^ (this.ghost[l+3] >>> 25 | this.ghost[l+3] << 32 - 25))
                            + (this.ghost[l+3] & this.ghost[l+2] ^ ~this.ghost[l+3] & this.ghost[l+1])
                            + this.ghost13[z]
                            + (di16[z] = 16 > z ? di16[z] : di16[z - 16]
                                +  ((di16[z - 15] >>> 7 | di16[z - 15] << 32 - 7)
                                    ^ (di16[z - 15] >>> 18 | di16[z - 15] << 32 - 18)
                                    ^ (di16[z - 15] >>> 3))
                                + di16[z - 7]
                                + ((di16[z - 2] >>> 17 | di16[z - 2] << 32 - 17)
                                    ^ (di16[z - 2] >>> 19 | di16[z - 2] << 32 - 19)
                                    ^ (di16[z - 2] >>> 10))  | 0 )
                
                        this.ghost[l+8] = s + ((this.ghost[l+7] >>> 2 | this.ghost[l+7] << 32 - 2)

                            
                    ^ (this.ghost[l+7] >>> 13 | this.ghost[l+7] << 32 - 13)
                        ^ (this.ghost[l+7] >>> 22 | this.ghost[l+7] << 32 - 22))
                        + (this.ghost[l+7] & this.ghost[l+6] ^ this.ghost[l+7] & this.ghost[l+5] ^ this.ghost[l+6] & this.ghost[l+5]) | 0
                this.ghost[l+4] = this.ghost[l+4] + s | 0
                z++
            }
            this.gl = this.ghost.length - 8
            let z = this.ghost.length - 1, i = 7
            for (;;) {
                if (z > this.gl - 1) this.ghost[z] = this.ghost[z] + this.ghosted[i] | 0
                else break
                z--, i--
            }
        }
        if (this.strings.len > 0) ll = string[0]
        else ll = di.length
        return this.digest(ll)
    }   
}


module.exports = { NjGhost }