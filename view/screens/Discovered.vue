<template>
  <div class="title">
    <DiscoveredComponent />
  </div>
</template>
<script>
import DiscoveredComponent from '../components/Discovered.vue'
export default {
  name: 'DiscoveredScreen',
  components: {
    DiscoveredComponent
  },
}
</script>
<style scoped>
.title {
  color: lightgray;
  width: 100%;
}
</style>