/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../../lib/mesh.js";
import Mover from "../../../lib/motion/mover.js";
import Circle from "../../../lib/geometry/circle.js";
import Vector from "../../../lib/math/vector.js";
import BoundsMover from "../../../lib/motion/boundsmover.js";
import * as math from "../../../lib/math/math.js";
import { randomColorPallete } from "../../../lib/color/colorpallete.js";
import Color from "../../../lib/color/color.js";

/************ CONFIG **************/

let config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  //Max dimension canvas will be display at on page
  //note, exact dimension will depend on RENDER_HEIGHT / width and
  //ratio to these properties.
  //Canvas display will be scaled to maintain aspect ratio
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#EEEEEE",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA",

  //whether video of canvas is recorded
  RECORD_VIDEO: true,
  ANIMATE: true,
  CLEAR_CANVAS: true,
  CIRLCE_COUNT: 500,
  DEFAULT_RADIUS: 10,
  MIN_SCALE: 0.2,
  MAX_SCALE: 10,
  FILL_OPACITY: 0.8,
  LINE_WIDTH: 0.5
};

let bounds;
let mover;
let movers;
let cp;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  cp = randomColorPallete();

  let points = bounds.randomPoints(config.CIRLCE_COUNT);
  movers = [];

  for (let i = 0; i < config.CIRLCE_COUNT; i++) {
    mover = new BoundsMover(
      bounds,
      points[i],
      Vector.createRandomVelocity().multiply(5)
    );
    mover.circle = new Circle(mover.position, config.DEFAULT_RADIUS);

    mover.circle.fillColor = cp.getRandomColor(config.FILL_OPACITY);
    mover.circle.strokeColor = undefined;
    mover.circle.lineWidth = config.LINE_WIDTH;

    //note, this is pretty inefficient. more efficient way would be to extend mover
    //and cache some of these values and properties
    mover.draw = function(context) {
      let max = Math.floor(
        this._bounds.center.distance(
          new Vector(this._bounds.width / 2, this._bounds.y)
        )
      );
      let distance = this._bounds.center.distance(this.circle.center);

      let maxScale = config.MAX_SCALE;
      let minScale = config.MIN_SCALE;
      let radiusScale = math.map(distance, 0, max, minScale, maxScale);

      radiusScale = maxScale - radiusScale + minScale;

      this.circle.radius = radiusScale * config.DEFAULT_RADIUS;
      this.circle.center = this.position;
      this.circle.draw(context);
    };

    movers.push(mover);
  }
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  for (let mover of movers) {
    mover.update();
    mover.draw(context);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
