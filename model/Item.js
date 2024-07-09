import StatefulObject from "./StatefulObject.js"
const { watch } = Vue

class Item extends StatefulObject {
  constructor(object) {
    super({
      location: null,
      type: null,
      quantity: 1,
      owner: null,
      ...object
    })
    watch(() => this.quantity, (val) => {
      if (val !== 0) {
        return
      }
      if (this.owner) {
        this.owner.loseItem(this)
      } else if (this.location) {
        this.location.removeItem()
      }
    })
  }
  matchesForInventory() {
    return false
  }
  get inventoryCount() {
    return this.quantity
  }
  get label() {
    return 'an item'
  }
  clone() {
    return new Item({ ...this.state })
  }
}
export default Item