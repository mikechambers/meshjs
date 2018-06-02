## mesh.js

Creative coding framework with a focus on quick iteration and easy output to
image and video.

The core philosophy behind the framework is to create a framework focused on
creative coding for image and video output. It is not useful for web deployment,
as it is only developed / tested on Google Chrome and leverages the latest
features and apis (including experimental features).

The goal is to provide a framework that makes it fast to do creative coding on
HTML canvas. It does not try to hide the underlying canvas drawing APIs, but
rather provide apis around it useful for creative coding.

### Features

- Quick and easy to get started.
- Config object based configuration, making it easy to quickly iterate, and save
  settings.
- Built in functionality for saving PNGs (hit "p") and videos (hit "v" when
  config.RECORD_VIDEO is set to true).
- Automatic support for rendering canvas at high resolution, but displaying at
  smaller size.
- APIs to make it easy to grab and use pixel data / colors from images and
  gradients.

In general, I add new features and APIs as I need them.

### Usage

The project includes a template folder that makes it easy to get started. Just
copy and rename the folder, and add your code to `main.js`.

1.  Specify configuration settings at the top of `main.js` in the `config`
    object. You can also add your own settings to the config object.
2.  Add any initialization code to the `init' function. This will be called once
    at start up (and also re-called any time you press the "i" key).
3.  Add rendering code and logic to the `draw` function. If `config.ANIMATE` is
    set to false, the draw function will be called once after init is called. If
    `config.ANIMATE` is true, then draw will be called repeatedly, with the
    frequency depending on the `config.FPS` setting.

### Drawing model

The drawing model uses the HTML5 Canvas drawing API. Specifically, drawing calls
are made directly to the context instance passed to the _init(context)_ and
_draw(context)_ functions, and available via _meshjs.canvas.context_. This is a
proxy for
[CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
and exposes all of its APIs.

In addition, class instances can implement the ability to draw themselves.

For example, _Shape_ instances in the _/lib/geometry_ dir can draw themselves:

```javascript
draw(context) {
  let circle = new Circle(bounds.center, 20);
  circle.lineWidth = 1.0;
  circle.strokeColor = Color.BLACK;
  circle.fillColor = Color.BLACK;

  circle.draw(context);
}
```

Classes that can draw themselves should implement the following as appropriate
(consider this similar to an isDrawable Interface):

- **lineWidth** property : specifies the width of the stroke line (passed on to
  context.lineWidth)
- **strokeColor** property : Takes a Color instance. Specifies the color of the
  stroke for the instance (passes on to context.strokeStyle via color.toCSS())
- **fillColor** property : Takes a Color instance. Specifies the color of the
  fill for the instance (passes on to context.fillStyle via color.toCSS())
- **draw(context)** method : Takes a context instance and draws the shape to it
  based on the instance properties.

### Keyboard Shortcuts

There are a number of built in keyboard short cuts. By default, these are
printed to the console when the project starts.

The following keyboard shortcuts are built in (currently no way to disable via
API).

| Key(s)      |                       Function                        |
| ----------- | :---------------------------------------------------: |
| SHIFT-P     |                     Download PNG                      |
| SHIFT-V     | Download Video (if enabled via _config.RECORD_VIDEO_) |
| SHIFT-J     |           Download Settings as a JSON file            |
| SHIFT-SPACE |                    Pause / Resume                     |
| SHIFT-R     |               Pause / Resume Rendering                |
| SHIFT-I     |                     Rerun init()                      |

In addition, you can define your own key combinations in the config, which will
then automatically be included in the console print out.

To add your own key shortcut descriptions add the config.KEY_COMMANDS property
with the following format:

```JavaScript
KEY_COMMANDS: {
  g: "Add nodes",
  b: "Cycle through colors"
}
```

Note, this only prints the information to the console. You must implement the
key listening code yourself by listening for the appropriate key events.

### Events

First and foremost, you can listen for any events
[broadcast in the browser](https://developer.mozilla.org/en-US/docs/Web/Events)
using addEventListner.

In addition _meshjs_ also emits a number of commonly used event, and where
useful, normalizes the data to make it easier to work with.

The following events are supported

| Event     | Description |
| --------- | :---------: |
| mousemove |             |
| mousedown |             |
| mouseup   |             |
| click     |             |
| keydown   |             |
| keypress  |             |
| keyup     |             |

Note that events are captured and dispatch prior to the call to draw(), and
therefor it is safe to draw to the context in the event handlers, as they will
be synced with the browser rendering loop.

To register for an event, simply define the event handler, and then pass it to
_meshjs.listen()_;

```JavaScript
function click(event) {
  console.log(event.position); //vector of mouse position click event occurred normalized for canvas
  console.log(event.event); //raw html event instance
}

meshjs.listen(click);
```

Note that you pass the instance name to listen, and thus the listener must be
named according the the event you are listening for.

You can listen for multiple events at a time like so:

```javascript
meshjs.listen(click, mousemove, keypress);
```

To stop listening for an event, just call pass then event handler you want to
stop listening for, and pass in false:

```JavaScript
mesh.listen(click, false);
```

### Project Template

You can find a template for getting started in the `template` folder. Just add
code your code to the `init()` and `draw()` methods.

### License

Copyright 2018 Mike Chambers

Released under and MIT License
