//t : current time
//b : start position
//c : change in position (finishPosition - startPosition)
//d : duration

export function linear2(t, b, c, d) {
  return c * (t / d) + b;
}

export function linearq(t, b, c, d) {
  return c * (t / d) + b;
}

export function linear3(start, destination, percent) {
  return (destination - start) * percent + start;
}

export function linear4(start, destination, percent) {
  return (destination - start) * percent + start;
}

export class Tween {
  constructor(start, end, duration, type = "linear") {
    this._start = start;
    this._end = end;
    this._duration = duration;
    this._startTime = undefined;
  }

  start() {
    this._startTime = Date.now();
  }

  update() {
    let elapsedTime = Date.now() - this._startTime;

    if (elapsedTime > this._duration) {
      return this._end;
    }

    let e = this.sineOut(elapsedTime / this._duration);
    console.log(elapsedTime, e);
    //console.log(e);
    return this._start + (this._end - this._start) * e;
  }

  sineOut(t) {
    return Math.sin((t * Math.PI) / 2);
  }
}
