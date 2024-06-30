import GameObject from './GameObject.js'
import { isDiagonalMove, randomElement, randomInt, roll, spread, attack, strengthToHitBonus } from './utils.js'

const { computed, watch } = Vue

const SEE_DURATION = spread(300)
export const TYPE = 'monster'

class Monster extends GameObject {
  constructor(monsterType, game) {
    super()
    const hits = roll(monsterType.level, 8)
    this.type = TYPE
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
      mean: monsterType.mean,
      level: monsterType.level,
      strength: {
        current: monsterType.strength,
        maximum: monsterType.strength
      },
      meleeDamageBonus: 0,
      meleeHitBonus: 0,
      tookDamageRecently: false,
      held: monsterType.held || false
    })
    if (monsterType.carry > 0 && randomInt(100) < monsterType.carry) {
      const item = getItem(this.game)
      this.items.push(item)
    }
    this.strengthToHitBonus = computed(() => {
      return strengthToHitBonus(this.strength.current)
    })
    this.dead = computed(() => {
      return this.hits.current < 1
    })
    this.isImmobile = computed(() => {
      return this.counts.hold > 0
    })
    this.toHitArmorLevel = computed(() => {
      return 5
    })
    this.strengthDamageBonus = computed(() => {
      const str = this.strength.current
      let add = 6
      if (str < 8)
	      return str - 7
      if (str < 31)
	      add--
      if (str < 22)
	      add--
      if (str < 20)
	      add--
      if (str < 18)
	      add--
      if (str < 17)
	      add--
      if (str < 16)
	      add--
      return add
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
  prepareTurn() {
    this.tookDamageRecently = false
  }
  moveTo(to) {
    const from = this.location
    if (to.character && !to.character.monsterType) {
      const { didHit, damage } = attack(this, to.character)
      if (didHit) {
        this.game.addMessage('The ' + this.monsterType.name + ' hit you for ' + damage + ' damage.')
      } else {
        this.game.addMessage('The ' + this.monsterType.name + ' missed you.')
      }
      return
    }
    if (this.held) {
      return
    }
    if (!to.canCharacterMoveTo) return
    from.character = null
    this.location = to
    to.character = this
  }
  takeDamage(x) {
    this.hits.current -= x
    if (x > 0) {
      this.tookDamageRecently = true
    }
  }
  getDamageRoll() {
    const dmg = this.monsterType.damage
    const types = dmg.split('/')
    return roll(randomElement(types))
  }
}
export default Monster