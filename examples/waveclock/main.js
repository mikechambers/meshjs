/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import { random, radians } from "../../lib/math/math.js";
import noise from "../../lib/math/noise.js";
import Color from "../../lib/color/color.js";
import Line from "../../lib/geometry/line.js";

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
  CAPTURE_VIDEO: false,

  CLEAR_CANVAS: false,

  ANGLE_STEP_DEGREES: 1,
  LINE_OPACITY: 0.6,
  LINE_WIDTH: 0.5,
  ANGLE_NOISE_INC: 0.005,
  POS_NOISE_INC: 0.01
};

let bounds;

let angnoise;
let radiusnoise;
let xnoise;
let ynoise;
let angle = -Math.PI / 2;

let radius;
let strokeColor = Color.BLACK;
let strokeChange = 1;
let radiusBase;

const init = function(context) {
  bounds = meshjs.bounds;

  radiusBase = bounds.center.distance(bounds.topLeft);

  angnoise = random(10);
  radiusnoise = random(10);
  xnoise = random(10);
  ynoise = random(10);

  meshjs.canvas.clear();
};

const draw = function(context, frameCount) {
  strokeColor.alpha = config.LINE_OPACITY;
  radiusnoise += config.ANGLE_NOISE_INC;
  radius = noise(radiusnoise) * radiusBase + 1;

  angnoise += 0.001;
  angle += radians(noise(angnoise) * config.ANGLE_STEP_DEGREES);

  if (angle > Math.PI * 2) {
    angle -= Math.PI * 2;
  } else if (angle < 0) {
    angle += Math.PI * 2;
  }

  xnoise += config.POS_NOISE_INC;
  ynoise += config.POS_NOISE_INC;

  let centerX = bounds.center.x + noise(xnoise) * 100 - 50;
  let centerY = bounds.center.y + noise(ynoise) * 100 - 50;

  let x1 = centerX + radius * Math.cos(angle);
  let y1 = centerY + radius * Math.sin(angle);

  let oppangle = angle + Math.PI;
  let x2 = centerX + radius * Math.cos(oppangle);
  let y2 = centerY + radius * Math.sin(oppangle);

  strokeColor.setToGrey((strokeColor.red += strokeChange));

  if (strokeColor.red >= 255) {
    strokeChange = -1;
  } else if (strokeColor.red <= 0) {
    strokeChange = 1;
  }

  let line = new Line(x1, y1, x2, y2); //we could reuse this instance for performance
  line.strokeColor = strokeColor;
  line.lineWidth = config.LINE_WIDTH;
  line.draw(context);
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
