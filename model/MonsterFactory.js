import Monster from "./Monster.js"
import { randomElement, randomInt } from "./utils.js"

const randomMove = (monster, probRandom) => {
  if (Math.random() < probRandom) {
    const locations = monster.game.getLocationsNearby(monster.location, location => location.canPlaceMonster)
    return randomElement(locations)
  } else {
    return monster.getMoveDestination(false)
  }
}

const LEVEL_ORDER = "KEBHISOR LCA NYTWFP GMXVJD"
const WAND_ORDER = "KEBHISORZ CAQ YTW PUGM VJ "
const DEFINITIONS = {
  A: {
    label: '&#x0041',
    name: 'aquator',
    mean: true,
    exp: 20,
    level: 5,
    armor: 2,
    damage: '0d0/0d0'
  },
  B: {
    label: '&#x0042',
    name: 'bat',
    fly: true,
    exp: 1,
    level: 1,
    armor: 3,
    damage: '1d2',
    getMoveDestination: (monster) => randomMove(monster, 0.5)
  },
  C: {
    label: '&#x0043',
    name: 'centaur',
    carry: 15,
    exp: 25,
    level: 4,
    armor: 4,
    damage: '1d6/1d6'
  },
  D: {
    label: '&#x0044',
    name: 'dragon',
    mean: true,
    exp: 6800,
    level: 10,
    armor: -1,
    damage: '1d8/1d8/3d10'
  },
  E: {
    label: '&#x0045',
    name: 'emu',
    mean: true,
    exp: 2,
    level: 1,
    armor: 7,
    damage: '1d2'
  },
  F: {
    label: '&#x0046',
    name: 'venus flytrap',
    mean: true,
    held: true,
    exp: 80,
    level: 8,
    armor: 3,
    damage: 'custom'
  },
  G: {
    label: '&#x0047',
    name: 'griffin',
    carry: 20,
    mean: true,
    fly: true,
    regen: true,
    exp: 2000,
    level: 13,
    armor: 2,
    damage: '4d3/3d5/4d3'
  },
  H: {
    label: '&#x0048',
    name: 'hobgoblin',
    mean: true,
    exp: 3,
    level: 1,
    armor: 5,
    damage: '1d8'
  },
  I: {
    label: '&#x0049',
    name: 'ice monster',
    mean: true,
    exp: 15,
    level: 1,
    armor: 9,
    damage: '1d2'
  },
  J: {
    label: '&#x004A',
    name: 'jabberwock',
    carry: 70,
    exp: 4000,
    level: 15,
    armor: 6,
    damage: '2d12/2d4'
  },
  K: {
    label: '&#x004B',
    name: 'kestral',
    mean: true,
    fly: true,
    exp: 1,
    level: 1,
    armor: 7,
    damage: '1d4'
  },
  L: {
    label: '&#x004C',
    name: 'leprechaun',
    greedy: true,
    exp: 10,
    level: 3,
    armor: 8,
    damage: '1d2'
  },
  M: {
    label: '&#x004D',
    name: 'medusa',
    mean: true,
    exp: 200,
    level: 8,
    armor: 2,
    damage: '3d4/3d4/2d5'
  },
  N: {
    label: '&#x004E',
    name: 'nymph',
    carry: 100,
    exp: 37,
    level: 3,
    armor: 9,
    damage: '0d0'
  },
  O: {
    label: '&#x004F',
    name: 'orc',
    greedy: true,
    exp: 5,
    level: 1,
    armor: 6,
    damage: '1d8'
  },
  P: {
    label: '&#x0050',
    name: 'phantom',
    invisible: true,
    exp: 120,
    level: 8,
    armor: 3,
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
    armor: 2,
    damage: '1d2/1d2/1d4'
  },
  R: {
    label: '&#x0052',
    name: 'rattlesnake',
    mean: true,
    exp: 9,
    level: 2,
    armor: 3,
    damage: '1d6'
  },
  S: {
    label: '&#x0053',
    name: 'snake',
    mean: true,
    exp: 2,
    level: 2,
    armor: 5,
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
    armor: 4,
    damage: '1d8/1d8/2d6'
  },
  U: {
    label: '&#x0055',
    name: 'ur-vile',
    mean: true,
    exp: 190,
    level: 7,
    armor: -2,
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
    armor: 1,
    damage: '1d10'
  },
  W: {
    label: '&#x0057',
    name: 'wraith',
    exp: 55,
    level: 5,
    armor: 4,
    damage: '1d6'
  },
  X: {
    label: '&#x0058',
    name: 'xeroc',
    carry: 30,
    exp: 100,
    level: 7,
    armor: 7,
    damage: '3d4'
  },
  Y: {
    label: '&#x0059',
    name: 'yeti',
    exp: 50,
    level: 4,
    armor: 6,
    damage: '1d6/1d6'
  },
  Z: {
    label: '&#x005A',
    name: 'zombie',
    mean: true,
    exp: 6,
    level: 2,
    armor: 8,
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