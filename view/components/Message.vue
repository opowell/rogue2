<template>
  <div class="message">
    <span>{{ message }}</span>
    <span v-if="showMore" class="showMore">MORE</span>
  </div>
</template>
<script>
export default {
  name: 'Message',
  props: {
    message: { type: String, default: null },
    showMore: { type: Boolean, default: false },
    height: { type: Number, required : true }
  },
  computed: {
    heightPx() {
      return this.height + 'px'
    }
  }
}
</script>
<style scoped>
.message {
  display: flex;
  color: lightgray;
  height: v-bind(heightPx);
}
.showMore {
  margin-left: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  background-color: lightgray;
  color: black;
}
</style>