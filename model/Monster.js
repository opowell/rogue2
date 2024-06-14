import GameObject from './GameObject.js'
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
    this.dead = computed(() => {
      return this.hits.current < 1
    })
    watch(this.dead, (newVal) => {
      if (newVal) {
        this.game.removeMonster(this)
      }
    })
  }
  step() {
    const playerLoc = this.game.player.location
    const curLoc = this.location
    const dx = Math.sign(playerLoc.x - curLoc.x)
    const dy = Math.sign(playerLoc.y - curLoc.y)
    const from = this.location
    let to = this.game.getLocation(curLoc.x + dx, curLoc.y + dy)
    if (isDiagonalMove(from, to) && this.game.hasWallBetween(from, to)) {
      const loc1 = this.game.getLocation(curLoc.x + dx, curLoc.y)
      const loc2 = this.game.getLocation(curLoc.x, curLoc.y + dy)
      if (loc1.canCharacterMoveTo) {
        to = loc1
      } else {
        to = loc2
      }
    }
    this.moveTo(to)
  }
  moveTo(to) {
    const from = this.location
    if (!to.canCharacterMoveTo) return
    from.character = null
    this.location = to
    to.character = this
  }
  takeDamage(x) {
    console.log('hit', this, x)
    this.hits.current -= x
  }
}
export default Monster