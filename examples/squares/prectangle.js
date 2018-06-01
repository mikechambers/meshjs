import Rectangle from "../../lib/geometry/rectangle.js";
import { random } from "../../lib/math/math.js";

export default class PRectangle extends Rectangle {
  constructor(x, y, width, height) {
    super(x, y, width, height);

    this._fillColor = undefined;
    this._strokeColor = undefined;
  }
  jitter(amt = 1) {
    this._x += random(-amt, amt);
    this._y += random(-amt, amt);
    this._width += random(-amt, amt);
    this._height += random(-amt, amt);
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
