import Vector from "../math/vector.js";
import Rectangle from "./rectangle.js";
import Color from "../color/color.js";
import Shape from "./shape.js";

export default class Circle extends Shape {
  constructor(x, y_r, r) {
    super();

    if (x instanceof Vector) {
      this._center = x;
      r = y_r;
    } else {
      this._center = new Vector(x, y_r);
    }

    this._radius = r;
  }

  get center() {
    return this._center;
  }

  set center(vector) {
    this._center = vector;
  }

  draw(context) {
    if (context === undefined) {
      console.log("Circle.draw(context) : context is undefined.");
    }

    context.drawCircle(this);
  }

  get bounds() {
    let out = new Rectangle();
    out.x = this._center.x - this._radius;
    out.y = this._center.y - this._radius;
    out.width = this._radius * 2 + this._lineWidth;
    out.height = this._radius * 2 + this._lineWidth;

    return out;
  }

  containsPoint(vector) {
    return this._center.distance(vector) < this._radius;
  }

  set radius(radius) {
    this._radius = radius;
  }

  get radius() {
    return this._radius;
  }
}
