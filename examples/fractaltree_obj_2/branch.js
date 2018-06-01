import Color from "../../lib/color/color.js";
import { random } from "../../lib/math/math.js";
import Vector from "../../lib/math/vector.js";
import { pointOnLine } from "../../lib/utils/utils.js";

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

  draw(context) {
    if (this.hasChildren) {
      for (let b of this._children) {
        b.draw(context);
      }
    }

    context.strokeStyle = this._branchColor.toCSS();
    context.lineWidth = 1.0;

    let r = this.hasChildren ? this._nodeRadius : this._leafRadius;
    let lineDestination = this._end;

    if (!this.hasChildren) {
      lineDestination = pointOnLine(this._end, this._start, r);
    }

    context.beginPath();
    context.moveTo(this._start.x, this._start.y);
    context.lineTo(lineDestination.x, lineDestination.y);
    context.stroke();

    context.fillStyle = this.hasChildren
      ? Color.WHITE.toCSS()
      : this._leafColor.toCSS();

    context.beginPath();
    context.arc(this._end.x, this._end.y, r, 0, Math.PI * 2);
    context.fill();
    context.stroke();
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
