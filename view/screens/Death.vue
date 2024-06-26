<template>
  <div ref="el" class="death-screen" tabindex="0" @keydown="handleKeydown">
    <ScoresComponent :scores />
    <div class="message">{{ message }}</div>
    <div>Press Enter to continue</div>
  </div>
</template>
<script>
import ScoresComponent from '../components/Scores.vue'
export default {
  name: 'DeathScreen',
  components: {
    ScoresComponent
  },
  props: {
    message: { type: String, required: true },
    scores: { type: Array, required: true }
  },
  methods: {
    handleKeydown(e) {
      if (e.code === 'Enter') {
        this.$emit('restart')
        e.preventDefault()
      }
    },
    focus() {
      this.$refs.el.focus()
    },
  }
}
</script>
<style scoped>
.death-screen {
  color: lightgray;
}
.death-screen:focus-visible {
  outline: none;
}
.message {
  margin-top: 2rem;
}
</style>