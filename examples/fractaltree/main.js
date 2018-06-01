/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Vector from "../../lib/math/vector.js";
import Circle from "../../lib/geometry/circle.js";
import Color from "../../lib/color/color.js";
import { map } from "../../lib/math/math.js";

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
  BACKGROUND_COLOR: "#000000",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#222222",

  //Where video of canvas is recorded
  RECORD_VIDEO: true,

  /*********** APP Specific Settings ************/
  STROKE_COLOR: "#FFFFFF",
  START_LENGTH: 300,
  STROKE_WIDTH: 2
};

/************** GLOBAL VARIABLES ************/

let bounds;
let _context;

let angle = 0;

let mousePosition = new Vector();

/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;
  _context = context;
};

const draw = function(context, frameCount) {
  angle = map(mousePosition.x, 0, bounds.width, 0, Math.PI * 2);

  context.save();
  context.translate(bounds.center.x, bounds.height);
  branch(config.START_LENGTH);
  context.restore();
};

const branch = function(len) {
  if (len < 4) {
    return;
  }

  drawLine(new Vector(0, 0), new Vector(0, -len));
  _context.translate(0, -len);

  _context.save();
  _context.rotate(angle);
  branch(len * 0.67);
  _context.restore();

  _context.save();
  _context.rotate(-angle);
  branch(len * 0.67);
  _context.restore();
};

const drawLine = function(start, end) {
  _context.beginPath();
  _context.strokeStyle = "#FFFFFF";
  _context.lineWidth = config.STROKE_WIDTH;
  _context.moveTo(start.x, start.y);
  _context.lineTo(end.x, end.y);
  _context.stroke();
};

const mousemove = function(event) {
  mousePosition = event.position;
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(mousemove);
};
