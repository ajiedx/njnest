class JinLoad extends NjSuper {
    super(dt, objx) {
        this.ext = ''
        this.path = ''
        this.files = {}
        this.styles = {}
    }

    init() {
        this.htmlAttributes()
        document.body.addEventListener('click', function (evt) {
            evt.preventDefault();
            let href
            let execute = false
            let parentUrl = 'no-parent'
            if (evt.target.hasAttribute('href')) {
                href = evt.target.getAttribute('href')
            }
            
            if (window.history.state == null || window.history.state.prev == undefined) {
                execute = true
                window.history.pushState({prev: href, history: [href]}, '', href)
            } else if (window.history.state.prev ) {

                // console.log(window.history.state)
                if (href.includes('.')) {
                    let url = location.pathname.split('/')
                    console.log(url)
                    let last = url[url.length - 1] 

                    if ('./' + last !== href) {
                        let path
                        if (window.history.state.parent) {
                            if (window.history.state.parent === url[url.length - 2]) {
                                execute = true
                                path = url.slice(0, url.length - 1).join('/') + href.slice(1, href.length)
                                parentUrl = url[url.length - 2]
                                console.log(path)
                                if (window.history.state.history) {
                                    window.history.state.history.push(path)
                                }
                                Object.assign(window.history.state, {prev: path, parent: parentUrl})
                                window.history.pushState(window.history.state, '', path)
                            }
                        } else {
                            parentUrl = url[url.length - 1]
                            execute = true
                            path = location.pathname + href.slice(1, href.length)
                            if (window.history.state.history) {
                                window.history.state.history.push(path)
                            }
                            Object.assign(window.history.state, {prev: path, parent: parentUrl})
                            window.history.pushState(window.history.state, '', path)
                        }
                        

                    } 
                    
                } else {
                    execute = true
                    if (window.history.state.history) {
                        window.history.state.history.push(href)
                    }

                    Object.assign(window.history.state, {prev: href, somethign: 'as'})

                    window.history.pushState(window.history.state, '', href)
                }
            }

            console.log(window.history.state)

            if (evt.target.hasAttribute('jinload') && execute) {
                const jinloadvalue = evt.target.getAttribute('jinload')
                const header = {
                    'EventListener': 'body',
                    'Event': 'click',
                    'JinLoad': jinloadvalue,
                    'HistoryParent': parentUrl 
                }
                jinload.views(jinloadvalue, 'click', header)
            }

        })
    }

    load(name, func, ext, state) {

        if (state) {
            window.newJinLoadState = state
        }

        let perspective = 'GET'

        if (state === 'update') {
            perspective = 'PUT'
        }
        
        let path
        if (name.includes(ext)) {
            path = '/jinload/' + name 

        } else {
            path = '/jinload/' + name + '.' + ext
        }

        fetch(path, {
            method: perspective, 
            headers: {
            // 'Content-Type': 'text/javascript',
            },
            // body: JSON.stringify(data),
        })
        .then(response => {
            response.text().then(function(text) {
                if (state) {
                    if (state == 'update') {
                        if (ext === 'js') {
                            console.log('*****************        '+name+'.js        *****************')
                        } else if (ext === 'css') {
                            console.log('##################        '+name+'.css        ##################')
                        }
                    }
                    func(text)
                    if (state) {
                        jinLoadTarget.dispatchEvent(jinLoadEvent)
                    } 
                } else {
                    func(text)
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

    js(name, state) {

        // if (this.path === '') {
        //     this.path = name.split('/').slice(0, -1).join('/')
        //     name = name.split('/').pop().split('.')[0]
        // }

        this.load(name, eval, 'js', state)

    }

    css(name, state) {
        if (jincss) {
            const runCss = (text) => {
                console.log(name, text)
                if (text) {
                    jincss.load(name, text)
                }
                
            }
            this.load(name, runCss, 'css', state)
        } 
    }


    htmlAttributes() {
        console.log()
        const html = document.querySelector('html')
        html.setAttribute('jinload', 'html')

        const body = document.querySelector('body')
        body.setAttribute('jinload', 'body')

    }

    rqs(name, path, func, headers, errsp, state) {
        if (state) {
            window.newJinLoadState = state
        }
        fetch(path, headers).then(response => {
            response.text().then((text) => {
                func(text)
                if (state) {
                    jinLoadTarget.dispatchEvent(jinLoadEvent)
                } 
            })
        }).catch((error) => {
            console.error('JinLoad Fetch Error from "'+ name +'" '+ errsp + ':', error)
        })
    }

    views(name, state, header) {
        const path = location.pathname
        let perspective
        const resolveView = (text) => {
            if (state) {
                if (state === 'click') {
                    console.log(text)
                }
            }
        }
        
        if (state) {
            if (state === 'click') {
                perspective = 'GET'
            }
        }
        const headers = {
            'Content-Type': '*/*',
        }

        Object.assign(header, headers)
        this.rqs(name, path, resolveView, {
            method: perspective, 
            headers: header,
        }, 'views from event ' + state, state)
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

    dispatchEvent(name) {
        window.newJinLoadState = name
        if (jinLoadTarget) {
            jinLoadTarget.dispatchEvent(jinLoadEvent)
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

window.jinload = new JinLoad()

jinLoadTarget.addEventListener('onjinload', function(jinEvent) {
    if (window.newJinLoadState) {
        let newState = window.newJinLoadState
        jinEvent.detail.switch(newState)
        window.newJinLoadState = undefined
    }

    if (window.jinLoadState === 'ready') {
        jinload.init()

        // jinload.dispatchEvent('htmlAttributes')

    }

    if (window.jinLoadState === 'reload') {
        jinload.startReload()
    }


})

