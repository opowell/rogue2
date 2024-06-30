import Item from "./Item.js"

class Scroll extends Item {
  constructor(scrollType) {
    super({
      type: 'scroll',
      scrollType
    })
  }
  get label() {
    if (this.scrollType.identified) {
      return 'a scroll of ' + this.scrollType.name
    }
    if (this.quantity === 1) {
      return 'a scroll titled ' + this.scrollType.hiddenName
    }
    return this.quantity + ' scrolls titled ' + this.scrollType.hiddenName
  }
  matchesForInventory(item) {
    return item.type === 'scroll' && item.scrollType === this.scrollType
  }
  identify() {
    this.scrollType.identified = true
  }
}
export default Scroll