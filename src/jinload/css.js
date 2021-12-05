class JinCss extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)
        const style = document.createElement('style')
        document.head.appendChild(style)
        
        this.style = style.sheet
        console.dir(this.style)
        // this.style.insertRule('body { background-color: black }', 0)
        
        // this.json = '{"0": { "body": "{ background-color: black }" }}'
    }

    load(file) {
        console.log(file)
    }
}
// let stylesheet = new CSSStyleDeclaration()
// console.log(stylesheet)

// .catch(err => {
// console.error('Failed to replace styles:', err);
// });

window.jincss = new JinCss()

