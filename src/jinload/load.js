class JinLoad extends NjSuper {
    super(dt, objx) {
        this.ext = ''
        this.path = ''
        this.files = {}
    }

    js(name) {
        this.ext = 'js'
        // if (this.path === '') {
        //     this.path = name.split('/').slice(0, -1).join('/')
        //     name = name.split('/').pop().split('.')[0]
        // }
        
        

        this.run(name, this.path, eval,
            this.jinLoadTarget, this.jinLoadEvent, this.ext)

        // this.assign('files', {path: this.path, name}, true)

        this.ext = ''
    }

    run(name, path, func, target, event, ext) {

        const xhr = new XMLHttpRequest()
        
        xhr.open('GET', '/jinload', true)
        xhr.setRequestHeader('jinload', name)

        xhr.onload = function () {

            eval(xhr.response)

            // if (target) {
            //     target.dispathEvent(event)
            // }

            xhr.abort()
        }
        
        xhr.send()

    }

    startReload() {
        window
        if (window.Worker) {
            const worker = new Worker('/jinupdate.js')

            worker.postMessage('http://localhost:8000')
            worker.onmessage = function(event) {

                if (window.jinload) {
                    window.jinload.js(event.data.split('/')[0])
                }
            }
        }
    }

}

const jinLoadEvent = new CustomEvent('onjinload', {
    bubbles: true,
    detail: {switch: function(state) {
        window.jinLoadState = state
    }}
})

jinLoadTarget = new EventTarget()

window.jinload = new JinLoad(eval, {jinLoadEvent, jinLoadTarget})

jinLoadTarget.addEventListener('onjinload', function(jinEvent) {
    if (window.newJinLoadState) {
        let newState = window.newJinLoadState
        jinEvent.detail.switch(newState)
        window.newJinLoadState = undefined
    }

    if (window.jinLoadState === 'ready') {
        if (jinload.reload == true) {
            window.newJinLoadState = 'reload'
            
        }
    }
})

document.onreadystatechange = function () {
    if(document.readyState === 'complete') {
        window.newJinLoadState = 'ready'

        jinupdate = true

        jinload.startReload()
    }
}
