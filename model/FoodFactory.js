import Food from "./Food.js"
import { randomElement } from "./utils.js"
export const TYPES = {
  RATION: {
    name: 'ration of food',
    prob: 9
  },
  SLIME_MOLD: {
    name: 'slime mold',
    prob: 1
  }
}

export const getFood = (foodType) => {
  if (!foodType) {
    foodType = randomElement(TYPES, type => type.prob)
  }
  return new Food(foodType)
}