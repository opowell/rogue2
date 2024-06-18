import GameObject from './GameObject.js'

class Trap extends GameObject {
  constructor(trapType) {
    super()
    this.type = 'trap'
    this.addState({
      discovered: false,
      trapType,
    })
  }
}
export default Trap