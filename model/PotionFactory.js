import Potion from "./Potion.js"
import { randomElement, randomInt, spread } from "./utils.js"

const colors = [
  "amber",
  "aquamarine",
  // "black",
  "blue",
  "brown",
  "clear",
  "crimson",
  "cyan",
  // "ecru",
  "gold",
  // "green",
  "grey",
  "magenta",
  "orange",
  "pink",
  "plaid",
  "purple",
  "red",
  "silver",
  "tan",
  "tangerine",
  // "topaz",
  "turquoise",
  "vermilion",
  "violet",
  "white",
  "yellow"
]

const randomColors = []
while (colors.length > 0) {
  const index = randomInt(colors.length - 1)
  const nextColor = colors.splice(index, 1)[0]
  randomColors.push(nextColor)
}

const CONFUSE_DURATION = spread(20)

const DEFINITIONS = {
  GAIN_STRENGTH: {
    name: 'gain strength',
    prob: 15,
    action: (character, potion) => {
      character.increaseStrength()
      potion.identify()
    }
  },
  HEALING: {
    name: 'healing',
    prob: 15,
    action: (character, potion) => {
      character.heal()
      potion.identify()
    }
  },
  POISON: {
    name: 'poison',
    prob: 8,
    action: (character, potion) => {
      character.counts.hold += spread(2)
      character.addMessage('you can\'t move')
      potion.identify()
    }
  },
  CONFUSION: {
    name: 'confusion',
    prob: 5,
    action: (character, potion) => {
      character.counts.confuse += CONFUSE_DURATION + randomInt(8)
      potion.identify()
    }
  },
  PARALYSIS: {
    name: 'paralysis',
    prob: 10,
    action: (character, potion) => {
      character.paralyse()
      potion.identify()
    }
  },
  SEE_INVISIBLE: {
    name: 'see invisible',
    prob: 2,
    action: (character, potion) => {
      character.counts.seeInvisible += SEE_DURATION
      character.counts.blind = 0
      character.addMessage('you can see invisible! (around 300 turns)')
      potion.identify()
    }
  },
  DETECT_MONSTERS: {
    name: 'detect monsters',
    prob: 6,
    action: (character, potion) => {
      character.counts.detectMonsters += 30
      potion.identify()
    }
  },
  DETECT_MAGIC: {
    name: 'detect magic',
    prob: 6
  },
  RAISE_LEVEL: {
    name: 'raise level',
    prob: 2,
    action: (character, potion) => {
      character.raiseLevel()
      potion.identify()
    }
  },
  EXTRA_HEALING: {
    name: 'extra healing',
    prob: 5
  },
  HASTE_SELF: {
    name: 'haste self',
    prob: 4,
    action: (character, potion) => {
      character.haste()
      potion.identify()
    }
  },
  RESTORE_STRENGTH: {
    name: 'restore strength',
    prob: 14,
    action: (character, potion) => {
      character.restoreStrength()
      potion.identify()
    }
  },
  BLINDNESS: {
    name: 'blindness',
    prob: 4,
    action: (character, potion) => {
      character.blind()
      potion.identify()
    }
  },
  QUENCH_THIRST: {
    name: 'quench thirst',
    prob: 1
  }
}

const defKeys = Object.keys(DEFINITIONS)
defKeys.forEach((key, index) => {
  DEFINITIONS[key].color = randomColors[index]
  DEFINITIONS[key].identified = false
})

export const getPotion = () => {
  const type = randomElement(DEFINITIONS, def => def.prob)
  return new Potion(type)
}