import Circle from "../../lib/geometry/circle.js";
import Drawable from "../../lib/core/drawable.js";

export default class Segment extends Drawable {
  constructor(p1, p2) {
    super();
    this._p1 = p1;
    this._p2 = p2;

    this._pointRadius = 0;
    this._p1Circle = new Circle(this._p1, this._pointRadius);
    this._p2Circle = new Circle(this._p2, this._pointRadius);
  }

  draw(context) {
    context.beginPath();
    context.moveTo(this._p1.x, this._p1.y);
    context.lineTo(this._p2.x, this._p2.y);

    context.strokeStyle = this._strokeColor.toCSS();
    context.stroke();

    if (this._pointRadius) {
      this._p1Circle.draw(context);
      this._p2Circle.draw(context);
    }
  }

  set pointRadius(value) {
    this._pointRadius = value;
  }

  get p1() {
    return this._p1;
  }

  get p2() {
    return this._p2;
  }
}
