import Trap from "./Trap.js"
import { randomElement } from "./utils.js"

const DEFINITIONS = {
  TRAP_DOOR: {
    name: 'trap door',
  },
  ARROW: {
    name: 'arrow trap'
  },
  SLEEP: {
    name: 'sleep trap'
  },
  BEAR: {
    name: 'bear trap'
  },
  TELEPORT: {
    name: 'teleport trap'
  },
  DART: {
    name: 'dart trap'
  }
}

export const getTrap = () => {
  const trapType = randomElement(DEFINITIONS)
  return new Trap(trapType)
}