/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Segment from "../../lib/geometry/segment.js";
import Vector from "../../lib/math/vector.js";
import Circle from "../../lib/geometry/circle.js";
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
  CAPTURE_VIDEO: false,
  CLEAR_CANVAS: true,
  ANIMATE: true
};

let bounds;
let segment;
let mouseSegment;
let intersectionCircle;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;
  let bounds2 = bounds.withPadding(100);

  segment = new Segment(bounds2.topLeft, bounds2.bottomRight);
  segment.endPointRadius = 2;

  mouseSegment = new Segment(bounds2.bottomLeft, new Vector());
  mouseSegment.endPointRadius = 2;

  intersectionCircle = new Circle(new Vector(), 6);
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  let intersection = utils.getSegmentIntersection(mouseSegment, segment);

  segment.draw(context);
  mouseSegment.draw(context);

  if (intersection !== undefined) {
    intersectionCircle.center = intersection;
    intersectionCircle.draw(context);
  }
};

const mousemove = function(event) {
  mouseSegment.p2 = event.position;
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(mousemove);
};
