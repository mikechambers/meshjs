import Rectangle from "./rectangle.js";
import Vector from "../math/vector.js";

export default class RoundedRectangle extends Rectangle {
  constructor(x, y, width, height, radius) {
    super(x, y, width, height);

    if (x instanceof Vector) {
      radius = height;
    }

    this._radius = radius;
  }

  draw(context) {
    context.beginPath();
    context.moveTo(this._x + this._radius, this._y);
    context.lineTo(this._x + this._width - this._radius, this._y);
    context.arc(
      this._x + this._width - this._radius,
      this._y + this._radius,
      this._radius,
      (3 * Math.PI) / 2,
      0
    );
    context.lineTo(
      this._x + this._width,
      this._y + this._height - this._radius
    );

    context.arc(
      this._x + this._width - this._radius,
      this._y + this._height - this._radius,
      this._radius,
      0,
      Math.PI / 2
    );

    context.lineTo(this._x + this._radius, this._y + this._height);
    context.arc(
      this._x + this._radius,
      this._y + this._height - this._radius,
      this._radius,
      Math.PI / 2,
      Math.PI
    );

    context.lineTo(this._x, this._y + this._radius);
    context.arc(
      this._x + this._radius,
      this._y + this._radius,
      this._radius,
      Math.PI,
      (3 * Math.PI) / 2
    );

    context.lineWidth = this._lineWidth;

    context.strokeStyle =
      this._strokeColor === undefined ? undefined : this._strokeColor.toCSS();

    context.fillStyle =
      this._fillColor === undefined ? undefined : this._fillColor.toCSS();

    if (this._fillColor !== undefined) {
      context.fill();
    }

    if (this._lineWidth) {
      context.stroke();
    }
  }
}
