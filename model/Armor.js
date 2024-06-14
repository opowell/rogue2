import Item from "./Item.js"
const { computed } = Vue

class Armor extends Item {
  constructor(armorType, cursed = false) {
    super({
      type: 'armor',
      armorType: armorType.name,
      bonus: 0,
      cursed,
      identified: false
    })
    this.baseDefence = computed(() => {
      return armorType.defence
    })
    this.defence = computed(() => {
      return this.baseDefence.value + this.bonus
    })
  }
  get label() {
    if (this.identified) {
      return '+' + this.bonus + ' ' + this.armorType
    }
    return this.armorType
  }
  enchant() {
    this.bonus++
  }
  identify() {
    this.identified = true
  }
}
export default Armor