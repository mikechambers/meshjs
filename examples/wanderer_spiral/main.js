/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Vector from "../../lib/math/vector.js";
import Color from "../../lib/color/color.js";
import Gradient, {
  randomGradient,
  gradientFromName
} from "../../lib/color/gradient.js";

import Wanderer from "./wanderer.js";
import Rectangle from "../../lib/geometry/rectangle.js";
import { loadPixelDataFromPathWithBounds } from "../../lib/data/pixeldata.js";
import { randomInt } from "../../lib/math/math.js";

/************ CONFIG **************/

const config = {
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  BACKGROUND_COLOR: "#ffffff", //background color of html page
  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA", //efefef fefefe
  RECORD_VIDEO: false,
  CLEAR_CANVAS: false,

  /*** project specific ***/
  WANDERER_COUNT: 20,
  STROKE_OPACITY: 0.5,
  MOVEMENT_SCALE: 10,
  START_RANDOM: false,
  FADE_FROM_CENTER: false,
  DEFAULT_RADIUS: 60
};

/************** GLOBAL VARIABLES ************/

let bounds;

let wanderers;
let maxDistance;
let pixels;
let startPixels;

let gradient;
/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;

  //maxDistance = bounds.center.distance(new Vector(bounds.x, bounds.center.y));

  meshjs.canvas.clear();

  gradient = randomGradient(bounds, Gradient.TOP_TO_BOTTOM);
  //let gradient = gradientFromName("By Design", bounds, Gradient.TOP_TO_BOTTOM);
  config.GRADIENT_NAME = gradient.name;
  console.log(gradient.name);
  gradient.create();

  startPixels = bounds.getRandomPoints(config.WANDERER_COUNT);
  wanderers = [];

  for (let i = 0; i < config.WANDERER_COUNT; i++) {
    let v = config.START_RANDOM ? startPixels[i] : bounds.center.copy();

    let w = new Wanderer(v, config.DEFAULT_RADIUS);
    w.movementScale = config.MOVEMENT_SCALE;
    w.strokeColor.alpha = config.STROKE_OPACITY;
    wanderers.push(w);
  }
};

const draw = function(context, frameCount) {
  for (let w of wanderers) {
    if (w.done) {
      continue;
    }

    w.strokeColor = gradient.getColor(w.position, config.STROKE_OPACITY);
    w.draw(context);

    if (!bounds.containsPoint(w.position)) {
      w.done = true;
      continue;
    }
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
