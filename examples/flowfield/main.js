/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import Vector from "../../lib/math/vector.js";
import Color from "../../lib/color/color.js";
import Particle from "./particle.js";
import { random } from "../../lib/math/math.js";
import noise from "../../lib/math/noise.js";
import PixelData, { loadPixelDataFromPath } from "../../lib/data/pixeldata.js";
import Gradient from "../../lib/color/gradient.js";

/************ CONFIG **************/

const config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  //Dimension canvas will be display at on page
  MAX_DISPLAY_HEIGHT: 640,
  MAX_DISPLAY_WIDTH: 640,

  //background color of html page
  BACKGROUND_COLOR: "#000000",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //Where video of canvas is recorded
  RECORD_VIDEO: false,

  //whether canvas should be cleared prior to each call to draw
  CLEAR_CANVAS: false,

  /***** app specific *****/
  SCALE: 20,
  INCREMENT: 0.1,
  PARTICLE_COUNT: 5000,
  DRAW_VECTORS: false,
  OPACITY: 0.2
};

/************** GLOBAL VARIABLES ************/

let bounds;
let canvas;

let cols;
let rows;
let zoff = 0;

let particles;
let vectors;

let pixelData;

/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;

  let gradient = new Gradient(bounds);
  gradient.addColorStop(0, "#FF0000");
  gradient.addColorStop(1, "#0000FF");
  gradient.create();

  //todo: we should cache this
  pixelData = gradient.pixelData;

  cols = Math.floor(bounds.width / config.SCALE);
  rows = Math.floor(bounds.height / config.SCALE);

  zoff = random(10000);

  vectors = new Array(rows * cols);

  particles = [];

  for (let i = 0; i < config.PARTICLE_COUNT; i++) {
    let p = new Particle(bounds, config.OPACITY);

    //move random point to function
    p.position = new Vector(random(bounds.width), random(bounds.height));

    particles.push(p);
  }
};

const draw = function(context) {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;

      let angle = noise(xoff, yoff, zoff) * (Math.PI * 2);

      let v = Vector.fromAngle(angle);
      v.magnitude = 3;

      vectors[index] = v;

      context.save();

      if (config.DRAW_VECTORS) {
        context.translate(x * config.SCALE, y * config.SCALE);
        context.rotate(v.heading);

        context.strokeStyle = "rgb(0, 0, 0, 0.2)";
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(config.SCALE, 0);
        context.stroke();

        context.restore();
      }
      xoff += config.INCREMENT;
    }
    yoff += config.INCREMENT;
  }
  zoff += 0.01;

  for (const [i, p] of particles.entries()) {
    let x = Math.floor(p.position.x / config.SCALE);
    let y = Math.floor(p.position.y / config.SCALE);
    let index = x + y * cols;

    let force = vectors[index];

    p.applyForce(force);

    p.update();
    p.draw(context, pixelData);
  }
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
