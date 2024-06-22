<template>
  <div class="title">
    <InventoryComponent :game="game" />
  </div>
</template>
<script>
import InventoryComponent from '../components/Inventory.vue'
export default {
  name: 'InventoryScreen',
  components: {
    InventoryComponent
  },
  props: {
    game: { type: Object, required: true }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$refs.input.focus()
    // }) 
  },
  methods: {
    handleKeydown(e) {
      e.stopPropagation()
      if (e.code === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        this.$emit('startGame', this.name)
      }
    }
  }
}
</script>
<style scoped>
.title {
  color: lightgray;
  width: 100%;
}
</style>