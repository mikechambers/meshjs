export function constrain(amt, min, max) {
  if (amt > max) {
    return max;
  }

  if (amt < min) {
    return min;
  }

  return amt;
}

//returns a random floating point number from min (inclusive) to max (exclusive)
// value >= min && value < max
export function random(min, max) {
  if (!max) {
    max = min;
    min = 0;
  }

  return Math.random() * (max - min) + min;
}

//returns a random int from min (inclusive) to max (exclusive)
// value >= min && value < max
export function randomInt(min, max) {
  if (!max) {
    max = min;
    min = 0;
  }

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

//returns a random int from min (inclusive) to max (inclusive)
// value >= min && value <= max
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
export function randomIntInclusive(min, max) {
  if (!max) {
    max = min;
    min = 0;
  }

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function map(value, inputMin, inputMax, outputMin, outputMax) {
  if (value > inputMax) {
    return outputMax;
  }

  if (value < inputMin) {
    return outputMin;
  }

  return (
    outputMin +
    (outputMax - outputMin) * ((value - inputMin) / (inputMax - inputMin))
  );
}

//https://stackoverflow.com/a/1186465/10232
//returns the greatest common divisor of two numbers
export function greatestCommonDivisor(a, b) {
  return b == 0 ? a : greatestCommonDivisor(b, a % b);
}

export function degrees(radians) {
  return (radians * 180) / Math.PI;
}

export function radians(degrees) {
  return (degrees * Math.PI) / 180;
}

/*
export function randomInclusive(min, max) {
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

	if(!max) {
		max = min;
		min = 0;
	}

	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
*/
