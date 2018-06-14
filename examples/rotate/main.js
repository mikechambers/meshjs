/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Rectangle from "../../lib/geometry/rectangle.js";
import * as utils from "../../lib/utils/utils.js";

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
  CANVAS_BACKGROUND_COLOR: "#FAFAFA",

  //whether video of canvas is recorded
  CAPTURE_VIDEO: false
};

let bounds;
let rectangle;
let angle = 0;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  rectangle = new Rectangle(bounds.center.copy(), 40, 20);
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  context.save();
  context.translate(rectangle.center.x, rectangle.center.y);
  context.rotate(angle);

  context.strokeRect(
    -rectangle.width / 2,
    -rectangle.height / 2,
    rectangle.width,
    rectangle.height
  );
  context.stroke();

  context.restore();
};

const mousemove = function(event) {
  angle = utils.angleBetweenPoint(rectangle.center, event.position);
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(mousemove);
};
