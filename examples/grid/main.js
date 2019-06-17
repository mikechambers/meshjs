/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Rectangle from "../../lib/geometry/rectangle.js";
import Circle from "../../lib/geometry/circle.js";
import Color from "../../lib/color/color.js";
import * as math from "../../lib/math/math.js";

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
  CAPTURE_VIDEO: false,

  ANIMATE: false,
};

let bounds;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {

  let SIDE_DIMENSION = 20;
  let PADDING = 10;

  let rows = Math.floor(config.RENDER_HEIGHT / (SIDE_DIMENSION + PADDING));
  let cols = Math.floor(config.RENDER_WIDTH / (SIDE_DIMENSION + PADDING));

  let colOffset = (config.RENDER_WIDTH - ((cols * (SIDE_DIMENSION + PADDING))) + PADDING) / 2;
  let rowOffset = (config.RENDER_HEIGHT - ((cols * (SIDE_DIMENSION + PADDING))) + PADDING) / 2;

	let count = 0;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {

			let s = getShape(
				((SIDE_DIMENSION + PADDING) * c) + colOffset,
				((SIDE_DIMENSION + PADDING) * r) + rowOffset,
				SIDE_DIMENSION,
				SIDE_DIMENSION
			);;


      s.draw(context);
    }
  }
};

const getShape = function(x, y, width, height) {
	let s;


	let mod = 1;
	if(Math.random() > 0.5) {
		x = x + (width - width / 2) / 2;
		y = y + (height - height / 2) / 2;
		width = width / 2;
		height = height / 2;

	}
	if(Math.random() > 0.5) {
		s = new Rectangle(x, y, width, height);
	} else {
		s = new Circle(x + width / 2, y + height / 2, width / 2);
	}


	let fill = Color.WHITE;
	if(Math.random() > 0.5) {
		fill = Color.BLACK;
	}

	s.fillColor = fill;
	s.strokeColor = Color.BLACK;

	return s;
}

window.onload = function() {
  meshjs.init(config, init, draw);
};
