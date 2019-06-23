/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs, { CONTEXT_WEBGL } from "../../lib/mesh.js";
import {
  Scene, Color, PerspectiveCamera,
  BoxBufferGeometry, Mesh, WebGLRenderer, MeshStandardMaterial, DirectionalLight
} from '../../ext/threejs/three.module.js';

/************ CONFIG **************/

let config = {
  //Dimensions that canvas will be rendered at
  RENDER_HEIGHT: 1080,
  RENDER_WIDTH: 1080,

  CONTEXT_TYPE: CONTEXT_WEBGL,

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
  ANIMATE:true
};

let bounds;
const FOV = 35;
const NEAR = 0.1;
const FAR = 100;

let scene;

let camera;
let renderer;
let light;
let mesh;
let geometry;

//called when project is being initialized
const init = function(context) {
  bounds = meshjs.bounds;

  //use the canvas from mesh.js, make sure config.CONTEXT_TYPE is set to CONTEXT_WEBGL
  renderer = new WebGLRenderer({ 
    canvas:meshjs.canvas.canvas
   });

  renderer.setSize(config.RENDER_WIDTH, config.RENDER_HEIGHT, false);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new Scene();

  scene.background = new Color("orangered");

  let aspect = config.RENDER_WIDTH / config.RENDER_HEIGHT;
  camera = new PerspectiveCamera(FOV, aspect, NEAR, FAR);
  camera.position.set(0, 0, 10);

  geometry = new BoxBufferGeometry( 1,1,1 );
  let material = new MeshStandardMaterial({ color: 0x156289 });
  mesh = new Mesh(geometry, material);

  scene.add(mesh);

  light = new DirectionalLight(0xffffff, 5.0);
  light.position.set(10, 10, 10);

  scene.add(light);
};

//called once per frame (if config.ANIMATE is true)
const draw = function(context, frameCount) {

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  mesh.rotation.z += 0.01;

  renderer.render(scene, camera);
};

window.onload = function() {
  meshjs.init(config, init, draw);
};
