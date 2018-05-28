import Canvas from "./canvas.js";
import { createFileName, downloadJSON } from "./datautils.js";
import Rectangle from "./rectangle.js";
import Vector from "./vector.js";

class MeshJS {
  constructor() {
    //may eventually allow these to be set via config object
    this._pauseKey = " ";
    this._downloadPngKey = "p";
    this._downloadVideoKey = "v";
    this._initKey = "i";
    this._downloadConfigJson = "j";

    this._config;
    this._init;
    this._draw;

    this._fpsInterval;
    this._lastFrameTime;
    this._startTime;
    this._paused = false;

    this._canvas;
    this._frameCount = 0;

    this._canvasScaleX = 1;
    this._canvasScaleY = 1;
    this._canvasBoundingRect = undefined;

    this._eventHandlers = new Map();

    this._requestAnimationFrameHandler = this.onAnimationFrame.bind(this);
  }

  init(config, initCallback, drawCallback, promise) {
    this._config = config;
    this._init = initCallback;
    this._draw = drawCallback;

    document.body.style.background = this._config.BACKGROUND_COLOR;

    window.addEventListener("keyup", this.onKeyUp.bind(this));

    this._fpsInterval = 1000 / this._config.FPS;
    this._lastFrameTime = Date.now();
    this._startTime = this._lastFrameTime;
    window.requestAnimationFrame(this._requestAnimationFrameHandler);

    this._canvas = new Canvas(
      this._config.PARENT_ID,
      this._config.RENDER_WIDTH,
      this._config.RENDER_HEIGHT,
      this._config.CANVAS_BACKGROUND_COLOR,
      this._config.CAPTURE_SVG,
      this._config.ENABLE_DEBUG
    );

    if (
      this._config.MAX_DISPLAY_WIDTH != this._config.RENDER_WIDTH ||
      this._config.MAX_DISPLAY_HEIGHT != this._config.RENDER_HEIGHT
    ) {
      let maxW = this._config.MAX_DISPLAY_WIDTH;
      let maxH = this._config.MAX_DISPLAY_HEIGHT;

      let canvasW = this._config.RENDER_WIDTH;
      let canvasH = this._config.RENDER_HEIGHT;

      if (canvasH > maxH || canvasW > maxW) {
        let ratio = canvasH / canvasW;

        if (canvasW >= maxW && ratio <= 1) {
          canvasW = maxW;
          canvasH = canvasW * ratio;
        } else if (canvasH >= maxH) {
          canvasH = maxH;
          canvasW = canvasH / ratio;
        }
      }

      this._canvas.canvas.style.height = canvasH;
      this._canvas.canvas.style.width = canvasW;

      //note, we cache these for performance for mouse events.
      this._canvasBoundingRect = this._canvas.canvas.getBoundingClientRect();
      this._canvasScaleX = config.RENDER_WIDTH / canvasW;
      this._canvasScaleY = config.RENDER_HEIGHT / canvasH;
    }

    if (this._config.RECORD_VIDEO) {
      this._canvas.startRecord();
    }

    let f = function() {
      this._init(this._canvas);

      if (!this._config.ANIMATE) {
        this.draw();
      }
    }.bind(this);

    //if a promise is passed in, we wont call init and draw until the
    //promise resolves
    if (promise) {
      promise.then(f, (err) => {
        console.log("mesh.init promise failed", err);
      });
    } else {
      f();
    }
  }

  /******************* Run Loop **********************/
  setPaused(paused) {
    this._paused = paused;
  }

  draw() {
    this._frameCount++;
    this._draw(this._canvas, this._frameCount);
    this._canvas.render();
  }

  onAnimationFrame() {
    let now = Date.now();
    let elapsed = now - this._lastFrameTime;

    if (elapsed > this._fpsInterval) {
      this._lastFrameTime = now - elapsed % this._fpsInterval;

      if (this._draw && !this._paused) {
        //todo: note events are not currently dispatched if paused
        this._dispatchEvents();
        if (this._config.ANIMATE) {
          if (this._config.CLEAR_CANVAS) {
            this._canvas.clear();
          }

          this.draw();
        }
      }
    }

    //todo: we should cache this as its probably creating a copy every time
    //and we dont have a reference to remove it
    window.requestAnimationFrame(this._requestAnimationFrameHandler);
  }

  /************************ Properties *********************/

  get canvas() {
    return this._canvas;
  }

  getConfigValue(key) {
    return this._config[key];
  }

  /************************* Events ************************/

  /**
   * Listen events you want to listen for. Can optionally pass in a boolean
   * as the last argument (default is true). If boolean is false, the events
   * passed in will no longer be listened for.
   */
  listen(...options) {
    if (options.length < 1) {
      console.log("Warning: mesh.listen : no listeners specified.");
      return;
    }

    let lastArg = options[options.length - 1];
    let shouldListen = true;

    if (lastArg === false || lastArg === true) {
      shouldListen = options.splice(-1, 1)[0];
    }

    if (options.length < 1) {
      console.log("Warning: mesh.listen : no listeners specified.");
    }

    if (shouldListen) {
      this._addListeners(options);
    } else {
      this._removeListeners(options);
    }
  }

  _addListeners(options) {
    for (let f of options) {
      if (this._eventHandlers.has(f.name)) {
        //dont add if we are already listening
        continue;
      }

      let h;
      switch (f.name) {
        case MOUSE_CLICK:
          h = new EventHandler(f);
          h.listen("click", this._generateMouseHandler(h), this._canvas.canvas);

          this._eventHandlers.set(MOUSE_CLICK, h);

          break;
        case MOUSE_UP:
          h = new EventHandler(f);
          h.listen(
            "mouseup",
            this._generateMouseHandler(h),
            this._canvas.canvas
          );

          this._eventHandlers.set(MOUSE_UP, h);
          break;
        case MOUSE_MOVE:
          h = new EventHandler(f);
          h.listen(
            "mousemove",
            this._generateMouseHandler(h),
            this._canvas.canvas
          );

          this._eventHandlers.set(MOUSE_MOVE, h);
          break;
        case MOUSE_DOWN:
          h = new EventHandler(f);
          h.listen(
            "mousedown",
            this._generateMouseHandler(h),
            this._canvas.canvas
          );

          this._eventHandlers.set(MOUSE_DOWN, h);
          break;
        case KEY_DOWN:
          h = new EventHandler(f);
          h.listen("keydown", this._generateKeyHandler(h), window);

          this._eventHandlers.set(KEY_DOWN, h);
          break;
        case KEY_UP:
          h = new EventHandler(f);
          h.listen("keyup", this._generateKeyHandler(h), window);

          this._eventHandlers.set(KEY_UP, h);
          break;

        case KEY_PRESS:
          h = new EventHandler(f);
          h.listen("keypress", this._generateKeyHandler(h), window);

          this._eventHandlers.set(KEY_PRESS, h);
          break;
      }
    }
  }

  _removeListeners(options) {
    for (let f of options) {
      let name = f.name;

      if (this._eventHandlers.has(name)) {
        let h = this._eventHandlers.get(name);

        h.remove();

        this._eventHandlers.delete(name);
      }
    }
  }

  _generateKeyHandler(handler) {
    let f = function(event) {
      handler.needToDispatch = true;
      handler.args = [{ event: event, key: event.key }];
    }.bind(this);

    return f;
  }

  _generateMouseHandler(handler) {
    let f = function(event) {
      handler.needToDispatch = true;
      handler.args = [
        { event: event, position: this._mouseEventRelativeToCanvas(event) }
      ];
    }.bind(this);

    return f;
  }

  //todo: need to make sure these are dispatched in correct order
  _dispatchEvents() {
    //order of events is specified in the EVENT_ORDER array below
    for (let eventName of EVENT_ORDER) {
      let h = this._eventHandlers.get(eventName);

      if (h !== undefined && h.needToDispatch) {
        h.dispatch();
      }
    }
  }

  _mouseEventRelativeToCanvas(event) {
    let x =
      (event.clientX - this._canvasBoundingRect.left) * this._canvasScaleX;
    let y = (event.clientY - this._canvasBoundingRect.top) * this._canvasScaleY;

    //todo: should we floor values? They seem to be floored in the events
    return new Vector(x, y);
  }

  onKeyUp(event) {
    const key = event.key;

    if (key === this._downloadPngKey) {
      this.downloadPng();
    } else if (key === this._downloadVideoKey) {
      this.downloadVideo();
    } else if (key === this._pauseKey) {
      this.setPaused(!this._paused);
    } else if (key === this._downloadConfigJson) {
      this.downloadJson();
    } else if (key === this._initKey) {
      this._init(this._canvas);
    }
  }

  /********************** Download Media *********************/

  downloadPng() {
    let n = createFileName(this._config.APP_NAME, "png");
    this._canvas.downloadPNG(n);
  }

  downloadVideo() {
    let n = createFileName(this._config.APP_NAME, "webm");
    this._canvas.downloadVideo(n);
  }

  downloadJson() {
    downloadJSON(this._config, `${this._config.APP_NAME}_config`);
  }
}

//todo: may want to make this static, so if we call from other modules we get
//same instance
let mesh;
export default (mesh = new MeshJS());

const MOUSE_MOVE = "mousemove";
const MOUSE_DOWN = "mousedown";
const MOUSE_UP = "mouseup";
const MOUSE_CLICK = "click";
const KEY_DOWN = "keydown";
const KEY_PRESS = "keypress";
const KEY_UP = "keyup";

const EVENT_ORDER = [
  MOUSE_MOVE,
  MOUSE_DOWN,
  MOUSE_UP,
  MOUSE_CLICK,
  KEY_DOWN,
  KEY_PRESS,
  KEY_UP
];

class EventHandler {
  constructor(callback) {
    this.args = undefined;
    this.listener = undefined;
    this.parent = undefined;
    this.name = undefined;
    this.callback = callback;
    this.needToDispatch = false;
  }

  listen(name, listener, parent) {
    this.listener = listener;
    this.parent = parent;
    this.name = name;

    parent.addEventListener(name, listener);
  }

  remove() {
    this.parent.removeEventListener(this.name, this.listener);
  }

  dispatch() {
    if (!this.needToDispatch) {
      return;
    }

    //todo: right now, we dont have any events that dispatch without arguments
    //so if this is hit, it means there is probably a bug.
    if (!this.args) {
      console.log(`Warning : event dispatch called with no arguments`, this);
    }

    this.callback(...this.args);
    this.args = null;
    this.needToDispatch = false;
  }
}
