import Color from "../color/color.js";

export default class SVGExporter {
  constructor(frames, width, height) {
    this._frames = frames;
    this._width = width;
    this._height = height;
    this._canvasState = new Map();
    this._lineSeperator = "\n";
    this._pathCommands = [];

    //retrieve to get default value
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let defaultFont = context.font;
    //todo: I could get the default values from the context, which would
    //account for any differences between the implimentation and standard

    //todo: check these
    this._canvasStateDefaults = new Map([
      ["strokeStyle", "#000000"],
      ["fillStyle", "#000000"],
      ["globalAlpha", "1.0"],
      ["lineWidth", "1.0"],
      ["lineCap", "butt"],
      ["lineJoin", "miter"],
      ["miterLimit", "10.0"],
      ["lineDashOffset", "0.0"],
      ["shadowOffsetX", "0"],
      ["shadowOffsetY", "0"],
      ["shadowBlur", "0"],
      ["shadowColor", "rgba(0,0,0,0)"],
      ["filter", "none"],
      ["globalCompositeOperation", "source-over"],
      ["font", defaultFont],
      ["textAlign", "start"],
      ["textBaseline", "alphabetic"],
      ["direction", "inherit"],
      ["imageSmoothingEnabled", "true"],
      ["imageSmoothingQuality", "low"]
    ]);

    this._defaultStrokeStyle = "#000000";
    this._defaultLineWidth;
  }

  _svgHeader() {
    let out = `<?xml version="1.0" standalone="no"?>${this._lineSeperator}
  		<svg width="${this._width}" height="${
      this._height
    }" version="1.1" xmlns="http://www.w3.org/2000/svg">${this._lineSeperator}`;

    return out;
  }

  parse() {
    let svg = [];
    svg.push(this._svgHeader());
    for (let commands of this._frames) {
      for (let command of commands) {
        let n = command.name;

        let fName = "parse_" + n;
        if (this[fName] === undefined) {
          console.log("SVG Export : unsupported command : " + n);
          continue;
        }

        let out = this[fName](command);
        if (out === undefined) {
          continue;
        }

        svg.push(out);
      }
    }
    svg.push("</svg>");
    return svg.join(this._lineSeperator);
  }

  /************ apis ***************/

  parse_beginPath(command) {
    this._pathCommands = [];
  }
  parse_moveTo(command) {
    this._pathCommands.push(command);
  }

  parse_lineTo(command) {
    this._pathCommands.push(command);
  }

  //todo: this doesnt handle stroke(path) yet
  parse_stroke(command) {
    //todo: should I just store paths as SVG paths?
    //todo: create SVG path here and return it

    let path = "";
    for (let p of this._pathCommands) {
      let args = p.args;
      switch (p.name) {
        case "moveTo":
          path += `M ${args[0]} ${args[1]} `;
          break;
        case "lineTo":
          path += `L ${args[0]} ${args[1]} `;
          break;
      }
    }

    path = path.trim();

    let out = `<path d="${path}" ${this._strokeColorAttributes()}
                      ${this._strokeWidthAttribute()} ${this._strokeLineCapAttribute()}
                      ${this._strokeLineJoinAttribute()} ${this._strokeMiterLimitAttribute()}/>`;
    return out;
  }

  parse_fillRect(command) {
    let args = command.args;
    let out = `<rect x="${args[0]}" y="${args[1]}" width="${args[2]}" height="${
      args[3]
    }"  ${this._fillColorAttributes()} />`;

    return out;
  }

  parse_drawCircle(command) {
    let circle = command.args;
    let out = `<circle cx="${circle.center.x}" cy="${circle.center.y}"
      r="${
        circle.radius
      }" ${this._fillColorAttributes()} ${this._strokeColorAttributes()} ${this._strokeWidthAttribute()} />`;

    return out;
  }

  parse_drawRectangle(command) {
    let rectangle = command.args;
    let out = `<rect x="${rectangle.x}" y="${rectangle.y}"
      width="${rectangle.width}" height="${rectangle.height}"
      ${this._fillColorAttributes()} ${this._strokeColorAttributes()} ${this._strokeWidthAttribute()} />`;

    return out;
  }

  //returns a string of name / value pair for stroke-width attributes
  _strokeLineCapAttribute() {
    return this._getPropertyForCanvasStateValue("stroke-linecap", "lineCap");
  }

  //returns a string of name / value pair for stroke-width attributes
  _strokeLineJoinAttribute() {
    return this._getPropertyForCanvasStateValue("stroke-linejoin", "lineJoin");
  }

  //returns a string of name / value pair for stroke-width attributes
  _strokeMiterLimitAttribute() {
    return this._getPropertyForCanvasStateValue(
      "stroke-miterlimit",
      "miterLimit"
    );
  }

  //returns a string of name / value pair for stroke-width attributes
  _strokeWidthAttribute() {
    return this._getPropertyForCanvasStateValue("stroke-width", "lineWidth");
  }

  //returns a string of name / value pair(s) for stroke and potentially
  //stroke-opacity attributes
  _strokeColorAttributes() {
    return this._getColorValueAttributes("strokeStyle", "stroke");
  }

  //returns a string of name / value pair(s) for fill and potentially
  //fill-opacity attributes
  _fillColorAttributes() {
    return this._getColorValueAttributes("fillStyle", "fill");
  }

  //returns a string with name / value pair(s) of color attributes named
  //based on the name passed in (NAME, NAME-OPACITY)
  _getColorValueAttributes(prop, name) {
    let p = this._getCanvasStateValue(prop);

    //if its a hex color, just return it
    if (p.startsWith("#")) {
      return `${name}="${p}"`;
    }

    //if its rgba then return VALUE and VALUE-OPACITY attributes
    if (p.startsWith("rgba")) {
      let c = Color.fromCSS(p);

      return `${name}="${c.toHex()}" ${name}-opacity="${c.alpha}"`;
    }

    return "";
  }

  //returns name / value pair for specified property
  _getPropertyForCanvasStateValue(property, value) {
    return `${property}="${this._getCanvasStateValue(value)}"`;
  }

  //gets current state value for specified property
  _getCanvasStateValue(value) {
    let v = this._canvasState.get(value);

    if (v === undefined) {
      return this._canvasStateDefaults.get(value);
    }

    return v;
  }

  /********** canvas state properties *************/
  parse_strokeStyle(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_fillStyle(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_globalAlpha(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_lineWidth(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_lineCap(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_lineJoin(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_miterLimit(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_lineDashOffset(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_shadowOffsetX(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_shadowOffsetY(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_shadowBlur(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_shadowColor(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_filter(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_globalCompositeOperation(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_font(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_textAlign(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_textBaseline(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_direction(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_imageSmoothingEnabled(command) {
    this._canvasState.set(command.name, command.args);
  }
  parse_imageSmoothingQuality(command) {
    this._canvasState.set(command.name, command.args);
  }
}
