import Pool from "../utils/pool.js";

export default class Context2D {
  constructor(
    context,
    backgroundColor,
    capture = false,
    debug = false,
    filter = false
  ) {
    this._context = context;
    this._commands = [];
    this._capture = capture;
    this._debug = debug;
    this._filter = filter;

    if (this._filter) {
      this._canvasState = new Map();
    }

    this._pool = new Pool(Command);

    this._renderEnabled = true;

    this._backgroundColor = backgroundColor;

    if (!this.backgroundColor) {
      let h = this.canvas.height;
      let w = this.canvas.width;

      this._backgroundCache = document.createElement("canvas");
      this._backgroundCache.height = h;
      this._backgroundCache.width = w;

      let ctx = this._backgroundCache.getContext("2d");
      ctx.fillStyle = this._backgroundColor.toCSS();
      ctx.fillRect(0, 0, w, h);
    }

    this.clear();
  }

  //todo: we could probably inline this into each method call below, which
  //should offer better performance
  handleCommand(command) {
    //if rendering is disabled, just dump calls
    if (!this._renderEnabled) {
      //ignore
      this._pool.put(command);
      return;
    }

    if (this._capture) {
      //save for later
      this._commands.push(command);
    } else {
      //call now and then forget
      command.command();
      this._pool.put(command);
    }
  }

  //clear rendering que, context, and optionally draws a new background
  //color
  clear() {
    this._clearCommands();
    let w = this._context.canvas.width;
    let h = this._context.canvas.height;

    if (this._backgroundColor === undefined) {
      this.clearRect(0, 0, w, h);
    } else {
      if (this._context.globalCompositeOperation !== "source-over") {
        //todo: right now, if you are not using default globalCompositeOperation then
        //we have to call clearRect, otherwise the screen may not clear depending on
        //the value. we can add some more values here where we dont have to
        //clear but we need to test them
        this.clearRect(0, 0, w, h);
      }

      this.drawImage(this._backgroundCache, 0, 0, w, h);
    }
  }

  _clearCommands() {
    let len = this._commands.lenght;
    for (let i = 0; i < len; i++) {
      //note: right now, we don't explicitly null out properties / reset
      //for performance reasons
      this._pool.put(this._commands[i]);
    }

    this._commands = [];
  }

  render() {
    if (!this._renderEnabled) {
      //note, if rendering is disabled commands are basically ignored.
      //we dont batch them to be drawn later

      //note, there shouldnt be any commands here. if there are it means
      //something didnt go through handleCommand

      if (this._commands.length !== 0) {
        console.log(
          `Warning : render disabled, but commands are present. This is probably a bug!`
        );
      }

      this._clearCommands();
      return;
    }

    let start;
    if (this._debug) {
      start = Date.now();
      console.log("-------------");
      console.log(`RENDER_START : ${this._commands.length} commands`);
    }

    for (let command of this._commands) {
      command.command();
    }
    this._clearCommands();

    if (this._debug) {
      console.log(`RENDER_COMPLETE : ${Date.now() - start}ms`);
    }
  }

  set debug(value) {
    this._debug = value;
  }
  get debug() {
    return this._debug;
  }

  get rawContext() {
    return this._context;
  }

  set renderEnabled(enabled) {
    this._renderEnabled = enabled;
    if (this._debug) {
      //todo: should this be here or in meshjs?
      console.log("Rendering " + (enabled ? "enabled" : "disabled"));
    }
  }

  get renderEnabled() {
    return this._renderEnabled;
  }

  /************ begin proxied apis *************/

  get canvas() {
    return this._context.canvas;
  }

  /******* currentTransform*******/
  set currentTransform(value) {
    let c = this._pool.get();
    c.name = "currentTransform";
    c.args = value;

    c.command = () => {
      this._context.currentTransform = value;
    };

    this.handleCommand(c);
  }

  get currentTransform() {
    return this._context.currentTransform;
  }

  /******* direction*******/
  set direction(value) {
    if (this._filter) {
      if (this._canvasState.get("direction") == value) {
        return;
      } else {
        this._canvasState.set("direction", value);
      }
    }

    let c = this._pool.get();
    c.name = "direction";
    c.args = value;

    c.command = () => {
      this._context.direction = value;
    };

    this.handleCommand(c);
  }

  get direction() {
    if (this._filter) {
      if (this._canvasState.has("direction")) {
        return this._canvasState.get("direction");
      }
    }

    return this._context.direction;
  }

  /******* fillStyle*******/
  set fillStyle(value) {
    if (this._filter) {
      if (this._canvasState.get("fillStyle") == value) {
        return;
      } else {
        this._canvasState.set("fillStyle", value);
      }
    }

    let c = this._pool.get();
    c.name = "fillStyle";
    c.args = value;

    c.command = () => {
      this._context.fillStyle = value;
    };

    this.handleCommand(c);
  }

  get fillStyle() {
    if (this._filter) {
      if (this._canvasState.has("fillStyle")) {
        return this._canvasState.get("fillStyle");
      }
    }

    return this._context.fillStyle;
  }

  /******* filter*******/
  set filter(value) {
    if (this._filter) {
      if (this._canvasState.get("filter") == value) {
        return;
      } else {
        this._canvasState.set("filter", value);
      }
    }

    let c = this._pool.get();
    c.name = "filter";
    c.args = value;

    c.command = () => {
      this._context.filter = value;
    };

    this.handleCommand(c);
  }

  get filter() {
    if (this._filter) {
      if (this._canvasState.has("filter")) {
        return this._canvasState.get("filter");
      }
    }

    return this._context.filter;
  }

  /******* font*******/
  set font(value) {
    if (this._filter) {
      if (this._canvasState.get("font") == value) {
        return;
      } else {
        this._canvasState.set("font", value);
      }
    }

    let c = this._pool.get();
    c.name = "font";
    c.args = value;

    c.command = () => {
      this._context.font = value;
    };

    this.handleCommand(c);
  }

  get font() {
    if (this._filter) {
      if (this._canvasState.has("font")) {
        return this._canvasState.get("font");
      }
    }

    return this._context.font;
  }

  /******* globalAlpha*******/
  set globalAlpha(value) {
    if (this._filter) {
      if (this._canvasState.get("globalAlpha") == value) {
        return;
      } else {
        this._canvasState.set("globalAlpha", value);
      }
    }

    let c = this._pool.get();
    c.name = "globalAlpha";
    c.args = value;

    c.command = () => {
      this._context.globalAlpha = value;
    };

    this.handleCommand(c);
  }

  get globalAlpha() {
    if (this._filter) {
      if (this._canvasState.has("globalAlpha")) {
        return this._canvasState.get("globalAlpha");
      }
    }

    return this._context.globalAlpha;
  }

  /******* globalCompositeOperation*******/
  set globalCompositeOperation(value) {
    if (this._filter) {
      if (this._canvasState.get("globalCompositeOperation") == value) {
        return;
      } else {
        this._canvasState.set("globalCompositeOperation", value);
      }
    }

    let c = this._pool.get();
    c.name = "globalCompositeOperation";
    c.args = value;

    c.command = () => {
      this._context.globalCompositeOperation = value;
    };

    this.handleCommand(c);
  }

  get globalCompositeOperation() {
    if (this._filter) {
      if (this._canvasState.has("globalCompositeOperation")) {
        return this._canvasState.get("globalCompositeOperation");
      }
    }

    return this._context.globalCompositeOperation;
  }

  /******* imageSmoothingEnabled*******/
  set imageSmoothingEnabled(value) {
    if (this._filter) {
      if (this._canvasState.get("imageSmoothingEnabled") == value) {
        return;
      } else {
        this._canvasState.set("imageSmoothingEnabled", value);
      }
    }

    let c = this._pool.get();
    c.name = "imageSmoothingEnabled";
    c.args = value;

    c.command = () => {
      this._context.imageSmoothingEnabled = value;
    };

    this.handleCommand(c);
  }

  get imageSmoothingEnabled() {
    if (this._filter) {
      if (this._canvasState.has("imageSmoothingEnabled")) {
        return this._canvasState.get("imageSmoothingEnabled");
      }
    }

    return this._context.imageSmoothingEnabled;
  }

  /******* imageSmoothingQuality*******/
  set imageSmoothingQuality(value) {
    if (this._filter) {
      if (this._canvasState.get("imageSmoothingQuality") == value) {
        return;
      } else {
        this._canvasState.set("imageSmoothingQuality", value);
      }
    }

    let c = this._pool.get();
    c.name = "imageSmoothingQuality";
    c.args = value;

    c.command = () => {
      this._context.imageSmoothingQuality = value;
    };

    this.handleCommand(c);
  }

  get imageSmoothingQuality() {
    if (this._filter) {
      if (this._canvasState.has("imageSmoothingQuality")) {
        return this._canvasState.get("imageSmoothingQuality");
      }
    }

    return this._context.imageSmoothingQuality;
  }

  /******* lineCap*******/
  set lineCap(value) {
    if (this._filter) {
      if (this._canvasState.get("lineCap") == value) {
        return;
      } else {
        this._canvasState.set("lineCap", value);
      }
    }

    let c = this._pool.get();
    c.name = "lineCap";
    c.args = value;

    c.command = () => {
      this._context.lineCap = value;
    };

    this.handleCommand(c);
  }

  get lineCap() {
    if (this._filter) {
      if (this._canvasState.has("lineCap")) {
        return this._canvasState.get("lineCap");
      }
    }

    return this._context.lineCap;
  }

  /******* lineDashOffset*******/
  set lineDashOffset(value) {
    if (this._filter) {
      if (this._canvasState.get("lineDashOffset") == value) {
        return;
      } else {
        this._canvasState.set("lineDashOffset", value);
      }
    }

    let c = this._pool.get();
    c.name = "lineDashOffset";
    c.args = value;

    c.command = () => {
      this._context.lineDashOffset = value;
    };

    this.handleCommand(c);
  }

  get lineDashOffset() {
    if (this._filter) {
      if (this._canvasState.has("lineDashOffset")) {
        return this._canvasState.get("lineDashOffset");
      }
    }
    return this._context.lineDashOffset;
  }

  /******* lineJoin*******/
  set lineJoin(value) {
    if (this._filter) {
      if (this._canvasState.get("lineJoin") == value) {
        return;
      } else {
        this._canvasState.set("lineJoin", value);
      }
    }

    let c = this._pool.get();
    c.name = "lineJoin";
    c.args = value;

    c.command = () => {
      this._context.lineJoin = value;
    };

    this.handleCommand(c);
  }

  get lineJoin() {
    if (this._filter) {
      if (this._canvasState.has("lineJoin")) {
        return this._canvasState.get("lineJoin");
      }
    }
    return this._context.lineJoin;
  }

  /******* lineWidth*******/
  set lineWidth(value) {
    if (this._filter) {
      if (this._canvasState.get("lineWidth") == value) {
        return;
      } else {
        this._canvasState.set("lineWidth", value);
      }
    }

    let c = this._pool.get();
    c.name = "lineWidth";
    c.args = value;

    c.command = () => {
      this._context.lineWidth = value;
    };

    this.handleCommand(c);
  }

  get lineWidth() {
    if (this._filter) {
      if (this._canvasState.has("lineWidth")) {
        return this._canvasState.get("lineWidth");
      }
    }
    return this._context.lineWidth;
  }

  /******* miterLimit*******/
  set miterLimit(value) {
    if (this._filter) {
      if (this._canvasState.get("miterLimit") == value) {
        return;
      } else {
        this._canvasState.set("miterLimit", value);
      }
    }

    let c = this._pool.get();
    c.name = "miterLimit";
    c.args = value;

    c.command = () => {
      this._context.miterLimit = value;
    };

    this.handleCommand(c);
  }

  get miterLimit() {
    if (this._filter) {
      if (this._canvasState.has("miterLimit")) {
        return this._canvasState.get("miterLimit");
      }
    }
    return this._context.miterLimit;
  }

  /******* shadowBlur*******/
  set shadowBlur(value) {
    if (this._filter) {
      if (this._canvasState.get("shadowBlur") == value) {
        return;
      } else {
        this._canvasState.set("shadowBlur", value);
      }
    }

    let c = this._pool.get();
    c.name = "shadowBlur";
    c.args = value;

    c.command = () => {
      this._context.shadowBlur = value;
    };

    this.handleCommand(c);
  }

  get shadowBlur() {
    if (this._filter) {
      if (this._canvasState.has("shadowBlur")) {
        return this._canvasState.get("shadowBlur");
      }
    }
    return this._context.shadowBlur;
  }

  /******* shadowColor*******/
  set shadowColor(value) {
    if (this._filter) {
      if (this._canvasState.get("shadowColor") == value) {
        return;
      } else {
        this._canvasState.set("shadowColor", value);
      }
    }

    let c = this._pool.get();
    c.name = "shadowColor";
    c.args = value;

    c.command = () => {
      this._context.shadowColor = value;
    };

    this.handleCommand(c);
  }

  get shadowColor() {
    if (this._filter) {
      if (this._canvasState.has("shadowColor")) {
        return this._canvasState.get("shadowColor");
      }
    }
    return this._context.shadowColor;
  }

  /******* shadowOffsetX*******/
  set shadowOffsetX(value) {
    if (this._filter) {
      if (this._canvasState.get("shadowOffsetX") == value) {
        return;
      } else {
        this._canvasState.set("shadowOffsetX", value);
      }
    }

    let c = this._pool.get();
    c.name = "shadowOffsetX";
    c.args = value;

    c.command = () => {
      this._context.shadowOffsetX = value;
    };

    this.handleCommand(c);
  }

  get shadowOffsetX() {
    if (this._filter) {
      if (this._canvasState.has("shadowOffsetX")) {
        return this._canvasState.get("shadowOffsetX");
      }
    }
    return this._context.shadowOffsetX;
  }

  /******* shadowOffsetY*******/
  set shadowOffsetY(value) {
    if (this._filter) {
      if (this._canvasState.get("shadowOffsetY") == value) {
        return;
      } else {
        this._canvasState.set("shadowOffsetY", value);
      }
    }

    let c = this._pool.get();
    c.name = "shadowOffsetY";
    c.args = value;

    c.command = () => {
      this._context.shadowOffsetY = value;
    };

    this.handleCommand(c);
  }

  get shadowOffsetY() {
    if (this._filter) {
      if (this._canvasState.has("shadowOffsetY")) {
        return this._canvasState.get("shadowOffsetY");
      }
    }
    return this._context.shadowOffsetY;
  }

  set strokeStyle(value) {
    if (this._filter) {
      if (this._canvasState.get("strokeStyle") == value) {
        return;
      } else {
        this._canvasState.set("strokeStyle", value);
      }
    }

    let c = this._pool.get();
    c.name = "strokeStyle";
    c.args = value;

    c.command = () => {
      this._context.strokeStyle = value;
    };

    this.handleCommand(c);
  }

  get strokeStyle() {
    if (this._filter) {
      if (this._canvasState.has("strokeStyle")) {
        return this._canvasState.get("strokeStyle");
      }
    }
    return this._context.strokeStyle;
  }

  /******* textAlign*******/
  set textAlign(value) {
    if (this._filter) {
      if (this._canvasState.get("textAlign") == value) {
        return;
      } else {
        this._canvasState.set("textAlign", value);
      }
    }

    let c = this._pool.get();
    c.name = "textAlign";
    c.args = value;

    c.command = () => {
      this._context.textAlign = value;
    };

    this.handleCommand(c);
  }

  get textAlign() {
    if (this._filter) {
      if (this._canvasState.has("textAlign")) {
        return this._canvasState.get("textAlign");
      }
    }
    return this._context.textAlign;
  }

  /******* textBaseline*******/
  set textBaseline(value) {
    if (this._filter) {
      if (this._canvasState.get("textBaseline") == value) {
        return;
      } else {
        this._canvasState.set("textBaseline", value);
      }
    }

    let c = this._pool.get();
    c.name = "textBaseline";
    c.args = value;

    c.command = () => {
      this._context.textBaseline = value;
    };

    this.handleCommand(c);
  }

  get textBaseline() {
    if (this._filter) {
      if (this._canvasState.has("textBaseline")) {
        return this._canvasState.get("textBaseline");
      }
    }
    return this._context.textBaseline;
  }

  /********** methods **********/
  addHitRegion(...args) {
    let c = this._pool.get();
    c.name = "addHitRegion";
    c.args = args;

    c.command = () => {
      this._context.addHitRegion(...args);
    };

    this.handleCommand(c);
  }
  arc(...args) {
    let c = this._pool.get();
    c.name = "arc";
    c.args = args;

    c.command = () => {
      this._context.arc(...args);
    };

    this.handleCommand(c);
  }
  arcTo(...args) {
    let c = this._pool.get();
    c.name = "arcTo";
    c.args = args;

    c.command = () => {
      this._context.arcTo(...args);
    };

    this.handleCommand(c);
  }
  beginPath(...args) {
    let c = this._pool.get();
    c.name = "beginPath";
    c.args = args;

    c.command = () => {
      this._context.beginPath(...args);
    };

    this.handleCommand(c);
  }
  bezierCurveTo(...args) {
    let c = this._pool.get();
    c.name = "bezierCurveTo";
    c.args = args;

    c.command = () => {
      this._context.bezierCurveTo(...args);
    };

    this.handleCommand(c);
  }
  clearHitRegions(...args) {
    let c = this._pool.get();
    c.name = "clearHitRegions";
    c.args = args;

    c.command = () => {
      this._context.clearHitRegions(...args);
    };

    this.handleCommand(c);
  }
  clearRect(...args) {
    let c = this._pool.get();
    c.name = "clearRect";
    c.args = args;

    c.command = () => {
      this._context.clearRect(...args);
    };

    this.handleCommand(c);
  }
  clip(...args) {
    let c = this._pool.get();
    c.name = "clip";
    c.args = args;

    c.command = () => {
      this._context.clip(...args);
    };

    this.handleCommand(c);
  }
  closePath(...args) {
    let c = this._pool.get();
    c.name = "closePath";
    c.args = args;

    c.command = () => {
      this._context.closePath(...args);
    };

    this.handleCommand(c);
  }
  createImageData(...args) {
    return this._context.createImageData(...args);
  }
  createLinearGradient(...args) {
    return this._context.createLinearGradient(...args);
  }
  createPattern(...args) {
    return this._context.createPattern(...args);
  }
  createRadialGradient(...args) {
    return this._context.createRadialGradient(...args);
  }
  drawFocusIfNeeded(...args) {
    let c = this._pool.get();
    c.name = "drawFocusIfNeeded";
    c.args = args;

    c.command = () => {
      this._context.drawFocusIfNeeded(...args);
    };

    this.handleCommand(c);
  }
  drawImage(...args) {
    let c = this._pool.get();
    c.name = "drawImage";
    c.args = args;

    c.command = () => {
      this._context.drawImage(...args);
    };

    this.handleCommand(c);
  }
  drawWidgetAsOnScreen(...args) {
    let c = this._pool.get();
    c.name = "drawWidgetAsOnScreen";
    c.args = args;

    c.command = () => {
      this._context.drawWidgetAsOnScreen(...args);
    };

    this.handleCommand(c);
  }
  drawWindow(...args) {
    let c = this._pool.get();
    c.name = "drawWindow";
    c.args = args;

    c.command = () => {
      this._context.drawWindow(...args);
    };

    this.handleCommand(c);
  }
  ellipse(...args) {
    let c = this._pool.get();
    c.name = "ellipse";
    c.args = args;

    c.command = () => {
      this._context.ellipse(...args);
    };

    this.handleCommand(c);
  }
  fill(...args) {
    let c = this._pool.get();
    c.name = "fill";
    c.args = args;

    c.command = () => {
      this._context.fill(...args);
    };

    this.handleCommand(c);
  }
  fillRect(...args) {
    let c = this._pool.get();
    c.name = "fillRect";
    c.args = args;

    c.command = () => {
      this._context.fillRect(...args);
    };

    this.handleCommand(c);
  }
  fillText(...args) {
    let c = this._pool.get();
    c.name = "fillText";
    c.args = args;

    c.command = () => {
      this._context.fillText(...args);
    };

    this.handleCommand(c);
  }

  getImageData(...args) {
    return this._context.getImageData(...args);
  }
  getLineDash(...args) {
    //todo: this could be off if we are batching calls and you call this in same
    //frame that you set it
    return this._context.getLineDash(...args);
  }
  isPointInPath(...args) {
    return this._context.isPointInPath(...args);
  }
  isPointInStroke(...args) {
    return this._context.isPointInStroke(...args);
  }
  lineTo(...args) {
    let c = this._pool.get();
    c.name = "lineTo";
    c.args = args;

    c.command = () => {
      this._context.lineTo(...args);
    };

    this.handleCommand(c);
  }
  measureText(...args) {
    return this._context.measureText(...args);
  }
  moveTo(...args) {
    let c = this._pool.get();
    c.name = "moveTo";
    c.args = args;

    c.command = () => {
      this._context.moveTo(...args);
    };

    this.handleCommand(c);
  }
  putImageData(...args) {
    let c = this._pool.get();
    c.name = "putImageData";
    c.args = args;

    c.command = () => {
      this._context.putImageData(...args);
    };

    this.handleCommand(c);
  }
  quadraticCurveTo(...args) {
    let c = this._pool.get();
    c.name = "quadraticCurveTo";
    c.args = args;

    c.command = () => {
      this._context.quadraticCurveTo(...args);
    };

    this.handleCommand(c);
  }
  rect(...args) {
    let c = this._pool.get();
    c.name = "rect";
    c.args = args;

    c.command = () => {
      this._context.rect(...args);
    };

    this.handleCommand(c);
  }
  removeHitRegion(...args) {
    let c = this._pool.get();
    c.name = "removeHitRegion";
    c.args = args;

    c.command = () => {
      this._context.removeHitRegion(...args);
    };

    this.handleCommand(c);
  }
  resetTransform(...args) {
    let c = this._pool.get();
    c.name = "resetTransform";
    c.args = args;

    c.command = () => {
      this._context.resetTransform(...args);
    };

    this.handleCommand(c);
  }
  restore(...args) {
    let c = this._pool.get();
    c.name = "restore";
    c.args = args;

    c.command = () => {
      this._context.restore(...args);
    };

    this.handleCommand(c);
  }
  rotate(...args) {
    let c = this._pool.get();
    c.name = "restore";
    c.args = args;

    c.command = () => {
      this._context.rotate(...args);
    };

    this.handleCommand(c);
  }
  save(...args) {
    let c = this._pool.get();
    c.name = "save";
    c.args = args;

    c.command = () => {
      this._context.save(...args);
    };

    this.handleCommand(c);
  }
  scale(...args) {
    let c = this._pool.get();
    c.name = "scale";
    c.args = args;

    c.command = () => {
      this._context.scale(...args);
    };

    this.handleCommand(c);
  }
  scrollPathIntoView(...args) {
    let c = this._pool.get();
    c.name = "scrollPathIntoView";
    c.args = args;

    c.command = () => {
      this._context.scrollPathIntoView(...args);
    };

    this.handleCommand(c);
  }
  setLineDash(...args) {
    let c = this._pool.get();
    c.name = "setLineDash";
    c.args = args;

    c.command = () => {
      this._context.setLineDash(...args);
    };

    this.handleCommand(c);
  }
  setTransform(...args) {
    let c = this._pool.get();
    c.name = "setTransform";
    c.args = args;

    c.command = () => {
      this._context.setTransform(...args);
    };

    this.handleCommand(c);
  }
  stroke(...args) {
    let c = this._pool.get();
    c.name = "stroke";
    c.args = args;

    c.command = () => {
      this._context.stroke(...args);
    };

    this.handleCommand(c);
  }
  strokeRect(...args) {
    let c = this._pool.get();
    c.name = "strokeRect";
    c.args = args;

    c.command = () => {
      this._context.strokeRect(...args);
    };

    this.handleCommand(c);
  }
  strokeText(...args) {
    let c = this._pool.get();
    c.name = "strokeText";
    c.args = args;

    c.command = () => {
      this._context.strokeText(...args);
    };

    this.handleCommand(c);
  }
  transform(...args) {
    let c = this._pool.get();
    c.name = "transform";
    c.args = args;

    c.command = () => {
      this._context.transform(...args);
    };

    this.handleCommand(c);
  }
  translate(...args) {
    let c = this._pool.get();
    c.name = "translate";
    c.args = args;

    c.command = () => {
      this._context.translate(...args);
    };

    this.handleCommand(c);
  }
}

class Command {
  constructor() {
    this.init();
  }

  init(name, args, command) {
    this.name = name;
    this.args = args;
    this.command = command;
  }
}
