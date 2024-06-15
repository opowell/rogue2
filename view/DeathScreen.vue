<template>
  <div class="death-screen">
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
}
</script>
<style scoped>
.death-screen {
  color: lightgray;
}
</style>