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
  STROKE_OPACITY: 0.3,
  MOVEMENT_SCALE: 8,
  START_RANDOM: false
};

/************** GLOBAL VARIABLES ************/

let bounds;

let wanderers;
let pd;
/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;

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
    let v = config.START_RANDOM ? bounds.randomPoint() : bounds.center.clone();

    wanderers.push(v);
  }
};

const draw = function(context, frameCount) {
  for (let position of wanderers) {
    if (position.done) {
      continue;
    }

    let strokeColor = pd.getColor(position, config.STROKE_OPACITY);
    context.strokeStyle = strokeColor.toCSS();

    context.beginPath();
    context.moveTo(position.x, position.y);

    let v = Vector.createRandom();
    v.multiply(config.MOVEMENT_SCALE);
    position.add(v);

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
