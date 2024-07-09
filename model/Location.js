import StatefulObject from "./StatefulObject.js"

const { computed, watch } = Vue
class Location extends StatefulObject{
  constructor(x, y) {
    super({
      x,
      y,
      objects: [],
      type: null,
      item: null,
      character: null,
      room: null,
      show: false, // whether or not to show location on map
      showContent: false, // whether or not to show content = item or character
      marked: false,
      identifiedMagic: null
    })
    this.isFloor = computed(() => {
      return this.type === 'floor'
    })
    this.canCharacterMoveTo = computed(() => {
      if (!this.type) return false
      if (this.character) return false
      return ['floor', 'hallway', 'door'].includes(this.type)
    })
    this.isDoor = computed(() => {
      return this.type === 'door'
    })
    this.isWall = computed(() => {
      if (!this.type) {
        return false
      }
      return this.type.includes('Wall')
    })
    this.canPlacePlayer = computed(() => {
      return !this.character && this.isFloor.value && !this.item
    })
    this.canPlaceMonster = computed(() => {
      return !this.character && this.isFloor.value
    })
    this.isHallway = computed(() => {
      return this.type === 'hallway'
    })
    this.canPlaceItem = computed(() => {
      if (!this.isFloor.value && !this.isHallway.value) return false
      if (!!this.item) return false
      return true
    })
    this.canPlaceStairs = computed(() => {
      if (!this.isFloor.value) return false
      if (!!this.item) return false
      return true
    })
    watch(() => this.showContent, val => {
      if (!val) {
        return
      }
      this.identifiedMagic = null
    })
  }
  reset() {
    this.objects = []
    this.type = null
    this.item = null
    this.character = null
    this.room = null
    this.show = false
    this.showContent = false
    this.marked = false
    this.identifiedMagic = null
  }
  removeItem() {
    this.item = null
  }
  identifyItem() {
    this.identifiedMagic = this.item?.magicType
  }
}
export default Location