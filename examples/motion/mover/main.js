/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../../lib/mesh.js";
import Mover from "../../../lib/motion/mover.js";
import Rectangle from "../../../lib/geometry/rectangle.js";
import Vector from "../../../lib/math/vector.js";

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
  RECORD_VIDEO: false,
  ANIMATE: true,
  CLEAR_CANVAS: true
};

let bounds;
let mover;
let movers;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  let points = bounds.getRandomPoints(100);
  movers = [];

  for (let i = 0; i < points.length; i++) {
    mover = new Mover(points[i], Vector.createRandomVelocity());
    mover.rectangle = new Rectangle(mover.position, 20, 10);
    mover.draw = function(context) {
      this.rectangle.position = this.position;

      context.save();
      //context.translate(this.rectangle.center.x, this.rectangle.center.y);
      context.rotate(this._velocity.heading);
      this.rectangle.draw(context);
      context.restore();
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
