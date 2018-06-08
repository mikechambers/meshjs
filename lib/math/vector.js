import { random } from "./math.js";

export default class Vector {
  constructor(x = 0, y = 0) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  set x(x) {
    this._x = x;
  }

  get y() {
    return this._y;
  }

  set y(y) {
    this._y = y;
  }

  get magnitude() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  set magnitude(magnitude) {
    this.normalize();
    this.multiply(magnitude);
  }

  angleTo(vector) {
    let dot = this.dot(vector);

    return Math.cos(dot / this.magnitude + vector.magnitude);
  }

  dot(vector) {
    return this._x * vector.x + this._y * vector.y;
  }

  get heading() {
    return Math.atan2(this._y, this._x);
  }

  distance(vector) {
    let x = vector.x - this._x;
    let y = vector.y - this._y;
    return Math.sqrt(x * x + y * y);
  }

  normalize() {
    let m = this.magnitude;

    if (m > 0) {
      this.divide(m);
    }

    return this;
  }

  limit(max) {
    if (this.magnitude > max) {
      this.normalize();
      this.multiply(max);
    }

    return this;
  }

  add(vector) {
    this._x += vector.x;
    this._y += vector.y;

    return this;
  }

  subtract(vector) {
    this._x -= vector.x;
    this._y -= vector.y;

    return this;
  }

  multiply(value) {
    this._x *= value;
    this._y *= value;

    return this;
  }

  divide(value) {
    this._x /= value;
    this._y /= value;

    return this;
  }

  rotate(angle) {
    let h = this.heading + angle;
    var m = this.magnitude;
    this._x = Math.cos(h) * m;
    this._y = Math.sin(h) * m;

    return this;
  }

  //floors x, y values so they are whole number ints.
  floor() {
    this._x = Math.floor(this._x);
    this._y = Math.floor(this._y);

    return this;
  }

  clone() {
    return new Vector(this._x, this._y);
  }

  static fromAngle(angleInRads = 0) {
    let v = new Vector();
    v.x = Math.cos(angleInRads);
    v.y = Math.sin(angleInRads);

    return v;
  }

  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static divide(v1, value) {
    return new Vector(v1.x / value, v1.y / value);
  }

  static multiply(v1, value) {
    return new Vector(v1.x * value, v1.y * value);
  }

  static createRandom(min_max = 0, max = 1) {
    if (arguments.length == 1) {
      max = min_max;
      min_max = 0;
    }
    return new Vector(random(min_max, max), random(min_max, max));
  }

  static createRandomVelocity(scale = 1) {
    return Vector.createRandom(-scale, scale);
  }

  clone() {
    return new Vector(this._x, this._y);
  }
}
