/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Vector from "../../lib/vector.js";
import Color from "../../lib/color.js";
import Gradient, {
  randomGradient,
  gradientFromName
} from "../../lib/gradient.js";

/************ CONFIG **************/

const config = {
  /**** required for mesh lib ******/

  //name of container that generated canvas will be created in
  PARENT_ID: "canvas_container",

  //app name, used for saving files
  PROJECT_NAME: meshjs.getProjectName(),

  //whether we proxy and capture canvas calls so we can spit out svg
  //svg output currently not implimented
  CAPTURE_SVG: false,

  //whether to output debug information (currently just for)
  //canvas rendering.
  ENABLE_DEBUG: false,

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
  BACKGROUND_COLOR: "#ffffff",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FAFAFA", //efefef fefefe

  //whether a single frame is rendered, or draw is called based on FPS setting
  ANIMATE: true,
  FPS: 60,

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false,
  WANDERER_COUNT: 20,
  STROKE_OPACITY: 0.3,
  MOVEMENT_SCALE: 8,
  START_RANDOM: false

  /*********** APP Specific Settings ************/
};

/************** GLOBAL VARIABLES ************/

let ctx;
let bounds;

let wanderers;
let pd;
/*************** CODE ******************/

const init = function(canvas) {
  ctx = canvas.context;
  bounds = canvas.bounds;
  canvas.clear();

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

const draw = function(canvas, frameCount) {
  for (let position of wanderers) {
    if (position.done) {
      continue;
    }

    let strokeColor = pd.getColor(position, config.STROKE_OPACITY);
    ctx.strokeStyle = strokeColor.toRGBA();

    ctx.beginPath();
    ctx.moveTo(position.x, position.y);

    let v = Vector.createRandom();
    v.multiply(config.MOVEMENT_SCALE);
    position.add(v);

    if (!bounds.containsPoint(position)) {
      position.done = true;
      continue;
    }

    ctx.lineTo(position.x, position.y);
    ctx.stroke();
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
