<template>
  <div class="title">
    <InventoryComponent :items="items" />
  </div>
</template>
<script>
import InventoryComponent from '../components/Inventory.vue'
export default {
  name: 'MessagesScreen',
  components: {
    InventoryComponent
  },
  props: {
    items: { type: Array, required: true },
  },
}
</script>
<style scoped>
.title {
  color: lightgray;
  width: 100%;
}
</style>