import Item from "./Item.js"

class Weapon extends Item {
  constructor(type) {
    super({
      weaponType: type.name,
      hitBonus: 0,
      damageBonus: 0,
      identified: false,
      damage: type.damage
    })
    this.type = 'weapon'
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