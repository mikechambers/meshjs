import Circle from "../../lib/geometry/circle.js";
import Color from "../../lib/color/Color.js";
import * as math from "../../lib/math/math.js";
import Vector from "../../lib/math/vector.js";

export default class GCircle extends Circle {
  constructor(center, radius, bounds) {
    super(center, radius);

    this._bounds = bounds;

    let strokeColor = Color.BLACK;
    strokeColor.alpha = 0.5;

    this._innerCircle = new Circle(center, 10);
    this._innerCircle.lineWidth = 1.0;
    this._innerCircle.strokeColor = strokeColor;

    this._xmove = math.random(-5, 5);
    this._ymove = math.random(-5, 5);

    this._childCircles;
  }

  set fillColor(value) {
    super.fillColor = value;
    this._innerCircle.fillColor = value;
  }

  get fillColor() {
    return super.fillColor;
  }

  draw(context) {
    //super.draw(context);
    //this._innerCircle.draw(context);

    for (let c of this._childCircles) {
      c.draw(context);
    }
  }

  update(circles) {
    this.center.x += this._xmove;
    this.center.y += this._ymove;

    if (this.center.x > this._bounds.x + this._bounds.width + this.radius) {
      this.center.x = this._bounds.x - this.radius;
    } else if (this.center.x < this._bounds.x - this.radius) {
      this.center.x = this._bounds.x + this._bounds.width + this.radius;
    }

    if (this.center.y > this._bounds.y + this._bounds.height + this.radius) {
      this.center.y = this._bounds.y - this.radius;
    } else if (this.center.y < this._bounds.y - this.radius) {
      this.center.y = this._bounds.y + this._bounds.height + this.radius;
    }
    this._childCircles = [];
    for (let circle of circles) {
      if (circle === this) {
        continue;
      }

      let dist = circle.center.distance(this.center);
      let overlap = dist - this.radius - circle.radius;
      if (overlap < 0) {
        let midx = (circle.center.x + this.center.x) / 2;
        let midy = (circle.center.y + this.center.y) / 2;

        let c = new Circle(new Vector(midx, midy), Math.abs(overlap));
        c.fillColor = new Color(255, 0.1);
        c.strokeColor = new Color(255, 0.0);
        this._childCircles.push(c);
      }
    }
  }
}
