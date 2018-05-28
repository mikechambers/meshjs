### todo

* Expand SVG export support
  * rectangle
  * circle
  * line (create)
* add line object
* add draw method to Gradient
* more robust SVG capture
  * perhaps just proxy the context object and pass that around. then capture commands with a setting to capture SVG. clear when we clear screen. could initially just implement some calls and proxy the others through.
* With new context proxy we can do some optimizations when redrawing. specifically, we may be able to check whether there have been any new commands since the last render, and if not, skip redrawing the screen
* We can also do things like save a set of commands and play them back in the future. basically you could add forward / rewind
  ## SVG capture
  * move  APP_NAME window.location.pathname.replace(/\//gi, "") to meshjs api

  Proxy calls to context, by passing and drawing to our own instance. We would probably need to mirror each specific call, but we could then store the call on the actual canvas instance like so:

      return context.drawImage(args).bind(context);

or something like that. we could save those in an array and then loop through at the end of the draw loop and call them.

We would then have a property on whether we should capture SVG, in which case, when we proxy the calls, we also create svg nodes from the calls, which we could then loop through and output when needed.
