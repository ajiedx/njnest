class JinStyle {
  constructor(name) {
    const style = document.createElement('style')
    document.head.appendChild(style)
    style.setAttribute('jinstyle', name)
    this.style = style.sheet

    this.css = {}
    this.incss = {}
  }

  
  indexify(i, index, prop) {
    let line = ''
    let value = ''
    for (const l in i) {
      if (i[l] === '{') {
        this[prop][index] = {name: line.trim()}
        line = ''
      } else if (i[l] === ':') {  
        value = line.trim()
        line = ''
      } else if (i[l] === ';') {  
        Object.assign(this[prop][index], {[value]: line.trim()})
        line = ''
      } else {
        line = line + i[l]
      }
    }
  }

  load(file) {
    let json = JSON.parse(file)
    if (this.style.cssRules.length == 0) {
      for (const i in json) {
        this.style.insertRule(i, json[i])
        this.indexify(i, json[i], 'css')

      }
    } else {
      console.log(file)
      for (const i in json) {
        this.indexify(i, json[i], 'incss')
      }
      for (const i in this.incss) {
        for (const l in this.incss[i]) {
          if (l !== 'name') {
            this.style.cssRules[i].styleMap.set(l, this.incss[i][l])
          }
        }
      }
    }
  }

}

class JinCss extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        
        this.styles = {}

    }

    load(name, file) {

      if (!this.styles[name]) {
        this.styles[name] = new JinStyle(name)
        this.styles[name].load(file)

      } else {
        this.styles[name].load(file)
      }


    }
}

// let stylesheet = new CSSStyleDeclaration()
// console.log(stylesheet)

// .catch(err => {
// console.error('Failed to replace styles:', err);
// });

window.jincss = new JinCss()

