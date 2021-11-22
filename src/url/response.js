const { NjSuper } = require('njsuper')

const { NjController } = require('./controller')

class NjUrlResponse extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)

        if (this.controller) {
            if (this.typeof(this.controller) == 'string') {
                
                if(this.controller == 'default') {
                    
                    this.controller = new NjController('this.name', this)
                    // console.log('aaaaaaaaa', this.controller)
                }
            } else if (this.typeof(this.controller) == 'function') {
                
            } else if (this.controller instanceof NjController) {
                this.controller = new NjController('this.name', this)
            } else if (this.controller instanceof Object) {
                this.controller = new this.controller(this)
            }
        }
        
    }

    rsp(req, res) {
        if (this.controller) {
            if (this.typeof(this.controller) == 'function') {
                return this.controller(this.response, req, res)
            } else {
                return this.controller.crsp(this.response, req, res)
            }
            
        } else {
            return this.response({html: this.html}, req, res)
        }
    }
    
    update() {
        this.urls.setUrl(this.path, this)
    }
}

module.exports = { NjUrlResponse }