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
  RECORD_VIDEO: false,
  //FPS: 5,

  CELL_WIDTH: 20
};

let bounds;

let cols;
let rows;
let grid;
let current;
let stack;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;
  grid = [];
  stack = [];

  cols = Math.floor(bounds.width / config.CELL_WIDTH);
  rows = Math.floor(bounds.height / config.CELL_WIDTH);

  //rows = j
  //col = i
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let b = new Rectangle(
        i * config.CELL_WIDTH,
        j * config.CELL_WIDTH,
        config.CELL_WIDTH,
        config.CELL_WIDTH
      );
      let cell = new Cell(i, j, b, grid, rows, cols);
      grid.push(cell);
    }
  }

  current = grid[0];
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {
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
    current.isCurrent;
  }
};

function removeWalls(a, b) {
  let x = a.i - b.i;

  if (x === 1) {
    a.removeWall(Cell.LEFT);
    b.removeWall(Cell.RIGHT);
  } else if (x === -1) {
    a.removeWall(Cell.RIGHT);
    b.removeWall(Cell.LEFT);
  }

  let y = a.j - b.j;

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
