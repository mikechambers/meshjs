## todo

### Tweaks

- Need to look at pointOnLine (try to figure out why we have to reverse angle)
- Update readme with updated features and getting started
- if CLEAR_CANVAS is true, should we call clear before calling init?
- confirm that the way we scale is using GPU
- when paused, and init is called should we then call draw once?
- look into rounding coordinates for draw commands
- maybe remove promise stuff. too complicated and you can workaround
- rename geometry folder
- add config to snap to pixels in context draw commands

### SVG export

- can we capture svg if not batching?
- capture path sent to stroke / etc
- need to explicitly split out opacity calls to support illustrator

### Projects

- Fill out Tween class and Tween manager class
- add a map function that lets you specify the easing equation?
- add color lerp?
- Motion classes (see below)
- Gradient
  - Add support for other gradient directions in Gradient class
  - Rename to indicate its using canvas implementation?

### Bigger Items

- Do custom implementation of Gradient (maybe that maps to SVG
- Think about SVG support (using the canvas api)
- Motion classes
- Figure out video capture bug
- Maybe rethink promise support in meshjs / circlepack_mask. Seems a bit over
  complicated

### Tooling

- NPM node to watch dir for downloads and copy
- Could implement download through an NPM server / node app, but might make ease
  of getting started too difficult
- Add support for auto reloading page when files update

### Motion Classes

In motion subdirectory (should we have subdirectories?)

- Mover
- Follower / Chaser / Tracker
- PointFollower
- MouserFollower
- BoundsMover

Need to come up with a better base name than mover.

### Drawing model

Note: I have settled on a model but am keeping the notes below for now for
reference.

Basically, you draw directly to the canvas context instance, using the
[context APIs](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
In addition, class instances can implement the ability to draw themselves.

For example, shape classes in the geometry dir can draw themselves:

```javascript
let circle = new Circle(bounds.center, 20);
circle.lineWidth = 1.0;
circle.strokeColor = Color.BLACK;
circle.fillColor = Color.BLACK;

circle.draw(context);
```

Classes that can draw themselves should implement the following as appropriate
(the Shape base class implements these):

- **lineWidth** property : specifies the width of the stroke line (passed on to
  context.lineWidth)
- **strokeColor** property : Takes a Color instance. Specifies the color of the
  stroke for the instance (passes on to context.strokeStyle via color.toCSS())
- **fillColor** property : Takes a Color instance. Specifies the color of the
  fill for the instance (passes on to context.fillStyle via color.toCSS())
- **draw(context)** method : Takes a context instance and draws the shape to it
  based on the instance properties.

Could go with a procedural model based on context (i.e. dont add new APIs to
context), but objects can draw themselves if passed a context object.

i.e. drawable objects have a draw(context) method, which then call the regular
draw apis.

We dont add new draw apis to context.

Are all base classes drawable? i.e. Circle, Rectangle? or do we have drawable
versions (Bounds, Rectangle).

If they are drawable, they need the following:

- Required
- draw(context) method
- fillStyle
- strokeStyle
- lineWidth
- Via Style
  - lineCap ?
  - lineDashOffset ?
  - lineJoin ?
  - lineWidth ?
  - miterLimit ?

Maybe we have basics, and then you can pass in pre functions? Are these needed?
you could just manually call them before.

```javascript
rectangle.draw(context, function(context) {
  context.lineCap = "butt";
});
```

Maybe just allow them to pass in a style instance which has properties, and has
a static method to let you set default for all instances.

Have to be careful we only make calls for things that are explicitly set.

Perhaps rectangle drawing is simple, if you need more advanced you need to do
manually, or override the draw method.

Or maybe that is the solution. We have a default draw, and you can override it
dynamically. Or maybe there is no draw and you attach it if you need it (or
subclass it). Overriding probably makes more sense, although quickly drawing is
really convient.

So, basic draw methods, and you subclass or override if you need more control.

Classes

- rectangle
- circle
- line
- path (contains lines)

we could add some drawing commands on context that know about shapes, and just
do the shape draws, but not styles.

i.e.

```javascript
context.drawRectangle(Rectangle | x, y, width, height);
context.drawCircle(Circle | x, y, radius);
context.drawPath(Path);
context.drawLine(Line | x1, y1, x2, y2);
```

We should not mix models. i.e. draw apis, and apis on context. putting them on
context doesnt actually save us a ton since we have to support the calls not on
context anyways, and it causes a potential issue with canvas adding apis in the
future.

So model is to call apis directly on context, or have instances impliment
draw(context) apis.

We will make it so all geometry can draw itself, and has appropriate properties
to do so:

fillStyle lineWidth strokeStyle (should we impliment end points

All geometry should extend a baseclass that has the properties and an empty draw

### Context proxy

Currently, we proxy all calls, and save function closures. We need to make a
decision on what the default is.

There is overhead right now when not batching, as we wrap the calls. We make it
where in the constructor, we dynamically set each method based on whether we
batch or now. that way, if you dont batch, we can just pass the call on
directly.

We will also probably need to add a simply command class that contains the
function closure, arguments and event name. Will probably need this for SVG
export, so we dont have to try to build SVG when calls are made, but can instead
do at the end of the frame.

## Video Capture issue

Sometimes video capture will kill performance of a project. It doesnt seem to
have anything to do with number of calls or items being drawn.

I can fix it if I batch all calls in the context proxy so they are all called at
once.

## SVG Export

- move PROJECT_NAME meshjs.getProjectName() to meshjs api
- pass in context to draw, not canvas

look at: https://github.com/gliffy/canvas2svg

Proxy calls to context, by passing and drawing to our own instance. We would
probably need to mirror each specific call, but we could then store the call on
the actual canvas instance like so:

      return context.drawImage(args).bind(context);

or something like that. we could save those in an array and then loop through at
the end of the draw loop and call them.

We would then have a property on whether we should capture SVG, in which case,
when we proxy the calls, we also create svg nodes from the calls, which we could
then loop through and output when needed.

- Expand SVG export support
  - rectangle
  - circle
  - line (create)
- add line object
- add draw method to Gradient

- more robust SVG capture
  - perhaps just proxy the context object and pass that around. then capture
    commands with a setting to capture SVG. clear when we clear screen. could
    initially just implement some calls and proxy the others through.
- With new context proxy we can do some optimizations when redrawing.
  specifically, we may be able to check whether there have been any new commands
  since the last render, and if not, skip redrawing the screen
- We can also do things like save a set of commands and play them back in the
  future. basically you could add forward / rewind
- add shortcut to open generated files in new tab instead of downloading
- what should we name apis we add onto canvas?
  - draw, create, add, render

Items that are maintained in canvas drawing state: strokeStyle, fillStyle,
globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, lineDashOffset,
shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, filter,
globalCompositeOperation, font, textAlign, textBaseline, direction,
imageSmoothingEnabled, imageSmoothingQuality.

https://html.spec.whatwg.org/multipage/canvas.html#line-styles

The current default path is persistent, and can only be reset using the
beginPath() method.

The save() method, when invoked, must push a copy of the current drawing state
onto the drawing state stack.

The restore() method, when invoked, must pop the top entry in the drawing state
stack, and reset the drawing state it describes. If there is no saved state,
then the method must do nothing.
