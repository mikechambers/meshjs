/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
//import Rectangle from "../../lib/rectangle.js";
import PRectangle from "./prectangle.js";
import Color from "../../lib/color.js";
import ColorPalette, { randomColorPallete } from "../../lib/colorpallete.js";

/************ CONFIG **************/

const config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  //Max dimension canvas will be display at on page
  //note, exact dimension will depend on RENDER_HEIGHT / width and
  //ratio to these properties.
  //Canvas display will be scaled to maintain aspect ratio
  MAX_DISPLAY_HEIGHT: 540,
  MAX_DISPLAY_WIDTH: 540,

  //background color of html page
  BACKGROUND_COLOR: "#EEEEEE",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA",

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false,

  /*
    Custom keyboard commands for project. These will be printed in the console
    at start. Commands should be in able format like so:
    KEY_COMMANDS: {
      g: "Add nodes",
      b: "Cycle through colors"
    },
  */
  KEY_COMMANDS: {}

  /*********** APP Specific Settings ************/
};

/************** GLOBAL VARIABLES ************/

let bounds;

let rectangles;

/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;

  rectangles = [];

  let cp = randomColorPallete();
  config.COLOR_PALLETE_NAME = cp.name;

  let cols = bounds.width / 8;
  let rows = bounds.height / 8;
  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let r = new PRectangle(x * rows, y * cols, cols, rows);
      r.pad(20);

      r.fillColor = cp.getRandomColor();
      r.strokeColor = Color.WHITE;

      rectangles.push(r);
    }
  }
};

const draw = function(context, frameCount) {
  //see if we can store these
  context.strokeStyle = Color.BLACK.toRGBA();
  context.fillStyle = Color.WHITE.toRGBA();

  for (let r of rectangles) {
    r.jitter(1);
    context.strokeRect(r.x, r.y, r.width, r.height);
    context.fillRect(r.x, r.y, r.width, r.height);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
