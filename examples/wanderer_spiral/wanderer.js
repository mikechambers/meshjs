import Drawable from "../../lib/core/drawable.js";
import Vector from "../../lib/math/vector.js";
import { random } from "../../lib/math/math.js";
import { pointOnCircle } from "../../lib/utils/utils.js";

export default class Wanderer extends Drawable {
  constructor(position, radius) {
    super();

    this._position = position;
    this._radius = radius;
    this._angle = random(0, Math.PI * 2);
    this._stepSize = (Math.PI * 2) / 720;
    this._lastPoint = pointOnCircle(this._position, this._radius, this._angle);
    this._movementScale = 5;
    this._done = false;
  }

  draw(context) {
    if (this._done) {
      return;
    }

    let v = Vector.createRandomVelocity(this._movementScale);
    this._position.add(v);
    this._angle += this._stepSize;

    let p = pointOnCircle(this._position, this._radius, this._angle);

    context.strokeStyle = this._strokeColor.toCSS();
    context.lineWidth = this._lineWidth;
    context.beginPath();
    context.moveTo(this._lastPoint.x, this._lastPoint.y);
    context.lineTo(p.x, p.y);
    context.stroke();

    this._lastPoint = p;
  }

  set movementScale(value) {
    this._movementScale = value;
  }

  get position() {
    return this._position;
  }

  set done(value) {
    this._done = value;
  }

  get done() {
    return this._done;
  }
}
