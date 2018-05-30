import Rectangle from "../../lib/rectangle.js";
import { randomIntInclusive } from "../../lib/math.js";

export default class PRectangle extends Rectangle {
  constructor(x, y, width, height) {
    super(x, y, width, height);

    this._fillColor = undefined;
    this._strokeColor = undefined;
  }
  jitter(amt = 1) {
    this._x += randomIntInclusive(-amt, amt);
    this._y += randomIntInclusive(-amt, amt);
    this._width += randomIntInclusive(-amt, amt);
    this._height += randomIntInclusive(-amt, amt);
  }

  set fillColor(value) {
    this._fillColor = value;
  }
  get fillColor() {
    return this._fillColor;
  }

  set strokeColor(value) {
    this._strokeColor = value;
  }
  get strokeColor() {
    return this._strokeColor;
  }
}
