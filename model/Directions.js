export const DIRECTIONS = {
  LEFT: {},
  RIGHT: {},
  UP: {},
  DOWN: {},
  UP_LEFT: {},
  UP_RIGHT: {},
  DOWN_RIGHT: {},
  DOWN_LEFT: {}
}

const match = (d1, d2) => {
  d1.opp = d2
  d2.opp = d1
}

match(DIRECTIONS.LEFT, DIRECTIONS.RIGHT)
match(DIRECTIONS.DOWN, DIRECTIONS.UP)
match(DIRECTIONS.UP_LEFT, DIRECTIONS.DOWN_RIGHT)
match(DIRECTIONS.UP_RIGHT, DIRECTIONS.DOWN_LEFT)