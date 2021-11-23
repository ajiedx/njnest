const { NjSuper } = require('njsuper')

class NjWatcher extends NjSuper {
    constructor(dt, objx, t) {
        super(dt, objx, t)
    }

    loop() {
        setTimeout(() => {
            // for (const i in this.entity) {
                
            // }
            this.dt.start()
            this.start()
        }, 3000)
    }
    
    start() {
        this.loop()
    }
}

module.exports = { NjWatcher }