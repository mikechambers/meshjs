/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import GCircle from "./gcircle.js";
import * as math from "../../lib/math/math.js";
import Color from "../../lib/color/color.js";

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
  CANVAS_BACKGROUND_COLOR: "#242944", //"#FAFAFA",
  CLEAR_CANVAS: true,

  //whether video of canvas is recorded
  CAPTURE_VIDEO: false,
  CIRCLE_CYCLE_COUNT: 10,
  RADIUS_MAX: 100,
  LINE_WIDTH: 1.0
};

let bounds;
let circles;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;
  circles = [];
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  for (let circle of circles) {
    circle.update(circles);
    circle.draw(context);
  }
};

const addCircles = function() {
  for (let i = 0; i < config.CIRCLE_CYCLE_COUNT; i++) {
    let p = bounds.getRandomPoint();
    let c = new GCircle(p, math.randomInt(config.RADIUS_MAX) + 10, bounds);

    c.lineWidth = 0;
    c.fillColor = new Color(150, 0.5);

    circles.push(c);
  }
};

const click = function(event) {
  addCircles();
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(click);
};
