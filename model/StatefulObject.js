const { reactive } = Vue

class StatefulObject {
  constructor(state) {
    this.state = reactive({})
    this.addState(state)
  }
  addState(object) {
    const keys = Object.keys(object)
    keys.forEach(key => {
      this.state[key] = object[key]
      Object.defineProperty(this, key, {
        get() {
          return this.state[key]
        },
        set(value) {
          return this.state[key] = value
        }
      })
    })
  }
}
export default StatefulObject