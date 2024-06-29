<template>
  <div class="title">
    <DiscoveredComponent :game="game" />
  </div>
</template>
<script>
import DiscoveredComponent from '../components/Discovered.vue'
export default {
  name: 'DiscoveredScreen',
  components: {
    DiscoveredComponent
  },
  props: {
    game: { type: Object, required: true },
  },
}
</script>
<style scoped>
.title {
  color: lightgray;
  width: 100%;
}
</style>