/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Rectangle from "../../lib/geometry/rectangle.js";
import * as math from "../../lib/math/math.js";

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
  CAPTURE_VIDEO: false,
  ANIMATE: false,

  RECT_COUNT: 500,
  PADDING: 20,
  RECT_BOUNDS_MIN: 20,
  RECT_BOUNDS_MAX: 100
};

let bounds;
let rectangles;
let padded;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  padded = bounds.withPadding(config.PADDING);

  context.clear();

  rectangles = [];

  for (var i = 0; i < config.RECT_COUNT; i++) {
    let w = math.randomInt(config.RECT_BOUNDS_MIN, config.RECT_BOUNDS_MAX);
    let h = math.randomInt(config.RECT_BOUNDS_MIN, config.RECT_BOUNDS_MAX);

    let position = padded.getRandomPoint();

    if (
      position.x + w > padded.x + padded.width ||
      position.y + h > padded.y + padded.height
    ) {
      i--;
      continue;
    }

    let r = new Rectangle(position, w, h);
    rectangles.push(r);
  }
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  padded.draw(context);
  for (let r of rectangles) {
    r.draw(context);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
