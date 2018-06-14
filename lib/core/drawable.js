import Color from "../color/color.js";
export default class Drawable {
  constructor() {
    this._fillColor = Color.WHITE;
    this._strokeColor = Color.BLACK;
    this._lineWidth = 1.0;
  }

  get fillColor() {
    return this._fillColor;
  }

  set fillColor(color) {
    this._fillColor = color;
  }

  get strokeColor() {
    return this._strokeColor;
  }

  set strokeColor(color) {
    this._strokeColor = color;
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
