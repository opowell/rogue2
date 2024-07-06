import Item from "./Item.js"

export const TYPE = 'food'

class Food extends Item {
  constructor(foodType) {
    super({
      type: TYPE,
      foodType,
    })
  }
  get label() {
    if (this.quantity === 1) {
      return this.foodType.name
    }
    return this.quantity + ' ' + this.foodType.pluralName
  }
  eat(character) {
    return this.foodType.eat(character)
  }
  matchesForInventory(item) {
    return item.type === 'food' && item.foodType === this.foodType
  }
}
export default Food