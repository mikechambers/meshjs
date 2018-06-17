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
import Segment from "./segment.js";
import Color from "../../lib/color/color.js";

/************ CONFIG **************/

let config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 2520,
  RENDER_WIDTH: 2520,

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

  MAIN_RADIUS: 1000,
  POINT_RADIUS: 10,
  SEGMENT_COUNT: 10000,
  MIN_DISTANCE: 10,
  SEGMENT_OPACITY: 0.1
};

let bounds;
let circle;
let segments;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  segments = [];

  circle = new Circle(bounds.center.copy(), config.MAIN_RADIUS);

  for (let i = 0; i < config.SEGMENT_COUNT; i++) {
    let distance = 0;

    let p1;
    let p2;
    while (distance < config.MIN_DISTANCE) {
      p1 = utils.randomPointOnCircle(bounds.center, config.MAIN_RADIUS, 2);
      p2 = utils.randomPointOnCircle(bounds.center, config.MAIN_RADIUS, 2);

      distance = p1.distance(p2);
    }

    let s = new Segment(p1, p2);
    s.strokeColor = new Color(0, 0, 0, config.SEGMENT_OPACITY);
    segments.push(s);
  }
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  circle.draw(context);

  for (let s of segments) {
    s.draw(context);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
