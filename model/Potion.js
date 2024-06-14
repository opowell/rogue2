import Item from "./Item.js"

class Potion extends Item {
  constructor(potionType) {
    super({
      type: 'potion',
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
      return 'a ' + this.potionType.color + ' potion'
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
    this.potionType.identified = true
  }
}
export default Potion