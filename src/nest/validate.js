const { NjSuper } = require('njsuper')
const { NjJson } = require('../parse/json')
const { NjController } = require('./controller')

class NjValidate extends NjController {
    constructor(dt, objx) {
        super(dt, objx)

    }

    async validate(req) {
        const json = JSON.parse(this.body)

        if (this.perspective === 'POST' && this.perspective === 'PATCH')
            for (const i in this) {
                if (this[i] instanceof NjJson) {
                    for (const l in json) {
                        
                        if (i === l) {
                            let count = 0
                            let invalid = []
                            for (const y in json[l]) {
                                if (this[i][y]) {
                                    count = count + 1
                                    if (!this.scanType(json[l][y], this[i][y])) {
                                        invalid.push(y)
                                    }
                                }
                            }
                            
                            if (this[i].count !== count) {
                                console.log('The field count on "\
' + i + '" from "' + this.name +'" table doesnt match. Got \
' + count + ' instead of ' + this[i].count)
                            }
                            
                            if (invalid.length > 0) {
                                for (const y in invalid) {
                                    console.log(invalid[y] + ' got invalid type on "\
' + i + '" from "' + this.name + '" table')
                                }
                            }

                        }
                    }
                }
            }
    }

    scanType(value, type) {

        if (type.includes('int') || type.includes('dec')) {
            if (!isNaN(value)) {
                return true
            } else {
                return false
            }

        } else if (type.includes('string') || type.includes('char')) {
            if (typeof value === 'string') {
                return true
            } else {
                false
            }
        } else if (type.includes('date') || type.includes('time')) {
            if (isNaN(Date.parse(value))) {

                return false
            } else {
                return true
            }
        } else if (type.includes('array') || type.includes('list') || type.includes('massive')) {
            if (Array.isArray(value)) {
                return true
            } else {
                return false
            }
        } else if (type.includes('JSON') || type.includes('json')) {
            try {
                if (JSON.parse(value)) {
                    return true
                } else {
                    return false
                }
            } catch (error) {
                return false
            }
        } else {
            // if dev
            if (typeof value === 'object') {
                console.log(value + 'Its an object')
                return true

            }
        }
    }
}

module.exports = { NjValidate }
