<template>
  <div class="game-screen" @keydown="handleKeydown" tabindex="0" ref="screen">
    <template v-if="!mounted" />
    <template v-else>
      <OptionsScreen v-show="showOptions" />
      <MessagesScreen v-show="showMessages" />
      <DeathScreen v-show="showDeath" ref="deathScreen" :message="deathMessage" @restart="restart" :scores="deathScores"
        :scores-start-index="deathScoresStartIndex" />
      <InventoryScreen v-show="showInventory" :items="inventoryItems" />
      <DiscoveredScreen v-show="showDiscovered" :game="game" />
      <DungeonScreen v-show="showDungeon" :game="game" :show-coordinates="showCoordinates"
        :inventory-items="inventoryItems" :location-width="locationWidth" :location-height="locationHeight" />
      <WelcomeScreen v-show="showWelcome" @start-game="startGame" :scores="welcomeScores" ref="welcome" />
      <HelpScreen v-show="showHelp" />
    </template>
  </div>
</template>
<script>
import WelcomeScreen from './screens/Welcome.vue'
import MessagesScreen from './screens/Messages.vue'
import HelpScreen from './screens/Help.vue'
import InventoryScreen from './screens/Inventory.vue'
import DeathScreen from './screens/Death.vue'
import DungeonScreen from './screens/Dungeon.vue'
import DiscoveredScreen from './screens/Discovered.vue'
import OptionsScreen from './screens/Options.vue'

const fontRatio = 8 / 14
const MIN_LEFT_PANEL_WIDTH = 12
const BOTTOM_PANEL_HEIGHT = 2
const TOP_PANEL_HEIGHT = 1

const alphabet = 'abcdefghijklmnopqrstuvwxyz'
const audio = {
  itemPickup: new Audio('./view/assets/item-pickup.mp3'),
  hit: new Audio('./view/assets/hit.mp3')
}

const SCREENS = {
  WELCOME: 'welcome',
  HELP: 'help',
  INVENTORY: 'inventory',
  DEATH: 'death',
  DUNGEON: 'dungeon',
  DISCOVERED: 'discovered',
  OPTIONS: 'options',
  MESSAGES: 'messages'
}

const SCORES_STORAGE_KEY = 'rogue-scores'

export default {
  name: 'GameView',
  components: {
    WelcomeScreen,
    HelpScreen,
    InventoryScreen,
    DeathScreen,
    DungeonScreen,
    DiscoveredScreen,
    OptionsScreen,
    MessagesScreen,
  },
  props: {
    game: { type: Object, required: true },
    showCoordinates: { type: Boolean, default: false },
  },
  data() {
    return {
      screen: SCREENS.WELCOME,
      audio,
      locationWidth: 0,
      locationHeight: 0,
      scores: [],
      mounted: false,
      takingAction: false,
      deathScoreIndex: null,
      inventoryHighlightFunction: null,
      takeActionFunction: null
    }
  },
  computed: {
    playerPickedUpItem() {
      return this.game.playerPickedUpItem
    },
    showDungeon() {
      return this.screen === SCREENS.DUNGEON
    },
    showMessages() {
      return this.screen === SCREENS.MESSAGES
    },
    showWelcome() {
      return this.screen === SCREENS.WELCOME
    },
    showOptions() {
      return this.screen === SCREENS.OPTIONS
    },
    showDeath() {
      return this.screen === SCREENS.DEATH
    },
    showInventory() {
      return this.screen === SCREENS.INVENTORY
    },
    showDiscovered() {
      return this.screen === SCREENS.DISCOVERED
    },
    showHelp() {
      return this.screen === SCREENS.HELP
    },
    inventoryItems() {
      const items = this.game.player.items.map(item => {
        return {
          label: item.label,
          type: item.type
        }
      })
      if (this.inventoryHighlightFunction) {
        items.forEach(item => item.fade = !this.inventoryHighlightFunction(item))
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
    showLeftPanel() {
      const windowCols = Math.floor(window.innerWidth / this.locationWidth)
      return windowCols > this.game.width + MIN_LEFT_PANEL_WIDTH
    },
    welcomeScores() {
      if (!this.scores) {
        return []
      }
      return this.scores.slice(0, 5)
    },
    deathScoresStartIndex() {
      if (!this.deathScoreIndex) {
        return null
      }
      return Math.max(this.deathScoreIndex - 4, 0)
    },
    deathScores() {
      if (!this.scores) {
        return []
      }
      if (!this.deathScoresStartIndex) {
        return []
      }
      return this.scores.slice(this.deathScoresStartIndex, 9)
    },
    playerTookDamageRecently() {
      if (!this.player) {
        return false
      }
      return this.player.tookDamageRecently
    },
  },
  watch: {
    playerTookDamageRecently(val) {
      if (!val) {
        return
      }
      audio.hit.pause()
      audio.hit.load()
      audio.hit.play()
    },
    playerPickedUpItem(val) {
      if (!val) {
        return
      }
      audio.itemPickup.pause()
      audio.itemPickup.load()
      audio.itemPickup.play()
    },
    showDeathScreenTrigger(val) {
      if (val) {
        this.screen = SCREENS.DEATH
        this.$nextTick(() => {
          this.$refs.deathScreen.focus()
        })
        this.scores = (JSON.parse(window.localStorage.getItem(SCORES_STORAGE_KEY)) || []).filter(score => !!score.gold)
        const newScore = {
          name: this.game.playerName,
          gold: this.game.player.gold,
          causeOfDeath: this.game.player.latestDamageCause,
          level: this.game.level
        }
        this.scores.push(newScore)
        this.scores = this.scores.sort((a, b) => b.gold - a.gold)
        this.deathScoreIndex = this.scores.findIndex(score => score === newScore)
        window.localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(this.scores))
      }
    },
    showWelcome(val) {
      if (val) {
        this.$refs.welcome.focusInput()
      }
    }
  },
  mounted() {
    this.setFontSize()
    const resizeObserver = new ResizeObserver(() => {
      this.setFontSize()
    })
    resizeObserver.observe(this.$refs.screen)
    this.scores = (JSON.parse(window.localStorage.getItem(SCORES_STORAGE_KEY)) || []).filter(score => !!score.gold)
    this.scores = this.scores.sort((a, b) => b.gold - a.gold)
    this.mounted = true
  },
  methods: {
    setFontSize() {
      const PADDING = 1
      let width = window.innerWidth / this.game.width + 2 * PADDING
      let height = window.innerHeight / (this.game.height + BOTTOM_PANEL_HEIGHT + TOP_PANEL_HEIGHT + 2 * PADDING)
      const ratio = width / height
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
      this.screen = SCREENS.WELCOME
    },
    startGame(name) {
      this.game.restart()
      this.game.playerName = name
      this.game.greetPlayer()
      this.screen = SCREENS.DUNGEON
      this.$nextTick(() => {
        this.$refs.screen.focus()
      })
    },
    dropPrompt() {
      if (!this.game.player.canDrop) {
        return
      }
      this.takingAction = true
      this.takeActionFunction = index => this.game.dropItem(index)
      this.game.messages.push('Drop: enter a letter, * for inventory, or Esc to cancel')
    },
    quaffPrompt() {
      this.takingAction = true
      this.inventoryHighlightFunction = item => item.type === 'potion'
      this.takeActionFunction = index => this.game.quaffItem(index)
      this.game.messages.push('Quaff: enter a letter, * for inventory, or Esc to cancel')
    },
    readPrompt() {
      this.takingAction = true
      this.inventoryHighlightFunction = item => item.type === 'scroll'
      this.takeActionFunction = index => {
        const scroll = this.game.player.items[index]
        if (scroll.type !== 'scroll') {
          this.game.addMessage('You cannot read that')
          return
        }
        this.game.readScroll(scroll, index)
      }
      this.game.messages.push('Read: enter a letter, * for inventory, or Esc to cancel')
    },
    eatPrompt() {
      this.takingAction = true
      this.inventoryHighlightFunction = item => item.type === 'food'
      this.takeActionFunction = index => this.game.player.eat(this.game.player.items[index])
      this.game.messages.push('Eat: enter a letter, * for inventory, or Esc to cancel')
    },
    wieldPrompt() {
      this.takingAction = true
      this.inventoryHighlightFunction = item => item.type === 'weapon'
      this.takeActionFunction = index => this.game.player.wield(this.game.player.items[index])
      this.game.messages.push('Wield: enter a letter, * for inventory, or Esc to cancel')
    },
    wearingArmorPrompt() {
      if (this.game.player.armor) {
        this.game.messages.push('you are already wearing some ' + this.game.player.armor.label + '. You\'ll have to take it off first')
        return
      }
      this.takingAction = true
      this.inventoryHighlightFunction = item => item.type === 'armor'
      this.takeActionFunction = index => this.game.player.wearArmor(this.game.player.items[index])
      this.game.messages.push('Wear armor: enter a letter, * for inventory, or Esc to cancel')
    },
    handleTakingActionKeyDown(event) {
      if (this.showInventory) {
        this.screen = SCREENS.DUNGEON
      }
      if (event.key === '*') {
        this.screen = SCREENS.INVENTORY
        return
      }
      if (event.key === 'Escape' && !this.showInventory) {
        this.game.clearCurrentMessage()
        this.takingAction = false
        this.inventoryHighlightFunction = null
        this.takeActionFunction = null
        return
      }
      const index = alphabet.indexOf(event.key)
      if (index > -1 && index < this.game.player.items.length && this.takeActionFunction) {
        this.takeActionFunction(index)
        this.takingAction = false
        this.game.clearCurrentMessage()
      }
    },
    handleKeydown(event) {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }
      if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
        return
      }
      if (this.showHelp) {
        this.showHelp = false
        return
      }
      this.game.prepareTurn()
      if (this.takingAction) {
        this.handleTakingActionKeyDown(event)
        return
      }
      if (this.game.messages.length > 1 && event.key !== ' ') {
        return
      }
      if (this.game.messages.length === 1) {
        this.game.clearCurrentMessage()
      }
      if (this.showInventory) {
        this.screen = SCREENS.DUNGEON
        return
      }
      if (this.showOptions) {
        this.screen = SCREENS.DUNGEON
        return
      }
      if (this.showDiscovered) {
        this.screen = SCREENS.DUNGEON
        return
      }
      switch (event.key) {
        case 'F4':
          this.game.showMostRecentMessage()
          break
        case 'F1':
        case '?':
          this.screen = SCREENS.HELP
          break
        case 'F6':
        case 'D':
          this.screen = SCREENS.DISCOVERED
          break
        case 'o':
          this.screen = SCREENS.OPTIONS
          break
        case 'r':
          this.readPrompt()
          break
        case 'e':
          this.eatPrompt()
          break
        case 'i':
          this.screen = SCREENS.INVENTORY
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
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  justify-content: center;
  padding: 1rem;
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