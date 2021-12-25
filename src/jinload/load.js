
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
        let pjms = [], line = [''], id = 0, sptag = '', continueattr = false, addattrs = ['']
        let launch = false, lid = 0, low = [], x1 = {}, x1in = {}, x1j = {}

        const objElement = (string, value) => {
            let ctag = [], vtag = [], vr = 0, elmnt = {}
            if (addattrs.length > 1) 
                for (const i in addattrs) 
                    if (addattrs[i] !== '')
                        this.pin(elmnt, addattrs[i])
                
                addattrs = ['']
               
            ctag = this.splitCharsFilter(string, ' >*=', ' >*\n')
            let tagf = false
            for (var es = 0; es < ctag.length; es++) {
                if (ctag[es] !== '' && ctag[es] != undefined) {
                    if (!tagf) vtag[0] = ctag[es], vr = vr + 1
                    else if (this.isEnd('=', ctag[es]))  vtag[vr] = [this.filterChars(ctag[es], ' ='), this.filterChars(ctag[es +1], ' \n')], vr = vr + 1, es++
                    else if (value) vtag[vr] = vtag[vr] ? vtag[vr]+' '+ ctag[es] : ctag[es]
                    tagf = true
                }
            }
            if (value) {
                if (vtag.length > 0) {
                    for (var es = 1; es < vtag.length - 1; es++) {
                        this.pin(elmnt , vtag[es])
                    }
                    Object.assign(elmnt, {name: vtag[0], value: vtag[vtag.length - 1]})
                }
            } else {
                for (var es = 1; es < vtag.length ; es++) {
                    this.pin(elmnt, vtag[es])
                }
                Object.assign(elmnt, {name: vtag[0]})
            }


            return elmnt
        }

        const pinx1 = (id, pj) => {
            for (let idj in x1) {
                if (idj > pj && idj < id) {
                    this.pin(x1[id], x1[idj])
                    delete x1[idj]
                }
            }
        }

        const pinx1j = (id, pj) => {
            for (let idj in x1j) {
                if (idj > pj && idj < id) {
                    this.pin(x1[id], x1j[idj])
                    delete x1j[idj]
                } else {
                    this.pin(x1, x1j[idj], idj)
                }
            }
        }

        const pinx1in = (id, pj) => {
            for (let idn in x1in) {
                if (!x1in[idn].name) {
                    delete x1in[idn]
                } else {
                    if (idn > pj && idn < id) {
                        this.pin(x1[id], x1in[idn])
                        delete x1in[idn]
                    } else {
                        this.pin(x1, x1in[idn], idn)
                        delete x1in[idn]
                    }
                }
                
            }
        }


        const pin = (id, pj, up) => {
            if (up) pinx1(id, pj), pinx1j(id, pj)
            else pinx1j(id, pj), pinx1(id, pj)
        }


        for (let i in file) {
            if (file[i] !== ' ') {
                if (file[i] === '*') {
                    // console.log(line[lid])
                    // pjms[id] = '#', id = id + 1
                    pjms[id] = line[lid] + ' ' + file[i],  lid = lid + 1

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
                        if (this.isEnd(',', pjms[id - 1])) {
                            continueattr = true
                            pjms[id - 1] = pjms[id - 1] + file[i]
                            line[lid] = pjms[id - 1] + file[i]
                            id = id - 1
                            line[lid] = line[lid] + file[i]
                        } else {
                            line[lid] = pjms[id - 1] + ' > '
                            id = id - 1
                            line[lid] = line[lid] + file[i]
                        }
                        
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

                } else if (file[i] === '\n' || file[i] === '}') {
                    if (this.isIntro('{', line[lid])) {
                        // addattrs.push([]), i = i + 2
                        line[lid + 1] = 'before='+this.filterChars(line[lid], '{')
                        line[lid] = 's'
                        
                    } else if (file[i] === '}') {
                        let al = line[lid].length - 1, aline = '', attr = false, complete = false, cl = line[lid]
                        line[lid] = '', lid = lid + 1, line[lid] = '*'
                        for (;;) {
                            if (al > 0) {
                                if (!attr)
                                    if (cl[al] === '{') attr = true, al--, lid = lid + 1, line[lid] = ''
                                    else attr = false, aline = cl[al] + aline
                                if (!complete && attr) {
                                    if (cl[al] === '>') {
                                        complete = true, lid = lid - 2, line[lid] = '>'
                                    } else line[lid] = cl[al] + line[lid]
                                } else if (complete) {
                                    line[lid] = cl[al] + line[lid]
                                }
                            } else break
                                
                            al = al - 1
                        }
                        
                        line[lid -2] = line[lid -2].trim() + ' '
                        pjms[id] = line[lid], id = id + 1
                        addattrs.push(['after', aline])
                        lid = lid + 2
                    }

                    
                    if (line[lid - 1] === '*' || line[lid - 1] === '\n') {
                        
                        if (addattrs.length > 1) pjms[id] = '#', id = id + 1
                        low = this.filterChars(line[lid], '\n').split(' ')
                      
                        for (const l in low) {
                            if (low[l] !== '') {
                                pjms[id] = ' l ' + low[l]
                                let pj = id - 1
                                
                                for (;;) {
                                    if (pj > -1) {
                                        if (pjms[pj].includes(low[l]+' ') && !this.isIntro('#', pjms[pj]) ) {
    
                                            sptag = this.splitOnce(pjms[pj], low[l]+' ', 'right', 'last')
                                            if (this.isIntro('#', pjms[id - 1])) {
                                                if (sptag[0].includes('=') && this.countChars(sptag[0], ' ') == 1)
                                                    sptag[1] = this.filterChars(sptag[1], '>') + ' ' + sptag[0] + ' >'
                                                if (sptag[0]=== '' || this.isIntro('s', sptag[0])) {
                                                    
                                                    x1[id] = {}, pin(id, pj, 'up')
                                                    x1[id].in = objElement(sptag[1])
                                                } else if (x1j.hasOwnProperty(0)) {
                                                    
                                                    x1[id] = {}, pin(id, pj)
                                                    x1[id].in = objElement(sptag[1])
                                                } else {
                                                    
                                                    x1[id] = {}, pinx1in(id, pj), pinx1(id, pj, 'up')
                                                    x1[id].in = objElement(sptag[1])
                                                }
        
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
                                                x1j[id].in = objElement(sptag[1])
                                            }
                                            pjms[pj] = sptag[0]
                                            pjms[id] = '# ' + sptag[1] + pjms[id]
                                            break;
                                        } else if (!this.isIntro('#', pjms[pj]) && pjms[pj] !== '' && !this.isIntro('s', pjms[pj])) {
                                            pjms[id] = pjms[pj] + pjms[id]
                                            this.pin(x1in, objElement(pjms[pj], 'value'), pj)
                                            pjms[pj] = ''
                                            // pjms[pj] = '#' + pjms[pj]
                                        }
                                        pj = pj - 1
                                    } else break
                                }
                                id = id + 1
                            }
                            
                        }
                        line[lid] = file[i]

                    } else if (line[lid] === 's') {
                        if (line[lid +1]) line[lid] = file [i]+ line[lid +1]
                    } else {
                        pjms[id] = line[lid] + file[i], lid = lid + 1, line[lid] = file[i]
                        id = id + 1
                    }

                } else if (file[i - 1] === '=') {
                    

                    launch = true; line[lid] = line[lid] + file[i]
                } else if (continueattr) {
                    line[lid] = pjms[id] 
                    line[lid] = line[lid] + file[i]
                    continueattr = false, launch = true
                } else {
                    line[lid] = line[lid] ? line[lid] + file[i] : file[i]
                }
            }
        }

        // this.output(pjms)
        console.log(x1)
        this.createX1Elements(x1)
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
        this.elements = {}
        this.options = {}
        this.id = 0
        this.ids = []
    }

    x1viload(text) {
        this.x1(text)
        for (let i in this.ids) {
            if (this.options[this.ids[i]][0] === 'append') {
                let query = document.querySelector(this.options[this.ids[i]][1])
                query.append(this.elements[this.ids[i]])
            }
        }
    }

    createX1Elements(x1, type) {
        // this.output(x1)
        this.ids = []
        function createX1Child (element, x1in) {
            for (let x in x1in) {
                if (!isNaN(x)) {
                    if (x1in[x].in) {
                        element.append(document.createElement(x1in[x].in.name))
                        for (let a in x1in[x].in) {
                            if (!isNaN(a)) {
                                element.children[x].setAttribute(x1in[x].in[a][0], x1in[x].in[a][1])
                            }
                        }
                        createX1Child(element.children[x], x1in[x])
                    } else {
                        element.append(document.createElement(x1in[x].name))
                        element.children[x].innerText = x1in[x].value
                        for (let a in x1in[x]) {
                            if (!isNaN(a)) {
                                element.children[x].setAttribute(x1in[x][a][0], x1in[x][a][1])
                            }
                        }
                    }

                    // console.log(element)
                }
            }
        }
        for (let x in x1) {
            if (!isNaN(x)) {
                this.elements[this.id] = document.createElement(x1[x].in.name)
                for (let a in x1[x].in) {
                    if (!isNaN(a)) {
                        this.elements[this.id].setAttribute(x1[x].in[a][0], x1[x].in[a][1])
                        this.options[this.id] = x1[x].in[a]

                    }
                }
                createX1Child(this.elements[this.id], x1[x])
                this.ids.push(this.id)
                this.id = this.id + 1
            }
        }
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
            this.x1viload(text)
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
                    'JinLoadName': jinloadvalue,
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
        // const html = document.querySelector('html')
        // html.setAttribute('jinload', 'html')

        // const body = document.querySelector('body')
        // body.setAttribute('jinload', 'body')
        const jinloads = [...document.body.querySelectorAll('[jinload]')]
        
        for (const j in jinloads) {
            let jinload = jinloads[j].getAttribute('jinload')
            if (this.isIntro('load', jinload)) {
                let name = jinload.split('.')[1]
                console.log(jinload)
                this.views(name, 'load', {'JinLoad': jinload})
            }
            console.log(jinload)
        }

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
        if (state === 'click') if (history.parent !== 'no-parent') path = path.split('/').filter(path => history.parent !== path).join('/')
        const resolveView = (text) => { if (state) this.webView(text) }

        if (state === 'click') perspective = 'GET'
        else if (state === 'load') perspective = 'PUT'

        const headers = {
            'Content-Type': '*/*',
            'Event': state,
            'JinLoadName': name
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
                    location.href = '/'
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
