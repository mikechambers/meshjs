/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import Gradient, { gradientFromName } from "../../lib/color/gradient.js";
import meshjs from "../../lib/mesh.js";

/************ CONFIG **************/

const config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1920,

  //whether canvas calls are batched and executed at once, or as they are made
  BATCH_DRAW_COMMANDS: false,

  //whether to output debug information (currently just for)
  //canvas rendering.
  DEBUG_DRAW_COMMANDS: false,

  //Max dimension canvas will be display at on page
  //note, exact dimension will depend on RENDER_HEIGHT / width and
  //ratio to these properties.
  //Canvas display will be scaled to maintain aspect ratio
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#FFFFFF",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //whether a single frame is rendered, or draw is called based on FPS setting
  ANIMATE: false,

  //Where video of canvas is recorded
  CAPTURE_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false,

  /*********** APP Specific Settings ************/

  GRADIENT_NAME: "Rainbow Blue"
};

/************** GLOBAL VARIABLES ************/

let bounds;

/*************** CODE ******************/
const init = function(context) {
  bounds = meshjs.bounds;
};

const draw = function(context) {
  let gradient = gradientFromName(
    "Rainbow Blue",
    bounds,
    Gradient.TOP_RIGHT_TO_BOTTOM_LEFT
  );
  gradient.create();

  context.drawImage(
    gradient.canvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height
  );
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
