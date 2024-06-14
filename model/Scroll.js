import Item from "./Item.js"

class Scroll extends Item {
  constructor(scrollType) {
    super({
      type: 'scroll',
      scrollType
    })
  }
  get label() {
    if (this.quantity === 1) {
      return 'a scroll'
    }
    return this.quantity + ' scrolls'
  }
  matchesForInventory(item) {
    return item.type === 'scroll' && item.scrollType === this.scrollType
  }
}
export default Scroll