## Style Guidelines

### Tools

Use prettier.js

Use eslint

Use mocha for testing

### API naming

- draw(content) //draws instance
- update() //updates instance
- createXXX //creates and returns a new instance
- getXXX //getter when not returning / mirror property
- toXXX //returns a different representation of instance (toString, toCSS, to
  SVG)

### Notes

standardize on tab / space and size of each (2)

Use camelCase when naming objects, functions, and instances

Boolean properties ask a question. Use is or has, contains, etc... for boolean
values

A base filename should exactly match the name of its default export.

Use upper case for constants

Pass hashes / objects to event handlers. Makes it easier to modify and add more
data in the future

getters must not change state

use getFoo and not foo if return is generated

arrays have plural names

early return from functions when possible

Use toFoo when getting a different representation of instance (toSvg, toHex).

Use fromFoo for generator functions that return instances (usually static
functions).

static methods that are tied closely to instance should be static and not helper
functions.

use setFoo getFoo if they change the state

prepend private functions and variables with underscore

if utility functions exclusively work on an instance they cab be part of the
class

never cache pixel data by default
