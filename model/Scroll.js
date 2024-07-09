import Item from "./Item.js"

export const TYPE = 'scroll'

class Scroll extends Item {
  constructor(scrollType) {
    super({
      type: TYPE,
      scrollType
    })
  }
  get label() {
    if (this.scrollType.identified) {
      return 'a scroll of ' + this.scrollType.name
    }
    if (this.quantity === 1) {
      return 'a scroll titled \'' + this.scrollType.hiddenName + '\''
    }
    return this.quantity + ' scrolls titled \'' + this.scrollType.hiddenName + '\''
  }
  matchesForInventory(item) {
    return item.type === 'scroll' && item.scrollType === this.scrollType
  }
  identify() {
    this.scrollType.identified = true
  }
  read(character) {
    this.scrollType.read(character, this)
  }
  clone() {
    return new Scroll({ ...this.state })
  }
  get magicType() {
    return this.scrollType.magic
  }
}
export default Scroll