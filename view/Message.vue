<template>
  <div class="message">
    <span>{{ message }}</span>
    <span v-if="showMore" class="showMore"> MORE&nbsp;</span>
  </div>
</template>
<script>
export default {
  name: 'Message',
  props: {
    message: { type: String, default: null },
    showMore: { type: Boolean, default: false }
  }
}
</script>
<style scoped>
.message {
  color: lightgray;
  height: 1.5rem;
}
.showMore {
  background-color: lightgray;
  color: black;
}
</style>