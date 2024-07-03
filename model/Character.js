import { TYPES as ARMOR_TYPES, getArmor } from './ArmorFactory.js'
import { TYPES as FOOD_TYPES, getFood } from './FoodFactory.js'
import GameObject from './GameObject.js'
import { spawnArrows, spawnBow, spawnMace } from './WeaponFactory.js'
import { alphabet, randomInt, roll, spread } from './utils.js'
const { computed, watch } = Vue

const SEE_DURATION = spread(300)
const STOMACH_SIZE = 2000
const FOOD_TIME = spread(1300)
const HUNGRY_TIME = 150
const STARVING_TIME = 850
const NUTRITION_STATUS = {
  FINE: {
    order: 0,
  },
  HUNGRY: {
    order: 1,
    message: 'you are starting to get hungry',
  },
  WEAK: {
    order: 2,
    message: 'you are starting to feel weak'
  },
  STARVING: {
    order: 3
  }
}
export const TYPE = 'character'

class Character extends GameObject {
  constructor(game) {
    super()
    this.type = TYPE
    this.addState({
      game,
      items: [],
      strength: {
        current: 16,
        maximum: 16
      },
      hits: {
        current: 12,
        maximum: 12
      },
      counts: {
        seeInvisible: 0,
        blind: 0,
        haste: 0,
        hold: 0,
        confuse: 0,
        sleep: 0,
      },
      experience: 0,
      gold: 0,
      weapon: null,
      armor: null,
      canSee: true,
      restCounter: 0,
      resting: true,
      latestDamageCause: 'died of natural causes',
      tookDamageRecently: false,
      confuseAttack: false,
      foodLeft: FOOD_TIME
    })

    const ration = getFood(FOOD_TYPES.RATION)
    this.items.push(ration)

    this.toHitArmorLevel = computed(() => {
      return this.armorLevel.value
    })
    const mace = spawnMace()
    mace.enchantHit()
    mace.enchantDamage()
    mace.identify()
    this.items.push(mace)

    const bow = spawnBow()
    bow.enchantHit()
    bow.identify()
    this.items.push(bow)

    const arrows = spawnArrows()
    arrows.identify()
    this.items.push(arrows)

    const ringMail = getArmor(ARMOR_TYPES.RING_MAIL, false)
    ringMail.enchant()
    ringMail.identify()
    this.items.push(ringMail)

    this.numItems = computed(() => {
      return this.items.reduce((acc, value) => acc + value.inventoryCount, 0)
    })
    this.meleeHitBonus = computed(() => {
      return 0
    })
    this.meleeDamageBonus = computed(() => {
      return 0
    })
    this.canSee = computed(() => {
      return this.counts.blind === 0
    })
    this.level = computed(() => {
      const xp = this.experience
      if (xp < 10) {
        return 1
      }
      return Math.ceil(Math.log2((xp + 1) / 10)) + 1
    })
    this.room = computed(() => {
      return this.location?.room
    })
    this.nextLevelXp = computed(() => {
      return Math.pow(2, this.level - 1) * 10
    })
    this.canDrop = computed(() => {
      return this.location.canPlaceItem
    })
    this.armor = ringMail
    this.armorLevel = computed(() => {
      if (!this.armor) {
        return 2
      }
      return this.armor.defence
    })
    this.weapon = mace
    this.damage = computed(() => {
      if (!this.weapon) {
        return 0
      }
      if (this.weapon.identified) {
        if (this.weapon.damageBonus !== 0) {
          return this.weapon.damage + '+' + this.weapon.damageBonus
        }
        return this.weapon.damage
      }
      return this.weapon.damage + '+?'
    })
    this.paralyzed = computed(() => {
      return this.counts.paralyze > 0
    })
    this.nutritionStatus = computed(() => {
      if (this.foodLeft >= 2 * HUNGRY_TIME) {
        return NUTRITION_STATUS.FINE
      }
      if (this.foodLeft >= HUNGRY_TIME) {
        return NUTRITION_STATUS.HUNGRY
      }
      if (this.foodLeft >= 0) {
        return NUTRITION_STATUS.WEAK
      }
      return NUTRITION_STATUS.STARVING
    })
    this.starved = computed(() => this.foodLeft < -STARVING_TIME)
    this.dead = computed(() => {
      if (this.starved.value) {
        return true
      }
      return this.hits.current < 1
    })
    this.adjacentEnemies = computed(() => {
      return this.game.getNearbyEnemies(this.location, 1)
    })
    watch(this.room, (val) => {
      if (!val) {
        return
      }
      val.enemies.forEach(enemy => {
        if (Math.random() * 3 > 1) {
          enemy.sleeping = false
        }
      })
    })
    watch(this.nutritionStatus, (newVal, oldVal) => {
      if (newVal.order < oldVal.order) {
        return
      }
      if (newVal.message) {
        this.addMessage(newVal.message)
      }
    })
    watch(() => this.foodLeft, val => {
      if (val >= 0) {
        return
      } 
      if (Math.random() < 0.2) {
        this.addMessage('you faint from lack of food')
        this.counts.sleep += randomInt(4, 11)
      }
    })
    watch(this.level, (newVal, oldVal) => {
      const modifier = newVal > oldVal ? 1 : -1
      const diff = Math.abs(newVal - oldVal)
      const change = modifier*roll(diff, 10)
      this.hits.current += change
      this.hits.maximum += change
      if (newVal > oldVal) {
        this.game.addMessage('Welcome to level ' + newVal)
      }
    })
    watch(() => this.location?.x + '-' + this.location?.y, () => {
      this.location.marked = true
    })
  }
  getDamageRoll() {
    return roll(this.weapon.damage)
  }
  raiseLevel() {
    this.xp = this.nextLevelXp
  }
  addMessage(m) {
    this.game.addMessage(m)
  }
  quaffItem(index) {
    const item = this.items[index]
    if (item.quantity === 1) {
      this.items.splice(index, 1)
    } else {
      item.quantity--
    }
    item.quaff(this)
    this.takeTurn()
  }
  wakeAdjacentEnemies() {
    this.adjacentEnemies.forEach(enemy => {
      if (enemy.monsterType.mean && 3 * Math.random() > 1) {
        enemy.sleeping = false
      }
    })
  }
  takeTurn() {
    const keys = Object.keys(this.counts)
    keys.forEach(key => {
      if (this.counts[key] > 0) {
        this.counts[key]--
      }
    })
    if (this.resting) {
      this.restCounter++
    }
    if (this.restCounter > 4) {
      this.takeDamage(-1)
      this.restCounter = 0
    }
    this.resting = true
    this.tookDamageRecently = false
    this.foodLeft--
  }
  prepareTurn() {
    this.tookDamageRecently = false
  }
  takeDamage(x, cause) {
    this.hits.current = Math.min(this.hits.maximum, this.hits.current - x)
    this.restCounter = 0
    this.resting = false
    this.latestDamageCause = cause
    if (x > 0) {
      this.tookDamageRecently = true
    }
  }
  restoreStrength() {
    this.strength.current = this.strength.maximum
  }
  heal() {
    this.hits.current += roll(this.level, 4)
    if (this.hits.current > this.hits.maximum) {
      this.hits.maximum++
      this.hits.current = this.hits.maximum
    }
    this.sight()
    this.game.addMessage('you begin to feel better')
  }
  healExtra() {
    this.hits.current += roll(this.level, 8)
    if (this.hits.current > this.hits.maximum) {
      this.hits.maximum = this.hits.maximum + 2
      this.hits.current = this.hits.maximum
    }
    this.sight()
    this.game.addMessage('you begin to feel much better')
  }
  blind() {
    this.counts.blind += SEE_DURATION
    this.game.addMessage('a cloak of darkness falls around you')
  }
  haste() {
    this.counts.haste += randomInt(10, 13)
  }
  poison() {
    this.strength.current -= randomInt(1, 3)
    this.game.addMessage('you feel very sick.')
  }
  sight() {
    this.counts.blind = 0
  }
  increaseStrength() {
    if (this.strength.current === this.strength.maximum) {
      this.strength.maximum++
    }
    this.strength.current++
    this.game.addMessage('You feel stronger, now. What bulging muscles!')
  }
  takeOffArmor() {
    if (!this.armor) {
      this.game.addMessage('You are not wearing any armor.')
      return
    }
    if (this.armor.cursed) {
      this.game.addMessage('Cannot remove armor, it seems to be cursed.')
      return
    }
    this.armor = null
    this.game.messages.push('Removed armor.')
  }
  loseItem(item) {
    const index = this.items.indexOf(item)
    this.items.splice(index, 1)
  }
  removeItem(index) {
    const item = this.items[index]
    let out = null
    if (item.quantity > 1) {
      item.quantity--
      out = item.clone()
    } else {
      out = this.items.splice(index, 1)[0]
    }
    return item
  }
  wield(item) {
    if (this.weapon?.cursed) {
      this.game.messages.push('You cannot, your current weapon is cursed.')
      return
    }
    this.weapon = item
  }
  wearArmor(item) {
    this.armor = item
    item.identified = true
  }
  eat(item) {
    if (item.type !== 'food') {
      this.addMessage("ugh, you would get ill if you ate that")
      return
    }
    item.quantity--
    if (this.foodLeft < 0) {
      this.foodLeft = 0
    }
    if (this.foodLeft > STOMACH_SIZE - 20) {
      this.counts.sleep += randomInt(2, 6)
      this.addMessage('You feel bloated and fall asleep')
    }
    this.foodLeft += FOOD_TIME - 200 + randomInt(400)
    if (this.foodLeft > STOMACH_SIZE) {
      this.foodLeft = STOMACH_SIZE
    }
    item.eat(this)
  }
  dropItem(index) {
    const item = this.removeItem(index)
    this.location.item = item
  }
  /**
   * 
   * @param {Location} location 
   * @returns whether or not item is in the current location
   */
  moveTo(location) {
    this.location = location
    const item = location.item
    if (!item) {
      return false
    }
    if (item.type === 'trap') {
      item.discovered = true
      this.takeDamage(randomInt(1, 2), 'a trap')
      this.game.addMessage('You stepped on a trap')
    } else if (item.type !== 'staircase') {
      if (item.type === 'gold') {
        this.gold += item.amount
        this.game.addMessage('You picked up ' + item.amount + ' pieces of gold.')
        location.item = null
      }
      else if (this.numItems > 25) {
        this.game.addMessage('Your pack is full.')
      } else {
        const matchingItem = this.items.find(i => {
          if (!i.matchesForInventory) {
            console.log('huh?', i, item)
            return false
          }
          return i.matchesForInventory(item)
        })
        let letter = ''
        if (matchingItem) {
          const index = this.items.findIndex(item => item === matchingItem)
          letter = alphabet[index]
          matchingItem.quantity++
        } else {
          this.items.push(item)
          letter = alphabet[this.items.length - 1]
        }
        this.game.addMessage('You picked up ' + (item.label || ('a ' + item.type)) + ' (' + letter + ')')
        location.item = null
      }
    }
    this.takeTurn()
    return true
  }
  getCurrentVisibleItems() {
    const out = {
      visible: {},
      touchable: []
    }
    if (this.location.room && this.location.room.lit) {
      this.location.room.locations.forEach(location => {
        if (location.type === 'door') {
          out.visible[location.x + '-' + location.y] = location.character
        }
      })
    }
    const x = this.location.x
    const y = this.location.y
    const touchableLocations = []
    const game = this.game
    touchableLocations.push(game.locations[x-1][y])
    touchableLocations.push(game.locations[x][y-1])
    touchableLocations.push(game.locations[x][y])
    touchableLocations.push(game.locations[x][y+1])
    touchableLocations.push(game.locations[x+1][y])
    if (!this.location.isHallway) {
      touchableLocations.push(game.locations[x-1][y-1])
      touchableLocations.push(game.locations[x-1][y+1])
      touchableLocations.push(game.locations[x+1][y-1])
      touchableLocations.push(game.locations[x+1][y+1])
    }
    touchableLocations.forEach(location => {
      if (location.type === 'door') {
        out.touchable.push('door')
      }
      if (location.item) {
        out.touchable.push(location.item.type)
      }
    })
    out.touchable.sort()
    return out
  }
  currentVisibilityMatches(oldItems) {
    const currentItems = this.getCurrentVisibleItems()
    const allVisibleKeys = {}
    Object.keys(currentItems.visible).forEach(key => allVisibleKeys[key] = currentItems.visible[key])
    Object.keys(oldItems.visible).forEach(key => allVisibleKeys[key] = oldItems.visible[key])
    const hasNewVisibility = Object.keys(allVisibleKeys).some(key => {
      if (currentItems.visible[key] && currentItems.visible[key] !== oldItems.visible[key]) {
        return true
      }
      return false
    })
    if (hasNewVisibility) {
      return false
    }
    if (currentItems.touchable.length && (currentItems.touchable.length > oldItems.touchable.length || currentItems.touchable.some((item, index) => item !== oldItems.touchable[index]))) {
      return false
    }
    return true
  }
}
export default Character