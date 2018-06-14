export default class Pool {
  constructor(type, cacheAmount = 0) {
    this._type = type;
    this._objects = [];

    for (let i = 0; i < cacheAmount; i++) {
      this._objects.push(new type());
    }
  }

  get() {
    if (this._objects.length === 0) {
      return new this._type();
    }

    return this._objects.pop();
  }

  put(obj) {
    this._objects.push(obj);
  }

  putItems(arr) {
    for (let a of arr) {
      this.put(a);
    }
  }
}
