import Item from "./Item.js"
import { getAAn } from "./utils.js"

export const TYPE = 'stick'

class Stick extends Item {
  constructor(stickType) {
    super({
      type: TYPE,
      stickType,
      identified: false,
      charges: stickType.getCharges() 
    })
  }
  get label() {
    if (this.stickType.identified) {
      const aWandOfLight = getAAn(this.stickType.material) + ' ' + this.stickType.material + ' of ' + stickType.label + ' (' + this.stickType.materialType + ')'
      if (this.identified) {
        return aWandOfLight + ' (' + this.chargesLeft + ')'
      }
      return aWandOfLight
    }
    return getAAn(this.stickType.materialType) + ' ' + this.stickType.materialType + ' ' + this.stickType.material
  }
}
export default Stick