<template>
  <div class="title">
    <span class="title-text">ROGUE: The Adventure Game</span>
    <div class="prompt">Rogue's Name?</div>
    <input ref="input" type="text" tabindex="0" spellcheck="false" v-model="name" @keydown="handleKeydown" />
    <ScoresComponent v-if="scores.length > 0" :scores="scores" />
  </div>
</template>
<script>
import ScoresComponent from '../components/Scores.vue'
export default {
  name: 'Welcome',
  components: {
    ScoresComponent
  },
  props: {
    modelValue: { type: String, default: null },
    scores: { type: Array, required: true },
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
.title-text {
  margin-bottom: 3rem;
}
input {
  margin-bottom: 2rem;
  font-family: IBMVGA8;
  background-color: transparent;
  border: none;
  color: white;
  text-align: center;
}
input:focus, input:active {
  background-color: transparent;
  border: none;
  outline: none;
}
.prompt {
  color: darkgray;
}
.title {
  color: #ffff05;
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>