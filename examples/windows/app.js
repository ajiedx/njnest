const { NjUrl } = require('../../njnest')
// dir.setDir('./src', 'src')
// dir.setExt('src', 'js')
// console.log(dir)
// const client = new Client()
const template = "<html>${rsp} ${asdas} ${yo}</html>"

function parse(template) {
  const regex = /\$[\{]\w+}/g
  const found = template.match(regex)
  var name = {}
  for (const i in found) {
    // console.log(found[i].slice(0, -1))
    Object.assign(name, {[found[i].slice(0, -1).slice(2)]: {regfound: found[i]}})    
  }
  // console.log(name)
  // console.log(found)
  // console.log(template.replaceAll(regex, 'what'))
}

parse(template)
const webapp = new NjUrl('bane', {
  wrapper: (rsp) => {

  },
  type: 'web'
})

webapp.on('/qwe', {
  name: 'aaaa',
  response: () => {
    return 'Hey'
  }
})
webapp.on('/qwe', {
  name: 'heys',
  response: () => {
    return 'Hey'
  }
})

const api = new NjUrl('bane', {
  type: 'api'
})

module.exports = { api, webapp }