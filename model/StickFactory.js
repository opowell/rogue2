import Stick from "./Stick.js"
import { randomElement } from "./utils.js"
import MAGIC_TYPES from './MagicTypes.js'

//      { "agate",		 25},
// 137     { "alexandrite",	 40},
// 138     { "amethyst",	 50},
// 139     { "carnelian",	 40},
// 140     { "diamond",	300},
// 141     { "emerald",	300},
// 142     { "germanium",	225},
// 143     { "granite",	  5},
// 144     { "garnet",		 50},
// 145     { "jade",		150},
// 146     { "kryptonite",	300},
// 147     { "lapis lazuli",	 50},
// 148     { "moonstone",	 50},
// 149     { "obsidian",	 15},
// 150     { "onyx",		 60},
// 151     { "opal",		200},
// 152     { "pearl",		220},
// 153     { "peridot",	 63},
// 154     { "ruby",		350},
// 155     { "sapphire",	285},
// 156     { "stibotantalite",	200},
// 157     { "tiger eye",	 50},
// 158     { "topaz",		 60},
// 159     { "turquoise",	 70},
// 160     { "taaffeite",	300},
// 161     { "zircon",	 	 80}
//      "avocado wood",
// 168     "balsa",
// 169     "bamboo",
// 170     "banyan",
// 171     "birch",
// 172     "cedar",
// 173     "cherry",
// 174     "cinnibar",
// 175     "cypress",
// 176     "dogwood",
// 177     "driftwood",
// 178     "ebony",
// 179     "elm",
// 180     "eucalyptus",
// 181     "fall",
// 182     "hemlock",
// 183     "holly",
// 184     "ironwood",
// 185     "kukui wood",
// 186     "mahogany",
// 187     "manzanita",
// 188     "maple",
// 189     "oaken",
// 190     "persimmon wood",
// 191     "pecan",
// 192     "pine",
// 193     "poplar",
// 194     "redwood",
// 195     "rosewood",
// 196     "spruce",
// 197     "teak",
// 198     "walnut",
// 199     "zebrawood"
// 5     "aluminum",
// 206     "beryllium",
// 207     "bone",
// 208     "brass",
// 209     "bronze",
// 210     "copper",
// 211     "electrum",
// 212     "gold",
// 213     "iron",
// 214     "lead",
// 215     "magnesium",
// 216     "mercury",
// 217     "nickel",
// 218     "pewter",
// 219     "platinum",
// 220     "steel",
// 221     "silver",
// 222     "silicon",
// 223     "tin",
// 224     "titanium",
// 225     "tungsten",
// 226     "zinc"

const TYPES = {
  LIGHT: {
    name: 'light',
    prob: 12,
    magic: MAGIC_TYPES.GOOD
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

export const getStick = () => {
  const stickType = randomElement(TYPES, type => type.prob)
  return new Stick(stickType)
}