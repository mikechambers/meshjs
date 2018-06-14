/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import { constrain } from "../../lib/math/math.js";

/************ CONFIG **************/

let config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 640,
  RENDER_WIDTH: 640,

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

  //Where video of canvas is recorded
  CAPTURE_VIDEO: false,
  D_A: 1.0,
  D_B: 0.5,
  FEED: 0.055,
  K: 0.062
};

let bounds;
let grid;
let next;

let imageData;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  grid = [];
  next = [];

  for (let x = 0; x < bounds.width; x++) {
    grid[x] = [];
    next[x] = [];
    for (let y = 0; y < bounds.height; y++) {
      grid[x][y] = { a: 1, b: 0 };
      next[x][y] = { a: 1, b: 0 };
    }
  }

  for (let i = 100; i < 150; i++) {
    for (let j = 100; j < 150; j++) {
      grid[i][j].b = 1;
    }
  }

  imageData = context.createImageData(bounds.width, bounds.height);
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  for (let x = 1; x < bounds.width - 1; x++) {
    for (let y = 1; y < bounds.height - 1; y++) {
      let a = grid[x][y].a;
      let b = grid[x][y].b;
      next[x][y].a = constrain(
        a +
          (config.D_A * laplace("a", x, y) - a * b * b + config.FEED * (1 - a)),
        0,
        1
      );

      next[x][y].b = constrain(
        b +
          (config.D_B * laplace("b", x, y) +
            a * b * b -
            (config.K + config.FEED) * b),
        0,
        1
      );
    }
  }

  for (let x = 0; x < bounds.width; x++) {
    for (let y = 0; y < bounds.height; y++) {
      let pix = (x + y * bounds.width) * 4;
      let a = next[x][y].a;
      let b = next[x][y].b;
      let c = Math.floor((a - b) * 255);
      c = constrain(c, 0, 255);

      imageData.data[pix + 0] = c;
      imageData.data[pix + 1] = c;
      imageData.data[pix + 2] = c;
      imageData.data[pix + 3] = 255;
    }
  }

  context.putImageData(imageData, 0, 0);

  swap();
};

let laplace = function(prop, x, y) {
  var sumA = 0;
  sumA += grid[x][y][prop] * -1;
  sumA += grid[x - 1][y][prop] * 0.2;
  sumA += grid[x + 1][y][prop] * 0.2;
  sumA += grid[x][y + 1][prop] * 0.2;
  sumA += grid[x][y - 1][prop] * 0.2;
  sumA += grid[x - 1][y - 1][prop] * 0.05;
  sumA += grid[x + 1][y - 1][prop] * 0.05;
  sumA += grid[x + 1][y + 1][prop] * 0.05;
  sumA += grid[x - 1][y + 1][prop] * 0.05;
  return sumA;
};

let swap = function() {
  //[grid, next] = [next, grid];

  var temp = grid;
  grid = next;
  next = temp;
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
