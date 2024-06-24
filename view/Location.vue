<template>
  <div
    :style="locationStyle"
    class="location"
    :class="locationClasses"
    v-html="content"
  />
</template>
<script>
const NO_CHARACTER = -1

export default {
  name: 'GameLocation',
  props: {
    location: { type: Object, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required : true }
  },
  data() {
    return {
      showHealing: false,
      showHurting: false,
      noTransition: true,
      showTransition: false,
    }
  },
  computed: {
    character() {
      return this.location.character
    },
    charTookDamage() {
      if (!this.character) {
        return false
      }
      return this.character.tookDamageRecently
    },
    locationClasses() {
      const location = this.location
      const classes = {}
      if (location.showContent && location.item?.type === 'staircase' && !location.character) {
        classes.flashing = true
      }
      if (location.show && !location.showContent && location.item?.type === 'staircase') {
        classes.flashing = true
      }
      classes.hurting = this.charTookDamage
      return classes
    },
    content() {
      const location = this.location
      if (!location.show) {
        if (location.marked) {
          return '&#8231;'
        }
        return ''
      }
      if (location.showContent) {
        if (location.character?.monsterType) {
          return location.character.monsterType.label
        }
        if (location.character) {
          return '&#x263A;'
        }
        if (location.item) {
          switch (location.item.type) {
            case 'food':
              return '&#x2663'
            case 'stick':
              return '&#x03C4;'
            case 'scroll':
              return '&#x266A;'
            case 'potion':
              return '&#x0021;'
            case 'weapon':
              return '&#x2191;'
            case 'ring':
              return '&#x25CB;'
            case 'gold':
              return '&#x263C;'
            case 'armor':
              return '&#x25D8;'
            case 'staircase':
              return '&#x2630;'
            case 'trap': {
              if (!location.item.discovered) {
                return '&#8231;'
              }
              return '&#x2666;'
            }
          }
        }
      }
      if (location.item?.type === 'staircase') {
        return '&#x2630;'
      }
      switch (location.type) {
        case 'hallway': {
          if (location.marked) {
            return '&#8231;'
          }
          return ''
        }
        case 'floor':
          return '&#8231;'
        case 'upLeftWall':
          return '&#x255D;'
        case 'upRightWall':
          return '&#x255A;'
        case 'downLeftWall':
          return '&#x2557;'
        case 'downRightWall':
          return '&#x2554;'
        case 'horizontalWall':
          return '&#x2550;'
        case 'verticalWall':
          return '&#x2551;'
        case 'door':
          return '&#x256C;'
        default:
          return ''
      }
    },
    bgColor() {
      const location = this.location
      if (!location.show) {
        return 'black'
      }
      if (location.showContent) {
        if (location.character) {
          if (location.type === 'hallway') {
            return '#b3b3b3'
          }
          return 'black'
        }
      }
      if (location.type === 'hallway') {
        return 'grey'
      }
      if (location.item?.type === 'staircase') {
        return 'lightgreen'
      }
      return ''
    },
    color() {
      const location = this.location
      if (location.show) {
        if (location.showContent) {
          if (location.character) {
            if (location.character?.monsterType) {
              if (location.type === 'hallway') {
                return 'black'
              }
              return '#aaaaaa'
            }
            return 'yellow'
          }
          if (location.item) {
            switch (location.item.type) {
              case 'potion':
                return location.item.potionType.color
              case 'ring':
              case 'weapon':
              case 'stick':
              case 'armor':
              case 'scroll':
                return '#5555ff'
              case 'gold':
                return '#ffff05'
              case 'food':
                return '#ba0000'
              case 'staircase':
                return 'black'
              case 'trap': {
                if (location.item.discovered) {
                  return '#ba00b0'
                }
              }
            }
          }
        }
        if (location.item?.type === 'staircase') {
          return 'black'
        }
      }
      if (location.type === 'floor') {
        if (location.marked) {
          return 'darkgrey'
        }
        return '#00ff34'
      }
      if (location.type === 'hallway' && location.marked) {
        return 'darkgrey'
      }
      if (location.type !== 'floor') return '#b74f00'
      return
    },
    locationStyle() {
      const location = this.location
      const style = {
        color: this.color,
        top: location.y * this.height + 'px',
        left: location.x * this.width + 'px',
      }
      if (!this.charTookDamage) {
        style['background-color'] = this.bgColor
      }
      return style
    }
  },
}
</script>
<style scoped>
.hurting {
  animation: pulse-hurting 0.5s;
}
.location {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}
@keyframes pulse-flashing {
  0%   {color: transparent;}
  49%  {color:transparent;}
  50% {color:black;}
  100% {color:black;}
}
.flashing {
  animation-name: pulse-flashing;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}
@keyframes pulse-hurting {
  0% {
    background-color: red;
  }
  100% {
    background-color: v-bind(bgColor);
  }
}
</style>