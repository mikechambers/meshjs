export default class Context2D {
  constructor(context, backgroundColor, capture = false, debug = false) {
    this._context = context;
    this._commands = [];
    this._capture = capture;
    this._debug = debug;

    this._renderEnabled = true;

    this._backgroundColorRGBA = undefined;

    this.backgroundColor = backgroundColor;
    this.clear();
  }

  set backgroundColor(color) {
    if (color === undefined) {
      this._backgroundColorRGBA = undefined;
      return;
    }

    //we store the CSS RGBA string instead of the color instance for performance
    //so we dont have to convert to RGBA css string every frame.
    this._backgroundColorRGBA = color.toCSS();
  }

  //todo: we could probably inline this into each method call below, which
  //should offer better performance
  handleCommand(cmd) {
    //if rendering is disabled, just dump calls
    if (!this._renderEnabled) {
      return;
    }

    if (this._capture) {
      this._commands.push(cmd);
    } else {
      cmd();
    }
  }

  //clear rendering que, context, and optionally draws a new background
  //color
  clear() {
    this._clearCommands();

    if (this._backgroundColorRGBA === undefined) {
      this.clearRect(0, 0, this.width, this.height);
    } else {
      this.fillStyle = this._backgroundColorRGBA;
      this.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  _clearCommands() {
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
      command();
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
    let c = () => {
      this._context.currentTransform = value;
    };

    this.handleCommand(c);
  }

  get currentTransform() {
    return this._context.currentTransform;
  }

  /******* direction*******/
  set direction(value) {
    let c = () => {
      this._context.direction = value;
    };

    this.handleCommand(c);
  }

  get direction() {
    return this._context.direction;
  }

  /******* fillStyle*******/
  set fillStyle(value) {
    let c = () => {
      this._context.fillStyle = value;
    };

    this.handleCommand(c);
  }

  get fillStyle() {
    return this._context.fillStyle;
  }

  /******* filter*******/
  set filter(value) {
    let c = () => {
      this._context.filter = value;
    };

    this.handleCommand(c);
  }

  get filter() {
    return this._context.filter;
  }

  /******* font*******/
  set font(value) {
    let c = () => {
      this._context.font = value;
    };

    this.handleCommand(c);
  }

  get font() {
    return this._context.font;
  }

  /******* globalAlpha*******/
  set globalAlpha(value) {
    let c = () => {
      this._context.globalAlpha = value;
    };

    this.handleCommand(c);
  }

  get globalAlpha() {
    return this._context.globalAlpha;
  }

  /******* globalCompositeOperation*******/
  set globalCompositeOperation(value) {
    let c = () => {
      this._context.globalCompositeOperation = value;
    };

    this.handleCommand(c);
  }

  get globalCompositeOperation() {
    return this._context.globalCompositeOperation;
  }

  /******* imageSmoothingEnabled*******/
  set imageSmoothingEnabled(value) {
    let c = () => {
      this._context.imageSmoothingEnabled = value;
    };

    this.handleCommand(c);
  }

  get imageSmoothingEnabled() {
    return this._context.imageSmoothingEnabled;
  }

  /******* imageSmoothingQuality*******/
  set imageSmoothingQuality(value) {
    let c = () => {
      this._context.imageSmoothingQuality = value;
    };

    this.handleCommand(c);
  }

  get imageSmoothingQuality() {
    return this._context.imageSmoothingQuality;
  }

  /******* lineCap*******/
  set lineCap(value) {
    let c = () => {
      this._context.lineCap = value;
    };

    this.handleCommand(c);
  }

  get lineCap() {
    return this._context.lineCap;
  }

  /******* lineDashOffset*******/
  set lineDashOffset(value) {
    let c = () => {
      this._context.lineDashOffset = value;
    };

    this.handleCommand(c);
  }

  get lineDashOffset() {
    return this._context.lineDashOffset;
  }

  /******* lineJoin*******/
  set lineJoin(value) {
    let c = () => {
      this._context.lineJoin = value;
    };

    this.handleCommand(c);
  }

  get lineJoin() {
    return this._context.lineJoin;
  }

  /******* lineWidth*******/
  set lineWidth(value) {
    let c = () => {
      this._context.lineWidth = value;
    };

    this.handleCommand(c);
  }

  get lineWidth() {
    return this._context.lineWidth;
  }

  /******* miterLimit*******/
  set miterLimit(value) {
    let c = () => {
      this._context.miterLimit = value;
    };

    this.handleCommand(c);
  }

  get miterLimit() {
    return this._context.miterLimit;
  }

  /******* shadowBlur*******/
  set shadowBlur(value) {
    let c = () => {
      this._context.shadowBlur = value;
    };

    this.handleCommand(c);
  }

  get shadowBlur() {
    return this._context.shadowBlur;
  }

  /******* shadowColor*******/
  set shadowColor(value) {
    let c = () => {
      this._context.shadowColor = value;
    };

    this.handleCommand(c);
  }

  get shadowColor() {
    return this._context.shadowColor;
  }

  /******* shadowOffsetX*******/
  set shadowOffsetX(value) {
    let c = () => {
      this._context.shadowOffsetX = value;
    };

    this.handleCommand(c);
  }

  get shadowOffsetX() {
    return this._context.shadowOffsetX;
  }

  /******* shadowOffsetY*******/
  set shadowOffsetY(value) {
    let c = () => {
      this._context.shadowOffsetY = value;
    };

    this.handleCommand(c);
  }

  get shadowOffsetY() {
    return this._context.shadowOffsetY;
  }

  set strokeStyle(value) {
    let c = () => {
      this._context.strokeStyle = value;
    };

    this.handleCommand(c);
  }

  get strokeStyle() {
    return this._context.strokeStyle;
  }

  /******* textAlign*******/
  set textAlign(value) {
    let c = () => {
      this._context.textAlign = value;
    };

    this.handleCommand(c);
  }

  get textAlign() {
    return this._context.textAlign;
  }

  /******* textBaseline*******/
  set textBaseline(value) {
    let c = () => {
      this._context.textBaseline = value;
    };

    this.handleCommand(c);
  }

  get textBaseline() {
    return this._context.textBaseline;
  }

  addHitRegion(...args) {
    let c = () => {
      this._context.addHitRegion(...args);
    };

    this.handleCommand(c);
  }
  arc(...args) {
    let c = () => {
      this._context.arc(...args);
    };

    this.handleCommand(c);
  }
  arcTo(...args) {
    let c = () => {
      this._context.arcTo(...args);
    };

    this.handleCommand(c);
  }
  beginPath(...args) {
    let c = () => {
      this._context.beginPath(...args);
    };

    this.handleCommand(c);
  }
  bezierCurveTo(...args) {
    let c = () => {
      this._context.bezierCurveTo(...args);
    };

    this.handleCommand(c);
  }
  clearHitRegions(...args) {
    let c = () => {
      this._context.clearHitRegions(...args);
    };

    this.handleCommand(c);
  }
  clearRect(...args) {
    let c = () => {
      this._context.clearRect(...args);
    };

    this.handleCommand(c);
  }
  clip(...args) {
    let c = () => {
      this._context.clip(...args);
    };

    this.handleCommand(c);
  }
  closePath(...args) {
    let c = () => {
      this._context.closePath(...args);
    };

    this.handleCommand(c);
  }
  createImageData(...args) {
    let c = () => {
      this._context.createImageData(...args);
    };

    this.handleCommand(c);
  }
  createLinearGradient(...args) {
    let c = () => {
      this._context.createLinearGradient(...args);
    };

    this.handleCommand(c);
  }
  createPattern(...args) {
    let c = () => {
      this._context.createPattern(...args);
    };

    this.handleCommand(c);
  }
  createRadialGradient(...args) {
    let c = () => {
      this._context.createRadialGradient(...args);
    };

    this.handleCommand(c);
  }
  drawFocusIfNeeded(...args) {
    let c = () => {
      this._context.drawFocusIfNeeded(...args);
    };

    this.handleCommand(c);
  }
  drawImage(...args) {
    let c = () => {
      this._context.drawImage(...args);
    };

    this.handleCommand(c);
  }
  drawWidgetAsOnScreen(...args) {
    let c = () => {
      this._context.drawWidgetAsOnScreen(...args);
    };

    this.handleCommand(c);
  }
  drawWindow(...args) {
    let c = () => {
      this._context.drawWindow(...args);
    };

    this.handleCommand(c);
  }
  ellipse(...args) {
    let c = () => {
      this._context.ellipse(...args);
    };

    this.handleCommand(c);
  }
  fill(...args) {
    let c = () => {
      this._context.fill(...args);
    };

    this.handleCommand(c);
  }
  fillRect(...args) {
    let c = () => {
      this._context.fillRect(...args);
    };

    this.handleCommand(c);
  }
  fillText(...args) {
    let c = () => {
      this._context.fillText(...args);
    };

    this.handleCommand(c);
  }
  getImageData(...args) {
    let c = () => {
      this._context.getImageData(...args);
    };

    this.handleCommand(c);
  }
  getLineDash(...args) {
    let c = () => {
      this._context.getLineDash(...args);
    };

    this.handleCommand(c);
  }
  isPointInPath(...args) {
    let c = () => {
      this._context.isPointInPath(...args);
    };

    this.handleCommand(c);
  }
  isPointInStroke(...args) {
    let c = () => {
      this._context.isPointInStroke(...args);
    };

    this.handleCommand(c);
  }
  lineTo(...args) {
    let c = () => {
      this._context.lineTo(...args);
    };

    this.handleCommand(c);
  }
  measureText(...args) {
    let c = () => {
      this._context.measureText(...args);
    };

    this.handleCommand(c);
  }
  moveTo(...args) {
    let c = () => {
      this._context.moveTo(...args);
    };

    this.handleCommand(c);
  }
  putImageData(...args) {
    let c = () => {
      this._context.putImageData(...args);
    };

    this.handleCommand(c);
  }
  quadraticCurveTo(...args) {
    let c = () => {
      this._context.quadraticCurveTo(...args);
    };

    this.handleCommand(c);
  }
  rect(...args) {
    let c = () => {
      this._context.rect(...args);
    };

    this.handleCommand(c);
  }
  removeHitRegion(...args) {
    let c = () => {
      this._context.removeHitRegion(...args);
    };

    this.handleCommand(c);
  }
  resetTransform(...args) {
    let c = () => {
      this._context.resetTransform(...args);
    };

    this.handleCommand(c);
  }
  restore(...args) {
    let c = () => {
      this._context.restore(...args);
    };

    this.handleCommand(c);
  }
  rotate(...args) {
    let c = () => {
      this._context.rotate(...args);
    };

    this.handleCommand(c);
  }
  save(...args) {
    let c = () => {
      this._context.save(...args);
    };

    this.handleCommand(c);
  }
  scale(...args) {
    let c = () => {
      this._context.scale(...args);
    };

    this.handleCommand(c);
  }
  scrollPathIntoView(...args) {
    let c = () => {
      this._context.scrollPathIntoView(...args);
    };

    this.handleCommand(c);
  }
  setLineDash(...args) {
    let c = () => {
      this._context.setLineDash(...args);
    };

    this.handleCommand(c);
  }
  setTransform(...args) {
    let c = () => {
      this._context.setTransform(...args);
    };

    this.handleCommand(c);
  }
  stroke(...args) {
    let c = () => {
      this._context.stroke(...args);
    };

    this.handleCommand(c);
  }
  strokeRect(...args) {
    let c = () => {
      this._context.strokeRect(...args);
    };

    this.handleCommand(c);
  }
  strokeText(...args) {
    let c = () => {
      this._context.strokeText(...args);
    };

    this.handleCommand(c);
  }
  transform(...args) {
    let c = () => {
      this._context.transform(...args);
    };

    this.handleCommand(c);
  }
  translate(...args) {
    let c = () => {
      this._context.translate(...args);
    };

    this.handleCommand(c);
  }
}
