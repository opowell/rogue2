import Food from "./Food.js"
import { randomElement } from "./utils.js"
export const TYPES = {
  RATION: {
    name: 'ration of food',
    prob: 9,
    eat: (character) => {
      if (Math.random() > 0.7) {
        character.experience++
        character.addMessage("yuk, this food tastes awful")
      } else {
        character.addMessage('yum, that tasted good')
      }
    }
  },
  SLIME_MOLD: {
    name: 'slime mold',
    eat: () => character.addMessage("my, that was a yummy slime mold"),
    prob: 1
  }
}

export const getFood = (foodType) => {
  if (!foodType) {
    foodType = randomElement(TYPES, type => type.prob)
  }
  return new Food(foodType)
}