import Scroll from "./Scroll.js"
import { randomElement } from "./utils.js"

const TYPES = {
  CONFUSE_MONSTER: {
    name: 'confuse monster',
    prob: 8
  },
  MAGIC_MAPPING: {
    name: 'magic mapping',
    prob: 5
  },
  HOLD_MONSTER: {
    name: 'hold monster',
    prob: 3
  },
  SLEEP: {
    name: 'sleep',
    prob: 5
  },
  ENCHANT_ARMOR: {
    name: 'enchant armor',
    prob: 8
  },
  IDENTIFY: {
    name: 'identify',
    prob: 27
  },
  SCARE_MONSTER: {
    name: 'scare monster',
    prob: 4
  },
  DETECT_FOOD: {
    name: 'detect food',
    prob: 4
  },
  TELEPORTATION: {
    name: 'teleportation',
    prob: 7
  },
  ENCHANT_WEAPON: {
    name: 'enchant weapon',
    prob: 10
  },
  CREATE_MONSTER: {
    name: 'create monster',
    prob: 5
  },
  REMOVE_CURSE: {
    name: 'remove curse',
    prob: 8
  },
  AGGRAVATE_MONSTER: {
    name: 'aggravate monster',
    prob: 4
  },
  BLANK_PAPER: {
    name: 'blank paper',
    prob: 1
  },
  VORPALIZE_WEAPON: {
    name: 'vorpalize weapon',
    prob: 1
  }
}

export const getScroll = () => {
  const scrollType = randomElement(TYPES, type => type.prob)
  return new Scroll(scrollType)
}