

class JinLoad extends NjSuper {
    super(dt, objx) {
        this.ext = ''
        this.path = ''
        this.files = {}
        this.styles = {}
    }



    js(name, state) {

        // if (this.path === '') {
        //     this.path = name.split('/').slice(0, -1).join('/')
        //     name = name.split('/').pop().split('.')[0]
        // }

        if (state) {
            window.newJinLoadState = state
        }

        let perspective = 'GET'

        if (state === 'update') {
            perspective = 'PUT'
        }
        
        let path
        if (name.includes('.js')) {
            path = '/jinload/' + name 

        } else {
            path = '/jinload/' + name + '.js'
        }
        
        fetch(path, {
            method: perspective, 
            headers: {
            // 'Content-Type': 'text/javascript',
            },
            // body: JSON.stringify(data),
        })
        .then(response => {
            console.log()
            // response.blob()
            response.text().then(function(text) {

                if (state) {
                    if (state == 'update') {
                        console.log('*****************        '+name+'.js        *****************')
                    }
                    eval(text)
                    if (window.jinLoadTarget) {
                        window.jinLoadTarget(window.jinLoadEvent)
                    }
                } else {
                    eval(text)
                }
            })
        })
        // .then(data => {
        //     console.log('Success:', data)
        // })
        .catch((error) => {
            console.error('Error:', error)
        })
    }

    css(name, state) {
        if (state) {
            window.newJinLoadState = state
        }

        let perspective = 'GET'

        if (state === 'update') {
            perspective = 'PUT'
        }
    
        fetch('/jinload/' + name + '.css', {
            method: perspective, // or 'PUT'
            headers: {
            // 'Content-Type': 'text/javascript',
            },
            // body: JSON.stringify(data),
        })
        .then(response => {
            console.log()
            // response.blob()
            response.text().then(function(text) {

                if (state) {
                    if (state == 'update') {
                        console.log('*****************        '+name+'.css       *****************')
                    }

                    if (window.jincss) {
                        window.jincss.load(name, text)
                    } 
                    if (window.jinLoadTarget) {
                        window.jinLoadTarget(window.jinLoadEvent)
                    }
                } else {
                    if (window.jincss) {
                        window.jincss.load(name, text)
                    } 

                }
            })
        })

        
    }

    startReload() {
        window
        if (window.Worker) {
            const worker = new Worker('/jinupdate.js')

            worker.postMessage('http://localhost:8000')
            worker.onmessage = function(event) {
                // console.log(event.data, '')
                if (event.data === 'RELOAD') {
                    location.reload()
                } else {
                    if (window.jinload) {
                        this.reloadFileName = event.data.split('/')[0].split('.')[0]
                        this.reloadExt = event.data.split('/')[0].split('.')[1]
                        console.log(this.reloadFileName)
                        if (this.reloadExt === 'js') {
                            window.jinload.js(this.reloadFileName, 'update')
                        } else if (this.reloadExt === 'css') {
                            window.jinload.css(this.reloadFileName, 'update')
                        }
                        
                    }
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
