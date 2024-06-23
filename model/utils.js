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
  if (typeof times === 'string') {
    const parts = times.split('d')
    times = parts[0]
    sides = parts[1]
  }
  let sum = 0
  for (let i = 0; i < times; i++) {
    sum += randomInt(1, sides)
  }
  return sum
}

export const spread = (x) => {
  return randomInt(0.9*x, 1.1*x)
}

const VORPALIZE_HIT_BONUS = 4
const VORPALIZE_DAMAGE_BONUS = 4
const IMMOBILE_HIT_BONUS = 4

const swing = (attackerLevel, defArmor, weaponPlus) => {
  const res = randomInt(19)
  const need = 20 - attackerLevel - defArmor
  return res + weaponPlus >= need
}

/*
 * roll_em: Roll several attacks
 */
export const attack = (attacker, defender, weapon, throwing = false) => {
  let didHit = false
  let hPlus = 0
  let dPlus = 0
  let weaponDamage = 0
  if (weapon) {
    // cp = att->s_dmg;
    hPlus = weapon.hitBonus
    dPlus = weapon.damageBonus
    if (weapon.vorpalizeType === defender.monsterType) {
      hPlus += VORPALIZE_HIT_BONUS 
      dPlus += VORPALIZE_DAMAGE_BONUS
    }
    if (throwing) {
      weaponDamage = weapon.throw
      if (attacker.weapon.weaponType === weapon.weaponType.shooter) {
        hPlus += attacker.weapon.hitBonus
        dPlus += attacker.weapon.damageBonus
      }
    } else {
      weaponDamage = weapon.damage
    }
  } else {
    if (attacker.monsterType) {
      weaponDamage = attacker.monsterType.damage
    }
  }
  if (!throwing) {
    hPlus += attacker.meleeHitBonus
    dPlus += attacker.meleeDamageBonus    
  }
	// // Drain a staff of striking
	// if (weap->o_type == STICK && weap->o_which == WS_HIT
	// 	&& --weap->o_charges < 0)
	// {
	//     cp = weap->o_damage = "0d0";
	//     weap->o_hplus = weap->o_dplus = 0;
	//     weap->o_charges = 0;
	// }
  if (defender.isImmobile) {
    hPlus += IMMOBILE_HIT_BONUS
  }
  const swings = weaponDamage.split('/')
  let damage = 0
  swings.forEach(swingDef => {
    const hit = swing(attacker.level, defender.toHitArmorLevel, attacker.strengthToHitBonus)
    if (hit) {
      didHit = true
      const pRoll = roll(swingDef)
      console.log('hit', dPlus, pRoll, attacker.strengthDamageBonus)
      damage += dPlus + pRoll + attacker.strengthDamageBonus
    }
  })
  if (defender.game.player === defender && defender.game.level === 1) {
    damage = Math.floor((damage + 1) / 2)
  }
  if (didHit) {
    defender.takeDamage(damage, 'killed by a ' + attacker.monsterType.name)
  }
  return didHit
}

export const strengthToHitBonus = (strength) => {
  const add = 4
  if (strength < 8)
    return strength - 7
  if (strength < 31)
    add--
  if (strength < 21)
    add--
  if (strength < 19)
    add--
  if (strength < 17)
    add--
  return add
}
