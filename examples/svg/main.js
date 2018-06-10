/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
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
  CANVAS_BACKGROUND_COLOR: "#FFFF00",

  //whether video of canvas is recorded
  CAPTURE_VIDEO: false,
  ANIMATE: false,

  BATCH_DRAW_COMMANDS: true,
  CAPTURE_SVG: true
};

let bounds;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  let red = new Color(255, 0, 0, 0.5);
  context.lineWidth = 6;
  context.strokeStyle = red.toCSS();
  context.beginPath();
  context.moveTo(bounds.center.x, bounds.center.y);
  context.lineTo(100, 100);
  context.stroke();

  context.lineWidth = 2;
  context.strokeStyle = "#00FF00";

  context.moveTo(100, 100);
  context.lineTo(900, 900);
  context.stroke();

  context.strokeStyle = "#0000FF";
  context.beginPath();
  context.moveTo(900, 100);
  context.lineTo(900, 900);
  context.stroke();
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {};

window.onload = function() {
  meshjs.init(config, init, draw);
};
