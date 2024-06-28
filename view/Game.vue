<template>
  <div class="game-screen" @keydown="handleKeydown" tabindex="0" ref="screen">
    <template v-if="!mounted" />
    <template v-else-if="showOptions">
      <OptionsScreen />
    </template>
    <template v-else-if="gameFinished">
      <DeathScreen ref="deathScreen" :message="deathMessage" @restart="restart" :scores="scores" />
    </template>
    <template v-else-if="showInventory">
      <InventoryScreen :items="inventoryItems" />
    </template>
    <DungeonScreen v-show="showGame" :game="game" :show-coordinates="showCoordinates" :inventory-items="inventoryItems" :location-width="locationWidth" :location-height="locationHeight" />
    <WelcomeScreen v-show="showWelcome" @start-game="startGame" :scores="scores" />
  </div>
</template>
<script>
import WelcomeScreen from './screens/Welcome.vue'
import InventoryScreen from './screens/Inventory.vue'
import DeathScreen from './screens/Death.vue'
import DungeonScreen from './screens/Dungeon.vue'
import OptionsScreen from './screens/Options.vue'

const fontRatio = 8/14
const MIN_LEFT_PANEL_WIDTH = 12
const BOTTOM_PANEL_HEIGHT = 2
const TOP_PANEL_HEIGHT = 1

export default {
  name: 'GameScreen',
  components: {
    WelcomeScreen,
    InventoryScreen,
    DeathScreen,
    DungeonScreen,
    OptionsScreen,
  },
  props: {
    game: { type: Object, required: true },
    showCoordinates: { type: Boolean, default: false },
  },
  data() {
    return {
      alphabet: 'abcdefghijklmnopqrstuvwxyz',
      showMap: true,
      dropping: false,
      quaffing: false,
      wearingArmor: false,
      gameStarted: false,
      gameFinished: false,
      showInventory: false,
      locationWidth: 0,
      locationHeight: 0,
      showOptions: false,
      scores: [],
      mounted: false
    }
  },
  computed: {
    showGame() {
      return !this.showOptions && !this.showInventory && !this.gameFinished && this.gameStarted
    },
    showWelcome() {
      return !this.showOptions && !this.showInventory && !this.gameFinished && !this.gameStarted
    },
    inventoryItems() {
      const items = this.game.player.items.map(item => {
        return {
          label: item.label,
          type: item.type
        }
      })
      if (this.showInventory) {
        items.forEach(item => item.fade = item.type !== 'potion')
      }
      return items
    },
    fontSize() {
      return this.locationHeight + 'px'
    },
    showDeathScreenTrigger() {
      return this.game.playerDead && this.game.messages.length < 2
    },
    deathMessage() {
      return this.game.playerName + ' ' + this.game.player.latestDamageCause + ' on level ' + this.game.level
    },
    player() {
      return this.game?.player
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
      return this.locationWidth * this.game.width + 'px'
    },
    showLeftPanel() {
      const windowCols = Math.floor(window.innerWidth / this.locationWidth)
      return windowCols > this.game.width + MIN_LEFT_PANEL_WIDTH
    }
  },
  watch: {
    showDeathScreenTrigger(val) {
      if (val) {
        this.gameFinished = true
        this.gameStarted = false
        this.$nextTick(() => {
          this.$refs.deathScreen.focus()
        })
        this.scores = JSON.parse(window.localStorage.getItem('scores')) || []
        this.scores.push({
          name: this.game.playerName,
          gold: this.game.player.gold,
          causeOfDeath: this.game.player.latestDamageCause,
          level: this.game.level
        })
        this.scores = this.scores.sort((a, b) => b.gold - a.gold)
        window.localStorage.setItem('scores', JSON.stringify(this.scores))
      }
    }
  },
  mounted() {
    this.setFontSize()
    const resizeObserver = new ResizeObserver(() => {
      this.setFontSize()
    })
    resizeObserver.observe(this.$refs.screen)
    this.scores = JSON.parse(window.localStorage.getItem('scores')) || []
    this.scores = this.scores.sort((a, b) => b.gold - a.gold)
    this.mounted = true
  },
  methods: {
    setFontSize() {
      let width = window.innerWidth / this.game.width
      let height = window.innerHeight / (this.game.height + BOTTOM_PANEL_HEIGHT + TOP_PANEL_HEIGHT)
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
      this.game.messages.push('Quaff: enter a letter, * for inventory, or Esc to cancel')
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
      if (event.key === '*') {
        this.showInventory = true
        return
      }
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
      this.game.prepareTurn()
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
input {
  font-size: v-bind(locationHeight);
}
</style>
<style scoped>
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
  justify-content: center;
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
</style>