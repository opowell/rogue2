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
          :class="{ identified: item.identified, 'magic-good': item.magic === MagicTypes.GOOD, 'magic-bad': item.magic === MagicTypes.BAD }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { TYPES as Scrolls } from '../../model/ScrollFactory.js'
import { TYPES as Rings } from '../../model/RingFactory.js'
import { TYPES as Sticks } from '../../model/StickFactory.js'
import MagicTypes from '../../model/MagicTypes.js'

function parseItems(types, header, sections) {
  const keys = Object.keys(types)
  const identified = keys.filter(key => types[key].identified)
  let sectionItems = keys.map(key => {
    const type = types[key]
    return {
      label: type.prob + '% ' + type.name,
      identified: type.identified,
      magic: type.magic,
      prob: type.prob
    }
  })
  sectionItems = sectionItems.sort((a, b) => b.prob - a.prob)
  sections.push({
    title: header + ' ' + identified.length + '/' + keys.length,
    items: sectionItems
  })
}

export default {
  name: 'DiscoveredComponent',
  props: {
    game: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      Scrolls,
      Rings,
      Sticks,
      MagicTypes
    }
  },
  computed: {
    potions() {
      return this.game.potionFactory.definitions
    },
    scrolls() {
      return this.game.scrollFactory.types
    },
    sections() {
      const sections = []
      parseItems(this.potions, 'Potions', sections)
      parseItems(this.scrolls, 'Scrolls', sections)
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
  justify-content: center;
}
.section {
  display: flex;
  flex-direction: column;
}
.section-title {
  color: darkgray;
}
.item {
  color: gray;
}
.identified {
  color: lightgray;
}
.magic-good {
  color: #617661;
}
.magic-bad {
  color: #754848;
}
.magic-good.identified {
  color: lightgreen;
}
.magic-bad.identified {
  color: lightcoral;
}
</style>