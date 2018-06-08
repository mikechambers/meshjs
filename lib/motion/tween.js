import Vector from "../math/vector.js";

export default class Tween {
  constructor(start, end, duration, easeFunction, oncomplete) {
    this._start = start;
    this._end = end;

    if (this._start instanceof Vector) {
      this._start = this._start.copy();
      this._end = this._end.copy();
    }

    this._duration = duration;
    this._startTime = undefined;
    this._easeFunction = easeFunction;
    this._oncomplete = oncomplete;
    this._completed = false;
  }

  start() {
    this._startTime = Date.now();
  }

  get isCompleted() {
    return this._completed;
  }

  update() {
    let elapsedTime = Date.now() - this._startTime;

    if (elapsedTime > this._duration) {
      if (this._oncomplete !== undefined) {
        this._oncomplete(this._end);
      }

      this._completed = true;

      return this._end;
    }

    let pos = this._easeFunction(elapsedTime / this._duration);
    let out;

    if (this._start instanceof Vector) {
      out = new Vector();
      out.x = this._start.x + (this._end.x - this._start.x) * pos;
      out.y = this._start.y + (this._end.y - this._start.y) * pos;
    } else {
      out = this._start + (this._end - this._start) * pos;
    }

    return out;
  }
}
