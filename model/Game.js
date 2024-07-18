import Location from './Location.js'
import Item from './Item.js'
import Room from './Room.js'
import Character from './Character.js'
import StatefulObject from './StatefulObject.js'
import { DIRECTIONS } from './Directions.js'
import { isDiagonalMove, randomElement, randomInt } from './utils.js'
import { getItem, potionFactory } from './ItemFactory.js'
import { getLevelMonster } from './MonsterFactory.js'
import { getTrap } from './TrapFactory.js'
import Amulet from './Amulet.js'
const { computed, nextTick, toRaw, watch } = Vue

const AMULET_LEVEL = 25
function isWall(location) {
  if (!location.type) {
    return true
  }
  return location.type.includes('Wall')
}
const TREAS_ROOM = 20	/* one chance in TREAS_ROOM for a treasure room */
const MAXTREAS = 10	/* maximum number of treasures in a treasure room */
const MINTREAS = 2	/* minimum number of treasures in a treasure room */
const MAX_ITEMS_PER_LEVEL = 9
const MAX_TRAPS = 10
const WANDER_TIME = 70

function canMoveTo(location) {
  if (!location.type) return false
  if (location.character) return false
  return ['floor', 'hallway', 'door'].includes(location.type)
}

const NUM_ROOM_COLS = 3
const NUM_ROOM_ROWS = 3

class Game extends StatefulObject {
  constructor(width, height) {
    super({
      locations: [],
      rooms: [],
      level: 1,
      objects: [],
      items: [],
      characters: [],
      messages: [],
      playerName: null,
      player: null,
      width,
      height,
      maxLevel: 1,
      seenAmulet: false,
      levelsWithoutFood: 0,
      wandererCount: 0,
      mostRecentMessage: null,
      potionFactory
    })
    this.player = new Character(this)
    this.createLocations()
    this.startNewLevel()
    this.playerDead = computed(() => this.player.dead)
    this.message = computed(() => {
      if (this.messages.length === 0) {
        return ''
      }
      return this.messages[0]
    })
    this.playerPickedUpItem = computed(() => this.player.pickedUpItem)
    watch(() => this.player.counts.sleep, (newVal, oldVal) => {
      if (newVal < 1) {
        if (oldVal > 0) {
          this.addMessage('you can move again')
        }
        return
      }
      this.step()
    })
    watch(() => this.level, (val) => {
      this.maxLevel = Math.max(val, this.maxLevel)
    })
    watch(() => this.wandererCount, (val) => {
      if (val >= WANDER_TIME + randomInt(3, 5) && randomInt(5) === 5) {
        const room = randomElement(this.rooms.flat().filter(room => room !== this.player.location.room))
        const location = room.getFreeCharacterLocation()
        const enemy = this.spawnMonster(location.x, location.y, this.level)
        enemy.sleeping = false
        this.wandererCount = 0
      }
    })
    watch(() => this.message.value, (val) => {
      if (!val) {
        return
      }
      this.mostRecentMessage = val
    })
  }
  showMostRecentMessage() {
    console.log('show most recent', this.messages, this.mostRecentMessage)
    if (this.messages.length > 0) {
      return
    }
    if (!this.mostRecentMessage) {
      return
    }
    this.messages.push(this.mostRecentMessage)
  }
  restart() {
    this.level = 1
    this.messages = []
    this.player = new Character(this)
    this.createLocations()
    this.startNewLevel()
  }
  startNewLevel() {
    this.wandererCount = 0
    this.objects = []
    this.items = []
    this.characters = []
    this.levelsWithoutFood++
    this.clearLocations()
    this.addRooms()
    this.createPlayer()
    this.createStaircase()
    this.addTraps()
  }
  prepareTurn() {
    this.characters.forEach(character => character.prepareTurn())
    this.player.prepareTurn()
  }
  addTraps() {
    const level = this.level
    if (Math.random() >= level / 10) {
      return
    }
    let numTraps = randomInt(Math.floor(level / 4))
		numTraps = Math.min(numTraps, MAX_TRAPS)
    let i = 0
    while (i < numTraps) {
      const room = this.getRandomRoom()
      const location = room.getFreeItemLocation()
      if (!location) {
        continue
      }
      location.item = getTrap()
      i++
    }
  }
  getRandomRoom() {
    return randomElement(this.rooms.flat())
  }
  greetPlayer() {
    this.addMessage('Welcome, ' + this.playerName + ', to the Dungeons of Doom!')
  }
  detectMagic() {
    this.locations.forEach(row => row.forEach(loc => {
      loc.identifyItem()
    }))
  }
  clearCurrentMessage() {
    this.messages.splice(0, 1)
  }
  clearLocations() {
    this.locations.forEach(row => row.forEach(location => {
      location.reset()
    }))
  }
  createLocations() {
    this.locations = []
    for (let i = 0; i < this.width; i++) {
      const col = []
      this.locations.push(col)
      for (let j = 0; j < this.height; j++) {
        col.push(new Location(i, j))
      }
    }
  }
  getLocation(x, y) {
    return this.locations[x][y]
  }
  addRooms() {
    const numVerticalHallways = NUM_ROOM_ROWS - 1
    const numHorizontalHallways = NUM_ROOM_COLS - 1
    const widthPerRoomCol = Math.floor((this.width - numHorizontalHallways)/ NUM_ROOM_COLS)
    const heightPerRoomRow = Math.floor((this.height - numVerticalHallways)/ NUM_ROOM_ROWS)
    this.rooms = []
    const minWidth = 4
    const minHeight = 4
    for (let i = 0; i < NUM_ROOM_COLS; i++) {
      this.rooms.push([])
      const minX = i * widthPerRoomCol + i
      const maxX = minX + widthPerRoomCol - 1
      for (let j = 0; j < NUM_ROOM_ROWS; j++) {
        const minY = j * heightPerRoomRow + j
        const maxY = minY + heightPerRoomRow - 1
        const width = randomInt(minWidth, widthPerRoomCol)
        const height = randomInt(minHeight, heightPerRoomRow)
        const x = randomInt(minX, maxX - (width - 1))
        const y = randomInt(minY, maxY - (height - 1))
        const room = this.addRoom(x, y, width, height)
        this.rooms[i].push(room)
      }
    }
    this.addDoors()
    this.addHallways()
    this.addItems()
  }
  getFreeItemFloorLocation() {
    return randomElement(this.locations.flat().filter(loc => loc.canPlaceItem && loc.isFloor))
  }
  addItems() {
    let i = 0
    if (this.level >= AMULET_LEVEL) {
      const amulet = new Amulet()
      this.placeItem(amulet)
      i++
    }
    for (let j = i; j < MAX_ITEMS_PER_LEVEL; j++) {
      if (Math.random() < 0.35) {
        const location = this.getFreeItemFloorLocation()
        if (location) {
          this.spawnRandomItem(location.x, location.y)
        }
      }
    }
    if (randomInt(TREAS_ROOM - 1) === 0) {
      const room = randomElement(this.rooms.flat())
      let locations = room.getFreeItemLocation()
      const spots = Math.min(locations.length, MAXTREAS - MINTREAS)
      const numTreasure = randomInt(spots - 1) + MINTREAS
      for (let i = 0; i < numTreasure; i++) {
        room.spawnRandomItem(this)
      }
      let numMonsters = randomInt(spots - 1) + MINTREAS
      if (numMonsters < numTreasure + 2) {
        numMonsters = numTreasure + 2
      }
      locations = room.locations.flat().filter(loc => loc.canPlaceMonster)
      if (numMonsters > locations.length - 1) {
        numMonsters = locations.length - 1
      }
      for (let i = 0; i < numMonsters; i++) {
        const location = randomElement(room.locations.flat().filter(loc => loc.canPlaceMonster))
        if (!location) {
          continue
        }
        const monster = this.spawnMonster(location.x, location.y, this.level + 1)
        monster.mean = true
      }
    }
  }
  getNearbyEnemies(location, distance) {
    return this.getLocationsNearby(location, (loc) => !!loc.character && loc.character !== this.player, distance).map(loc => loc.character)
  }
  readScroll(scroll, index) {
    this.player.removeItem(index)
    scroll.read(this.player)
  }
  revealMap() {
    this.locations.flat().forEach(location => location.show = true)
  }
  addHallways() {
    for (let i = 0; i < NUM_ROOM_COLS; i++) {
      for (let j = 0; j < NUM_ROOM_ROWS; j++) {
        const room = this.rooms[i][j]
        if (i < NUM_ROOM_COLS - 1) {
          const rightRoom = this.rooms[i + 1][j]
          const y1 = room.rightDoor.y
          const y2 = rightRoom.leftDoor.y
          const x1 = room.x + room.width
          const x2 = rightRoom.x - 1
          const xhat = randomInt(x1, x2)
          for (let x = x1; x <= x2; x++) {
            const y = x < xhat ? y1 : y2
            this.locations[x][y].type = 'hallway'
          }
          for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
            this.locations[xhat][y].type = 'hallway'
          }
        }
        if (j < NUM_ROOM_ROWS - 1) {
          const downRoom = this.rooms[i][j + 1]
          const x1 = room.downDoor.x
          const x2 = downRoom.upDoor.x
          const y1 = room.y + room.height
          const y2 = downRoom.y - 1
          const yhat = randomInt(y1, y2)
          for (let y = y1; y <= y2; y++) {
            const x = y < yhat ? x1 : x2
            this.locations[x][y].type = 'hallway'
          }
          for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
            this.locations[x][yhat].type = 'hallway'
          }
        }
      }
    }
  }
  addDoors() {
    for (let i = 0; i < NUM_ROOM_COLS; i++) {
      const left = i > 0
      const right = i < NUM_ROOM_COLS - 1
      for (let j = 0; j < NUM_ROOM_ROWS; j++) {
        const room = this.rooms[i][j]
        const up = j > 0
        const down = j < NUM_ROOM_ROWS - 1
        if (left) {
          const y = room.y + 1 + randomInt(room.height - 3)
          room.setLeftDoor(this.locations[room.x][y])
        }
        if (right) {
          const y = room.y + 1 + randomInt(room.height - 3)
          room.setRightDoor(this.locations[room.x + room.width - 1][y])
        }
        if (up) {
          const x = room.x + 1 + randomInt(room.width - 3)
          room.setUpDoor(this.locations[x][room.y])
        }
        if (down) {
          const x = room.x + 1 + randomInt(room.width - 3)
          room.setDownDoor(this.locations[x][room.y + room.height - 1])
        }
      }
    }
  }
  getLocationsNearby(location, filter = () => true, distance = 1) {
    const minX = Math.max(location.x - distance, 0)
    const maxX = Math.min(location.x + distance, this.locations.length - 1)
    const minY = Math.max(location.y - distance, 0)
    const maxY = Math.min(location.y + distance, this.locations[0].length - 1)
    let out = []
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        if (x === location.x && y === location.y) {
          continue
        }
        const loc = this.locations[x][y]
        if (filter(loc)) {
          out.push(loc)
        }
      }
    }
    return out
  }
  addRoom(x, y, w, h) {
    const room = new Room(x, y, w, h, this)
    room.lit = randomInt(100) > this.level - 1
    this.locations[x][y].type = 'downRightWall'
    this.locations[x + w - 1][y].type = 'downLeftWall'
    this.locations[x][y + h - 1].type = 'upRightWall'
    this.locations[x + w - 1][y + h - 1].type = 'upLeftWall'
    for (let i = x + 1; i <= x + w - 2; i++) {
      this.locations[i][y].type = 'horizontalWall'
      this.locations[i][y+h-1].type = 'horizontalWall'
    }
    for (let i = x; i <= x + w - 1; i++) {
      for (let j = y; j <= y + h - 1; j++) {
        this.locations[i][j].room = room
        room.locations.push(this.locations[i][j])
      }
    }
    for (let i = x+1; i <= x + w - 2; i++) {
      for (let j = y+1; j <= y + h - 2; j++) {
        this.locations[i][j].type = 'floor'
      }
    }
    for (let i = y + 1; i <= y + h - 2; i++) {
      this.locations[x][i].type = 'verticalWall'
      this.locations[x+w-1][i].type = 'verticalWall'
    }
    let addedGold = false
    if (Math.random() > 0.5 && !this.seenAmulet && this.level >= this.maxLevel) {
      const amount = randomInt(50 + 10 * this.level) + 2
      const location = room.getFreeItemLocation()
      if (location) {
        this.createGold(location.x, location.y, amount)
        addedGold = true
      }
    }
    if (randomInt(100) < (addedGold ? 80 : 25)) {
      const location = randomElement(room.locations.flat().filter(loc => loc.canPlaceMonster))
      if (location) {
        this.spawnMonster(location.x, location.y)
      }
    }
    return room
  }
  spawnMonster(x, y, level) {
    const monster = getLevelMonster(this, level)
    this.characters.push(monster)
    this.placeMonster(monster, x, y)
    return monster
  }
  spawnRandomItem(x, y) {
    const item = getItem(this)
    this.placeItem(item, x, y)
  }
  hasWallBetween(a, b) {
    return isWall(this.locations[a.x][b.y]) || isWall(this.locations[b.x][a.y])
  }
  quaffItem(index) {
    this.player.quaffItem(index)
  }
  healPlayer() {
    this.player.heal()
    this.addMessage('You begin to feel better')
  }
  blindPlayer() {
    this.player.blind()
  }
  poisonPlayer() {
    this.player.poison()
  }
  hastePlayer() {
    this.player.haste()
    this.addMessage('You feel yourself moving much faster')
  }
  rest() {
    this.step()
  }
  restorePlayerStrength() {
    this.player.restoreStrength()
    this.addMessage('hey, this tastes great.  It makes you feel warm all over')
  }
  dropItem(index) {
    this.player.dropItem(index)
  }
  createGold(x, y, amount) {
    const item = this.createItem(x, y)
    item.type = 'gold'
    item.amount = amount
  }
  createStaircase() {
    const locations = this.locations.flat().filter(location => location.canPlaceStairs === true || location.canPlaceStairs.value)
    const location = randomElement(locations)
    if (!location) {
      console.log('ERROR - could not place staircase', location, locations, this.locations.flat())
    }
    const item = this.createItem(location.x, location.y)
    item.type = 'staircase'
  }
  createItem(x, y) {
    const object = new Item()
    return this.placeItem(object, x, y)
  }
  placeItem(object, x, y) {
    let location
    if (!x && !y) {
      const room = randomElement(this.rooms)
      location = randomElement(room.locations.filter(loc => loc.canPlaceItem))
    } else {
      location = this.locations[x][y]
    }
    if (location.canPlaceItem === false || location.canPlaceItem.value === false) {
      return object
    }
    location.item = object
    object.location = location
    return object
  }
  placeMonster(monster, x, y) {
    const location = this.locations[x][y]
    if (location.canPlaceMonster === false || location.canPlaceMonster.value === false) {
      console.log('WARNING, could not place MONSTER', monster, location, x, y)
      return monster
    }
    location.character = monster
    monster.location = location
    return monster
  }
  createCharacter(x, y) {
    const character = new Character(this)
    const location = this.locations[x][y]
    location.character = character
    character.location = location
    return character
  }
  addMessage(message) {
    this.messages.push(message)
  }
  createPlayer() {
    const player = this.player
    const locations = this.locations.flat().filter(location => location.canPlacePlayer === true || location.canPlacePlayer?.value === true)
    const location = randomElement(locations)
    player.location = location
    location.character = player
    const x = location.x
    const y = location.y
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        this.locations[i][j].show = true
        this.locations[i][j].showContent = true
      }
    }
    if (location.room?.lit) {
      location.room.locations.forEach(r => {
        r.show = true
        r.showContent = true
      })
    }
  }
  runUp() {
    const location = this.player.location
    if (!canMoveTo(this.locations[location.x][location.y-1])) return
    this.runExcept(DIRECTIONS.DOWN)
  }
  runDown() {
    const location = this.player.location
    if (location.y === this.height - 1) return
    if (!canMoveTo(this.locations[location.x][location.y+1])) return
    this.runExcept(DIRECTIONS.UP)
  }
  runLeft() {
    const location = this.player.location
    if (location.x === 0) return
    if (!canMoveTo(this.locations[location.x-1][location.y])) return
    this.runExcept(DIRECTIONS.RIGHT)
  }
  runDownLeft() {
    const location = this.player.location
    if (location.x === 0) return
    if (location.y === this.height - 1) return
    if (!canMoveTo(this.locations[location.x-1][location.y+1])) return
    this.runExcept(DIRECTIONS.UP_RIGHT)
  }
  runDownRight() {
    const location = this.player.location
    if (location.x === this.width - 1) return
    if (location.y === this.height - 1) return
    if (!canMoveTo(this.locations[location.x+1][location.y+1])) return
    this.runExcept(DIRECTIONS.UP_LEFT)
  }
  runUpRight() {
    const location = this.player.location
    if (location.x === 0) return
    if (location.y === this.height - 1) return
    if (!canMoveTo(this.locations[location.x+1][location.y-1])) return
    this.runExcept(DIRECTIONS.DOWN_LEFT)
  }
  runUpLeft() {
    const location = this.player.location
    if (location.x === 0) return
    if (location.y === 0) return
    if (!canMoveTo(this.locations[location.x-1][location.y-1])) return
    this.runExcept(DIRECTIONS.DOWN_RIGHT)
  }
  runRight() {
    const location = this.player.location
    if (location.x === this.width - 1) return
    if (!canMoveTo(this.locations[location.x+1][location.y])) return
    this.runExcept(DIRECTIONS.LEFT)
  }
  runExcept(exceptDirection) {
    const prefDir = exceptDirection.opp
    const location = this.player.location
    const possibleLocations = []
    if (location.type === 'floor') {
      if (exceptDirection !== DIRECTIONS.UP_LEFT) {
        const nextLoc = this.locations[location.x - 1][location.y - 1]
        if (canMoveTo(nextLoc)) {
          possibleLocations.push({
            location: nextLoc,
            moveDir: DIRECTIONS.UP_LEFT,
          })
        }
      }
      if (exceptDirection !== DIRECTIONS.UP_RIGHT) {
        const nextLoc = this.locations[location.x + 1][location.y - 1]
        if (canMoveTo(nextLoc)) {
          possibleLocations.push({
            location: nextLoc,
            moveDir: DIRECTIONS.UP_RIGHT,
          })
        }
      }
      if (exceptDirection !== DIRECTIONS.DOWN_RIGHT) {
        const nextLoc = this.locations[location.x + 1][location.y + 1]
        if (canMoveTo(nextLoc)) {
          possibleLocations.push({
            location: nextLoc,
            moveDir: DIRECTIONS.DOWN_RIGHT,
          })
        }
      }
      if (exceptDirection !== DIRECTIONS.DOWN_LEFT) {
        const nextLoc = this.locations[location.x - 1][location.y + 1]
        if (canMoveTo(nextLoc)) {
          possibleLocations.push({
            location: nextLoc,
            moveDir: DIRECTIONS.DOWN_LEFT,
          })
        }
      }
    }
    if (exceptDirection !== DIRECTIONS.UP) {
      const nextLoc = this.locations[location.x][location.y - 1]
      if (canMoveTo(nextLoc)) {
        possibleLocations.push({
          location: nextLoc,
          moveDir: DIRECTIONS.UP,
        })
      }
    }
    if (exceptDirection !== DIRECTIONS.DOWN) {
      const nextLoc = this.locations[location.x][location.y + 1]
      if (canMoveTo(nextLoc)) {
        possibleLocations.push({
          location: nextLoc,
          moveDir: DIRECTIONS.DOWN,
        })
      }
    }
    if (exceptDirection !== DIRECTIONS.LEFT) {
      const nextLoc = this.locations[location.x - 1][location.y]
      if (canMoveTo(nextLoc)) {
        possibleLocations.push({
          location: nextLoc,
          moveDir: DIRECTIONS.LEFT,
        })
      }
    }
    if (exceptDirection !== DIRECTIONS.RIGHT) {
      const nextLoc = this.locations[location.x + 1][location.y]
      if (canMoveTo(nextLoc)) {
        possibleLocations.push({
          location: nextLoc,
          moveDir: DIRECTIONS.RIGHT,
        })
      }
    }
    let destination = possibleLocations.find(loc => loc.moveDir === prefDir)
    if (!destination && possibleLocations.length === 1 && (location.isHallway || location.isDoor)) {
      destination = possibleLocations[0]
    }
    if (!destination) {
      return
    }
    const currentVisibleItems = this.player.getCurrentVisibleItems()
    const movedOntoItem = this.movePlayer(location, destination.location)
    if (movedOntoItem) {
      return
    }
    const newVisibility = !this.player.currentVisibilityMatches(currentVisibleItems)
    if (newVisibility) {
      return
    }
    if (this.messages.length > 0) {
      return
    }
    nextTick(() => {
      this.runExcept(destination.moveDir.opp)
    })
  }
  goDownStairs() {
    const location = this.player.location
    if (location.item?.type !== 'staircase') return
    this.level++
    this.startNewLevel()
  }
  moveUp() {
    const location = this.player.location
    if (location.y === 0) return
    this.movePlayer(location, this.locations[location.x][location.y-1])
  }
  moveDown() {
    const location = this.player.location
    if (location.y === this.height - 1) return
    this.movePlayer(location, this.locations[location.x][location.y+1])
  }
  moveLeft() {
    const location = this.player.location
    if (location.x === 0) return
    this.movePlayer(location, this.locations[location.x-1][location.y])
  }
  moveRight() {
    const location = this.player.location
    if (location.x === this.width - 1) return
    this.movePlayer(location, this.locations[location.x+1][location.y])
  }
  moveUpLeft() {
    const location = this.player.location
    if (location.x === 0) return
    if (location.y === 0) return
    this.movePlayer(location, this.locations[location.x - 1][location.y - 1])
  }
  moveDownLeft() {
    const location = this.player.location
    if (location.x === 0) return
    if (location.y === this.height - 1) return
    this.movePlayer(location, this.locations[location.x-1][location.y+1])
  }
  moveUpRight() {
    const location = this.player.location
    if (location.x === this.width - 1) return
    if (location.y === 0) return
    this.movePlayer(location, this.locations[location.x+1][location.y-1])
  }
  moveDownRight() {
    const location = this.player.location
    if (location.x === this.width - 1) return
    if (location.y === this.height - 1) return
    this.movePlayer(location, this.locations[location.x+1][location.y+1])
  }
  removeMonster(monster) {
    const index = this.characters.findIndex(m => {
      return toRaw(m) === monster
    })
    if (index < 0) {
      console.log('what, not found?!')
    } else {
      this.characters.splice(index, 1)
    }
    monster.location.character = null
    if (monster.items.length > 0) {
      if (monster.location.canPlaceItem) {
        monster.location.item = monster.items[0]
      }
    }
  }
  movePlayer(from, to) {
    to = this.player.getMoveToLocation(to)
    if (isDiagonalMove(from, to) && this.hasWallBetween(from, to)) {
      return
    }
    if (from !== to && to.character) {
      const damage = this.player.getDamageRoll()
      to.character.takeDamage(damage)
      this.addMessage('You hit the ' + to.character.monsterType.name)
      if (to.character.dead) {
        this.addMessage('You have defeated the ' + to.character.monsterType.name)
        this.player.experience += to.character.monsterType.exp
      }
      this.step()
      return
    }
    if (!canMoveTo(to)) return
    let x = from.x
    let y = from.y
    for (let i = Math.max(x - 1, 0); i < Math.min(x + 2, this.width); i++) {
      for (let j = Math.max(y - 1, 0); j < Math.min(y + 2, this.height); j++) {
        const location = this.locations[i][j]
        if (location.isFloor || location.isDoor) {
          if (to.room !== location.room) {
            location.show = location.show && (location.room.lit || location.isDoor || location.item?.type === 'staircase')
            location.showContent = location.item?.type === 'staircase'
          } else {
            location.show = location.show && (location.room?.lit || location.isDoor || location.item?.type === 'staircase')
            location.showContent = location.room?.lit || location.item?.type === 'staircase'
          }
        } else {
          location.showContent = location.item?.type === 'staircase'
        }
      }
    }
    if (from.room !== to.room) {
      if (from.room) {
        from.room.locations.filter(location => location.isFloor || location.isDoor).forEach(location => {
          location.show = location.show && (from.room.lit || location.isDoor || location.item?.type === 'staircase')
          location.showContent = location.item?.type === 'staircase'
        })
      }
    }
    x = to.x
    y = to.y
    for (let i = Math.max(x - 1, 0); i < Math.min(x + 2, this.width); i++) {
      for (let j = Math.max(y - 1, 0); j < Math.min(y + 2, this.height); j++) {
        const observedLocation = this.locations[i][j]
        if (to.isHallway && observedLocation.isWall) {
          continue
        }
        if (to.isHallway && Math.abs(i - x) + Math.abs(j - y) >= 2 && !observedLocation.isHallway) {
          continue
        }
        observedLocation.show = true
        observedLocation.showContent = true
      }
    }
    from.character = null
    to.character = this.player
    const movedOntoItem = this.player.moveTo(to)
    if (from.room !== to.room) {
      if (to.room && to.room.lit) {
        to.room.locations.forEach(location => {
          location.show = true
          location.showContent = true
        })
      }
    }
    this.step()
    return movedOntoItem
  }
  step() {
    this.player.takeTurn()
    this.characters.forEach(character => {
      if (this.player.hadHastedTurn && character.counts.haste < 1) {
        return
      }
      character.step()
    })
    this.wandererCount++
    this.player.wakeAdjacentEnemies()
  }
}
export default Game