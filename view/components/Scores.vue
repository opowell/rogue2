<template>
  <div class="hall">Hall of fame</div>
  <div class="scores">
    <div v-for="(score, index) in scores" :key="index" class="score" v-html="label(score)" />
  </div>
</template>
<script>

export default {
  name: 'Scores',
  props: {
    scores: { type: Array, required: true },
  },
  computed: {
    goldDigits() {
      return Math.max(...this.scores.map(score => score.gold.toString().length))
    }
  },
  methods: {
    label(score) {
      const gold = String(score.gold).padStart(this.goldDigits, 'x').replaceAll('x', '&nbsp;')
      return gold + ' gold - ' + score.name + ', ' + score.causeOfDeath + ' on level ' + score.level
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