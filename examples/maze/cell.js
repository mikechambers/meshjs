import Drawable from "../../lib/core/drawable.js";
import Line from "../../lib/geometry/line.js";
import Vector from "../../lib/math/vector.js";
import Color from "../../lib/color/color.js";
import { randomInt } from "../../lib/math/math.js";

export default class Cell extends Drawable {
  constructor(col, row, bounds, grid, rows, cols) {
    super();
    this._row = row;
    this._col = col;
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

    for (let line of this._lines) {
      line.strokeColor = Color.WHITE;
      line.strokeColor.alpha = 0.0;
      line.lineWidth = 2.0;
    }
  }

  get col() {
    return this._col;
  }

  get row() {
    return this._row;
  }

  get visited() {
    return this._visited;
  }

  set visited(value) {
    this._visited = value;

    if (this._visited) {
      for (let line of this._lines) {
        line.strokeColor.alpha = 0.8;
        //line.lineWidth = 2.0;
      }
    }
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
    let top = this._grid[this._getIndex(this._col, this._row - 1)];
    let right = this._grid[this._getIndex(this._col + 1, this._row)];
    let bottom = this._grid[this._getIndex(this._col, this._row + 1)];
    let left = this._grid[this._getIndex(this._col - 1, this._row)];

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

  _getIndex(col, row) {
    if (col < 0 || row < 0 || col > this._cols - 1 || row > this._rows - 1) {
      return -1;
    }

    return col + row * this._cols;
  }

  draw(context) {
    let fillColor = this._fillColor;

    if (this._isCurrent) {
      fillColor = Color.fromHex("#ff5f5f");
      //fillColor.alpha = 0.5;
    }

    context.fillStyle = fillColor.toCSS();
    //context.strokeStyle = this._strokeColor.toCSS();
    //context.lineWidth = this._lineWidth;

    if (this._isCurrent || !this._visited) {
      context.fillRect(
        this._bounds.x,
        this._bounds.y,
        this._bounds.width,
        this._bounds.height
      );
    }

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
