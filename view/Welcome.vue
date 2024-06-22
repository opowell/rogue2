<template>
  <div class="title">
    <span>ROGUE: The Adventure Game</span>
    <div>Rogue's Name? <input ref="input" type="text" tabindex="0" v-model="name" @keydown="handleKeydown" /></div>
  </div>
</template>
<script>
export default {
  name: 'Welcome',
  props: {
    modelValue: { type: String, default: null },
  },
  data() {
    return {
      name: this.modelValue
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
input {
  font-size: 1.2rem;
  font-family: IBMVGA8;
  background-color: transparent;
  border: none;
  color: white;
}
input:focus, input:active {
  background-color: transparent;
  border: none;
  outline: none;
}
.title {
  color: lightgray;
  height: 1.5rem;
}
</style>