export default class SVGExporter {
  constructor(commands, width, height) {
    this._commands = commands;
    this._width = width;
    this._height = height;
    this._context = new Map();
    this._lineSeperator = "\n";
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
    for (let command of this._commands) {
      let n = command.name;

      let f = this["parse_" + n];

      if (f === undefined) {
        console.log("SVG Export : unsupported command : " + n);
        continue;
      }

      let out = f(command);
      svg.push(out);
    }
    svg.push("</svg>");
    return svg.join(this._lineSeperator);
  }

  parse_strokeStyle(command) {}
  parse_fillStyle(command) {}
  lineWidth(command) {}
}
