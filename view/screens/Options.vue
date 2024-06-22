<template>
  <div class="title">
    <span>Options</span>
    <div v-for="option in options" :key="option.name" class="option">
      <div class="option-name">{{ option.name }}</div>
      <div class="option-value">{{ option.value }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Options',
  data() {
    return {
      options: [
        {
          name: 'Drop breadcrumbs',
          value: 'yes'
        },
        {
          name: 'Coloured potions',
          value: 'yes'
        },
        {
          name: 'Stats on left',
          value: 'yes'
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.input.focus()
    }) 
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
.option {
  display: flex;
}
.option-name {
  flex: 1 1 auto;
}
.title {
  color: lightgray;
  width: 300px;
}
</style>