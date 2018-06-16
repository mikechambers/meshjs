import Circle from "./circle.js";
import Drawable from "../core/drawable.js";

export default class Segment extends Drawable {
  constructor(p1, p2) {
    super();
    this._p1 = p1;
    this._p2 = p2;

    this._endPointRadius = 0;
    this._p1Circle = new Circle(this._p1, this._endPointRadius);
    this._p2Circle = new Circle(this._p2, this._endPointRadius);
  }

  draw(context) {
    context.beginPath();
    context.moveTo(this._p1.x, this._p1.y);
    context.lineTo(this._p2.x, this._p2.y);

    context.strokeStyle = this._strokeColor.toCSS();
    context.stroke();

    if (this._endPointRadius > 0) {
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

  set p1(value) {
    this._p1 = value;
    this._p1Circle.center = this._p1;
  }

  get p2() {
    return this._p2;
  }

  set p2(value) {
    this._p2 = value;
    this._p2Circle.center = this._p2;
  }

  set endPointRadius(value) {
    this._endPointRadius = value;
    this._p1Circle.radius = this._endPointRadius;
    this._p2Circle.radius = this._endPointRadius;
  }

  get endPointRadius() {
    return this._endPointRadius;
  }
}
