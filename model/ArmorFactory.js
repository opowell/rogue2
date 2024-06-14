import Armor from "./Armor.js"
import { randomElement } from "./utils.js"
export const TYPES = {
  LEATHER_ARMOR: {
    name: 'leather armor',
    defence: 3,
    prob: 20
  },
  STUDDED_LEATHER_ARMOR: {
    name: 'studded leather armor',
    defence: 4,
    prob: 15
  },
  RING_MAIL: {
    name: 'ring mail',
    defence: 4,
    prob: 15
  },
  SCALE_MAIL: {
    name: 'scale mail',
    defence: 5,
    prob: 13
  },
  CHAIN_MAIL: {
    name: 'chain mail',
    defence: 6,
    prob: 12
  },
  SPLINT_MAIL: {
    name: 'splint mail',
    defence: 7,
    prob: 10
  },
  BANDED_MAIL: {
    name: 'banded mail',
    defence: 7,
    prob: 10
  },
  PLATE_MAIL: {
    name: 'plate mail',
    defence: 8,
    prob: 5
  }
}

export const getArmor = (armorType, cursed) => {
  if (cursed === undefined) {
    cursed = Math.random() < 0.5
  }
  if (!armorType) {
    armorType = randomElement(TYPES, type => type.prob)
  }
  return new Armor(armorType, cursed)
}