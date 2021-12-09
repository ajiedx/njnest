
class JinParser extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

        this.regex = {
            tags: /[\s\S\/]+?\<|\>\b/gm,
            nextInBracket: /><$/
        }
    }

    matchBool(string, reg) {
        const sm = this.match(string, reg)
        if (sm) return true
        else return false
    }

    match(string, reg) {
        return string.match(this.regex[reg])
    }

    matchAll(string, reg) {
        return string.matchAll(this.regex[reg])
    }
}

class JinDom extends JinParser {
    constructor(dt, objx) {
        super(dt, objx)

    }

    createElements(text) {

        let regexTags = ['']
        regexTags = regexTags.concat(this.match(text, 'tags'))
        let constructTags = []
        let index = 0
        
        for (let i = 1; i < regexTags.length; i++) {
            
            // console.log(regexTags[i - 1])
            if (this.compareBegining('/', regexTags[i])) {
                constructTags[index] = regexTags[i - 1] + regexTags[i]
                // console.log(constructTags[index])
                index = index + 1
            } 
            
            // else if (this.compareBegining('<', regexTags[i]) && !) {
            //     constructTags[index] = regexTags[i]
            //     // console.log(constructTags[index])
            //     index = index + 1
                
            // } 
            
            else if (this.matchBool(regexTags[i], 'nextInBracket') && this.matchBool(regexTags[i - 1], 'nextInBracket')) {
                constructTags[index] = regexTags[i ]
                index = index + 1
            }
            
            
            
        }

        console.log(constructTags)
        

    }
}


class JinLoad extends JinDom {
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
            if (evt.target.hasAttribute('href')) href = evt.target.getAttribute('href')
            const addExeHistory = (path, parent) => {
                if (window.history.state.history) window.history.state.history.push(path)
                execute = true
                Object.assign(window.history.state, {prev: path, parent: parent})
                window.history.pushState(window.history.state, '', path)
            }

            if (window.history.state == null || window.history.state.prev == undefined) {
                execute = true
                window.history.pushState({prev: href, history: [href]}, '', href)
            } else if (window.history.state.prev) {
                if (href.includes('.')) {
                    let url = location.pathname.split('/')
                    let last = url[url.length - 1] 
                    if ('./' + last !== href) {
                        let path
                        if (window.history.state.parent) {
                            if (window.history.state.parent === url[url.length - 2]) {
                                path = url.slice(0, url.length - 1).join('/') + href.slice(1, href.length)
                                parentUrl = url[url.length - 2]
                                addExeHistory(path, parentUrl)
                            } else {
                                parentUrl = url[url.length - 1]
                                path = location.pathname + href.slice(1, href.length)
                                addExeHistory(path, parentUrl)
                            }
                        } else {
                            parentUrl = url[url.length - 1]
                            path = location.pathname + href.slice(1, href.length)
                            addExeHistory(path, parentUrl)
                        }
                    } 
                } else {
                    addExeHistory(href, parentUrl)
                }
            }

            if (evt.target.hasAttribute('jinload') && execute) {
                const jinloadvalue = evt.target.getAttribute('jinload')
                const history = {href: href.split('/')[1], parent: parentUrl}
                const header = {
                    'EventListener': 'body',
                    'Event': 'click',
                    'JinLoad': jinloadvalue,
                    'HistoryParent': parentUrl 
                }
                jinload.views(jinloadvalue, 'click', header, history)
            }

        })
    }

    load(name, func, ext, state) {
        if (state) window.newJinLoadState = state
        let perspective = 'GET'
        if (state === 'update') perspective = 'PUT'
        
        let path
        if (name.includes(ext)) path = '/jinload/' + name 
        else path = '/jinload/' + name + '.' + ext

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
                        if (ext === 'js') console.log('*****************        '+name+'.js        *****************')
                        else if (ext === 'css') console.log('##################        '+name+'.css        ##################')
                    }
                    func(text)
                    if (state) jinLoadTarget.dispatchEvent(jinLoadEvent)
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
            const runCss = (text) => { if (text) jincss.load(name, text) }
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
        if (state) window.newJinLoadState = state
        fetch(path, headers).then(response => {
            response.text().then((text) => {
                func(text)
                if (state) jinLoadTarget.dispatchEvent(jinLoadEvent)
            })
        }).catch((error) => {
            console.error('JinLoad Fetch Error from "'+ name +'" '+ errsp + ':', error)
        })
    }



    views(name, state, header, history) {
        let path = location.pathname; let perspective
        if (history.parent !== 'no-parent') path = path.split('/').filter(path => history.parent !== path).join('/')
        const resolveView = (text) => { if (state) if (state === 'click') this.createElements(text) }
        
        if (state) if (state === 'click') perspective = 'GET'
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

