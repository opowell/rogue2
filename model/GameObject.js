import StatefulObject from './StatefulObject.js'

class GameObject extends StatefulObject{
  constructor() {
    super({
      location: null,
      type: null
    })
  }
  get label() {
    if (this.name) {
      return this.name
    }
    return this.type
  }
  clone() {
    const out = new GameObject()
    out.type = this.type
    return out
  }
}
export default GameObject