import { getPotion } from "./PotionFactory.js"
import { getScroll } from "./ScrollFactory.js"
import { getWeapon } from "./WeaponFactory.js"
import { getArmor } from "./ArmorFactory.js"
import { getRing } from "./RingFactory.js"
import { getStick } from "./StickFactory.js"
import { randomElement } from "./utils.js"
import { getFood } from "./FoodFactory.js"

const TYPES = {
  POTION: {
    factory: getPotion,
    prob: 27
  },
  SCROLL: {
    factory: getScroll,
    prob: 30
  },
  FOOD: {
    factory: getFood,
    prob: 17
  },
  WEAPON: {
    factory: getWeapon,
    prob: 8
  },
  ARMOR: {
    factory: getArmor,
    prob: 8
  },
  RING: {
    factory: getRing,
    prob: 5
  },
  STICK: {
    factory: getStick,
    prob: 5
  }
}

export const getItem = () => {
  const type = randomElement(TYPES, def => def.prob)
  return type.factory()
}