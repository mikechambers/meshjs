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
import Branch from "./branch.js";
import * as utils from "../../lib/utils/utils.js";
import ColorPalette, {
  randomColorPallete
} from "../../lib/color/colorpallete.js";
import Gradient, { gradientFromName } from "../../lib/color/gradient.js";

/************ CONFIG **************/

const config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080, //2436,
  RENDER_WIDTH: 1080, //1125,

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
  CAPTURE_VIDEO: false,

  KEY_COMMANDS: {
    g: "Add nodes",
    b: "Cycle through colors"
  },

  /*********** APP Specific Settings ************/

  LEAF_COLOR: "#00FF00",
  LEAF_RADIUS: 8,
  NODE_RADIUS: 2,
  LEAF_OPACITY: 0.9,
  BRANCH_COLOR: "#333333", //"#EEEEEE",
  GRADIENT_NAME: "Bora Bora",
  START_GENERATIONS: 10,
  JITTER: true
};

/************** GLOBAL VARIABLES ************/

//hot pink : 255,20,147

let context;
let bounds;

let circle;
let angle = (3 * Math.PI) / 4;

let mousePosition = new Vector();

let colorPallete;
let gradient;

/*************** CODE ******************/

let root;
let leafColor;
const init = function(context) {
  bounds = meshjs.bounds;

  gradient = gradientFromName(
    config.GRADIENT_NAME,
    bounds,
    Gradient.TOP_TO_BOTTOM
  );
  gradient.create();

  colorPallete = randomColorPallete();

  root = new Branch(
    new Vector(bounds.center.x, bounds.height),
    new Vector(bounds.center.x, bounds.height - bounds.height / 4)
  );

  let c = colorPallete.getRandomColor();
  c.alpha = config.LEAF_OPACITY;

  let options = {
    leafColor: c,
    leafRadius: config.LEAF_RADIUS,
    nodeRadius: config.NODE_RADIUS,
    branchColor: Color.fromHex(config.BRANCH_COLOR)
  };

  root.options = options;

  for (let i = 0; i < config.START_GENERATIONS; i++) {
    root.spawn();
  }
};

const draw = function(context, frameCount) {
  context.drawImage(
    gradient.canvas,
    bounds.x,
    bounds.y,
    bounds.width,
    bounds.height
  );

  if (config.JITTER) {
    root.jitter();
  }
  root.draw(context);
};

const updateColor = function() {
  let c = colorPallete.getRandomColor();
  c.alpha = config.LEAF_OPACITY;

  root.updateLeafColor(c);
};

const keypress = function(event) {
  if (event.key === "g") {
    root.spawn();
  } else if (event.key === "b") {
    updateColor();
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(keypress);
};
