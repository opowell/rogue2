import Item from "./Item.js"
import { getAAn } from "./utils.js"

export const TYPE = 'potion'

class Potion extends Item {
  constructor(potionType) {
    super({
      type: TYPE,
      potionType,
    })
  }
  get label() {
    if (this.potionType.identified) {
      if (this.quantity === 1) {
        return 'a potion of ' + this.potionType.name + ' (' + this.potionType.color + ')'
      }
      return this.quantity + ' potions of ' + this.potionType.name + ' (' + this.potionType.color + ')'
    }
    if (this.quantity === 1) {
      return getAAn(this.potionType.color) + ' ' + this.potionType.color + ' potion'
    }
    return this.quantity + ' ' + this.potionType.color + ' potions'
  }
  matchesForInventory(item) {
    return item.type === 'potion' && item.potionType === this.potionType
  }
  quaff(character) {
    if (this.potionType && this.potionType.action) {
      this.potionType.action(character, this)
    }
  }
  identify() {
    console.log('identify', this, this.potionType)
    this.potionType.identified = true
  }
}
export default Potion