<template>
  <div
    :style="locationStyle"
    class="location"
  >
    {{ coordinate.label }}
  </div>
</template>
<script>
export default {
  name: 'GameCoordinate',
  props: {
    coordinate: { type: Object, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required : true }
  },
  computed: {
    locationStyle() {
      return {
        top: this.coordinate.y * this.height + 'px',
        left: this.coordinate.x * this.width + 'px',
      }
    }
  },
}
</script>
<style scoped>
.location {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
}
</style>