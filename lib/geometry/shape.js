import Color from "../../lib/color/color.js";

export default class Shape {
  constructor() {
    this._fillStyle = Color.WHITE;
    this._strokeStyle = Color.BLACK;
    this._lineWidth = 1.0;
  }

  get fillStyle() {
    return _fillStyle._name;
  }

  set fillStyle(color) {
    this._fillStyle = color;
  }

  get strokeStyle() {
    return this._strokeStyle;
  }

  set strokeStyle(color) {
    this._strokeStyle = color;
  }

  get lineWidth() {
    return this._lineWidth;
  }
  set lineWidth(width) {
    this._lineWidth = width;
  }

  draw(context) {
    console.log("Shape.draw : This method should be overridden by subclass.");
  }
}
