/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import { loadPixelDataFromPathWithBounds } from "../../lib/data/pixeldata.js";
import Rectangle from "../../lib/geometry/rectangle.js";
import { randomIntInclusive } from "../../lib/math/math.js";
import Circle from "../../lib/geometry/circle.js";
import Color from "../../lib/color/color.js";

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
  TEMPLATE: "radial.png",
  COUNT: 4000,
  MAX_RADIUS: 40
};

let bounds;
let _pd; //PixelData

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  let c = _pd.getColor(40,40);

  //context.putImageData(_pd.imageData, 0, 0);

  let fill = new Color(255,255,255, 1.0);
  let stroke = new Color(0,0,0, 0.8);

  for(let i = 0; i < config.COUNT; i++) {
    let x = randomIntInclusive(0, config.RENDER_WIDTH);
    let y = randomIntInclusive(0, config.RENDER_HEIGHT);

    let c = _pd.getColor(x, y);
    let v = c.toHSV().value;

    let radius = Math.floor(config.MAX_RADIUS * v);

    let circle = new Circle(x, y, radius);

    circle.fillColor = fill;
    circle.strokeColor = stroke;
    circle.draw(context);
  }
};

window.onload = function() {
  loadPixelDataFromPathWithBounds(
    config.TEMPLATE,
    function(pd) {
      _pd = pd;
      meshjs.init(config, init, draw);
    },
    new Rectangle(0, 0, config.RENDER_WIDTH, config.RENDER_HEIGHT)
  );
};
