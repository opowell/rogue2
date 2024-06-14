import Ring from "./Ring.js"
import { randomElement } from "./utils.js"
import MAGIC_TYPES from './MagicTypes.js'
const TYPES = {
  PROTECTION: {
    name: 'protection',
    prob: 9
  },
  ADD_STRENGTH: {
    name: 'add strength',
    prob: 9
  },
  SUSTAIN_STRENGTH: {
    name: 'sustain strength',
    prob: 5,
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
  ADORNMENT: {
    name: 'adornment',
    prob: 1
  },
  AGGRAVATE_MONSTER: {
    name: 'aggravate monster',
    prob: 10,
    magic: MAGIC_TYPES.BAD
  },
  DEXTERITY: {
    name: 'dexterity',
    prob: 8
  },
  INCREASE_DAMAGE: {
    name: 'increase damage',
    prob: 8
  },
  REGENERATION: {
    name: 'regeneration',
    prob: 4,
    magic: MAGIC_TYPES.GOOD
  },
  SLOW_DIGESTION: {
    name: 'slow digestion',
    prob: 9,
    magic: MAGIC_TYPES.GOOD
  },
  TELEPORTATION: {
    name: 'teleportation',
    prob: 5,
    magic: MAGIC_TYPES.BAD
  },
  STEALTH: {
    name: 'stealth',
    prob: 7,
    magic: MAGIC_TYPES.GOOD
  },
  MAINTAIN_ARMOR: {
    name: 'maintain armor',
    prob: 5,
    magic: MAGIC_TYPES.GOOD
  }
}

export const getRing = () => {
  const ringType = randomElement(TYPES, type => type.prob)
  return new Ring(ringType)
}