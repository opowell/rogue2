import Item from "./Item.js"

class Amulet extends Item {
  constructor() {
    super({
      type: 'amulet',
    })
  }
  get label() {
    return 'the amulet of Yendor'
  }
}
export default Amulet