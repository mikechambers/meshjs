/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Cell from "./cell.js";
import Rectangle from "../../lib/geometry/rectangle.js";
import Gradient, { randomGradient } from "../../lib/color/gradient.js";
import { randomInt } from "../../lib/math/math.js";

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

  //Where video of canvas is recorded
  CAPTURE_VIDEO: true,
  BATCH_DRAW_COMMANDS: true,
  DEBUG_DRAW_COMMANDS: false,
  //FPS: 1,
  FILTER_DRAW_COMMANDS: true,

  CELL_WIDTH: 20
};

let bounds;

let cols;
let rows;
let grid;
let current;
let stack;
let gradient;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;
  grid = [];
  stack = [];

  gradient = randomGradient(bounds, Gradient.TOP_LEFT_TO_BOTTOM_RIGHT);
  gradient.create();

  cols = Math.floor(bounds.width / config.CELL_WIDTH);
  rows = Math.floor(bounds.height / config.CELL_WIDTH);

  //rows = j
  //col = i
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let b = new Rectangle(
        col * config.CELL_WIDTH,
        row * config.CELL_WIDTH,
        config.CELL_WIDTH,
        config.CELL_WIDTH
      );
      let cell = new Cell(col, row, b, grid, rows, cols);
      grid.push(cell);
    }
  }

  current = grid[randomInt(0, grid.length)];
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
  gradient.draw(context);

  for (let cell of grid) {
    cell.draw(context);
  }

  current.visited = true;
  let next = current.checkNeighbors();

  if (next !== undefined) {
    next.visited = true;

    stack.push(current);

    removeWalls(current, next);

    current.isCurrent = false;
    next.isCurrent = true;
    current = next;
  } else if (stack.length > 0) {
    let cell = stack.pop();

    current.isCurrent = false;
    current = cell;
    current.isCurrent = true;
  } else {
    current.isCurrent = false;
  }
};

function removeWalls(a, b) {
  let x = a.col - b.col;

  if (x === 1) {
    a.removeWall(Cell.LEFT);
    b.removeWall(Cell.RIGHT);
  } else if (x === -1) {
    a.removeWall(Cell.RIGHT);
    b.removeWall(Cell.LEFT);
  }

  let y = a.row - b.row;

  if (y === 1) {
    a.removeWall(Cell.TOP);
    b.removeWall(Cell.BOTTOM);
  } else if (y === -1) {
    a.removeWall(Cell.BOTTOM);
    b.removeWall(Cell.TOP);
  }
}

window.onload = function() {
  meshjs.init(config, init, draw);
};
