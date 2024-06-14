import Item from "./Item.js"

class Ring extends Item {
  constructor(ringType) {
    super({
      type: 'ring',
      ringType,
      identified: false
    })
  }
  get label() {
    if (this.identified) {
      return 'a ring of ' + ringType.label
    }
    return 'a ring'
  }
}
export default Ring