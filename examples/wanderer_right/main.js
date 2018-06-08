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

import { map, randomInt } from "../../lib/math/math.js";

/************ CONFIG **************/

const config = {
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  BACKGROUND_COLOR: "#ffffff", //background color of html page
  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA", //efefef fefefe
  RECORD_VIDEO: true,
  BATCH_CANVAS_CALLS: true,
  CLEAR_CANVAS: false,

  /*** project specific ***/
  WANDERER_COUNT: 100,
  STROKE_OPACITY: 0.3,
  MOVEMENT_SCALE: 10,
  START_RANDOM: false,
  FADE_FROM_CENTER: false
};

/************** GLOBAL VARIABLES ************/

let bounds;

let wanderers;
let pd;
let maxDistance;
/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;

  maxDistance = bounds.center.distance(new Vector(bounds.x, bounds.center.y));

  meshjs.canvas.clear();

  let gradient = randomGradient(bounds, Gradient.TOP_TO_BOTTOM);
  //let gradient = gradientFromName("By Design", bounds, Gradient.TOP_TO_BOTTOM);
  config.GRADIENT_NAME = gradient.name;
  console.log(gradient.name);
  gradient.create();

  pd = gradient.pixelData;
  pd.cache();

  wanderers = [];

  for (let i = 0; i < config.WANDERER_COUNT; i++) {
    let v = config.START_RANDOM ? bounds.getRandomPoint() : bounds.center.copy();

    wanderers.push(v);
  }
};

const draw = function(context, frameCount) {
  for (let position of wanderers) {
    if (position.done) {
      continue;
    }

    context.beginPath();
    context.moveTo(position.x, position.y);

    let dir = randomInt(0, 4);

    let x = 0;
    let y = 0;
    switch (dir) {
      case 0:
        x = config.MOVEMENT_SCALE;
        break;
      case 1:
        x = -config.MOVEMENT_SCALE;
        break;
      case 2:
        y = config.MOVEMENT_SCALE;
        break;
      case 3:
        y = -config.MOVEMENT_SCALE;
        break;
    }

    position.x += x;
    position.y += y;

    //config.MOVEMENT_SCALE

    let strokeColor;

    if (config.FADE_FROM_CENTER) {
      let distance = position.distance(bounds.center);

      let alpha = 1 - map(distance, 0, maxDistance, 0, 0.5);
      strokeColor = pd.getColor(position, alpha);
    } else {
      strokeColor = pd.getColor(position, config.STROKE_OPACITY);
    }

    context.strokeStyle = strokeColor.toCSS();

    if (!bounds.containsPoint(position)) {
      position.done = true;
      continue;
    }

    context.lineTo(position.x, position.y);
    context.stroke();
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
