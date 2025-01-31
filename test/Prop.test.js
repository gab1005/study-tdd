const { describe, it } = require("mocha");
const { expect } = require("chai");
const Prop = require("../src/Prop");

describe("Prop", () => {
  it("is destroyed when health reaches 0", () => {
    const prop = new Prop(2000);

    prop.takeDamage(2000);
    expect(prop.isDestroyed).to.be.true;
  });
});
