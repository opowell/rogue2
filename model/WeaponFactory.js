import Weapon from "./Weapon.js"
import { randomElement, randomInt } from "./utils.js"

const DEFINITIONS = {
  MACE: {
    name: 'mace',
    damage: '2d4',
    throw: '1d3'
  },
  LONG_SWORD: {
    name: 'long sword',
    damage: '3d4',
    throw: '1d2'
  },
  SHORT_BOW: {
    name: 'short bow',
    damage: '1d1',
    throw: '1d1'
  },
  ARROW: {
    name: 'arrow',
    damage: '1d1',
    throw: '2d3',
    isMany: true,
    isMissile: true
  },
  DAGGER: {
    name: 'dagger',
    damage: '1d6',
    throw: '1d4',
    isMissile: true
  },
  TWO_HANDED_SWORD: {
    name: 'two-handed sword',
    damage: '4d4',
    throw: '1d2'
  },
  DART: {
    name: 'dart',
    damage: '1d1',
    throw: '1d3',
    isMany: true,
    isMissile: true
  },
  CROSSBOW: {
    name: 'crossbow',
    damage: '1d1',
    throw: '1d1'
  },
  CROSSBOW_BOLT: {
    name: 'crossbow bolt',
    damage: '1d2',
    throw: '2d5',
    isMany: true,
    isMissile: true
  },
  SPEAR: {
    name: 'spear',
    damage: '2d3',
    throw: '1d6',
    isMissile: true
  },
}

DEFINITIONS.ARROW.shooter = DEFINITIONS.SHORT_BOW
DEFINITIONS.CROSSBOW_BOLT.shooter = DEFINITIONS.CROSSBOW

export const getWeapon = (weaponType) => {
  if (!weaponType) {
    weaponType = randomElement(DEFINITIONS)
  }
  return new Weapon(weaponType)
}

export const spawnMace = () => {
  return new Weapon(DEFINITIONS.MACE)
}
export const spawnBow = () => {
  return new Weapon(DEFINITIONS.SHORT_BOW)
}
export const spawnArrows = () => {
  const arrows = new Weapon(DEFINITIONS.ARROW)
  arrows.quantity = randomInt(15) + 25
  return arrows
}
