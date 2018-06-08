/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import PCircle from "./pcircle.js";
import { downloadSVG } from "../../lib/data/datautils.js";
import * as utils from "../../lib/utils/utils.js";
import Vector from "../../lib/math/vector.js";
import Color from "../../lib/color/color.js";
import { colorPalleteFromName } from "../../lib/color/colorpallete.js";
import { randomInt } from "../../lib/math/math.js";
import Gradient from "../../lib/color/gradient.js";
import { loadPixelDataFromPathWithBounds } from "../../lib/data/pixeldata.js";
import ColorPallete from "../../lib/color/colorpallete.js";
import Rectangle from "../../lib/geometry/rectangle.js";

/************ CONFIG **************/

let colorSource = {
  PALLETE: "PALLETE",
  GRADIENT: "GRADIENT",
  FILL: "FILL"
};

let config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080, //1600,
  RENDER_WIDTH: 1080, //2560,

  //Max dimension canvas will be display at on page
  //note, exact dimension will depend on RENDER_HEIGHT / width and
  //ratio to these properties.
  //Canvas display will be scaled to maintain aspect ratio
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#EEEEEE",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  /*********** APP Specific Settings ************/

  RADIUS: 4,
  CIRCLE_BOUNDS_PADDING: 8,
  STROKE_COLOR: "#000000",
  FILL_COLOR: "#FFFFFF",
  COLOR_SOURCE: colorSource.PALLETE, // PALLETE, GRADIENT, FILL
  PALLETE_NAME: "Melon Ball Surprise",
  STROKE_SIZE: 2,
  DRAW_BY_DEFAULT: true, //hit d key to toggle whether frames are rendered
  INIT_AFTER_COMPLETE: false,
  DOWNLOAD_PNG_ON_COMPLETE: true,
  TEMPLATE: "mask.gif",

  DEFAULT_COUNT: 20
};

/************** GLOBAL VARIABLES ************/

let bounds;
let circles;

let pAmount;
let pallete;

let pixels;
let _doDraw;
let _completed;
let _completedCaptured;

let gradient;

let originalPixels = [];
let pointBounds;

/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;
  pointBounds = bounds.withPadding(
    config.STROKE_SIZE + config.CIRCLE_BOUNDS_PADDING
  );

  pixels = [...originalPixels];
  _completed = false;
  _completedCaptured = false;
  _doDraw = config.DRAW_BY_DEFAULT;

  meshjs.setPaused(false);

  if (config.COLOR_SOURCE == colorSource.PALLETE) {
    pallete = colorPalleteFromName(config.PALLETE_NAME);
  } else if (config.COLOR_SOURCE == colorSource.GRADIENT) {
    gradient = Gradient.random();
    gradient.create();
  }

  circles = [];

  utils.shuffleArray(pixels);

  pAmount = 1;
};

const draw = function(context, frameCount) {
  if (!(frameCount % 60)) {
    let total = originalPixels.length;
    let current = pixels.length;
    let per = 100 - Math.round((current / total) * 100);
    console.log(`${per}%`, pixels.length, circles.length);
  }

  let count = config.DEFAULT_COUNT;
  if (circles.length > 300) {
    count = 1000;
  }

  let points = getgetRandomPoints(count);

  for (let p of points) {
    if (
      p.x < pointBounds.x ||
      p.x > pointBounds.x + pointBounds.width ||
      p.y < pointBounds.y ||
      p.y > pointBounds.y + pointBounds.height
    ) {
      continue;
    }

    let found = false;
    for (let i = 0; i < circles.length; i++) {
      let c = circles[i];
      if (
        utils.circleContainsPoint(
          c.center,
          c.radius + config.RADIUS / 2 + config.STROKE_SIZE,
          p
        )
      ) {
        found = true;
        continue;
      }
    }

    if (!found) {
      let c = new PCircle(p, config.RADIUS);
      c.boundsPadding = config.CIRCLE_BOUNDS_PADDING;
      c.strokeColor = Color.fromHex(config.STROKE_COLOR);
      c.lineWidth = config.STROKE_SIZE;

      c.fillColor = getColor(p);
      circles.push(c);
    }
  }

  for (let c of circles) {
    c.checkCollisions(bounds, circles);
    c.grow();

    if (_doDraw) {
      c.draw(context);
    }
  }

  if (_completed & !_completedCaptured) {
    if (config.DOWNLOAD_PNG_ON_COMPLETE) {
      meshjs.downloadPng();
    }

    _completedCaptured = true;

    if (config.INIT_AFTER_COMPLETE) {
      init(canvas);
    }
  }
};

const getColor = function(point) {
  let c;
  switch (config.COLOR_SOURCE) {
    case colorSource.PALLETE:
      c = pallete.getNextColor();
      break;
    case colorSource.GRADIENT:
      c = gradient.getColor(point);
      break;
    case colorSource.FILL:
      c = Color.fromHex(config.FILL_COLOR);
      break;
    default:
      console.log(
        `Warning: config.COLOR_SOURCE not recgonized : ${config.COLOR_SOURCE}`
      );
  }

  return c;
};

const getgetRandomPoints = function(count) {
  if (pixels.length == 0) {
    console.log("render complete");
    meshjs.setPaused(true);
    _doDraw = true;
    _completed = true;
    return [];
  }

  if (pixels.length < count) {
    count = pixels.length;
  }

  //remove from the end of the array
  return pixels.splice(-count, count);
};

const createSVG = function() {
  let svg = `<?xml version="1.0" standalone="no"?>\n
		<svg width="${config.RENDER_WIDTH}" height="${config.RENDER_HEIGHT}"
		version="1.1" xmlns="http://www.w3.org/2000/svg">\n`;

  svg =
    svg +
    `<rect x="0" y="0" width="${config.RENDER_WIDTH}"
				height="${config.RENDER_HEIGHT}"
				fill="${config.CANVAS_BACKGROUND_COLOR}"/>\n`;

  for (let c of circles) {
    svg = svg + c.toSVG() + "\n";
  }

  svg = svg + "</svg>";

  return svg;
};

const keypress = function(event) {
  if (event.key === "s") {
    let svg = createSVG();
    downloadSVG(svg, config.PROJECT_NAME);
  } else if (event.key === "d") {
    _doDraw = !_doDraw;
  }
};

window.onload = function() {
  let r;
  let p = new Promise(function(resolve, reject) {
    r = resolve;
  });

  meshjs.init(config, init, draw, p);
  meshjs.listen(keypress);

  loadPixelDataFromPathWithBounds(
    config.TEMPLATE,
    function(pd) {
      originalPixels = pd.filter(Color.BLACK);
      r(); //tell mesh js we are ready
    },
    meshjs.bounds
  );
};
