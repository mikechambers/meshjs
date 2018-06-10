/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import * as utils from "../../lib/utils/utils.js";
import Circle from "../../lib/geometry/circle.js";

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

  MAIN_RADIUS: 300,
  POINT_RADIUS: 10,
  POINT_COUNT: 20
};

let bounds;
let circle;
let circles;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  circles = [];

  let points = utils.randomPointsOnCircle(
    bounds.center,
    config.MAIN_RADIUS,
    config.POINT_COUNT
  );

  circle = new Circle(bounds.center.copy(), config.MAIN_RADIUS);

  for (let p of points) {
    let c = new Circle(p, config.POINT_RADIUS);
    circles.push(c);
  }
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  circle.draw(context);

  for (let c of circles) {
    c.draw(context);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
