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
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

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

  /*********** APP Specific Settings ************/

  LEAF_COLOR: "#00FF00",
  LEAF_RADIUS: 8,
  NODE_RADIUS: 2,
  LEAF_OPACITY: 0.8,
  BRANCH_COLOR: "#EEEEEE",
  GRADIENT_NAME: "ServQuick"
};

/************** GLOBAL VARIABLES ************/

//hot pink : 255,20,147

let context;
let bounds;

let circle;
let angle = (3 * Math.PI) / 2;

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
    Gradient.BOTTOM_TO_TOP
  );
  gradient.create();

  colorPallete = randomColorPallete();
  config.PALLETTE_NAME = colorPallete.name;

  root = new Branch(
    new Vector(bounds.center.x, bounds.height),
    new Vector(bounds.center.x, bounds.height - bounds.height / 5)
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

  for (let i = 0; i < 8; i++) {
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

  root.jitter();
  root.draw(context);
};

const click = function(event) {
  root.spawn();
};

window.onload = function() {
  meshjs.init(config, init, draw);
  meshjs.listen(click);
};
