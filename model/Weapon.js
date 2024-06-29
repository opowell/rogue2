import Item from "./Item.js"
import { randomInt } from "./utils.js"

class Weapon extends Item {
  constructor(type, groupId, randomize = true) {
    super({
      weaponType: type.name,
      hitBonus: 0,
      damageBonus: 0,
      identified: false,
      damage: type.damage,
      vorpalizeType: null,
      cursed: false,
      quantity: 1,
      groupId
    })
    this.type = 'weapon'
    const r = Math.random()
    if (randomize) {
      if (r < 0.1) {
        this.hitBonus = -randomInt(1, 3)
        this.cursed = true
      } else if (r < 0.15) {
        this.hitBonus = randomInt(1, 3)
      }
    }
    if (type.isMany) {
      this.quantity = randomInt(8, 15)
    }
  }
  get inventoryCount() {
    return 1
  }
  get label() {
    if (this.quantity === 1) {
      if (this.identified) {
        return 'a +' + this.hitBonus + ',+' + this.damageBonus + ' ' + this.weaponType 
      }
      return 'a ' + this.weaponType
    }
    if (this.identified) {
        return this.quantity + ' +' + this.hitBonus + ',+' + this.damageBonus + ' ' + this.weaponType + 's'
    }
    return this.quantity + ' ' + this.weaponType + 's'
  }
  enchantDamage() {
    this.damageBonus++
  }
  enchantHit() {
    this.hitBonus++
  }
  enchant() {
    if (Math.random() < 0.5) {
      this.enchantHit()
    } else {
      this.enchantDamage()
    }
  }
  identify() {
    this.identified = true
  }
}
export default Weapon