
const { NjSuper } = require('njsuper')
const { NjViews } = require('../nest/views')
const { NjUrlController } = require('./controller')

class NjUrlResponse extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)

        if (this.controller) {
            if (this.typeof(this.controller) == 'string') {
                if(this.controller == 'default') {
                    if (this.sql) {
                        if (this.sqlName === 'mysql') {
                            const { NjMysqlController } = require('../sql/mysqlcontroller')
                            this.controller = new NjMysqlController('NjMysqlController', this)
                        }
                    } else {
                        this.controller = new NjUrlController('NjUrlController', this)
                    }

                }
            } else if (this.typeof(this.controller) == 'function') {

            } else if (this.controller instanceof NjUrlController) {
                this.controller = new NjUrlController('NjUrlController', this)
            } else if (this.instanceAll(NjUrlController, this.controller)) {
                this.controller = new this.controller(this.controller.constructor.name, this)
            } else if (this.controller instanceof Object) {
                this.controller = new this.controller(this)
            }
        } else {
            if (this.sql) {
                if (this.sqlName === 'mysql') {
                    const { NjMysqlController } = require('../sql/mysqlcontroller')
                    this.controller = new NjMysqlController('NjMysqlController', this)
                }
            } else {
                this.controller = new NjUrlController('NjUrlController', this)
            }
        }
    }

    setId(id) {
        this.controller.setId(id)
    }

    setUrlTail(point, array) {
        this.urlTail = []
        let l = 0
        for (let i = point + 1; i < array.length  ; i++) {
            this.urlTail[l] = array[i]
            l++
        }
        this.controller.urlTail = this.urlTail
    }

    activateView(view) {
        if (this.controller) {
            if (this.controller.views[view]) {
                return this.controller.views[view]
            } else {
                for (const i in this.controller.views) {
                    if (this.controller.views[i] instanceof NjViews) {
                        if (this.controller.views[i][view]) {
                            return this.controller.views[i][view]
                        }
                    }
                }
            }
        }

        return false

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
