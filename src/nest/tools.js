const { NjSuper } = require('njsuper')

class NjTools extends NjSuper {
    constructor(dt, objx) {
        super(dt, objx)

    }

    strPlace(strings, obj) {
        strings = strings.split('\n')
        let newstrings = [], l = 0, replace = false
        for (let i in strings) {
            if (strings[i] !== '') {
                for (const c in obj) {
                    if (obj[c] && obj[c].before) {
                        [newstrings[l], replace] = this.rplString({string: strings[i],
                            new: obj[c].new, sub: obj[c].before,
                            options: {line: '_', space: ' '}})
                        if (replace) newstrings[l+1] = strings[i], l=l+2, i++, delete obj[c], replace = false
                    }
                    
                    if (obj[c] && obj[c].new && obj[c].value) { 
                        [newstrings[l], replace] = this.rplString({string: strings[i],
                            new: obj[c].new, sub: obj[c].value,
                            options: {line: '_', space: ' '}})
                        
                        if (replace) delete obj[c], replace = false, i++
                    }
    
                    if (obj[c] && obj[c].after) {
                        [newstrings[l], replace] = this.rplString({string: strings[i],
                            new: obj[c].new, sub: obj[c].after,
                            options: {line: '_', space: ' '}})
                        // if (replace) console.log(replace, strings[i])
                        if (replace) newstrings[l+1] = newstrings[l], newstrings[l] = strings[i], l=l+2, i++, delete obj[c], replace = false
                        
                    } 
                }
            }
         

            newstrings[l] = strings[i]

            l++
        }
        return newstrings.join('\n')
    }

}

module.exports = { NjTools }