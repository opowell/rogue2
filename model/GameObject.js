import StatefulObject from "./StatefulObject.js"

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
}
export default GameObject