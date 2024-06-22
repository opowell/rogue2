<template>
  <div class="game-screen" @keydown="handleKeydown" tabindex="0" ref="screen">
    <template v-if="showOptions">
      <OptionsScreen />
    </template>
    <template v-else-if="gameFinished">
      <DeathScreen ref="deathScreen" :message="deathMessage" @restart="restart" />
    </template>
    <template v-else-if="showInventory">
      <InventoryScreen :game="game" />
    </template>
    <template v-else-if="gameStarted">
      <div class="column1">
        <div v-if="player" class="section">
          <div class="section-title">Player</div>
          <div v-for="item in characterItems" class="section-row" :key="item.label">
            <div class="section-row-label">{{ item.label }}</div>
            <div class="section-row-value">{{ item.value }}</div>
          </div>
        </div>
        <InventoryComponent :game="game" />
      </div>
      <div class="column2">
        <GameMessage :message="message" :show-more="game.messages.length > 1" :height="locationHeight" class="message"/>
        <div v-if="showMap" class="map">
          <template v-if="showCoordinates">
            <GameCoordinate
              v-for="coordinate in gameCoordinates"
              :key="coordinate.x + '-' + coordinate.y"
              :coordinate="coordinate"
              :width="locationWidth"
              :height="locationHeight"
            />
          </template>
          <GameLocation
            v-for="location in visibleLocations"
            :key="location.x + '-' + location.y"
            :location="location"
            :width="locationWidth"
            :height="locationHeight"
          />
        </div>
      </div>
    </template>
    <template v-else>
      <WelcomeScreen @start-game="startGame" />
    </template>
  </div>
</template>
<script>
import WelcomeScreen from './screens/Welcome.vue'
import InventoryComponent from './components/Inventory.vue'
import InventoryScreen from './screens/Inventory.vue'
import Coordinate from './Coordinate.vue'
import Location from './Location.vue'
import Message from './Message.vue'
import DeathScreen from './screens/Death.vue'
import OptionsScreen from './screens/Options.vue'

const fontRatio = 8/14

export default {
  name: 'GameScreen',
  components: {
    GameLocation: Location,
    GameMessage: Message,
    GameCoordinate: Coordinate,
    WelcomeScreen,
    InventoryScreen,
    DeathScreen,
    OptionsScreen,
    InventoryComponent
  },
  props: {
    game: { type: Object, required: true },
    showCoordinates: { type: Boolean, default: false },
  },
  data() {
    const gameCoordinates = []
    for (let i = 0; i < this.game.width; i++) {
      gameCoordinates.push({
        x: i,
        y: -1,
        label: i
      })
    }
    for (let i = 0; i < this.game.height; i++) {
      gameCoordinates.push({
        x: -1,
        y: i,
        label: i
      })
    }

    return {
      alphabet: 'abcdefghijklmnopqrstuvwxyz',
      showMap: true,
      dropping: false,
      quaffing: false,
      wearingArmor: false,
      gameCoordinates,
      gameStarted: false,
      gameFinished: false,
      showInventory: false,
      locationWidth: 0,
      locationHeight: 0,
      showOptions: false
    }
  },
  computed: {
    fontSize() {
      return this.locationHeight + 'px'
    },
    showDeathScreenTrigger() {
      console.log(this.game.playerDead, this.game.messages.length)
      return this.game.playerDead.value && this.game.messages.length < 2
    },
    deathMessage() {
      return this.game.playerName + ' ' + this.game.player.latestDamageCause + ' on level ' + this.game.level
    },
    player() {
      return this.game?.player
    },
    characterItems() {
      const player = this.player
      if (!player) return []
      return [
        {
          label: 'Level',
          value: this.game.level
        },
        {
          label: 'Hits',
          value: player.hits.current + '(' + player.hits.maximum + ')'
        },
        {
          label: 'Str',
          value: player.strength.current + '(' + player.strength.maximum + ')'
        },
        {
          label: 'Gold',
          value: player.gold
        },
        {
          label: 'Damage',
          value: player.damage
        },
        {
          label: 'Armor',
          value: player.armorLevel
        },
        {
          label: 'Exp',
          value: player.level + '/' + player.experience
        }
      ]
    },
    message() {
      if (this.game.messages.length > 0) {
        return this.game.messages[0]
      }
      return ''
    },
    locations() {
      return this.game.locations.flat()
    },
    visibleLocations() {
      return this.locations
      // return this.locations.filter(location => {
      //   return location.visible ||
      //     (
      //       location.mapped &&
      //       (
      //         location.room?.lit ||
      //         location.item?.type === 'staircase'
      //       )
      //     )
      // })
    },
    mapWidth() {
      return this.locationWidth * 80 + 'px'
    }
  },
  watch: {
    showDeathScreenTrigger(val) {
      if (val) {
        this.gameFinished = true
        this.gameStarted = false
        this.$nextTick(() => {
          console.log(this, this.$refs, this.$refs.deathScreen)
          this.$refs.deathScreen.focus()
        })
      }
    }
  },
  mounted() {
    this.setFontSize()
    const resizeObserver = new ResizeObserver(() => {
      this.setFontSize()
    })
    resizeObserver.observe(this.$refs.screen)
  },
  methods: {
    setFontSize() {
      let width = window.innerWidth / 80
      let height = window.innerHeight / 28
      const ratio = width/height
      if (ratio < fontRatio) {
        width = Math.floor(width)
        height = width / fontRatio
      } else {
        height = Math.floor(height)
        width = height * fontRatio
      }
      this.locationWidth = width
      this.locationHeight = height
    },
    restart() {
      this.gameFinished = false
    },
    startGame(name) {
      this.game.restart()
      this.game.playerName = name
      this.game.greetPlayer()
      this.gameStarted = true
      this.$nextTick(() => {
        this.$refs.screen.focus()
      })
    },
    dropPrompt() {
      if (!this.game.player.canDrop) {
        return
      }
      this.dropping = true
      this.game.messages.push('Drop: enter a letter, or Esc to cancel')
    },
    quaffPrompt() {
      this.quaffing = true
      this.game.messages.push('Quaff: enter a letter, or Esc to cancel')
    },
    wieldPrompt() {
      this.wielding = true
      this.game.messages.push('Wield: enter a letter, or Esc to cancel')
    },
    wearingArmorPrompt() {
      this.wearingArmor = true
      this.game.messages.push('Wear armor: enter a letter, or Esc to cancel')
    },
    handleQuaffingKeyDown(event) {
      if (event.key === 'Escape') {
        this.game.clearCurrentMessage()
        this.quaffing = false
        return
      }
      const index = this.alphabet.indexOf(event.key)
      if (index > -1 && index < this.game.player.items.length) {
        this.game.quaffItem(index)
        this.quaffing = false
        this.game.clearCurrentMessage()
      }
    },
    handleDroppingKeyDown(event) {
      if (event.key === 'Escape') {
        this.game.clearCurrentMessage()
        this.dropping = false
        return
      }
      const index = this.alphabet.indexOf(event.key)
      if (index > -1 && index < this.game.player.items.length) {
        this.game.dropItem(index)
        this.dropping = false
        this.game.clearCurrentMessage()
      }
    },
    handleWearingArmorKeyDown(event) {
      if (event.key === 'Escape') {
        this.game.clearCurrentMessage()
        this.wearingArmor = false
        return
      }
      const index = this.alphabet.indexOf(event.key)
      if (index > -1 && index < this.game.player.items.length) {
        this.game.player.wearArmor(this.game.player.items[index])
        this.wearingArmor = false
        this.game.clearCurrentMessage()
      }
    },
    handleWieldingKeyDown(event) {
      if (event.key === 'Escape') {
        this.game.clearCurrentMessage()
        this.wielding = false
        return
      }
      const index = this.alphabet.indexOf(event.key)
      if (index > -1 && index < this.game.player.items.length) {
        this.game.player.wield(this.game.player.items[index])
        this.wielding = false
        this.game.clearCurrentMessage()
      }
    },
    handleKeydown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }
      if (this.wearingArmor) {
        this.handleWearingArmorKeyDown(event)
        return
      }
      if (this.quaffing) {
        this.handleQuaffingKeyDown(event)
        return
      }
      if (this.dropping) {
        this.handleDroppingKeyDown(event)
        return
      }
      if (this.wielding) {
        this.handleWieldingKeyDown(event)
        return
      }
      if (this.game.messages.length > 1 && event.key !== ' ') {
        return
      }
      if (this.game.messages.length === 1) {
        this.game.clearCurrentMessage()
      }
      if (this.showInventory) {
        this.showInventory = false
        return
      }
      switch (event.key) {
        case 'o':
          this.showOptions = true
          break
        case 'i':
          this.showInventory = true
          break
        case 'q':
          this.quaffPrompt()
          break
        case ':':
          this.game.goDownStairs()
          break
        case ' ':
          event.preventDefault()
          this.game.clearCurrentMessage()
          break
        case 'H':
          this.game.runLeft()
          break
        case 'B':
          this.game.runDownLeft()
          break
        case 'Z':
          this.game.runUpLeft()
          break
        case 'N':
          this.game.runDownRight()
          break
        case 'U':
          this.game.runUpRight()
          break
        case 'J':
          this.game.runDown()
          break
        case 'K':
          this.game.runUp()
          break
        case 'L':
          this.game.runRight()
          break
        case 'h':
          this.game.moveLeft()
          break
        case 'j':
          this.game.moveDown()
          break
        case 'k':
          this.game.moveUp()
          break
        case 'l':
          this.game.moveRight()
          break
        case 'z':
          this.game.moveUpLeft()
          break
        case 'b':
          this.game.moveDownLeft()
          break
        case 'u':
          this.game.moveUpRight()
          break
        case 'n':
          this.game.moveDownRight()
          break
        case 'd':
          this.dropPrompt()
          break
        case 'w':
          this.wieldPrompt()
          break
        case 'T':
          this.game.player.takeOffArmor()
          break
        case 'W':
          this.wearingArmorPrompt()
          break
        case '.':
          this.game.rest()
          break
      }
    }
  }
}
</script>
<style>
.location {
  width: v-bind(locationWidth);
  height: v-bind(locationHeight);
}
</style>
<style scoped>
.section-title {
  color: #555;
}
.section-row {
  display: flex;
  color: lightgray;
}
.section-row-label {
  flex: 1 1 auto;
}
.section-row-value {
  flex: 0 0 auto;
}
.column1 {
  flex: 1 1 auto;
  gap: 1rem;
  display: flex;
  flex-direction: column;
}
.column2 {
  flex: 0 0 v-bind(mapWidth);
  display: flex;
  flex-direction: column;
}
.game-screen {
  background-color: black;
  font-family: IBMVGA8;
  font-size: v-bind(fontSize);
  display: flex;
  gap: 2rem;
  padding: 1rem;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
@font-face {
  font-family: "IBMVGA8";
  /* src: url("WebPlus_IBM_VGA_9x16.woff") format('woff'); */
  /* src: url("WebPlus_IBM_VGA_9x14.woff") format('woff'); */
  /* src: url("WebPlus_IBM_VGA_8x14.woff") format('woff'); */
  src: url("Web437_IBM_VGA_8x14.woff") format('woff');
  /* src: url("Web437_IBM_VGA_9x14.woff") format('woff'); */
  /* src: url("Web437_IBM_VGA_9x16.woff") format('woff'); */
}
.map {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.message {
  flex: 0 0 auto;
}
</style>