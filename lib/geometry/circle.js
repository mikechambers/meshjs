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

    context.lineWidth = this._lineWidth;

    context.strokeStyle =
      this._strokeStyle instanceof Color
        ? this._strokeStyle.toRGBA()
        : this._strokeStyle;

    context.fillStyle =
      this._fillStyle instanceof Color
        ? this._fillStyle.toRGBA()
        : this._fillStyle;

    context.beginPath();
    context.arc(this._center.x, this._center.y, this._radius, 0, Math.PI * 2);

    if (this._fillStyle) {
      context.fill();
    }

    if (this._lineWidth) {
      context.stroke();
    }
  }

  //todo: remove this once we impliment full svg support
  toSVG() {
    //note, we dont use rgba for colors, but use hex amd exlpicit opacity
    //in order to maintain support with illustrator
    return `<circle cx="${this._center.x}" cy="${this._center.y}"
				r="${this._radius}" stroke="${this._strokeStyle.toHex()}"
				fill-opacity="${this._fillStyle.alpha}"
				stroke-opacity="${this._strokeStyle.alpha}"
				fill="${this._fillStyle.toHex()}" stroke-width="${this._lineWidth}"/>`;
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
