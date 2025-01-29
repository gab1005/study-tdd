const STARTING_HEALTH = 1000;
const MAX_HEALTH = 1000;
const BASE_POWER = 100;

class Character {
  #maxHealth = MAX_HEALTH;
  #health = STARTING_HEALTH;
  #level = 1;

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

  #getPower () {
    return this.#level * BASE_POWER;
  }

  attack (target) {
    const damage = this.#getPower();
    target.#health = Math.max(0, target.#health - damage);
  }

  healing (target) {
    if (target.isAlive === false) {
      return;
    }

    const healing = this.#getPower();

    target.#health = Math.min(MAX_HEALTH, target.#health + healing);
  }
}

module.exports = Character;