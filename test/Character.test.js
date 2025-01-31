const {describe, it} = require('mocha');
const {expect} = require('chai');
const Character = require('../src/Character');
const Prop = require('../src/Prop');

function repeatFunction (action, times) {
  for (let i = 0; i < times; i++) {
    action();
  }
}

describe("Character", () => {
  describe("A Character, when created, has...", () => {
    it("starts with 1000 of health", () => {
      const char = new Character(0);
      expect(char.health).to.equal(1000);
    });

    it("starts at level 1",() => {
      const char = new Character(0);
      expect(char.level).to.equal(1);
    });

    it("starts alive", () => {
      const char = new Character(0);
      expect(char.isAlive).to.be.true;
    });
  });
  
  describe("Character can deal damage to character", () => {
    it("subtracts damage from health", () => {
      const charA = new Character(-1);
      const charB = new Character(1);

      charA.attack(charB);;

      expect(charB.health).to.be.equal(900);
    });

    it("sets health to 0 if damage exceeds health", () => {
      const charA = new Character(-1);
      const charB = new Character(1);

      repeatFunction(() => charA.attack(charB), 11);

      expect(charB.health).to.be.equal(0);
    });

    it("dies when health becomes 0", () => {
      const charA = new Character(-1);
      const charB = new Character(1);

      repeatFunction(() => charA.attack(charB), 10);

      expect(charB.isAlive).to.be.false;
    });

    it("can not deal damage to itself", () => {
      const charA = new Character(0);

      expect(() => charA.attack(charA)).to.throw();
    });

    it("If the target is 5 or more Levels above the attacker, Damage is reduced by 50%", () => {
      const charA = new Character(-1);
      const charB = new Character(1);

      repeatFunction(() => charA.levelUp(), 6);

      charA.attack(charB);

      expect(charB.health).to.be.equal(850);
    });

    it("If the target is 5 or more levels below the attacker, Damage is increased by 50%", () => {
      const charA = new Character(-1);
      const charB = new Character(1);

      repeatFunction(() => charB.levelUp(), 6);

      charA.attack(charB);

      expect(charB.health).to.be.equal(950);
    });

  });

  describe("A Character can heal a character", () => {
    it("Dead character can not be healed", () =>{
      const charA = new Character(-1);
      const charB = new Character(1);

      repeatFunction(() => charA.attack(charB), 10);

      if (charB.isAlive === false) {
        charB.heal();
        expect(charB.health).to.not.be.above(0);
      }

    });

    it("Healing can not exceed 1000 health", () => {
      const charB = new Character(0);

      repeatFunction(() => charB.heal(), 50);

      expect(charB.health).to.be.not.above(1000);
    });

    it("can only heal itself", () => {
      const charA = new Character(-1);
      const charB = new Character(1);

      charA.attack(charB);

      charB.heal();

      expect(charB.health).to.be.equal(1000);
    });
  });

  describe("Character can level up", () => {
    it("level up by 1 one", () => {
      const char = new Character(0);

      char.levelUp();
      expect(char.level).to.be.equal(2);

      char.levelUp();
      expect(char.level).to.be.equal(3);
    })
  });

  describe("Characters have an attack Max Range", () => {
    it("Melee fighters have a range of 2 meters", () => {
      const char = new Character(0);
      expect(char.attackRange).to.be.equal(2);
    })

    it("Ranged fighters have a range of 20 meters", () => {
      const char = new Character(0, "ranged");
      expect(char.attackRange).to.be.equal(20);
    })

    it("Characters must be in range to deal damage to a target", () => {
      const charA = new Character(-5);
      const charB = new Character(5, "ranged");

      charA.attack(charB);
      expect(charB.health).to.equal(1000);
      
      charA.move(8); // charA.position = 3; charB.position = 5;
      charA.attack(charB);
      expect(charB.health).to.equal(900);

      charB.move(10); // charA.position = 3; charB.position = 15
      charB.attack(charA);
      expect(charA.health).to.equal(900);

      charB.move(200); // charA.position = 3; charB.position = 215; to far
      charB.attack(charA);
      expect(charA.health).to.equal(900);
      
    });
  })

  describe("Characters may belong to one or more Factions", () => {
    it("Newly created Characters belong to no Faction", () => {
      const charA = new Character(0);
      expect(charA.factions.length).to.equal(0);
    });

    it("A Character may Join or Leave one or more Factions.", () => {
      const charA = new Character(0);
      charA.joinFaction("f1");
      charA.joinFaction("f2");
      expect(charA.factions.includes("f1")).to.be.true;
      expect(charA.factions.includes("f2")).to.be.true;

      charA.leaveFaction("f2");
      expect(charA.factions.includes("f2")).to.be.false;
    });
    
    it("Players belonging to the same Faction are considered Allies", () => {
      const charA = new Character(0);
      const charB = new Character(1);

      charA.joinFaction("f1");
      charB.joinFaction("f1");

      expect(charA.isAlliedWith(charB)).to.be.true;
    });

    it("Allies cannot Deal Damage to one another", () => {
      const charA = new Character(0);
      const charB = new Character(1);

      charA.joinFaction("f1");
      charB.joinFaction("f1");

      expect(() => charA.attack(charB)).to.throw();
    });

    it("Allies can Heal one another", () => {
      const charA = new Character(0);
      const charB = new Character(1);

      charA.attack(charB);
      expect(charB.health).to.equal(900);

      charA.joinFaction("f1");
      charB.joinFaction("f1");
      charA.heal(charB);
      expect(charB.health).to.equal(1000);


    });
  });

  describe("Characters can damage non-character things (props)", () => {
    it("Anything that has Health may be a target", () => {
      const char = new Character(0);
      const tree = new Prop(2000);

      char.attack(tree);

      expect(tree.health).to.equal(1900);
    });
    it("cannot heal a prop", () => {
      const char = new Character(0);
      const tree = new Prop(2000);

      char.attack(tree);
      expect(() => char.heal(tree)).to.throw();
    });
  });


//   Characters can damage non-character things (props).
// Anything that has Health may be a target
// These things cannot be Healed and they do not Deal Damage
// These things do not belong to Factions; they are neutral
// When reduced to 0 Health, things are Destroyed
// As an example, you may create a Tree with 2000 Health
});
