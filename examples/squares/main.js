/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import PRectangle from "./prectangle.js";
import Color from "../../lib/color/color.js";
import ColorPalette, {
  randomColorPallete
} from "../../lib/color/colorpallete.js";
import { shuffleArray } from "../../lib/utils/utils.js";

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
  BACKGROUND_COLOR: "#FFFFFF",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA",

  //Where video of canvas is recorded
  CAPTURE_VIDEO: true,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: true,
  ANIMATE:true,

  /*
    Custom keyboard commands for project. These will be printed in the console
    at start. Commands should be in able format like so:
    KEY_COMMANDS: {
      g: "Add nodes",
      b: "Cycle through colors"
    },
  */
  KEY_COMMANDS: {},

  PADDING: -20,
  FILL_OPACITY: 1.0,
  JITTER: true,
  JITTER_AMOUNT: 1,
  SCALE: 80,
  STROKE_COLOR: "#ffffff",
  LINE_WIDTH: 0.5,
  SHUFFLE: false,
  SHADOW_BLUR: 20

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

  let cols = Math.floor(bounds.width / config.SCALE);
  let rows = Math.floor(bounds.height / config.SCALE);

  let i = 0;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let r = new PRectangle(
        x * config.SCALE,
        y * config.SCALE,
        config.SCALE,
        config.SCALE
      );

      r.pad(config.PADDING);

      r.fillColor = cp.getRandomColor(config.FILL_OPACITY);
      r.strokeColor = config.STROKE_COLOR;
      r.lineWidth = config.LINE_WIDTH;

      rectangles.push(r);
    }
  }

  if (config.SHUFFLE) {
    shuffleArray(rectangles);
  }

  if (config.SHADOW_BLUR) {
    context.shadowColor = "#000000";
    context.shadowBlur = config.SHADOW_BLUR;
  }
};

const draw = function(context, frameCount) {
	return;
	console.log("draw");


  //see if we can store these
  context.strokeStyle = Color.WHITE.toCSS();
  //context.fillStyle = Color.WHITE.toCSS();

  for (let r of rectangles) {
    if (config.JITTER) {
      r.jitter(config.JITTER_AMOUNT);
    }

    context.fillStyle = r.fillColor.toCSS();
    context.strokeRect(r.x, r.y, r.width, r.height);
    context.fillRect(r.x, r.y, r.width, r.height);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
