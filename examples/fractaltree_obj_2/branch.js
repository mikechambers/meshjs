import Color from "../../lib/color.js";
import { random } from "../../lib/math.js";
import Vector from "../../lib/vector.js";
import { pointOnLine } from "../../lib/utils.js";

export default class Branch {
  constructor(start, end) {
    this._start = start;
    this._end = end;

    this._children = [];

    this._leafColor = Color.WHITE;
    this._leafRadius = 6;
    this._nodeRadius = 3;
    this._branchColor = Color.WHITE;

    this._options = undefined;
  }

  set start(position) {
    this._start = position;
  }

  get start() {
    return this._start;
  }

  set options(options) {
    this._leafColor = options.leafColor;
    this._leafRadius = options.leafRadius;
    this._nodeRadius = options.nodeRadius;
    this._branchColor = options.branchColor;

    this._options = options;

    if (this.hasChildren) {
      for (let b of this._children) {
        b.options = options;
      }
    }
  }

  get hasChildren() {
    return this._children != undefined && this._children.length > 0;
  }

  set leafColor(color) {
    this._leafColor = color;
  }

  set nodeRadius(radius) {
    this._nodeRadius = radius;
  }

  set leafRadius(radius) {
    this._leafRadius = radius;
  }

  set branchColor(color) {
    this._branchColor = color;
  }

  jitter() {
    this._end.add(Vector.createRandom(1));

    for (let b of this._children) {
      b.start = this._end;
      b.jitter();
    }
  }

  draw(ctx) {
    if (this.hasChildren) {
      for (let b of this._children) {
        b.draw(ctx);
      }
    }

    ctx.strokeStyle = this._branchColor.toRGBA();
    ctx.lineWidth = 1.0;

    let r = this.hasChildren ? this._nodeRadius : this._leafRadius;
    let lineDestination = this._end;

    if (!this.hasChildren) {
      lineDestination = pointOnLine(this._end, this._start, r);
    }

    ctx.beginPath();
    ctx.moveTo(this._start.x, this._start.y);
    ctx.lineTo(lineDestination.x, lineDestination.y);
    ctx.stroke();

    ctx.fillStyle = this.hasChildren
      ? Color.WHITE.toRGBA()
      : this._leafColor.toRGBA();

    ctx.beginPath();
    ctx.arc(this._end.x, this._end.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  get length() {
    return this._start.distance(this._end);
  }

  spawn() {
    if (this.hasChildren) {
      for (let b of this._children) {
        b.spawn();
      }
      return;
    }

    //let heading = Vector.subtract(this._end, this._start).heading;

    let b1 = this.createChild(random(0, Math.PI / 4));
    let b2 = this.createChild(-random(0, Math.PI / 4));

    this._children.push(b1);
    this._children.push(b2);
  }

  createChild(angle) {
    let dir = Vector.subtract(this._end, this._start);
    dir.rotate(angle);
    dir.multiply(random(0.5, 0.9));

    let end = Vector.add(this._end, dir);
    let b = new Branch(this._end, end);
    b.options = this._options;

    return b;
  }
}
