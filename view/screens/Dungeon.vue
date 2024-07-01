<template>
  <div class="dungeon">
    <div v-if="showSidePanels" class="column1">
      <div v-if="player" class="section">
        <div class="section-title">Player</div>
        <div v-for="item in characterItems" class="section-row" :key="item.label">
          <div class="section-row-label">{{ item.label }}</div>
          <div class="section-row-value" v-html="item.value" />
        </div>
      </div>
    </div>
    <div class="column2">
      <GameMessage :message="game.message" :show-more="game.messages.length > 1" :height="locationHeight" class="message" />
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
      <div v-if="!showSidePanels" class="bottom-panel">
        <div v-for="item in characterItems" class="section-bottom-row" :key="item.label">
          <div class="section-bottom-row-label">{{ item.label }}:</div>
          <div class="section-bottom-row-value" v-html="item.value" />
        </div>
      </div>
    </div>
    <div v-if="showSidePanels" class="column1">
      <InventoryComponent :items="inventoryItems" />
    </div>
  </div>
</template>
<script>
import InventoryComponent from '../components/Inventory.vue'
import Coordinate from '../components/Coordinate.vue'
import Location from '../components/Location.vue'
import Message from '../components/Message.vue'

const MIN_LEFT_PANEL_WIDTH = 12

export default {
  name: 'DungeonScreen',
  components: {
    GameLocation: Location,
    GameMessage: Message,
    GameCoordinate: Coordinate,
    InventoryComponent
  },
  props: {
    game: { type: Object, required: true },
    showCoordinates: { type: Boolean, default: false },
    inventoryItems: { type: Array, required: true },
    locationWidth: { type: Number, required: true },
    locationHeight: { type: Number, required: true },
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
      gameCoordinates,
      showOptions: false,
    }
  },
  computed: {
    fontSize() {
      return this.locationHeight + 'px'
    },
    player() {
      return this.game?.player
    },
    characterItems() {
      const player = this.player
      if (!player) return []
      let hitsValue = player.hits.current + '(' + player.hits.maximum + ')'
      if (!this.showSidePanels) {
        const curHits = String(player.hits.current).padStart(2, 'x').replaceAll('x', '&nbsp;')
        hitsValue = curHits + '(' + player.hits.maximum + ')'
      }
      return [
        {
          label: 'Level',
          value: this.game.level
        },
        {
          label: 'Hits',
          value: hitsValue
        },
        {
          label: 'Str',
          value: player.strength.current + '(' + player.strength.maximum + ')'
        },
        {
          label: 'Gold',
          value: String(player.gold).padStart(3, 'x').replaceAll('x', '&nbsp;')
        },
        // {
        //   label: 'Damage',
        //   value: player.damage
        // },
        {
          label: 'Food',
          value: player.foodLeft
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
    showSidePanels() {
      const windowCols = Math.floor(window.innerWidth / this.locationWidth)
      return windowCols > this.game.width + 2*MIN_LEFT_PANEL_WIDTH
    }
  },
}
</script>
<style scoped>
.dungeon {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  justify-content: center;
}
.section-title {
  color: #555;
}
.section-row {
  display: flex;
  color: lightgray;
}
.bottom-panel {
  display: flex;
  grid-gap: 2rem;
  color: #ffff05;
}
.section-bottom-row {
  display: flex;
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