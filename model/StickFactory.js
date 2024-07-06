import Stick from "./Stick.js"
import { randomElement, randomInt, shuffleArray } from "./utils.js"
import MAGIC_TYPES from './MagicTypes.js'

const WOOD_TYPES = [
  "avocado wood",
  "balsa",
  "bamboo",
  "banyan",
  "birch",
  "cedar",
  "cherry",
  "cinnibar",
  "cypress",
  "dogwood",
  "driftwood",
  "ebony",
  "elm",
  "eucalyptus",
  "fall",
  "hemlock",
  "holly",
  "ironwood",
  "kukui wood",
  "mahogany",
  "manzanita",
  "maple",
  "oaken",
  "persimmon wood",
  "pecan",
  "pine",
  "poplar",
  "redwood",
  "rosewood",
  "spruce",
  "teak",
  "walnut",
  "zebrawood"
]

shuffleArray(WOOD_TYPES)

const METAL_TYPES = [
  "aluminum",
  "beryllium",
  "bone",
  "brass",
  "bronze",
  "copper",
  "electrum",
  "gold",
  "iron",
  "lead",
  "magnesium",
  "mercury",
  "nickel",
  "pewter",
  "platinum",
  "steel",
  "silver",
  "silicon",
  "tin",
  "titanium",
  "tungsten",
  "zinc"
]

shuffleArray(METAL_TYPES)

export const TYPES = {
  LIGHT: {
    name: 'light',
    prob: 12,
    magic: MAGIC_TYPES.GOOD,
    getCharges: () => randomInt(10, 19)
  },
  STRIKING: {
    name: 'striking',
    prob: 9,
    magic: MAGIC_TYPES.GOOD
  },
  LIGHTNING: {
    name: 'lightning',
    prob: 3,
    magic: MAGIC_TYPES.GOOD
  },
  FIRE: {
    name: 'fire',
    prob: 3,
    magic: MAGIC_TYPES.GOOD
  },
  COLD: {
    name: 'cold',
    prob: 3,
    magic: MAGIC_TYPES.GOOD
  },
  POLYMORPH: {
    name: 'polymorph',
    prob: 15,
    magic: MAGIC_TYPES.GOOD
  },
  MAGIC_MISSILE: {
    name: 'magic missile',
    prob: 10,
    magic: MAGIC_TYPES.GOOD
  },
  HASTE_MONSTER: {
    name: 'haste monster',
    prob: 9,
    magic: MAGIC_TYPES.BAD
  },
  SLOW_MONSTER: {
    name: 'slow monster',
    prob: 11,
    magic: MAGIC_TYPES.GOOD
  },
  DRAIN_LIFE: {
    name: 'drain life',
    prob: 9,
    magic: MAGIC_TYPES.GOOD
  },
  NOTHING: {
    name: 'nothing',
    prob: 1
  },
  TELEPORT_AWAY: {
    name: 'teleport away',
    prob: 5,
    magic: MAGIC_TYPES.GOOD
  },
  TELEPORT_TO: {
    name: 'teleport to',
    prob: 5,
    magic: MAGIC_TYPES.BAD
  },
  CANCELLATION: {
    name: 'cancellation',
    prob: 5,
    magic: MAGIC_TYPES.GOOD
  }
}

const defKeys = Object.keys(TYPES)
defKeys.forEach((key, index) => {
  const type = TYPES[key]
  const isWand = Math.random() > 0.5
  type.material = isWand ? 'wand' : 'staff'
  type.materialType = isWand ? METAL_TYPES[index] : WOOD_TYPES[index]
  type.identified = false
  if (!type.getCharges) {
    type.getCharges = () => randomInt(3, 7)
  }
})

export const getStick = () => {
  const stickType = randomElement(TYPES, type => type.prob)
  return new Stick(stickType)
}