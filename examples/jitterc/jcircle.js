import Circle from "../../lib/geometry/circle.js";
import Vector from "../../lib/math/vector.js";
import * as utils from "../../lib/utils/utils.js";
import noise from "../../lib/math/noise.js";

export default class JCircle extends Circle {
  constructor(center, radius, resolution = 60) {
    super(center, radius);

    this._resolution = resolution;
    this._radiusStep = Math.random() * 10000;
    this._seed = Math.random() * 100;
    this._xinc = Math.random() * 100;
    this._yinc = Math.random() * 100;
    /*
    this._points = [];
    for (let i = 0; i < Math.PI * 2; i += stepSize) {
      this._points.push(utils.pointOnCircle(this._center, this._radius, i));
    }
    */
  }

  draw(context) {
    this.center.x += (noise(this.center.x * this._xinc) - 0.5) * 3;
    this.center.y += (noise(this.center.y * this._yinc) - 0.5) * 3;

    this._xinc += 0.1;
    this._yinc += 0.1;

    let path = new Path2D();
    this._seed += 0.01;

    let stepSize = (Math.PI * 2) / this._resolution;
    for (let i = 0; i < Math.PI * 2; i += stepSize) {
      let angle = i;
      let frequency = 2.15;
      let magnitude = 0.5; // this is scaling impact of deformation

      let x = Math.cos(angle);
      let y = Math.sin(angle);

      let deformation = noise(x * frequency, y * frequency, this._seed);
      let radius = this._radius * (1.5 + magnitude * deformation);

      if (i > 0) {
        path.lineTo(this._center.x + radius * x, this._center.y + radius * y);
      } else {
        path.moveTo(this._center.x + radius * x, this._center.y + radius * y);
      }
    }

    if (this._lineWidth) {
      context.strokeStyle = this._strokeColor.toCSS();
      context.stroke(path);
    }

    context.fillStyle = this._fillColor.toCSS();
    context.fill(path);
  }
}
