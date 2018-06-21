## todo

### Tweaks

- Need to look at pointOnLine (try to figure out why we have to reverse angle)
- Update readme with updated features and getting started
- look into rounding coordinates for draw commands
- rename geometry folder
- add config to snap to pixels in context draw commands

### Projects

- Fill out Tween class and Tween manager class
- add a map function that lets you specify the easing equation?
- add color lerp (that takes a color and an easing equation)
- Motion classes (see below)
- Gradient
  - Add support for other gradient directions in Gradient class
  - Rename to indicate its using canvas implementation?

### Bigger Items

- Do custom implementation of Gradient (maybe that maps to SVG
- Think about SVG support (using the canvas api)
- Motion classes
- Figure out video capture bug

### Tooling

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
(there is a base class named Drawable that impliments these and can be
subclassed.):

- **lineWidth** property : specifies the width of the stroke line (passed on to
  context.lineWidth)
- **strokeColor** property : Takes a Color instance. Specifies the color of the
  stroke for the instance (passes on to context.strokeStyle via color.toCSS())
- **fillColor** property : Takes a Color instance. Specifies the color of the
  fill for the instance (passes on to context.fillStyle via color.toCSS())
- **draw(context)** method : Takes a context instance and draws the shape to it
  based on the instance properties.

Note, we may also implement other styles when they are needed, such as:

- lineCap ?
- lineDashOffset ?
- lineJoin ?
- lineWidth ?
- miterLimit ?

## Video Capture issue

Sometimes video capture will kill performance of a project. It doesnt seem to
have anything to do with number of calls or items being drawn.

I can fix it if I batch all calls in the context proxy so they are all called at
once.
