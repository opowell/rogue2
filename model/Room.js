import StatefulObject from "./StatefulObject.js"
import { randomElement } from "./utils.js"

class Room extends StatefulObject {
  constructor(x, y, width, height) {
    super({
      x,
      y,
      width,
      height,
      locations: [],
      lit: false,
      rightDoor: null,
      leftDoor: null,
      upDoor: null,
      downDoor: null
    })
  }
  getFreeItemLocation() {
    return randomElement(this.locations.filter(loc => loc.canPlaceItem))
  }
  getFreeCharacterLocation() {
    return randomElement(this.locations.filter(loc => loc.canPlaceMonster))
  }
  spawnRandomItem(game) {
    const location = this.getFreeItemLocation()
    if (!location) {
      return false
    }
    game.spawnRandomItem(location.x, location.y)
  }
  setRightDoor(location) {
    this.rightDoor = location
    location.type = 'door'
  }
  setLeftDoor(location) {
    this.leftDoor = location
    location.type = 'door'
  }
  setUpDoor(location) {
    this.upDoor = location
    location.type = 'door'
  }
  setDownDoor(location) {
    this.downDoor = location
    location.type = 'door'
  }
}
export default Room