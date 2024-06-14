<template>
  <div class="game-screen" @keydown="handleKeydown" tabindex="0" ref="screen">
    <div class="column1">
      <div v-if="player" class="section">
        <div class="section-title">Player</div>
        <div v-for="item in characterItems" class="section-row" :key="item.label">
          <div class="section-row-label">{{ item.label }}</div>
          <div class="section-row-value">{{ item.value }}</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Inventory</div>
        <div class="section-row" v-for="(item, index) in game.player.items" :key="index">
          <div class="section-row-label">{{ alphabet[index] + ') ' + (item.label || item.type) }}</div>
        </div>
      </div>
    </div>
    <div class="column2">
      <GameMessage :message="message" :show-more="game.messages.length > 1"/>
      <div v-if="showMap" class="map">
        <!-- <GameCoordinate
          v-for="coordinate in gameCoordinates"
          :key="coordinate.x + '-' + coordinate.y"
          :coordinate="coordinate"
        /> -->
        <GameLocation
          v-for="location in visibleLocations"
          :key="location.x + '-' + location.y"
          :location="location"
        />
      </div>
    </div>
  </div>
</template>
<script>
// import Coordinate from './Coordinate.vue'
import Location from './Location.vue'
import Message from './Message.vue'
const LOCATION = {
  WIDTH: 16,
  HEIGHT: 28
}
export default {
  name: 'GameScreen',
  components: {
    GameLocation: Location,
    GameMessage: Message,
    // GameCoordinate: Coordinate,
  },
  props: {
    game: { type: Object, required: true }
  },
  data() {
    // const gameCoordinates = []
    // for (let i = 0; i < game.width; i++) {
    //   gameCoordinates.push({
    //     x: i,
    //     y: -1,
    //     label: i
    //   })
    // }
    // for (let i = 0; i < game.height; i++) {
    //   gameCoordinates.push({
    //     x: -1,
    //     y: i,
    //     label: i
    //   })
    // }

    return {
      alphabet: 'abcdefghijklmnopqrstuvwxyz',
      showMap: true,
      dropping: false,
      quaffing: false,
      wearingArmor: false,
      // gameCoordinates
    }
  },
  computed: {
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
          label: 'Strength',
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
    screenWidth() {
      return this.game.width * LOCATION.WIDTH + 'px'
    },
    screenHeight() {
      return this.game.height * LOCATION.HEIGHT + 'px'
    }
  },
  mounted() {
    this.$refs.screen.focus()
  },
  methods: {
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
      switch (event.key) {
        case 'q':
          this.quaffPrompt()
          break
        case ':':
          this.game.goDownStairs()
          break
        case ' ':
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
      }
    }
  }
}
</script>
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
  flex: 0 0 210px;
  gap: 1rem;
  display: flex;
  flex-direction: column;
}
.column2 {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
}
.game-screen {
  font-size: 1.2rem;
  background-color: black;
  font-family: IBMVGA8;
  display: flex;
  gap: 2rem;
  padding: 1rem;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
}
@font-face {
  font-family: "IBMVGA8";
  /* src: url("WebPlus_IBM_VGA_9x16.woff") format('woff'); */
  /* src: url("WebPlus_IBM_VGA_9x14.woff") format('woff'); */
  /* src: url("WebPlus_IBM_VGA_8x14.woff") format('woff'); */
  /* src: url("Web437_IBM_VGA_8x14.woff") format('woff'); */
  /* src: url("Web437_IBM_VGA_9x14.woff") format('woff'); */
  src: url("Web437_IBM_VGA_9x16.woff") format('woff');
}
.map {
  width: v-bind(screenWidth);
  height: v-bind(screenHeight);
  position: relative;
}
</style>