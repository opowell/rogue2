import MagicTypes from "./MagicTypes.js"
import Potion from "./Potion.js"
import { randomElement, randomInt, spread } from "./utils.js"

const colors = [
  // "amber",
  "aquamarine",
  // "black",
  "blue",
  "brown",
  // "clear",
  "crimson",
  "cyan",
  // "ecru",
  "gold",
  // "green",
  "grey",
  "magenta",
  "orange",
  "pink",
  // "plaid",
  "purple",
  "red",
  "silver",
  "tan",
  // "tangerine",
  // "topaz",
  "turquoise",
  // "vermilion",
  "violet",
  "white",
  "yellow"
]
const DEFINITIONS = {
  DETECT_MAGIC: {
    name: 'detect magic',
    prob: 6,
    action: (character, potion) => {
      character.game.detectMagic()
      character.addMessage('magic detected!')
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  DETECT_MONSTERS: {
    name: 'detect monsters',
    prob: 6,
    action: (character, potion) => {
      character.counts.detectMonsters += 30
      character.addMessage('you can detect monsters!')
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  EXTRA_HEALING: {
    name: 'extra healing',
    prob: 5,
    action: (character, potion) => {
      character.healExtra()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  GAIN_STRENGTH: {
    name: 'gain strength',
    prob: 15,
    action: (character, potion) => {
      character.increaseStrength()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  HASTE_SELF: {
    name: 'haste self',
    prob: 4,
    action: (character, potion) => {
      character.haste()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  HEALING: {
    name: 'healing',
    prob: 15,
    action: (character, potion) => {
      character.heal()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  RAISE_LEVEL: {
    name: 'raise level',
    prob: 2,
    action: (character, potion) => {
      character.raiseLevel()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  RESTORE_STRENGTH: {
    name: 'restore strength',
    prob: 14,
    action: (character, potion) => {
      character.restoreStrength()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  SEE_INVISIBLE: {
    name: 'see invisible',
    prob: 2,
    action: (character, potion) => {
      character.counts.seeInvisible()
      potion.identify()
    },
    magic: MagicTypes.GOOD
  },
  QUENCH_THIRST: {
    name: 'quench thirst',
    prob: 1
  },
  BLINDNESS: {
    name: 'blindness',
    prob: 4,
    action: (character, potion) => {
      character.blind()
      potion.identify()
    },
    magic: MagicTypes.BAD
  },
  CONFUSION: {
    name: 'confusion',
    prob: 5,
    action: (character, potion) => {
      character.counts.confuse += CONFUSE_DURATION + randomInt(8)
      character.addMessage('you feel confused')
      potion.identify()
    },
    magic: MagicTypes.BAD
  },
  PARALYSIS: {
    name: 'paralysis',
    prob: 10,
    action: (character, potion) => {
      character.counts.hold += PARALYZE_DURATION + randomInt(8)
      character.addMessage('you can\'t move')
      potion.identify()
    },
    magic: MagicTypes.BAD
  },
  POISON: {
    name: 'poison',
    prob: 8,
    action: (character, potion) => {
      character.poison()
      potion.identify()
    },
    magic: MagicTypes.BAD
  },
}

const CONFUSE_DURATION = spread(20)
const PARALYZE_DURATION = spread(2)

export default class PotionFactory {
  constructor() {
    const randomColors = []
    while (colors.length > 0) {
      const index = randomInt(colors.length - 1)
      const nextColor = colors.splice(index, 1)[0]
      randomColors.push(nextColor)
    }
    const defKeys = Object.keys(DEFINITIONS)
    defKeys.forEach((key, index) => {
      DEFINITIONS[key].color = randomColors[index]
      DEFINITIONS[key].identified = false
    })
    this.definitions = DEFINITIONS
  }
  getPotion = () => {
    const type = randomElement(this.definitions, def => def.prob)
    return new Potion(type)
  }
}