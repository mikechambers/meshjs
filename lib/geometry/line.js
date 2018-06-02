import Shape from "./shape.js";
import Vector from "../math/vector.js";

export default class Line {
  constructor(x1_v1 = 0, y1_v2 = 0, x2 = 0, y2 = 0) {
    if (x1_v1 instanceof Vector) {
      this._start = x1_v1;
      this._end = y1_v2;
    } else {
      this._start = new Vector(x1_v1, y1_v2);
      this._end = new Vector(x2, y2);
    }
  }

  get start() {
    return this._start;
  }
  set start(value) {
    this._start = value;
  }

  get end() {
    return this._end;
  }
  set end(value) {
    this._end = value;
  }

  draw(context) {
    context.strokeStyle = this.strokeColor.toCSS();
    context.lineWidth = this.lineWidth;
    context.beginPath();
    context.moveTo(this._start.x, this._start.y);
    context.lineTo(this._end.x, this._end.y);
    context.stroke();
  }
}
