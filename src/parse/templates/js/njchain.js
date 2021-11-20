class NjSuper {
    constructor(dt, objx) {
        if(typeof objx === 'object') {
            if (objx.hasOwnProperty('obj')) {
                this.objx = objx.obj
                delete objx.obj
            }
            Object.assign(this, objx)
        }
        
        if (typeof t !== 'undefined') {
            Object.create(this.dt)
        } else if (this.enum === true) {
            Object.defineProperty(this, 'dt', {
                value: dt,
                enumerable: true,
                writable: true,
                configurable: true
            })
            
        } else {
            this.dt = dt
        }
    }

    define(name, vl, objx) {
        if (objx === false) {
            Object.defineProperty(this, name, {
                value: vl,
                enumerable: true,
                writable: true,
                configurable: true
            })
        } else if (this.typeof(objx) === 'object') {

            Object.defineProperty(this, name, {
                value: this.resolveObject(vl, objx, name),
                enumerable: true,
                writable: true,
                configurable: true
            })
        } else if (this.objx) {
            Object.defineProperty(this, name, {
                value: this.resolveObject(vl),
                enumerable: true,
                writable: true,
                configurable: true
            })
        } else {
            Object.defineProperty(this, name, {
                value: this.resolveObject(vl),
                enumerable: true,
                writable: true,
                configurable: true
            })
        }
    }

    resolveObject(value, obj, name) {
        if (name) {
            if (obj.obj instanceof Object) {
                Object.assign(value, obj)
                return new obj.obj(name, value)
            } else if (this.objx) {
                Object.assign(value, obj)
                return new this.objx(name, value)
            } else {
                return new NjSuper(name, value)
            }
        } else if (obj) {
            if (obj.obj instanceof Object) {
                return new obj.obj(value, obj)
            } else if (this.objx) {
                return new this.objx(value, obj)
            } else {
                return new NjSuper(value)
            }
        } 

    }

    typeof(value) {
        if (typeof value === 'function') {
            return 'function'
        } else if (typeof value === 'string') {
            return 'string'
        } else if (Array.isArray(value)) {
            return 'array'
        } else if (typeof value === 'object') {
            return 'object'
        } else if (typeof value === 'number') {
            return 'number'
        } if (typeof value === 'boolean') {
            return 'boolean'
        } else if (typeof value === 'undefined') {
            return 'undefined'
        }
    }

    count(obj) {
        if (this.typeof(obj) === 'object') {
            let length = 0
            for (const i in obj) {
                length = length + 1
            }
            return length
        } else if (this.typeof(obj) === 'array') {
            return obj.length
        }
    }

    assign(name, value) {
        if (name === 'this') {
            if (this.typeof(value) === 'object') {
            
                Object.assign(this, value)
                
            } else if (this.typeof(value) === 'string') {
                let number = 0
                for (const i in this) {
                    if (this.typeof(Number(i)) === 'number') {
                        if(number <= Number(i)) {
                            if(!this.has(Number(i) + 1)) {
                                number = Number(i) + 1
                            }
                        }
                    }
                }
                Object.assign(this, {[number]: value})
    
            } else if (this.typeof(value) === 'array') {
                if (this.has('array')) {
                    this.array.push(value)
                } else {
                    this.array = value
                }
            } else if (this.typeof(value) === 'function') {
                const func = value
                Object.assign(this, {func})
            }
        } else {
            if (this.typeof(value) === 'object') {
            
                Object.assign(this[name], value)
                
            } else if (this.typeof(value) === 'string') {
                let number = 0
                for (const i in this[name]) {
                    if (this.typeof(Number(i)) === 'number') {
                        if(number <= Number(i)) {
                            if(!this[name].hasOwnProperty(Number(i) + 1)) {
                                number = Number(i) + 1
                            }
                        }
                    }
                }
                Object.assign(this[name], {[number]: value})
    
            } else if (this.typeof(value) === 'array') {
                if (this[name].hasOwnProperty('array')) {
                    this[name].array.push(value)
                } else {
                    this[name].push(...value)
                }
            } else if (this.typeof(value) === 'function') {
                const func = value
                Object.assign(this[name], {func})
            }
        }
        
    }

    add(value, name, objx) {
        if (!name) {
            this.check(value)
            this.assign('this', value)
        } else {

            this.check(name)
            if (this.has(name)) {
                this.assign(name, value)

                
            } else if (objx) {
                console.log('wwwww')
               this.define(name, value, objx)
            } else {
                console.log('wwwww')
                this.define(name, value, false)
            }
        }
    }

    check(value) {
        try {
            if (value === undefined) {
                throw Error
            }
        } catch (error) {
            console.log('Undefined')
            console.log(error)
        }

    }

    has(name) {
        return this.hasOwnProperty(name)
    }
    
}










class NjConn extends NjSuper {
    constructor(dt, objx) {
        
    }
}

class NjChain extends NjConn {
    constructor(dt, objx) {

    }
}