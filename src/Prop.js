class Prop {
  #health;

  constructor(health) {
    this.#health = health;
  }

  get health () {
    return this.#health;
  }

  get isDestroyed() {
    if (this.#health <= 0) return true;
    false;
  }

  takeDamage(damage) {
    this.#health = Math.max(0, this.#health - damage);
  }

}

module.exports = Prop;