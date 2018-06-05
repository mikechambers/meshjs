/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import JCircle from "./jcircle.js";
import Vector from "../../lib/math/vector.js";
import { randomColorPallete } from "../../lib/color/colorpallete.js";
import Color from "../../lib/color/color.js";
import { shuffleArray } from "../../lib/utils/utils.js";

/************ CONFIG **************/

let config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  //Max dimension canvas will be display at on page
  //note, exact dimension will depend on RENDER_HEIGHT / width and
  //ratio to these properties.
  //Canvas display will be config.SCALEd to maintain aspect ratio
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#EEEEEE",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA",

  //whether video of canvas is recorded
  RECORD_VIDEO: true,

  ENABLE_DEBUG: false,
  BATCH_CANVAS_CALLS: true,
  FILTER_DRAW_COMMANDS: true,

  SCALE: 40,
  CIRCLE_RESOLUTION: 100,
  FILL_OPACITY: 0.8,
  LINE_WIDTH: 0
};

let bounds;
let circles;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  circles = [];

  let cols = bounds.width / config.SCALE;
  let rows = bounds.width / config.SCALE;

  let pallete = randomColorPallete();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let cp = new Vector(
        x * config.SCALE + config.SCALE / 2,
        y * config.SCALE + config.SCALE / 2
      );
      let jc = new JCircle(cp, config.SCALE / 2, config.CIRCLE_RESOLUTION);
      jc.fillColor = pallete.getRandomColor(config.FILL_OPACITY);

      jc.strokeColor = Color.WHITE;
      jc.lineWidth = config.LINE_WIDTH;

      circles.push(jc);
    }
  }

  shuffleArray(circles);

  //context.globalCompositeOperation = "divide";
  //context.shadowColor = "black";
  //context.shadowBlur = 10;
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  for (let c of circles) {
    c.draw(context);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
