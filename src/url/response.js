
const { NjSuper } = require('njsuper')

const { NjController } = require('./controller')

class NjUrlResponse extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)

        if (this.controller) {
            if (this.typeof(this.controller) == 'string') {
                
                if(this.controller == 'default') {
                    if (this.sql) {
                        console.log(this.sqlName)
                        if (this.sqlName === 'mysql') {
                            const { NjMysqlController } = require('../sql/mysqlcontroller')
                            this.controller = new NjMysqlController('NjMysqlController', this)
                        }
                           

                    } else {
                        this.controller = new NjController('NjController', this)
                    }
                    
                    // console.log('aaaaaaaaa', this.controller)
                }
            } else if (this.typeof(this.controller) == 'function') {
                
            } else if (this.controller instanceof NjController) {
                this.controller = new NjController('NjController', this)
            } else if (this.instanceAll(NjController, this.controller)) {
                this.controller = new this.controller(this.controller.constructor.name, this)
            } else if (this.controller instanceof Object) {
                this.controller = new this.controller(this)
            }
        }
    }

    setId(id) {
        this.controller.setId(id)
    }

    rsp(req) {

        if (this.controller) {
            if (this.typeof(this.controller) == 'function') {
                return this.controller(this.response, req)
            } else {
                return this.controller.crsp(this.response, req)
            }
            
        } else {
            return this.response({html: this.html}, req)
        }
    }
    
    update() {
        this.urls.setUrl(this.path, this)
    }
}

module.exports = { NjUrlResponse }