<template>
  <div
    :style="locationStyle"
    class="location"
  >
    {{ coordinate.label }}
  </div>
</template>
<script>
const LOCATION = {
  WIDTH: 16,
  HEIGHT: 28
}
export default {
  name: 'GameCoordinate',
  props: {
    coordinate: { type: Object, required: true }
  },
  data() {
    return {
      locationWidth: LOCATION.WIDTH + 'px',
      locationHeight: LOCATION.HEIGHT + 'px'
    }
  },
  computed: {
    locationStyle() {
      return {
        top: this.coordinate.y * LOCATION.HEIGHT + 'px',
        left: this.coordinate.x * LOCATION.WIDTH + 'px',
      }
    }
  },
}
</script>
<style scoped>
.location {
  width: v-bind(locationWidth);
  height: v-bind(locationHeight);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: v-bind(locationHeight);
}
</style>