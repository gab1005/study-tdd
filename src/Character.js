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
  #factions = new Set(); // Set garante que todos os elementos são unicos
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

  #getPower (target) {
    let modifier = 1;
    if (this.level - target.level >=5) modifier = 1.5;
    if (target.level - this.level >= 5) modifier = 0.5;
    return BASE_POWER * modifier;
  }

  #isInRange (target) {
    const distanceBetweenCharacter = Math.abs(this.#position - target.#position);

    const isInRange = this.#attackRange >= distanceBetweenCharacter;

    return isInRange;
  }

  get attackRange () {
    return this.#attackRange;
  }

  get factions() {
    return [...this.#factions];
  }

  attack (target) {
    if (target instanceof Character) {
      this.#attackCharacter(target);
    } else {
      this.#attackProp(target);
    }
  }

  #attackProp(target) {
    target.takeDamage(BASE_POWER);
  }

  #attackCharacter (target) {
    if (target === this) throw new Error("Cannot attack itself");

    if (this.isAlliedWith(target)) throw new Error("Cannot attack an allied");
    if (this.#isInRange(target) === false) return;

    const damage = this.#getPower(target);
    target.#health = Math.max(0, target.#health - damage);
  }

  heal (target = null) {
    if (target === null) target = this;
    if (!(target instanceof Character)) {
      throw new Error("Can only heal a character.");
    }

    if (target !== this && !target.isAlliedWith(this)) {
      throw new Error("Cannot heal a character from another faction.");
    }

    if (target.isAlive === false) {
      return;
    }

    const healingPower = this.#getPower(this);
    target.#health = Math.min(MAX_HEALTH, target.#health + healingPower);
  }

  levelUp () {
    this.#level++;
  }

  move (meters) {
    this.#position += meters;
  }

  joinFaction(faction) {
    this.#factions.add(faction);
  }

  leaveFaction(faction) {
    this.#factions.delete(faction);
  }

  isAlliedWith(other) {
    for(let faction of other.factions) {
      if (this.#factions.has(faction)) return true;
    }

    return false;
  }

}

module.exports = Character;