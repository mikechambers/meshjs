import Mover from "./mover.js";

export default class BoundsMover extends Mover {
  constructor(bounds, position, velocity) {
    super(position, velocity);

    this._bounds = bounds;
  }

  checkBounds() {
    if (
      this._position.x < this._bounds.x ||
      this._position.x > this._bounds.x + this._bounds.width
    ) {
      this._velocity.x *= -1;
    }

    if (
      this._position.y < this._bounds.y ||
      this._position.y > this._bounds.y + this._bounds.height
    ) {
      this._velocity.y *= -1;
    }
  }

  update() {
    this.checkBounds();
    super.update();
  }
}
