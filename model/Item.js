import StatefulObject from "./StatefulObject.js"
const { watch } = Vue

class Item extends StatefulObject{
  constructor(object) {
    super({
      location: null,
      type: null,
      quantity: 1,
      owner: null,
      ...object
    })
    watch(() => this.quantity, () => {
      if (this.quantity === 1) {
        if (this.owner) {
          this.owner.loseItem(this)
        } else if (this.location) {
          this.location.removeItem()
        }
      } else {
        this.quantity--
      }
    })
  }
  matchesForInventory() {
    return false
  }
  get inventoryCount() {
    return this.quantity
  }
}
export default Item