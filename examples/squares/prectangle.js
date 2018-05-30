import Rectangle from "../../lib/rectangle.js";
import { randomInt } from "../../lib/math.js";

export default class PRectangle extends Rectangle {
  jitter(amt = 1) {
    this._x += randomInt(-amt, amt);
    this._y += randomInt(-amt, amt);
    this._width += randomInt(-amt, amt);
    this._height += randomInt(-amt, amt);

    this._fillColor = undefined;
    this._strokeColor = undefined;
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
