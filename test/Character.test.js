const {describe, it} = require('mocha');
const {expect} = require('chai');
const Character = require('../src/Character');

function repeatFunction (action, times) {
  for (let i = 0; i < times; i++) {
    action();
  }
}

describe("Character", () => {
  describe("A Character, when created, has...", () => {
    it("starts with 1000 of health", () => {
      const char = new Character();
      expect(char.health).to.equal(1000);
    });

    it("starts at level 1",() => {
      const char = new Character();
      expect(char.level).to.equal(1);
    });

    it("starts alive", () => {
      const char = new Character();
      expect(char.isAlive).to.be.true;
    });
  });
  
  describe("Character can deal damage to character", () => {
    it("subtracts damage from health", () => {
      const charA = new Character();
      const charB = new Character();

      charA.attack(charB);;

      expect(charB.health).to.be.equal(900);
    });

    it("sets health to 0 if damage exceeds health", () => {
      const charA = new Character();
      const charB = new Character();

      repeatFunction(() => charA.attack(charB), 11);

      expect(charB.health).to.be.equal(0);
    });

    it("dies when health becomes 0", () => {
      const charA = new Character();
      const charB = new Character();

      repeatFunction(() => charA.attack(charB), 10);

      expect(charB.isAlive).to.be.false;
    });

    it("can not deal damage to itself", () => {
      const charA = new Character();

      expect(() => charA.attack(charA)).to.throw();
    });

    it("If the target is 5 or more Levels above the attacker, Damage is reduced by 50%", () => {
      const charA = new Character();
      const charB = new Character();

      repeatFunction(() => charA.levelUp(), 6);

      charA.attack(charB);

      expect(charB.health).to.be.equal(850);
    });

    it("If the target is 5 or more levels below the attacker, Damage is increased by 50%", () => {
      const charA = new Character();
      const charB = new Character();

      repeatFunction(() => charB.levelUp(), 6);

      charA.attack(charB);

      expect(charB.health).to.be.equal(950);
    });

  });

  describe("A Character can heal a character", () => {
    it("Dead character can not be healed", () =>{
      const charA = new Character();
      const charB = new Character();

      repeatFunction(() => charA.attack(charB), 10);

      if (charB.isAlive === false) {
        charB.heal();
        expect(charB.health).to.not.be.above(0);
      }

    });

    it("Healing can not exceed 1000 health", () => {
      const charB = new Character();

      repeatFunction(() => charB.heal(), 50);

      expect(charB.health).to.be.not.above(1000);
    });

    it("can only heal itself", () => {
      const charA = new Character();
      const charB = new Character();

      charA.attack(charB);

      charB.heal();

      expect(charB.health).to.be.equal(1000);
    });
  });

  describe("Character can level up", () => {
    it("level up by 1 one", () => {
      const char = new Character();

      char.levelUp();
      expect(char.level).to.be.equal(2);

      char.levelUp();
      expect(char.level).to.be.equal(3);
    })
  });
});
