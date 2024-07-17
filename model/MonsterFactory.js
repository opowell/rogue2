import Monster from "./Monster.js"
import { randomElement, randomInt } from "./utils.js"

const randomMove = (monster, probRandom) => {
  if (Math.random() < probRandom) {
    const locations = monster.game.getLocationsNearby(monster.location, location => location.canCharacterMoveTo && monster.game.canCharacterMoveTo(monster.location, location))
    return randomElement(locations)
  } else {
    return monster.getMoveDestination(false)
  }
}

const LEVEL_ORDER = "KEBHISOR LCA NYTWFP GMXVJD"
const WAND_ORDER = "KEBHISORZ CAQ YTW PUGM VJ "
const DEFINITIONS = {
  A: {
    label: 'A',
    name: 'aquator',
    mean: true,
    exp: 20,
    level: 5,
    armor: 9,
    damage: '0d0/0d0'
  },
  B: {
    label: 'B',
    name: 'bat',
    fly: true,
    exp: 1,
    level: 1,
    armor: 8,
    damage: '1d2',
    getMoveDestination: (monster) => randomMove(monster, 0.5)
  },
  C: {
    label: 'C',
    name: 'centaur',
    carry: 15,
    exp: 25,
    level: 4,
    armor: 7,
    damage: '1d6/1d6'
  },
  D: {
    label: 'D',
    name: 'dragon',
    mean: true,
    exp: 6800,
    level: 10,
    armor: 12,
    damage: '1d8/1d8/3d10'
  },
  E: {
    label: 'E',
    name: 'emu',
    mean: true,
    exp: 2,
    level: 1,
    armor: 4,
    damage: '1d2'
  },
  F: {
    label: 'F',
    name: 'venus flytrap',
    mean: true,
    held: true,
    exp: 80,
    level: 8,
    armor: 8,
    damage: 'custom'
  },
  G: {
    label: 'G',
    name: 'griffin',
    carry: 20,
    mean: true,
    fly: true,
    regen: true,
    exp: 2000,
    level: 13,
    armor: 9,
    damage: '4d3/3d5/4d3'
  },
  H: {
    label: 'H',
    name: 'hobgoblin',
    mean: true,
    exp: 3,
    level: 1,
    armor: 6,
    damage: '1d8'
  },
  I: {
    label: 'I',
    name: 'ice monster',
    exp: 15,
    level: 1,
    armor: 2,
    damage: '1d2'
  },
  J: {
    label: '&#x004A',
    name: 'jabberwock',
    carry: 70,
    exp: 4000,
    level: 15,
    armor: 5,
    damage: '2d12/2d4'
  },
  K: {
    label: '&#x004B',
    name: 'kestral',
    mean: true,
    fly: true,
    exp: 1,
    level: 1,
    armor: 4,
    damage: '1d4'
  },
  L: {
    label: '&#x004C',
    name: 'leprechaun',
    greedy: true,
    exp: 10,
    level: 3,
    armor: 3,
    damage: '1d2'
  },
  M: {
    label: '&#x004D',
    name: 'medusa',
    mean: true,
    exp: 200,
    level: 8,
    armor: 9,
    damage: '3d4/3d4/2d5'
  },
  N: {
    label: '&#x004E',
    name: 'nymph',
    carry: 100,
    exp: 37,
    level: 3,
    armor: 2,
    damage: '0d0'
  },
  O: {
    label: '&#x004F',
    name: 'orc',
    greedy: true,
    exp: 5,
    level: 1,
    armor: 5,
    damage: '1d8'
  },
  P: {
    label: '&#x0050',
    name: 'phantom',
    invisible: true,
    exp: 120,
    level: 8,
    armor: 8,
    damage: '4d4',
    getMoveDestination: (monster) => randomMove(monster, 0.2)
  },
  Q: {
    label: '&#x0051',
    name: 'quagga',
    carry: 30,
    mean: true,
    exp: 32,
    level: 3,
    armor: 9,
    damage: '1d2/1d2/1d4'
  },
  R: {
    label: '&#x0052',
    name: 'rattlesnake',
    mean: true,
    exp: 9,
    level: 2,
    armor: 8,
    damage: '1d6',
    hit: (attacker, defender) => {
      if (!defender.saveAgainstPoison()) {
        defender.weaken()
      }
    }
  },
  S: {
    label: '&#x0053',
    name: 'snake',
    mean: true,
    exp: 2,
    level: 2,
    armor: 6,
    damage: '1d3'
  },
  T: {
    label: '&#x0054',
    name: 'troll',
    carry: 50,
    regenerate: true,
    mean: true,
    exp: 120,
    level: 6,
    armor: 7,
    damage: '1d8/1d8/2d6'
  },
  U: {
    label: '&#x0055',
    name: 'ur-vile',
    mean: true,
    exp: 190,
    level: 7,
    armor: 13,
    damage: '1d3/1d3/1d3/4d6'
  },
  V: {
    label: '&#x0056',
    name: 'vampire',
    carry: 20,
    regenerate: true,
    mean: true,
    exp: 350,
    level: 8,
    armor: 10,
    damage: '1d10'
  },
  W: {
    label: '&#x0057',
    name: 'wraith',
    exp: 55,
    level: 5,
    armor: 7,
    damage: '1d6'
  },
  X: {
    label: '&#x0058',
    name: 'xeroc',
    carry: 30,
    exp: 100,
    level: 7,
    armor: 4,
    damage: '3d4'
  },
  Y: {
    label: '&#x0059',
    name: 'yeti',
    exp: 50,
    level: 4,
    armor: 5,
    damage: '1d6/1d6'
  },
  Z: {
    label: '&#x005A',
    name: 'zombie',
    mean: true,
    exp: 6,
    level: 2,
    armor: 3,
    damage: '1d8'
  },
}

const defKeys = Object.keys(DEFINITIONS)
defKeys.forEach((key) => {
  const type = DEFINITIONS[key]
  type.strength = 10
})

export const getLevelMonster = (game, level) => {
  if (!level) {
    level = game.level
  }
  const list = LEVEL_ORDER
  let d = null
  while (d === null || list[d] === ' ') {
		d = game.level + randomInt(3) + randomInt(4) - 5
		if (d < 0)
      d = randomInt(3)
		if (d > 25)
      d = randomInt(3) + 21
  }
  const monsterType = DEFINITIONS[list[d]]
  return new Monster(monsterType, game)
}

export const getMonster = (game, monsterType) => {
  if (!monsterType) {
    monsterType = randomElement(DEFINITIONS)
  }
  return new Monster(monsterType, game)
}