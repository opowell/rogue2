import { TYPES as ARMOR_TYPES, getArmor } from './ArmorFactory.js'
import { TYPES as FOOD_TYPES, getFood } from './FoodFactory.js'
import GameObject from './GameObject.js'
import { spawnArrows, spawnBow, spawnMace } from './WeaponFactory.js'
import { isDiagonalMove, roll, spread } from './utils.js'
const { computed, watch } = Vue

const SEE_DURATION = spread(300)

class Monster extends GameObject {
  constructor(monsterType, game) {
    super()
    this.type = 'monster'
    this.addState({
      game,
      monsterType,
      hits: {
        current: 12,
        maximum: 12
      },
      counts: {
        seeInvisible: 0,
        blind: 0,
        haste: 0,
        hold: 0,
        confuse: 0
      },
      experience: 0,
    })
  }
  step() {
    const playerLoc = this.game.player.location
    const curLoc = this.location
    const dx = Math.sign(playerLoc.x - curLoc.x)
    const dy = Math.sign(playerLoc.y - curLoc.y)
    this.moveTo(this.game.getLocation(curLoc.x + dx, curLoc.y + dy))
  }
  moveTo(to) {
    const from = this.location
    console.log('moveTo', to.x, to.y, to, to.canCharacterMoveTo, isDiagonalMove(from, to), this.game.hasWallBetween(from, to))
    if (!to.canCharacterMoveTo) return
    if (isDiagonalMove(from, to) && this.game.hasWallBetween(from, to)) {
      return
    }
    console.log('moving')
    from.character = null
    to.character = this
  }
}
export default Monster