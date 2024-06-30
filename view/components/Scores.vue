<template>
  <div class="hall">Hall of fame</div>
  <div class="scores">
    <div v-for="(score, index) in scores" :key="index" class="score" v-html="label(score, index)" />
  </div>
</template>
<script>
import { COLORS, CONTENT } from '../constants.js'
export default {
  name: 'Scores',
  props: {
    scores: { type: Array, required: true },
    startIndex: { type: Number, default: 1 }
  },
  computed: {
    goldDigits() {
      return Math.max(...this.scores.map(score => score.gold.toString().length))
    }
  },
  methods: {
    label(score, index) {
      index = this.startIndex + index
      const gold = String(score.gold).padStart(this.goldDigits, 'x').replaceAll('x', '&nbsp;')
      const goldDiv = gold + '<div style="color: ' + COLORS.GOLD + '">' + CONTENT.GOLD + '</div>'
      return '#' + index + '&nbsp;' + goldDiv + '&nbsp;' + score.name + ', ' + score.causeOfDeath + ' on level ' + score.level
    }
  }
}
</script>
<style scoped>
.hall {
  color: lightgray;
}
.scores {
  color: darkgray;
  display: flex;
  flex-direction: column;
}
.score {
  display: flex;
}
</style>