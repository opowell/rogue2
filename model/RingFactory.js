import Ring from "./Ring.js"
import { randomElement, shuffleArray } from "./utils.js"
import MAGIC_TYPES from './MagicTypes.js'

const STONE_TYPES = [
  "agate",
  "alexandrite",
  "amethyst",
  "carnelian",
  "diamond",
  "emerald",
  "germanium",
  "granite",
  "garnet",
  "jade",
  "kryptonite",
  "lapis lazuli",
  "moonstone",
  "obsidian",
  "onyx",
  "opal",
  "pearl",
  "peridot",
  "ruby",
  "sapphire",
  "stibotantalite",
  "tiger eye",
  "topaz",
  "turquoise",
  "taaffeite",
  "zircon"
]

shuffleArray(STONE_TYPES)

export const TYPES = {
  MAINTAIN_ARMOR: {
    name: 'maintain armor',
    prob: 5,
    magic: MAGIC_TYPES.GOOD
  },
  REGENERATION: {
    name: 'regeneration',
    prob: 4,
    magic: MAGIC_TYPES.GOOD
  },
  SEARCHING: {
    name: 'searching',
    prob: 10,
    magic: MAGIC_TYPES.GOOD
  },
  SEE_INVISIBLE: {
    name: 'see invisible',
    prob: 10,
    magic: MAGIC_TYPES.GOOD
  },
  SLOW_DIGESTION: {
    name: 'slow digestion',
    prob: 9,
    magic: MAGIC_TYPES.GOOD
  },
  STEALTH: {
    name: 'stealth',
    prob: 7,
    magic: MAGIC_TYPES.GOOD
  },
  SUSTAIN_STRENGTH: {
    name: 'sustain strength',
    prob: 5,
    magic: MAGIC_TYPES.GOOD
  },
  ADD_STRENGTH: {
    name: 'add strength',
    prob: 9
  },
  ADORNMENT: {
    name: 'adornment',
    prob: 1
  },
  DEXTERITY: {
    name: 'dexterity',
    prob: 8
  },
  INCREASE_DAMAGE: {
    name: 'increase damage',
    prob: 8
  },
  PROTECTION: {
    name: 'protection',
    prob: 9
  },
  AGGRAVATE_MONSTER: {
    name: 'aggravate monster',
    prob: 10,
    magic: MAGIC_TYPES.BAD
  },
  TELEPORTATION: {
    name: 'teleportation',
    prob: 5,
    magic: MAGIC_TYPES.BAD
  },
}

const defKeys = Object.keys(TYPES)
defKeys.forEach((key, index) => {
  TYPES[key].stone = STONE_TYPES[index]
  TYPES[key].identified = false
})

export const getRing = () => {
  const ringType = randomElement(TYPES, type => type.prob)
  return new Ring(ringType)
}