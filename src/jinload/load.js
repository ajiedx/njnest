class JinLoad extends NjSuper {
    super(dt, objx) {
        this.ext = ''
        this.path = ''
        this.files = {}
    }

    js(name, state) {

        // if (this.path === '') {
        //     this.path = name.split('/').slice(0, -1).join('/')
        //     name = name.split('/').pop().split('.')[0]
        // }

        if (state) {
            window.newJinLoadState = state
        }

        if (window.xhr) {
            window.xhr.open('GET', '/jinload', true)
            window.xhr.setRequestHeader('jinload', name)
            window.xhr.setRequestHeader('extension', 'js')

            window.xhr.onload = function () {

                if (state) {
                    if (state == 'update') {
                        console.log('*****************        '+name+'.js        *****************')
                    }
                    eval(xhr.response)
                    if (window.jinLoadTarget) {
                        window.jinLoadTarget(window.jinLoadEvent)
                    }
                } else {
                    eval(xhr.response)
                }

                window.xhr.abort()
            }
            
            window.xhr.send()
        }

    }

    css(name, state) {
        if (state) {
            window.newJinLoadState = state
        }

        if (window.xhr) {
            window.xhr.open('GET', '/jinload', true)
            window.xhr.setRequestHeader('jinload', name)
            window.xhr.setRequestHeader('extension', 'css')

            window.xhr.onload = function () {
    
                
                if (state) {
                    if (state == 'update') {
                        if (window.jincss) {
                            window.jincss.load(xhr.reponse)
                        }
                    }
                    
                    if (window.jinLoadTarget) {
                        window.jinLoadTarget(window.jinLoadEvent)
                    }
                }

                if (window.jincss) {
                    window.jincss.load(xhr.reponse)
                } else {
                    console.log('error css')
                }

    
                window.xhr.abort()
            }
            
            window.xhr.send()
        }
    }
    startReload() {
        window
        if (window.Worker) {
            const worker = new Worker('/jinupdate.js')

            worker.postMessage('http://localhost:8000')
            worker.onmessage = function(event) {

                if (window.jinload) {
                    window.jinload.js(event.data.split('/')[0], 'update')
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

const jinLoadTarget = new EventTarget()
window.xhr = new XMLHttpRequest()
window.jinload = new JinLoad()

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
