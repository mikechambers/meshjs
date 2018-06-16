import { random } from "../math/math.js";
import Vector from "../math/vector.js";
import Circle from "../geometry/circle.js";
import Segment from "../geometry/segment.js";

export function circleContainsPoint(center, radius, point) {
  if (center instanceof Circle) {
    center = center.center;
    point = radius;
    radius = center.radius;
  }

  return center.distance(point) < radius;
}

export function pointOnCircle(center, radius, angleInRadians) {
  let x = Math.cos(angleInRadians) * radius + center.x;
  let y = Math.sin(angleInRadians) * radius + center.y;

  return new Vector(x, y);
}

export function randomPointOnCircle(center, radius) {
  return pointOnCircle(center, radius, random(Math.PI * 2));
}

export function randomPointsOnCircle(center, radius, count) {
  let out = [];
  for (let i = 0; i < count; i++) {
    out.push(pointOnCircle(center, radius, random(Math.PI * 2)));
  }
  return out;
}

export function pointOnLine(p1, p2, distance) {
  //Note, this is a bit of a hack. Will probably be faster using trig

  let v = Vector.subtract(p1, p2);
  v.normalize();
  v.multiply(-distance);
  v.add(p1);

  return v;
}

export function angleBetweenPoint(p1, p2) {
  let dy = p2.y - p1.y;
  let dx = p2.x - p1.x;

  return Math.atan2(dy, dx);
}

//https://www.topcoder.com/community/data-science/data-science-tutorials/
//geometry-concepts-line-intersection-and-its-applications/
export function getLineIntersection(a1, a2, b1, b2) {
  if (a1 instanceof Segment) {
    b1 = a2.p1;
    b2 = a2.p2;

    a2 = a1.p2;
    a1 = a1.p1;
  }

  let A1 = a2.y - a1.y;
  let B1 = a1.x - a2.x;
  let C1 = A1 * a1.x + B1 * a1.y;

  let A2 = b2.y - b1.y;
  let B2 = b1.x - b2.x;
  let C2 = A2 * b1.x + B2 * b1.y;

  let det = A1 * B2 - A2 * B1;

  if (det === 0) {
    //lines are parallel
    return undefined;
  }

  let x = (B2 * C1 - B1 * C2) / det;
  let y = (A1 * C2 - A2 * C1) / det;

  return new Vector(x, y);
}

export function getSegmentIntersection(a1, a2, b1, b2) {
  if (a1 instanceof Segment) {
    b1 = a2.p1;
    b2 = a2.p2;

    a2 = a1.p2;
    a1 = a1.p1;
  }

  let v = getLineIntersection(a1, a2, b1, b2);

  if (v === undefined) {
    return undefined;
  }

  let isOnX = Math.min(b1.x, b2.x) <= v.x && v.x <= Math.max(b1.x, b2.x);
  let isOnY = Math.min(b1.y, b2.y) <= v.y && v.y <= Math.max(b1.y, b2.y);

  if (isOnX && isOnY) {
    return v;
  } else {
    return undefined;
  }
}

export function appendArray(arr1, arr2) {
  Array.prototype.push.apply(arr1, arr2);
}

//https://www.frankmitchell.org/2015/01/fisher-yates/
export function shuffleArray(arr) {
  let len = arr.length;

  if (len <= 1) {
    return arr;
  }

  for (let i = len - 1; i > 0; i -= 1) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
