const options = {
  moduleCache: {
      vue: Vue
  },
  async getFile(url) {
    const res = await fetch(url)
    if ( !res.ok )
      throw Object.assign(new Error(res.statusText + ' ' + url), { res })
    const file = {
      getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
    }
    if (url.endsWith('.js')) {
      file.type = '.mjs'
    }
    return file
  },
  addStyle(textContent) {
    const style = Object.assign(document.createElement('style'), { textContent });
    const ref = document.head.getElementsByTagName('style')[0] || null;
    document.head.insertBefore(style, ref);
  },
}
const { loadModule } = window['vue3-sfc-loader']

import Game from './model/Game.js'
window.rogue = {}
window.rogue.init = () => {
  const { createApp, ref } = Vue
  createApp({
    components: {
      'GameScreen': Vue.defineAsyncComponent( () => loadModule('./view/Game.vue', options) )
    },
    setup() {
      const WIDTH = 78
      const HEIGHT = 23

      const game = ref(new Game(WIDTH, HEIGHT))
      const out = {
        game
      }
      Object.keys(out).forEach(key => {
        window.rogue[key] = out[key]
      })
      return out
    }
  }).mount('#app')  
}

window.rogue.init()