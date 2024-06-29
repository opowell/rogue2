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
      return 'a ring of ' + ringType.label + ' (' + this.ringType.stone + ')'
    }
    return getAAn(this.ringType.stone) + ' ' + this.ringType.stone + ' ring'
  }
}
export default Ring