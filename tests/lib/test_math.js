import * as math from "../../lib/math.js";
import { expect } from "chai";

/******* randomIntInclusive ***********/
describe("randomIntInclusive", () => {
  it("Should return numbers in specified range", () => {
    let range = 1;

    let min = 0;
    let max = 0;
    for (let i = 0; i < 1000; i++) {
      let r = math.randomIntInclusive(-range, range);
      expect(r >= -range && r <= range).to.equal(true);

      if (r > max) {
        max = r;
      } else if (r < min) {
        min = r;
      }
    }

    expect(min == -range).to.equal(true);
    expect(max == range).to.equal(true);
  });
});

describe("randomIntInclusive", () => {
  it("Should return numbers from 0 to arg", () => {
    let range = 5;

    let min = 0;
    let max = 0;
    for (let i = 0; i < 1000; i++) {
      let r = math.randomIntInclusive(range);
      expect(r >= -range && r <= range).to.equal(true);

      if (r > max) {
        max = r;
      } else if (r < min) {
        min = r;
      }
    }

    expect(min == 0).to.equal(true);
    expect(max == range).to.equal(true);
  });
});

/******* randomInt ***********/
describe("randomInt", () => {
  it("Should return numbers in specified range", () => {
    let range = 1;

    let min = 0;
    let max = 0;
    for (let i = 0; i < 1000; i++) {
      let r = math.randomInt(range);
      expect(r >= 0 && r < range).to.equal(true);

      if (r > max) {
        max = r;
      } else if (r < min) {
        min = r;
      }
    }

    expect(min == 0).to.equal(true);
    expect(max < range).to.equal(true);
  });
});

describe("randomInt", () => {
  it("Should return numbers from 0 up to arg", () => {
    let range = 5;

    let min = 0;
    let max = 0;
    for (let i = 0; i < 1000; i++) {
      let r = math.randomInt(range);
      expect(r >= 0 && r < range).to.equal(true);

      if (r > max) {
        max = r;
      } else if (r < min) {
        min = r;
      }
    }

    expect(min == 0).to.equal(true);
    expect(max < range).to.equal(true);
  });
});

/******* random ***********/
describe("random", () => {
  it("Should return numbers in specified range", () => {
    let range = 1;
    for (let i = 0; i < 10000; i++) {
      let r = math.random(-range, range);
      expect(r >= -range && r < range).to.equal(true);
    }
  });
});

describe("random", () => {
  it("Should return numbers from 0 to arg", () => {
    let range = 1;

    for (let i = 0; i < 10000; i++) {
      let r = math.random(range);
      expect(r >= 0 && r < range).to.equal(true);
    }
  });
});
