const STARTING_HEALTH = 1000;
const MAX_HEALTH = 1000;
const BASE_POWER = 100;
const STARTING_LEVEL = 1;
const RANGE = {
  MELEE: 2,
  RANGED: 20,
}

class Character {
  #maxHealth = MAX_HEALTH;
  #health = STARTING_HEALTH;
  #level = STARTING_LEVEL;
  #position;
  #attackRange;

  constructor(position, type = "melee") {
    if (arguments.length < 1 || typeof arguments[0] !== "number") throw new Error("Invalid");

    if (!["melee", "ranged"].includes(type)) throw new Error('Invalid character type, use "melee" or "range".');

    this.#position = position;
    this.#attackRange = type === "melee" ? RANGE.MELEE : RANGE.RANGED;
  }

  get health () {
    return this.#health;
  }

  get level () {
    return this.#level;
  }

  get isAlive () {
    if (this.#health <= 0) {
      return false;
    }

    return true;
  }

  get attackRange () {
    return this.#attackRange;
  }

  #getPower (target) {
    let modifier = 1;
    if (this.level - target.level >=5) modifier = 1.5;
    if (target.level - this.level >= 5) modifier = 0.5;
    return BASE_POWER * modifier;
  }

  attack (target) {
    if (target === this) throw new Error("Cannot attack itself");
    const damage = this.#getPower(target);
    target.#health = Math.max(0, target.#health - damage);
  }

  heal () {
    // if (arguments.length) throw new Error("INVALID");

    if (this.isAlive === false) {
      return;
    }

    const healingPower = this.#getPower(this);
    this.#health = Math.min(this.#maxHealth, this.#health + healingPower);
  }

  levelUp () {
    this.#level++;
  }

  move (meters) {
    this.#position += meters;
  }
}

module.exports = Character;