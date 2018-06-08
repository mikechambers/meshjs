import Vector from "../math/vector.js";
import { constrain } from "../math/math.js";

export default class Mover {
  constructor(position = new Vector(), velocity = new Vector()) {
    this._velocity = velocity;
    this._acceleration = new Vector();

    this._position = position;

    this._mass = 1.0;
    this._friction = 0.0;

    this._minGravityInfluence = 1.0;
    this._maxGravityInfluence = 200.0;
    this._gravityCoefficient = 0.3;
    this._maxVelocity = 5.0;

    this._angle = 0;
  }

  //force:vector
  applyForce(force) {
    this._acceleration.add(Vector.divide(vector / this._mass));
  }

  update() {
    if (this._friction != 0) {
      let force = Vector.multiply(this._velocity, -1);
      force.normalize();
      force.multiply(this._friction);

      this.applyForce(force);
    }

    this._velocity.add(this._acceleration);

    this._velocity.limit(this._maxVelocity);
    //console.log("_position", this._position);
    this._position.add(this._velocity);
    //console.log("_position", this._position);

    //acceleration *= 0;
  }

  repel(mover) {
    let out = this.attract(mover);
    out.multiply(-1);
    return out;
  }

  attract(mover) {
    let force = Vector.subtract(position, mover.position);
    let distance = constrain(
      force.length(),
      this._minGravityInfluence,
      this._maxGravityInfluence
    );

    force.normalize();

    //float strength = (gravityCoefficient * mass * mover.mass) / (distance * distance);
    let strength =
      (this._gravityCoefficient * this._mass * mover.mass) / distance;
    force.multiply(strength);

    return force;
  }

  get position() {
    return this._position;
  }

  set position(value) {
    this._position = value;
  }

  get velocity() {
    return this._velocity;
  }

  set velocity(value) {
    this._velocity = value;
  }

  get mass() {
    return this._mass;
  }

  set mass(value) {
    this._mass = value;
  }
}
