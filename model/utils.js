/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @returns a random integer from [x, y].
 */
export const randomInt = (x, y = 0, weights) => {
    const cumWeights = []
    let sum = 0
    const dist = Math.abs(x - y)
    if (weights && dist + 1 !== weights.length) {
        console.log('ERROR drawing random int', weights, dist, x, y)
    }
    for (let i = 0; i <= dist; i++) {
        sum += weights ? weights[i] : 1
        cumWeights[i] = sum
    }
    const draw = Math.random() * sum
    let index = 0
    for (let i = 0; i < cumWeights.length; i++) {
        if (cumWeights[i] >= draw) {
            break
            }
        index++
    }
    const min = Math.min(x, y)
    return min + index
}
/**
 * 
 * @param {Array} array
 * @returns a random element from the array.
 */
export const randomElement = (array, weightFn) => {
    if (array.length === 0) return
    const keys = Object.keys(array)
    let weights = null
    if (weightFn) {
        weights = keys.map(key => array[key]).map(item => weightFn(item))
        }
    const index = randomInt(keys.length - 1, 0, weights)
    return array[keys[index]]
}

export const isDiagonalMove = (a, b) => {
  return Math.abs(Math.abs(a.x - b.x) - Math.abs(a.y - b.y)) === 0
}

export const roll = (times, sides) => {
  let sum = 0
  for (let i = 0; i < times; i++) {
    sum += randomInt(1, sides)
  }
  return sum
}

export const spread = (x) => {
  return randomInt(0.9*x, 1.1*x)
}
