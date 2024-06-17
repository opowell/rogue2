import GameObject from './GameObject.js'
import { isDiagonalMove, randomElement, randomInt, roll, spread } from './utils.js'

const { computed, watch } = Vue

const SEE_DURATION = spread(300)

class Monster extends GameObject {
  constructor(monsterType, game) {
    super()
    this.type = 'monster'
    const hits = roll(monsterType.level, 8)
    this.addState({
      game,
      monsterType,
      hits: {
        current: hits,
        maximum: hits
      },
      counts: {
        seeInvisible: 0,
        blind: 0,
        haste: 0,
        hold: 0,
        confuse: 0
      },
      experience: 0,
      items: [],
      mean: monsterType.mean
    })
    if (monsterType.carry > 0 && randomInt(100) < monsterType.carry) {
      const item = getItem()
      this.items.push(item)
    }
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
    if (this.dead) {
      return
    }
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
    if (to.character && !to.character.monsterType) {
      const damage = this.getDamageRoll()
      to.character.takeDamage(damage, 'killed by a ' + this.monsterType.name)
      this.game.addMessage('The ' + this.monsterType.name + ' hit you for ' + damage + ' damage')
      return
    }
    if (!to.canCharacterMoveTo) return
    from.character = null
    this.location = to
    to.character = this
  }
  takeDamage(x) {
    this.hits.current -= x
  }
  getDamageRoll() {
    const dmg = this.monsterType.damage
    const types = dmg.split('/')
    return roll(randomElement(types))
  }
}
export default Monster