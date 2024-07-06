import Scroll from "./Scroll.js"
import { alphabet, randomElement, randomElements, spread } from "./utils.js"
const SLEEPTIME = 4

export const TYPES = {
  CONFUSE_MONSTER: {
    name: 'confuse monster',
    prob: 8,
    read: (character, scroll) => {
      character.confuseAttack = true
      character.addMessage('your hands begin to glow red')
      scroll.identify()
    }
  },
  MAGIC_MAPPING: {
    name: 'magic mapping',
    prob: 5,
    read: (character, scroll) => {
      character.addMessage('oh, now this scroll has a map on it')
      character.game.revealMap()
      scroll.identify()
    }
  },
  HOLD_MONSTER: {
    name: 'hold monster',
    prob: 3,
    read: (character, scroll) => {
      const nearbyEnemies = character.game.getNearbyEnemies(character.location, 2)
      nearbyEnemies.forEach(enemy => enemy.held = true)
      scroll.identify()
    }
  },
  SLEEP: {
    name: 'sleep',
    prob: 5,
    read: (character, scroll) => {
      const turns = Math.round(spread(SLEEPTIME) + 4)
      character.sleep(turns)
      scroll.identify()
      character.addMessage('you fall asleep for ' + turns + ' turns')
    }
  },
  ENCHANT_ARMOR: {
    name: 'enchant armor',
    prob: 8,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  IDENTIFY: {
    name: 'identify',
    prob: 27,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  SCARE_MONSTER: {
    name: 'scare monster',
    prob: 4,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  DETECT_FOOD: {
    name: 'detect food',
    prob: 4,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  TELEPORTATION: {
    name: 'teleportation',
    prob: 7,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  ENCHANT_WEAPON: {
    name: 'enchant weapon',
    prob: 10,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  CREATE_MONSTER: {
    name: 'create monster',
    prob: 5,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  REMOVE_CURSE: {
    name: 'remove curse',
    prob: 8,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  AGGRAVATE_MONSTER: {
    name: 'aggravate monster',
    prob: 4,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  },
  BLANK_PAPER: {
    name: 'blank paper',
    prob: 1,
    read: (character, scroll) => {
      character.addMessage('this scroll seems to be blank')
      scroll.identify()
    }
  },
  VORPALIZE_WEAPON: {
    name: 'vorpalize weapon',
    prob: 1,
    read: (character, scroll) => {
      console.log('TODO')
      scroll.identify()
    }
  }
}

const alphabetArray = alphabet.split('')
const defKeys = Object.keys(TYPES)
defKeys.forEach((key) => {
  const type = TYPES[key]
  type.identified = false
  type.hiddenName = randomElements(alphabetArray, 10).join('')
})

export const getScroll = () => {
  const scrollType = randomElement(TYPES, type => type.prob)
  return new Scroll(scrollType)
}