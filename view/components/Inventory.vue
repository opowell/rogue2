<template>
  <div class="section">
    <div class="section-title">Inventory</div>
    <div class="section-row" v-for="(item, index) in items" :key="index">
      <div class="section-row-label" :class="{ fade: item.fade }">{{ alphabet[index] + ') ' + (item.label || item.type) }}</div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'InventoryComponent',
  props: {
    items: { type: Array, required: true },
  },
  data() {
    return {
      alphabet: 'abcdefghijklmnopqrstuvwxyz',
    }
  },
}
</script>
<style scoped>
.section-title {
  color: #555;
}
.section-row {
  display: flex;
  color: lightgray;
}
.section-row-label {
  flex: 1 1 auto;
}
.section-row-value {
  flex: 0 0 auto;
}
.fade {
  color: gray;
}
</style>