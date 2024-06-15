<template>
  <div ref="el" class="death-screen" tabindex="0" @keydown="handleKeydown">
    <div>{{ message }}</div>
    <div>Press Enter to continue</div>
  </div>
</template>
<script>
export default {
  name: 'DeathScreen',
  props: {
    message: { type: String, required: true }
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
    }
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
</style>