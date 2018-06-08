import Vector from "../math/vector.js";
import { randomInt } from "../math/math.js";
import Shape from "./shape.js";

export default class Rectangle extends Shape {
  constructor(x, y, width, height) {
    super();

    if (x instanceof Vector) {
      height = width;
      width = y;
      y = x.y;
      x = x.x;
    }

    this._x = x;
    this._y = y;
    this._height = height;
    this._width = width;
    this._updateCenter();
  }

  _updateCenter() {
    if (!this._center) {
      this._center = new Vector();
    }

    this._center.x = this._x + this._width / 2;
    this._center.y = this._y + this._height / 2;
  }

  get center() {
    return this._center;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
    this._updateCenter();
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
    this._updateCenter();
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
    this._updateCenter();
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
    this._updateCenter();
  }

  set position(vector) {
    this._x = vector.x;
    this._y = vector.y;
  }

  get position() {
    return new Vector(this._x, this._y);
  }

  //todo: do we need to return new instances here?
  get topLeft() {
    return new Vector(this._x, this._y);
  }

  get topRight() {
    return new Vector(this._x + this._width, this._y);
  }

  get bottomRight() {
    return new Vector(this._x + this._width, this._y + this._height);
  }

  get bottomLeft() {
    return new Vector(this._x, this._y + this._height);
  }

  draw(context) {
    if (context === undefined) {
      console.log("Rectangle.draw(context) : context is undefined.");
    }

    context.lineWidth = this._lineWidth;

    context.strokeStyle =
      this._strokeColor === undefined ? undefined : this._strokeColor.toCSS();

    context.fillStyle =
      this._fillColor === undefined ? undefined : this._fillColor.toCSS();

    context.beginPath();

    if (this._fillColor !== undefined) {
      context.fillRect(this._x, this._y, this._width, this._height);
      context.fill();
    }

    if (this._lineWidth) {
      context.strokeRect(this._x, this._y, this._width, this._height);
      context.stroke();
    }
  }

  //scales the rectangle by included amout. note, if you want to make a copy
  //first call copy : r.copy().scale(2);
  //todo: should this return a copy, similar to Vector. in which case call interval
  //withScale?
  //or make a static version?
  scale(scale) {
    this._height *= scale;
    this._width += scale;
  }

  withScale(scale) {
    let r = this.copy();
    r.scale(scale);
    return r;
  }

  pad(padding) {
    this._x += padding;
    this._width -= padding * 2;

    this._y += padding;
    this._height -= padding * 2;
  }

  //returns a new instance of Rectangle, with dimensions based on existing
  //instance with padding applied to all 4 sides
  withPadding(padding) {
    let r = this.copy();

    r.pad(padding);

    return r;
  }

  randomPoint() {
    return new Vector(
      randomInt(this._x, this._x + this._width),
      randomInt(this._y, this._y + this._height)
    );
  }

  randomPoints(count) {
    let out = new Array(count);

    for (let i = 0; i < count; i++) {
      out[i] = this.randomPoint();
    }

    return out;
  }

  copy() {
    return new Rectangle(this._x, this._y, this._width, this._height);
  }

  containsPoint(vector) {
    return (
      vector.x > this._x &&
      vector.x < this._x + this._width &&
      vector.y > this._y &&
      vector.y < this._y + this._height
    );
  }
}
