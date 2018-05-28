### todo

* Expand SVG export support
  * rectangle
  * circle
  * line (create)
* add line object
* add draw method to Gradient
* more robust SVG capture
  * perhaps just proxy the context object and pass that around. then capture commands with a setting to capture SVG. clear when we clear screen. could initially just impliment some calls and proxy the others through.

  ## SVG capture

  Proxy calls to context, by passing and drawing to our own instance. We would probably need to mirror each specific call, but we could then store the call on the actual canvas instance like so:

      return context.drawImage(args).bind(context);

or something like that. we could save those in an array and then loop through at the end of the draw loop and call them.

We would then have a property on whether we should capture SVG, in which case, when we proxy the calls, we also create svg nodes from the calls, which we could then loop through and output when needed.
