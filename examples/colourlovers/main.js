/**
	Mike Chambers
	https://github.com/mikechambers
	http://www.mikechambers.com

	Released under an MIT License
	Copyright Mike Chambers 2018
**/

import meshjs from "../../lib/mesh.js";
import { downloadJSON } from "../../lib/data/datautils.js";
import Color from "../../lib/color/color.js";

/************ CONFIG **************/

const config = {
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
  BACKGROUND_COLOR: "#000000",

  //background color for display and offscreen canvas
  CANVAS_BACKGROUND_COLOR: "#FFFFFF",

  //whether a single frame is rendered, or draw is called based on FPS setting
  ANIMATE: false,

  //Where video of canvas is recorded
  CAPTURE_VIDEO: false

  /*********** APP Specific Settings ************/
};

/************** GLOBAL VARIABLES ************/

let bounds;

/*************** CODE ******************/

const init = function(context) {
  bounds = meshjs.bounds;
};

const draw = function(context) {};

//https://stackoverflow.com/a/46719196/10232
let regex = /[^\u0000-\u00ff]/; // Small performance gain from pre-compiling the regex
function stringContainsDoubleByte(str) {
  if (!str.length) return false;
  if (str.charCodeAt(0) > 255) return true;
  return regex.test(str);
}

const onJsonLoad = function(request) {
  let palletes = request.response;

  let out = [];
  for (let p of palletes) {
    let title = p.title;

    //our json downloader doesnt support unicode chars
    //so we just filter them out here
    if (stringContainsDoubleByte(title)) {
      continue;
    }

    let tmp = [];

    for (let c of p.colors) {
      let _c = Color.fromHex(c);
      tmp.push({
        r: _c.red,
        g: _c.green,
        b: _c.blue
      });
    }

    out.push({ name: title, colors: tmp });
  }

  downloadJSON(out, config.PROJECT_NAME);
};

window.onload = function() {
  meshjs.init(config, init, draw);

  var request = new XMLHttpRequest();

  //from http://www.colourlovers.com/api
  request.open("GET", "colors.json");

  request.responseType = "json";
  request.send();

  request.onreadystatechange = function() {
    if (request.readyState == 4 && request.status == "200") {
      onJsonLoad(request);
    }
  };
};
