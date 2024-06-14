import Item from "./Item.js"

class Stick extends Item {
  constructor(stickType) {
    super({
      type: 'stick',
      stickType,
      identified: false
    })
  }
  get label() {
    if (this.identified) {
      return 'a stick of ' + ringType.label
    }
    return 'a stick'
  }
}
export default Stick