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
  WANDERER_COUNT: 2000,
  STROKE_OPACITY: 0.5,
  MOVEMENT_SCALE: 10,
  START_RANDOM: true,
  FADE_FROM_CENTER: false,
  DEFAULT_RADIUS: 60,
  TEMPLATE: "mask.gif",
  USE_TEMPLATE: true
};

/************** GLOBAL VARIABLES ************/

let bounds;

let wanderers;
let pd;
let maxDistance;
let pixels;
let startPixels;
/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;

  //maxDistance = bounds.center.distance(new Vector(bounds.x, bounds.center.y));

  meshjs.canvas.clear();

  let gradient = randomGradient(bounds, Gradient.TOP_TO_BOTTOM);
  //let gradient = gradientFromName("By Design", bounds, Gradient.TOP_TO_BOTTOM);
  config.GRADIENT_NAME = gradient.name;
  console.log(gradient.name);
  gradient.create();

  pd = gradient.pixelData;
  pd.cache();

  startPixels = bounds.randomPoints(config.WANDERER_COUNT);

  wanderers = [];

  for (let i = 0; i < config.WANDERER_COUNT; i++) {
    let v = config.START_RANDOM
      ? startPixels[randomInt(startPixels.length)]
      : bounds.center.clone();

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

    let c = pixels.getColor(w.position);
    if (config.USE_TEMPLATE) {
      w.strokeColor.alpha = c.isEqualTo(Color.WHITE) ? 0.6 : 0.1;
      w.draw(context);
    }

    if (!bounds.containsPoint(w.position)) {
      w.done = true;
      continue;
    }
  }
};

window.onload = function() {
  loadPixelDataFromPathWithBounds(
    config.TEMPLATE,
    function(pd) {
      pixels = pd;
      startPixels = pixels.filter(Color.WHITE);
      pixels.cache();
      meshjs.init(config, init, draw);
    },
    new Rectangle(0, 0, config.RENDER_WIDTH, config.RENDER_HEIGHT)
  );
};
