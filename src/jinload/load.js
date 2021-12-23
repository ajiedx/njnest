
class JinParser extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        this.regex = {
            html: /[\s\S\/]+?\<|\>\b/gm
        }
    }

    html(htm) {
        let index = 1
        let closed = true, exist = false, sl = 0, closedTags = ['ss', ], tag = '', id = 0, parsedTags = {}
        for (let i = 0; i < htm.length; i++) {
            htm[i] = this.filterChars(htm[i], '\n\r')
            // console.log(htm[i])
            if (this.isIntro('/', htm[i])) {
                if (this.isIntro('/', htm[i-1])) {
                    if (!this.isEnd('><', htm[i])) {
                        console.log(htm[i], 'pp'); closed = true;
                        closedTags = closedTags.slice(0, closedTags.length - 1); index = index - 1
                    } else {
                        closed = true;
                        console.log(closedTags[index - 1], 'ppp')
                        closedTags = closedTags.slice(0, closedTags.length - 1); index = index - 1
                    }
                } else if (this.isEnd('<', htm[i-1]) && !this.isIntro('/', htm[i])) {
                        if (closedTags[index - 1] !== undefined) {
                            closed = true; htm[i] = closedTags[index - 1]
                            closedTags = closedTags.slice(0, closedTags.length - 1); index = index - 1
                            console.log(htm[i], 'aa')
                        }
                } else if (!this.isIntro('/', htm[i-1]) && this.isEnd(this.filterChars(closedTags[index-1], '/'), htm[i])) {
                    if (closedTags[index - 1] !== undefined) {
                        closed = true; htm[i] = closedTags[index - 1]
                        closedTags = closedTags.slice(0, closedTags.length - 1); index = index - 1
                        console.log(htm[i], 'll')
                    }
                } else if (!this.isEnd('><', htm[i])) {
                    console.log(htm[i], 'span')
                } else {
                    if (index > 1 && closedTags) {
                        for (const funotc in closedTags) {
                            if (this.isEnd(this.filterChars(closedTags[funotc], '/'), htm[i])) exist = funotc
                        }
                        if (exist) {
                            console.log(closedTags[exist], 'cc'); closedTags = closedTags.slice(0, exist); index = Number(exist); exist = false;
                        }
                    }
                }
            } else if (this.isEnd('><', htm[i]) && this.isEnd('><', htm[i-1])) {
                closed = false; closedTags[index] = htm[i]
                console.log(htm[i], '----')
                index = index + 1;
            } else if (this.isEnd('><', htm[i])) {
                if (!this.isIntro('/', htm[i-1])) {
                    closed = false; closedTags[index] = htm[i]
                    console.log(htm[i], ',,,,,')
                    index = index + 1;
                } else if (this.isEnd('<', htm[i-2])) {
                    console.log(htm[i], 'ddd')
                }

            } else if (this.isEnd('<', htm[i])) {
                console.log(htm[i], 'ss')
            } else if (this.isEnd('<', htm[i]) && this.isIntro('/', htm[i-1])) {
                closed = false; closedTags[index] = htm[i]
                console.log(htm[i], htm[i-1], 'xx')
                index = index + 1;
            }
        }

        console.log(closedTags[index - 1])
    }

    x1(file) {
        let splchars = '\n *', sym = '*', pjms = [], line = [''], id = 0, pjm = [], x1id = -1, split = false, splitchar = ''
        let launch = false, lid = 0, low = [], x1 = {}, x1in = {}, x1j = {}, x1jid = 0, star = false, x1x = {}, x1n = {}
        let last = '', sptag = '', ids = [], idr = [], idids = 0, x1b = {}
        for (let i in file) {
            if (file[i] !== ' ') {
                if (file[i] === '*') {
                    // console.log(line[lid])
                    pjms[id] = line[lid] + file[i],  lid = lid + 1
                    line[lid] = file[i]
                    id = id + 1
                } else if (file[i - 1] === ' ') {
                    if (launch) {
                        pjms[id] = line[lid], lid = lid + 1, line[lid] = 'opt'
                        if (pjms[id] === '\n') {
                            // pjms[id-1] = pjms[id-1]
                            id = id -1
                            lid = lid + 1
                            line[lid] = 's '
                        }
                        id = id + 1
                        launch = false
                    }
                    if (line[lid] === 'opt') {
                        line[lid] = pjms[id - 1] + ' } '
                        id = id - 1
                        line[lid] = line[lid] + file[i]
                    } else if (file[i]!=='\n' ) {
                        if (line[lid] === '\n' || line[lid] === '*') {
                            lid = lid + 1
                            line[lid] = line[lid] ? line[lid] + file[i] : file[i]
                        } else  {
                            line[lid] = line[lid] ? line[lid]+  " " + file[i] : file[i]
                        }

                    } else {
                        pjms[id] = line[lid],  lid = lid + 1, line[lid] = file[i]
                        id = id + 1
                    }
                } else if (file[i] === '\n') {
                    if (line[lid - 1] === '*' || line[lid - 1] === '\n') {
                        low = this.filterChars(line[lid], '\n').split(' ')

                        for (const l in low) {
                            pjms[id] = ' l ' + low[l]
                            let pj = id - 1

                            for (;;) {
                                if (pj < 0) break

                                if (pjms[pj].includes(low[l]+' ') && !this.isIntro('#', pjms[pj]) && !this.isIntro('$', pjms[pj])) {
                                    last = pjms[pj]
                                    sptag = this.splitOnce(pjms[pj], low[l]+' ', 'right', 'last')

                                    if (this.isIntro('#', pjms[id - 1]) && !this.isIntro('$', pjms[pj])) {
                                        if (sptag[0]=== '' || this.isIntro('s', sptag[0])) {
                                            x1[id] = {}
                                            for (let idj in x1) {
                                                if (idj > pj && idj < id) {
                                                    // console.log(x1[idj], '[][][]['+idj+id+pj+'][]][][]')
                                                    this.pin(x1[id], x1[idj])
                                                    delete x1[idj]
                                                }
                                            }
                                            for (let idj in x1j) {
                                                if (idj > pj && idj < id) {
                                                    this.pin(x1[id], x1j[idj])
                                                    delete x1j[idj]
                                                } else {
                                                    this.pin(x1, x1j[idj], idj)
                                                }
                                            }

                                            x1[id].in = sptag[1]
                                            idids = idids + 1

                                        } else if (x1j.hasOwnProperty(0)) {

                                            x1[id] = {}
                                            for (let idj in x1j) {
                                                if (idj > pj && idj < id) {
                                                    this.pin(x1[id], x1j[idj])
                                                    delete x1j[idj]
                                                } else {
                                                    this.pin(x1, x1j[idj], idj)
                                                }
                                            }
                                            for (let idj in x1) {
                                                if (idj > pj && idj < id) {
                                                    this.pin(x1[id], x1[idj])
                                                    delete x1[idj]
                                                }
                                            }
                                            // this.output(x1, '  -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=', 3)
                                            x1[id].in = sptag[1]

                                            idids = idids + 1
                                        } else {
                                            // this.output(x1, 'asssssssdasd')
                                            this.output(x1j, 'asssssssdasd')
                                            console.log(sptag[1], pj, id, low[l])
                                            x1[id] = {}
                                            for (let idn in x1in) {
                                                if (idn > pj && idn < id) {
                                                    this.pin(x1[id], x1in[idn])
                                                    delete x1in[idn]
                                                } else {
                                                    this.pin(x1, x1in[idn], idn)
                                                    delete x1in[idn]
                                                }
                                            }

                                            for (let idj in x1j) {
                                                if (idj > pj && idj < id) {
                                                    this.pin(x1[id], x1j[idj])
                                                    delete x1j[idj]
                                                } else {
                                                    this.pin(x1, x1j[idj], idj)
                                                }
                                            }
                                            for (let idj in x1) {
                                                if (idj > pj && idj < id) {
                                                    this.pin(x1[id], x1[idj])
                                                    delete x1[idj]
                                                }
                                            }

                                            x1[id].in = sptag[1]
                                        }

                                        x1id = 0
                                    } else {
                                        x1j[id] = {}
                                        for (let idn in x1in) {
                                            if (idn > pj && idn < id) {
                                                this.pin(x1j[id], x1in[idn])
                                                delete x1in[idn]
                                            } else {
                                                this.pin(x1, x1in[idn], idn)
                                                delete x1in[idn]
                                            }
                                        }
                                        x1j[id].in = sptag[1]

                                        x1id = x1id + 1
                                    }



                                    pjms[pj] = sptag[0]
                                    this.output(x1)

                                    pjms[id] = '#' + x1id + ' ' + sptag[1] + pjms[id]
                                    break;
                                } else if (!this.isIntro('#', pjms[pj]) && pjms[pj] !== '') {
                                    pjms[id] = pjms[pj] + pjms[id]
                                    this.pin(x1in, pjms[pj], pj)
                                    console.log(pj, id)
                                    // this.output(pjms[id], '___________')
                                    pjms[pj] = ''
                                    // pjms[pj] = '#' + pjms[pj]

                                }
                                pj = pj - 1
                            }
                            id = id + 1
                        }
                        line[lid] = file[i]

                    } else {
                        pjms[id] = line[lid] + file[i], lid = lid + 1, line[lid] = file[i]
                        id = id + 1
                    }

                } else if (file[i - 1] === '=') {
                    launch = true; line[lid] = line[lid] + file[i]
                }  else {
                    line[lid] = line[lid] ? line[lid] + file[i] : file[i]
                }
            }
        }

        this.output(pjms)
        this.output(line)
        this.output(x1)
        // console.log(pjms, line, x1)
        // let wrapper = false, slpjms = []
        // id = 0
        // pjms[0][0] = '*' + pjms[0][0]
        // for (let i in pjms) {
        //     if (this.isIntro('*',pjms[i][0]) || this.isIntro('\n',pjms[i][0])) {
        //         for (let l in pjms[i]) {
        //             if (pjms[i][l] === '}' || pjms[i][l] === 's' || this.isEnd('\\*', pjms[i][l])) {
        //                 pjms[i].push('}')
        //                 wrapper = false
        //                 break
        //             } else wrapper = true
        //
        //         }
        //
        //         if (wrapper) {
        //             console.log(pjms[i])
        //             console.log(id)
        //             slpjms[id] = []
        //
        //             let as = false
        //
        //             for (let l in pjms[i]) {
        //                 let ls = []
        //                 for (let s in pjms) {
        //                     if (Number(i) > Number(s)) {
        //                         for (let c in pjms[s]) {
        //                             if (this.filterChars(pjms[i][l], '\n*') === this.filterChars(pjms[s][c], '\n*')) {
        //                                 as = true
        //                                 slpjms[id] = [pjms[s][c]]
        //                                 ls[0] = s
        //                                 ls[1] = c
        //                             } else if (as) {
        //                                 slpjms[id]= slpjms[id] + ' ' +  [pjms[s][c]]
        //                             }
        //                         }
        //                     }
        //                 }
        //
        //                 id = id + 1
        //                 console.log(ls, pjms[ls[0]])
        //             }
        //         }
        //     }
        // }

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

class JinCache extends JinParser {
    constructor(dt, objx) {
        super(dt, objx)
    }

    cache() {

    }
}

class JinApi extends JinParser {
    constructor(dt, objx) {
        super(dt, objx)

    }

    createElements(wrap, elements) {
        if (elements) {
            // console.log(wrap)
            let wrapper = false, element
            for (const i in elements) {
                elements[i][1] = this.splitLeft(elements[i][1], ' :=')
                console.log(elements[i][1])
                if (wrapper) {
                    element = document.createElement(elements[i][0])
                    for (const l in elements[i][1]) {

                        if(this.isIntro('=', elements[i][1][l])) {
                            // console.log(elements[i][1][l - 1], this.filterChars(elements[i][1][l], '='), '---')
                            element.setAttribute(elements[i][1][l - 1], this.filterChars(elements[i][1][l], '='))
                        } else if(this.isIntro(':', elements[i][1][l])) {
                            // console.log(this.filterChars(elements[i][1][l], ':'), '___')
                            element.innerText = this.filterChars(elements[i][1][l], ':')
                        }
                        // console.log(element)
                    }

                    wrap.append(element)
                }
                if (elements[i][0] === wrap[0]) {
                    console.log(elements[i])
                    wrap = document.createElement(wrap[0]); wrapper = true;
                    if (elements[i][1].length > 1) {
                        console.log(elements[i][1].length )
                        for (const l in elements[i][1]) {
                            if(this.isIntro('=', elements[i][1][l])) {
                                console.log(elements[i][1][l - 1], this.filterChars(elements[i][1][l], '='), '---')
                                wrap.setAttribute(elements[i][1][l - 1], this.filterChars(elements[i][1][l], '='))
                            }
                            // console.log(element)
                        }
                    }
                }


            }

            console.dir( wrap)

        }

    }

    parse(rgxTags, syntax) {
        if (syntax === 'html') this.html(rgxTags)
        else this.pjm(rgxTags)
    }

    webView(text) {
        let syntax
        if (this.isIntro('<', text[0])) syntax = 'html'
        else syntax = 'pjm'
        if (syntax === 'pjm') {
            this.x1(text)
        } else {
            let regexTags = ['']
            regexTags = regexTags.concat(this.match(text, syntax))
            this.parse(regexTags, syntax)
        }
    }
}


class JinLoad extends JinApi {
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
        const resolveView = (text) => { if (state) if (state === 'click') this.webView(text) }

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
                    // location.reload()
                    location.href = '/'

                    // setTimeout(() => {
                    //     location.assign('/comestas/hello')
                    // }, 300)

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
        let comestas = document.querySelector('#comestas')
        let help = document.querySelector('.hello')
        comestas.click()
        help.click()

        // jinload.dispatchEvent('htmlAttributes')

    }

    if (window.jinLoadState === 'reload') {
        jinload.startReload()
    }


})
