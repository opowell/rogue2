import Monster from "./Monster.js"
import { randomElement, randomInt } from "./utils.js"

const LEVEL_ORDER = "K BHISOR LCA NYTWFP GMXVJD"
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
    damage: '1d2'
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
}
//  	/* Name		 CARRY	FLAG    str, exp, lvl, amr, hpt, dmg */
// 409 	{ "medusa",	 40,	ISMEAN,	{ XX,200,   8,   2, ___, "3d4/3d4/2d5" } },
// 410 	{ "nymph",	 100,	0,	{ XX, 37,   3,   9, ___, "0d0" } },
// 411 	{ "orc",	 15,	ISGREED,{ XX,  5,   1,   6, ___, "1d8" } },
// 412 	{ "phantom",	 0,ISINVIS,{ XX,120,   8,   3, ___, "4d4" } },
// 413 	{ "quagga",	 30,	ISMEAN,	{ XX, 32,   3,   2, ___, "1d2/1d2/1d4" } },
// 414 	{ "rattlesnake", 0,	ISMEAN,	{ XX,  9,   2,   3, ___, "1d6" } },
// 415 	{ "slime",	 	 0,	ISMEAN,	{ XX,  1,   2,   8, ___, "1d3" } },
// 416 	{ "troll",	 50,	ISREGEN|ISMEAN,{ XX, 120, 6, 4, ___, "1d8/1d8/2d6" } },
// 417 	{ "ur-vile",	 0,	ISMEAN,	{ XX,190,   7,  -2, ___, "1d3/1d3/1d3/4d6" } },
// 418 	{ "vampire",	 20,	ISREGEN|ISMEAN,{ XX,350,   8,   1, ___, "1d10" } },
// 419 	{ "wraith",	 0,	0,	{ XX, 55,   5,   4, ___, "1d6" } },
// 420 	{ "xeroc",30,	0,	{ XX,100,   7,   7, ___, "3d4" } },
// 421 	{ "yeti",	 30,	0,	{ XX, 50,   4,   6, ___, "1d6/1d6" } },
// 422 	{ "zombie",	 0,	ISMEAN,	{ XX,  6,   2,   8, ___, "1d8" } }

export const getLevelMonster = (game) => {
  const list = LEVEL_ORDER
  let d = null
  while (d === null || list[d] === ' ') {
		d = game.level + randomInt(4) + randomInt(5) - 5
		if (d < 0)
      d = randomInt(4)
		if (d > 25)
      d = randomInt(4) + 21
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