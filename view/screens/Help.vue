<template>
  <div class="items">
    <div v-for="(item, index) in items" :key="index" class="item" v-html="item" />
  </div>
</template>
<script>
const items = [
  'F1',
  'list of commands',
  'F2',
  'list of symbols',
  'F3',
  'repeat command',
  'F4',
  'repeat most recent message',
  'F5',
  'rename something',
  'F6',
  'recall what\'s been discovered',
  'F7',
  'inventory of your possessions',
  'F8',
  '&lt;dir&gt; identify trap type',
  'Space',
  'Clear -More- message',
  'h',
  'left',
  'j',
  'down',
  'k',
  'up',
  'l',
  'right'
]
export default {
  name: 'HelpScreen',
  data() {
    return {
      items
    }
  }
}
</script>
<style scoped>
.items {
  align-self: flex-start;
  margin: 1rem;
  color: lightgray;
  display: grid;
  grid-template-columns: 1fr 7fr 1fr 7fr;
  column-gap: 1rem;
}
</style>