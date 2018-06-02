/*
* APIS below are created from CreateJS Ease class.
* 
* Ease
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2010 gskinner.com, inc.
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

function getPowIn(pow) {
  return function(t) {
    return Math.pow(t, pow);
  };
}

function getPowOut(pow) {
  return function(t) {
    return 1 - Math.pow(1 - t, pow);
  };
}

function getPowInOut(pow) {
  return function(t) {
    if ((t *= 2) < 1) return 0.5 * Math.pow(t, pow);
    return 1 - 0.5 * Math.abs(Math.pow(2 - t, pow));
  };
}

export function linear(t) {
  return t;
}

export let quadIn = getPowIn(2);
export let quadOut = getPowOut(2);
export let quadInOut = getPowInOut(2);

export let cubicIn = getPowIn(3);
export let cubicOut = getPowOut(3);
export let cubicInOut = getPowInOut(3);

export let quartIn = getPowIn(4);
export let quartOut = getPowOut(4);
export let quartInOut = getPowInOut(4);

export let quintIn = getPowIn(5);
export let quintOut = getPowOut(5);
export let quintInOut = getPowInOut(5);

export function sineIn(t) {
  return 1 - Math.cos((t * Math.PI) / 2);
}

export function sineOut(t) {
  return Math.sin((t * Math.PI) / 2);
}

export function sineInOut(t) {
  return -0.5 * (Math.cos(Math.PI * t) - 1);
}

function getBackIn(amount) {
  return function(t) {
    return t * t * ((amount + 1) * t - amount);
  };
}

function getBackOut(amount) {
  return function(t) {
    return --t * t * ((amount + 1) * t + amount) + 1;
  };
}

function getBackInOut(amount) {
  amount *= 1.525;
  return function(t) {
    if ((t *= 2) < 1) return 0.5 * (t * t * ((amount + 1) * t - amount));
    return 0.5 * ((t -= 2) * t * ((amount + 1) * t + amount) + 2);
  };
}

export let backIn = getBackIn(1.7);
export let backOut = getBackOut(1.7);
export let backInOut = getBackInOut(1.7);

export function circIn(t) {
  return -(Math.sqrt(1 - t * t) - 1);
}

export function circOut(t) {
  return Math.sqrt(1 - --t * t);
}

export function circInOut(t) {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1);
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1);
}

export function bounceIn(t) {
  return 1 - Ease.bounceOut(1 - t);
}

export function bounceOut(t) {
  if (t < 1 / 2.75) {
    return 7.5625 * t * t;
  } else if (t < 2 / 2.75) {
    return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
  } else if (t < 2.5 / 2.75) {
    return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
  } else {
    return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
  }
}

export function bounceInOut(t) {
  if (t < 0.5) return Ease.bounceIn(t * 2) * 0.5;
  return Ease.bounceOut(t * 2 - 1) * 0.5 + 0.5;
}

function getElasticIn(amplitude, period) {
  var pi2 = Math.PI * 2;
  return function(t) {
    if (t == 0 || t == 1) return t;
    var s = (period / pi2) * Math.asin(1 / amplitude);
    return -(
      amplitude *
      Math.pow(2, 10 * (t -= 1)) *
      Math.sin(((t - s) * pi2) / period)
    );
  };
}

function getElasticOut(amplitude, period) {
  var pi2 = Math.PI * 2;
  return function(t) {
    if (t == 0 || t == 1) return t;
    var s = (period / pi2) * Math.asin(1 / amplitude);
    return (
      amplitude * Math.pow(2, -10 * t) * Math.sin(((t - s) * pi2) / period) + 1
    );
  };
}

function getElasticInOut(amplitude, period) {
  var pi2 = Math.PI * 2;
  return function(t) {
    var s = (period / pi2) * Math.asin(1 / amplitude);
    if ((t *= 2) < 1)
      return (
        -0.5 *
        (amplitude *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t - s) * pi2) / period))
      );
    return (
      amplitude *
        Math.pow(2, -10 * (t -= 1)) *
        Math.sin(((t - s) * pi2) / period) *
        0.5 +
      1
    );
  };
}

export let elasticIn = getElasticIn(1, 0.3);
export let elasticOut = getElasticOut(1, 0.3);
export let elasticInOut = getElasticInOut(1, 0.3 * 1.5);
