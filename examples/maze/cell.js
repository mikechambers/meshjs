import Drawable from "../../lib/core/drawable.js";
import Line from "../../lib/geometry/line.js";
import Vector from "../../lib/math/vector.js";
import Color from "../../lib/color/color.js";
import { randomInt } from "../../lib/math/math.js";

export default class Cell extends Drawable {
  constructor(i, j, bounds, grid, rows, cols) {
    super();
    this._j = j;
    this._i = i;
    this._bounds = bounds;
    this._visited = false;
    this._grid = grid;

    this._rows = rows;
    this._cols = cols;

    this._walls = [true, true, true, true];
    this._isCurrent = false;

    this._lines = [
      new Line(this._bounds.topLeft, this._bounds.topRight),
      new Line(this._bounds.topRight, this._bounds.bottomRight),
      new Line(this._bounds.bottomRight, this._bounds.bottomLeft),
      new Line(this._bounds.bottomLeft, this._bounds.topLeft)
    ];
  }

  get i() {
    return this._i;
  }

  get j() {
    return this._j;
  }

  get visited() {
    return this._visited;
  }

  set visited(value) {
    this._visited = value;
  }

  set isCurrent(value) {
    this._isCurrent = value;
  }

  removeWall(index) {
    this._walls[index] = false;
  }

  checkNeighbors() {
    //rows = j
    //col = i
    let neighbors = [];
    let top = this._grid[this._getIndex(this._i, this._j - 1)];
    let right = this._grid[this._getIndex(this._i + 1, this._j)];
    let bottom = this._grid[this._getIndex(this._i, this._j + 1)];
    let left = this._grid[this._getIndex(this._i - 1, this._j)];

    if (top !== undefined && !top.visited) {
      neighbors.push(top);
    }

    if (right !== undefined && !right.visited) {
      neighbors.push(right);
    }

    if (bottom !== undefined && !bottom.visited) {
      neighbors.push(bottom);
    }

    if (left !== undefined && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      let r = randomInt(0, neighbors.length);
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  _getIndex(i, j) {
    if (i < 0 || j < 0 || i > this._cols - 1 || j > this._rows - 1) {
      return -1;
    }

    return i + j * this._cols;
  }

  draw(context) {
    let fillColor = this._fillColor;

    if (this._visited && !this._isCurrent) {
      fillColor = new Color(128, 128, 128);
    }

    if (this._isCurrent) {
      fillColor = new Color(0, 255, 0);
    }

    context.fillStyle = fillColor.toCSS();
    //context.strokeStyle = this._strokeColor.toCSS();
    //context.lineWidth = this._lineWidth;

    context.fillRect(
      this._bounds.x,
      this._bounds.y,
      this._bounds.width,
      this._bounds.height
    );

    if (this._walls[Cell.TOP]) {
      this._lines[Cell.TOP].draw(context);
    }
    if (this._walls[Cell.RIGHT]) {
      this._lines[Cell.RIGHT].draw(context);
    }
    if (this._walls[Cell.BOTTOM]) {
      this._lines[Cell.BOTTOM].draw(context);
    }
    if (this._walls[Cell.LEFT]) {
      this._lines[Cell.LEFT].draw(context);
    }
  }
}

Cell.TOP = 0;
Cell.RIGHT = 1;
Cell.BOTTOM = 2;
Cell.LEFT = 3;

//i = row
//j = col
