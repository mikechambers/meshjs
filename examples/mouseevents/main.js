/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Circle from "../../lib/geometry/circle.js";
import Color from "../../lib/color/color.js";

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
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //Where video of canvas is recorded
  CAPTURE_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false,

  /*********** APP Specific Settings ************/
  RADIUS: 20
};

/************** GLOBAL VARIABLES ************/

let bounds;
let _context;
let listenMouseMove = true;

/*************** CODE ******************/

const init = function(context) {
  _context = context;
  bounds = meshjs.bounds;
};

const draw = function(context, frameCount) {};

const click = function(event) {
  let position = event.position;

  console.log("mouseClick", event, position);

  let c = new Circle(position, config.RADIUS);
  c.fillColor = new Color(255, 0, 0, 0.5);
  c.draw(_context);

  meshjs.listen(mousemove, (listenMouseMove = !listenMouseMove));
};

const mouseup = function(event) {
  let position = event.position;
  console.log("mouseUp", event, position);

  let c = new Circle(position, config.RADIUS * 2);
  c.fillColor = new Color(0, 0, 255, 0.5);
  c.draw(_context);
};

const mousedown = function(event) {
  let position = event.position;
  console.log("mouseDown", event, position);

  let c = new Circle(position, config.RADIUS * 2);
  c.fillColor = new Color(128, 255, 0, 0.5);
  c.draw(_context);
};

const mousemove = function(event) {
  let position = event.position;
  console.log("mouseMove", event, position);

  let c = new Circle(position, config.RADIUS);
  c.fillColor = new Color(255, 0, 0);
  c.draw(_context);
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(click, mousemove, mousedown, mouseup);
};
