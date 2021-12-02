const { NjUrl } = require('../../njnest')

const htmlMeta = {
  title: 'Default Title',
  description: 'Default Description',
  author: 'Ajiedx',
  // template: 
  // body:
}

const api = new NjUrl('bane', {
  url: '/api',

})

api.on('/user', {
  controller: 'default',
  idx: 'username',
  response: (ctrl, req) => {
    
    return ctrl
  }
})

const webapp = new NjUrl('bane', {
  // wrapper: (rsp) => {

  // },
  // parser: '',
  reload: true,
  htmlMeta,
  jinload: ['main.js'],
  jsDir: ['./src'],
  cssDir: ['./src/css'],
  cssLinks: ['./src/css/main.css'],
})



webapp.on('/', {
  name: 'index',
  controller: 'default',
  response: (ctrl, req, res) => {

    ctrl.html.replaceBody('<h2>NEW BODY</h2>')
    ctrl.html.replaceMeta('title', 'New Title')
    return ctrl
  }
})


webapp.on('/important', {
  name: 'important',
  controller: 'default',
  response: (ctrl, req, res) => {

    ctrl.html.replaceBody('<h3>Important BODY</h3>')
    ctrl.html.replaceMeta('title', 'Important Title')
    return ctrl
  }
})


module.exports = { api, webapp }