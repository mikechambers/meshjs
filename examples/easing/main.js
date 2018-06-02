/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import * as easing from "../../lib/motion/easing.js";
import Circle from "../../lib/geometry/circle.js";
import Vector from "../../lib/math/vector.js";
import Tween from "../../lib/motion/tween.js";

/************ CONFIG **************/

const config = {
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

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  /*
    Custom keyboard commands for project. These will be printed in the console
    at start. Commands should be in a format like so:
    KEY_COMMANDS: {
      g: "Add nodes",
      b: "Cycle through colors"
    },
  */
  KEY_COMMANDS: {}

  /*********** APP Specific Settings ************/
};

let bounds;
let circle;
let cBounds;
let tween;

const init = function(context) {
  bounds = meshjs.bounds;
  cBounds = bounds.withPadding(20);

  let radius = 20;
  circle = new Circle(cBounds.x + radius, cBounds.center.y, radius);

  tween = new Tween(
    circle.center,
    new Vector(cBounds.width - radius, circle.center.y),
    2000,
    easing.cubicInOut
  );
  tween.start();
};

const draw = function(context, frameCount) {
  circle.center = tween.update();

  cBounds.draw(context);
  circle.draw(context);
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
