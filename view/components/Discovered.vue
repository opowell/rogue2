<template>
  <div class="main">
    <div class="title">Discovered</div>
    <div class="sections">
      <div class="section" v-for="(section, index) in sections" :key="index">
        <div class="section-title">{{ section.title }}</div>
        <div
          v-for="(item, itemIndex) in section.items"
          :key="index + '-' + itemIndex"
          class="item"
          :class="{ identified: item.identified }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { DEFINITIONS as Potions } from '../../model/PotionFactory.js'
import { TYPES as Scrolls } from '../../model/ScrollFactory.js'
import { TYPES as Rings } from '../../model/RingFactory.js'
import { TYPES as Sticks } from '../../model/StickFactory.js'

function parseItems(types, header, sections) {
  const keys = Object.keys(types)
  const identified = keys.filter(key => types[key].identified)
  const sectionItems = keys.map(key => {
    const type = types[key]
    return {
      label: '- ' + type.name,
      identified: type.identified
    }
  })
  sections.push({
    title: header + ' ' + identified.length + '/' + keys.length,
    items: sectionItems
  })
}

export default {
  name: 'DiscoveredComponent',
  data() {
    return {
      Potions,
      Scrolls,
      Rings,
      Sticks
    }
  },
  computed: {
    sections() {
      const sections = []
      parseItems(this.Potions, 'Potions', sections)
      parseItems(this.Scrolls, 'Scrolls', sections)
      parseItems(this.Rings, 'Rings', sections)
      parseItems(this.Sticks, 'Sticks', sections)
      return sections
    }
  }
}
</script>
<style scoped>
.main {
  display: flex;
  flex-direction: column;
}
.title {
  color: darkgray;
}
.sections {
  display: flex;
  gap: 1rem;
}
.section {
  display: flex;
  flex-direction: column;
}
.section-title {
  color: gray;
}
.item {
  color: gray;
}
.identified {
  color: lightgray;
}
</style>