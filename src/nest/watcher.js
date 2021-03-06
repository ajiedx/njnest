const { NjSuper } = require('njsuper')

class NjWatcher extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
    }

    loop() {
        setTimeout(() => {
            this.dt.start()
            this.start()
        }, 500)
    }
    
    start() {
        this.loop()
    }
}

module.exports = { NjWatcher }