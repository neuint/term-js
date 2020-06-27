import crypto from 'crypto';

var template = "<div class=\"wrapper\">\n  <div ref=\"root\" class=\"root\">\n    <div ref=\"tabs\" class=\"tabs\"></div>\n    <div ref=\"content\" class=\"content\"></div>\n  </div>\n</div>\n";

var css = {"wrapper":"wrapper-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696","root":"root-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696","content":"content-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696","contentItem":"contentItem-terminals-orchestrator-️aaefd931710e8877aa62b6bef7605696"};

function unwrapExports(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var guid = createCommonjsModule(function (module, exports) {
  exports.__esModule = true;

  var Guid =
  /** @class */
  function () {
    function Guid(guid) {
      if (!guid) {
        throw new TypeError("Invalid argument; `value` has no value.");
      }

      this.value = Guid.EMPTY;

      if (guid && Guid.isGuid(guid)) {
        this.value = guid;
      }
    }

    Guid.isGuid = function (guid) {
      var value = guid.toString();
      return guid && (guid instanceof Guid || Guid.validator.test(value));
    };

    Guid.create = function () {
      return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    };

    Guid.createEmpty = function () {
      return new Guid("emptyguid");
    };

    Guid.parse = function (guid) {
      return new Guid(guid);
    };

    Guid.raw = function () {
      return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    };

    Guid.gen = function (count) {
      var out = "";

      for (var i = 0; i < count; i++) {
        // tslint:disable-next-line:no-bitwise
        out += ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      }

      return out;
    };

    Guid.prototype.equals = function (other) {
      // Comparing string `value` against provided `guid` will auto-call
      // toString on `guid` for comparison
      return Guid.isGuid(other) && this.value === other.toString();
    };

    Guid.prototype.isEmpty = function () {
      return this.value === Guid.EMPTY;
    };

    Guid.prototype.toString = function () {
      return this.value;
    };

    Guid.prototype.toJSON = function () {
      return {
        value: this.value
      };
    };

    Guid.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    Guid.EMPTY = "00000000-0000-0000-0000-000000000000";
    return Guid;
  }();

  exports.Guid = Guid;
});
unwrapExports(guid);
var guid_1 = guid.Guid;
/** Detect free variable `global` from Node.js. */

var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
/** Detect free variable `self`. */

var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root = freeGlobal || freeSelf || Function('return this')();
/** Built-in value references. */

var Symbol = root.Symbol;
/** Used for built-in method references. */

var objectProto = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString = objectProto.toString;
/** Built-in value references. */

var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }

  return result;
}
/** Used for built-in method references. */


var objectProto$1 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1 = objectProto$1.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString(value) {
  return nativeObjectToString$1.call(value);
}
/** `Object#toString` result references. */


var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1 = Symbol ? Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }

  return symToStringTag$1 && symToStringTag$1 in Object(value) ? getRawTag(value) : objectToString(value);
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike(value) {
  return value != null && typeof value == 'object';
}
/** `Object#toString` result references. */


var symbolTag = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */

function isSymbol(value) {
  return typeof value == 'symbol' || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */


function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }

  return result;
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */


var isArray = Array.isArray;
/** Used as references for various `Number` constants. */

var INFINITY = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }

  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */


function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
/** `Object#toString` result references. */


var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction(value) {
  if (!isObject(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
/** Used to detect overreaching core-js shims. */


var coreJsData = root['__core-js_shared__'];
/** Used to detect methods masquerading as native. */

var maskSrcKey = function () {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
/** Used for built-in method references. */


var funcProto = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString = funcProto.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */


var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1 = funcProto$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$1 = objectProto$2.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative = RegExp('^' + funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }

  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */


function getValue(object, key) {
  return object == null ? undefined : object[key];
}
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */


function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */


function noop() {} // No operation performed.

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */


function eq(value, other) {
  return value === other || value !== value && other !== other;
}
/** Used to match property names within property paths. */


var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */

function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol(value)) {
    return true;
  }

  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object(object);
}
/* Built-in method references that are verified to be native. */


var nativeCreate = getNative(Object, 'create');
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
  this.size = 0;
}
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
/** Used to stand-in for `undefined` hash values. */


var HASH_UNDEFINED = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$3 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet(key) {
  var data = this.__data__;

  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }

  return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
}
/** Used for built-in method references. */


var objectProto$4 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3 = objectProto$4.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$3.call(data, key);
}
/** Used to stand-in for `undefined` hash values. */


var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */

function hashSet(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
  return this;
}
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function Hash(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */


function assocIndexOf(array, key) {
  var length = array.length;

  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}
/** Used for built-in method references. */


var arrayProto = Array.prototype;
/** Built-in value references. */

var splice = arrayProto.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }

  --this.size;
  return true;
}
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);
  return index < 0 ? undefined : data[index][1];
}
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */


function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function ListCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;
/* Built-in method references that are verified to be native. */

var Map$1 = getNative(root, 'Map');
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash(),
    'map': new (Map$1 || ListCache)(),
    'string': new Hash()
  };
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */


function isKeyable(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */


function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function mapCacheDelete(key) {
  var result = getMapData(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */


function mapCacheSet(key, value) {
  var data = getMapData(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function MapCache(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;
/** Error message constants. */

var FUNC_ERROR_TEXT = 'Expected a function';
/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */

function memoize(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }

  var memoized = function () {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };

  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
} // Expose `MapCache`.


memoize.Cache = MapCache;
/** Used as the maximum memoize cache size. */

var MAX_MEMOIZE_SIZE = 500;
/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */

function memoizeCapped(func) {
  var result = memoize(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}
/** Used to match property names within property paths. */


var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */

var reEscapeChar = /\\(\\)?/g;
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */

var stringToPath = memoizeCapped(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
      result.push('');
    }

  string.replace(rePropName, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : number || match);
  });
  return result;
});
/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */

function toString(value) {
  return value == null ? '' : baseToString(value);
}
/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */


function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }

  return isKey(value, object) ? [value] : stringToPath(toString(value));
}
/** Used as references for various `Number` constants. */


var INFINITY$1 = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
}
/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */


function baseGet(object, path) {
  path = castPath(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }

  return index && index == length ? object : undefined;
}
/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */


function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */


function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */


function isUndefined(value) {
  return value === undefined;
}

var ID = guid_1.create().toString();
var RELEASE_DELAY = 150;
var EMITTER_FORCE_LAYER_TYPE = "EMITTER_FORCE_LAYER_TYPE_" + ID;
var EMITTER_TOP_LAYER_TYPE = "EMITTER_TOP_LAYER_TYPE_" + ID;
var isListenersSet = false;
var layersMap = [];
var listenersLayers = [];
var listenersPredefinedLayers = {};
var forceListeners = [];

var onEvent = function (e, type) {
  forceListeners.forEach(function (listener) {
    get(listener, type, noop)(e);
  });

  if (listenersLayers.length) {
    get(last(listenersLayers), type, noop)(e);
  } else {
    var layers = Object.keys(listenersPredefinedLayers).filter(function (key) {
      return listenersPredefinedLayers[Number(key)].length > 0;
    }).sort(function (a, b) {
      return Number(a) - Number(b);
    });
    (listenersPredefinedLayers[Number(last(layers))] || []).forEach(function (listener) {
      get(listener, type, noop)(e);
    });
  }
};

var clearTargetDownLists = function (target) {
  target.forEach(function (item) {
    item.instance.clearDownList();
  });
};

var onPress = function (e) {
  onEvent(e, 'onPress');
};

var onDown = function (e) {
  onEvent(e, 'onDown');
};

var onUp = function (e) {
  onEvent(e, 'onUp');
};

var onWindowBlur = function () {
  clearTargetDownLists(listenersLayers);
  clearTargetDownLists(forceListeners);
  Object.keys(listenersPredefinedLayers).forEach(function (key) {
    return clearTargetDownLists(listenersPredefinedLayers[Number(key)]);
  });
};

var Emitter =
/** @class */
function () {
  /**
   * Constructor of the class.
   * @param {boolean|number|string} subscribeType - Layer type,
   * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
   * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
   * 5 - add to the layer with index 5.
   * @param {number} releaseDelay - Delay between keyDown and keyUp events for
   * fires keyRelease event.
   */
  function Emitter(subscribeType, releaseDelay) {
    var _this = this;

    if (releaseDelay === void 0) {
      releaseDelay = RELEASE_DELAY;
    }

    this.id = guid_1.create().toString();
    this.downList = [];
    this.releaseDictionary = {};
    this.pressReleaseDictionary = {};
    this.keyDownListeners = [];
    this.keyPressListeners = [];
    this.keyUpListeners = [];
    this.keyReleaseListeners = [];
    this.pressReleaseListeners = [];

    this.pressHandler = function (e) {
      var downList = _this.downList;
      var keyCode = Emitter.getEventKeyCode(e);
      var timeStamp = e.timeStamp;
      var downData = downList.find(function (item) {
        return item.timeStamp === timeStamp;
      });

      if (downData) {
        downData.pressKeyCode = keyCode;

        _this.keyPressListeners.forEach(function (listener) {
          return _this.executeCallback(e, listener, true);
        });
      }
    };

    this.downHandler = function (e) {
      var downList = _this.downList;
      var keyCode = Emitter.getEventKeyCode(e);

      if (!downList.find(function (item) {
        return item.keyCode === keyCode;
      })) {
        downList.push({
          keyCode: keyCode,
          timeStamp: e.timeStamp
        });
      }

      _this.keyDownListeners.forEach(function (listener) {
        return _this.executeCallback(e, listener);
      });
    };

    this.upHandler = function (e) {
      var _a = _this,
          downList = _a.downList,
          releaseDictionary = _a.releaseDictionary,
          pressReleaseDictionary = _a.pressReleaseDictionary,
          releaseDelay = _a.releaseDelay;
      var keyCode = Emitter.getEventKeyCode(e);
      var keyDownInfo = null;

      for (var i = 0, ln = downList.length; i < ln; i += 1) {
        if (downList[i].keyCode === keyCode) {
          keyDownInfo = downList[i];
          downList.splice(i, 1);
          break;
        }
      }

      _this.keyUpListeners.forEach(function (listener) {
        return _this.executeCallback(e, listener);
      });

      if (keyDownInfo && e.timeStamp - keyDownInfo.timeStamp <= releaseDelay) {
        releaseDictionary[keyDownInfo.keyCode] = keyDownInfo.timeStamp;

        _this.keyReleaseListeners.forEach(function (listener) {
          return _this.executeReleaseCallback(e, listener);
        });

        if (keyDownInfo.pressKeyCode) {
          pressReleaseDictionary[keyDownInfo.keyCode] = keyDownInfo;

          _this.pressReleaseListeners.forEach(function (listener) {
            return _this.executeReleaseCallback(e, listener, true);
          });
        }
      }
    };

    this.subscribeType = subscribeType || EMITTER_TOP_LAYER_TYPE;
    this.releaseDelay = releaseDelay;
    Emitter.setGeneralListeners();
    this.addListeners();
  }
  /**
   * @public
   *
   * Sets names for layers indexes.
   * @param {string|number|array[]|object[]|object} firstParam - Name or id of the layer.
   * For array or object it's a
   * layers config.
   *
   * @param {string} firstParam.name - Name of the layer.
   * @param {number} firstParam.id - Id of the layer.
   * @example
   * Emitter.setLayersMap({ name: 'fileBrowsing', id: 1 })
   *
   * @param {string} firstParam[0] - Name of the layer.
   * @param {number} firstParam[1] - Id of the layer.
   * @example
   * Emitter.setLayersMap(['fileBrowsing', 1])
   *
   * @param {number} firstParam[0] - Id of the layer.
   * @param {string} firstParam[1] - Name of the layer.
   * @example
   * Emitter.setLayersMap([1, 'fileBrowsing'])
   *
   * @param {string} firstParam[].name - Name of the layer.
   * @param {number} firstParam[].id - Id of the layer.
   * @example
   * Emitter.setLayersMap([
   *    { name: 'fileBrowsing', id: 1 },
   *    { name: 'preview', id: 5},
   * ])
   *
   * @param {string} firstParam[][0] - Name of the layer.
   * @param {number} firstParam[][1] - Id of the layer.
   * @example
   * Emitter.setLayersMap([
   *    ['fileBrowsing', 1],
   *    ['preview', 5],
   * ])
   *
   * @param {number} firstParam[][0] - Id of the layer.
   * @param {string} firstParam[][1] - Name of the layer.
   * @example
   * Emitter.setLayersMap([
   *    [1, 'fileBrowsing'],
   *    [5, 'preview'],
   * ])
   *
   * @param {Object.<string, number>} firstParam - Map of the Layers with name/id pairs.
   * @example
   * Emitter.setLayersMap({
   *    fileBrowsing: 1,
   *    preview: 5
   * })
   *
   * @param {string|number} secondParam - Name or id of the Layer.
   * @example
   * Emitter.setLayersMap('fileBrowsing', 1);
   * @example
   * Emitter.setLayersMap(1, 'fileBrowsing');
   *
   * @returns {number} Count of the set names;
   */


  Emitter.setLayersMap = function (firstParam, secondParam) {
    if (typeof firstParam === 'string' && typeof secondParam === 'number') {
      return Number(Emitter.setLayerMap({
        name: firstParam,
        id: secondParam
      }));
    }

    if (typeof firstParam === 'number' && typeof secondParam === 'string') {
      return Number(Emitter.setLayerMap({
        name: secondParam,
        id: firstParam
      }));
    }

    if (isArray(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray(firstParam) && isUndefined(secondParam)) {
      var setCount_1 = 0;
      firstParam.forEach(function (layerMap) {
        setCount_1 += Number(Emitter.setLayerMap(layerMap));
      });
      return setCount_1;
    }

    if (!isArray(firstParam) && typeof firstParam === 'object' && !isUndefined(firstParam.name) && !isUndefined(firstParam.id)) {
      return Number(Emitter.setLayerMap(firstParam));
    }

    if (!isArray(firstParam) && typeof firstParam === 'object') {
      var setCount_2 = 0;
      Object.keys(firstParam).forEach(function (key) {
        var id = firstParam[key];
        setCount_2 += Number(Emitter.setLayerMap({
          id: id,
          name: key
        }));
      });
      return setCount_2;
    }

    return 0;
  };

  Emitter.setLayerMap = function (data) {
    if (typeof data === 'object' && !isArray(data)) {
      return Emitter.setLayerMapFromObject(data);
    }

    if (isArray(data)) {
      return Emitter.setLayerMapFromArray(data);
    }

    return false;
  };

  Emitter.setLayerMapFromObject = function (data) {
    var _a = data || {
      name: '',
      id: 0
    },
        name = _a.name,
        id = _a.id;

    if (name) {
      layersMap.push({
        name: name,
        id: id
      });
      return true;
    }

    return false;
  };

  Emitter.setLayerMapFromArray = function (data) {
    var name = data[0];
    var id = data[1];

    if (typeof name === 'number' && typeof id === 'string') {
      name = data[1];
      id = data[0];
    }

    return Emitter.setLayerMapFromObject({
      name: name,
      id: id
    });
  };

  Emitter.setGeneralListeners = function () {
    if (!isListenersSet) {
      window.addEventListener('keypress', onPress, true);
      window.addEventListener('keyup', onUp, true);
      window.addEventListener('keydown', onDown, true);
      window.addEventListener('blur', onWindowBlur, true);
      isListenersSet = true;
    }
  };

  Emitter.getEventKeyCode = function (e) {
    return e.which || e.keyCode;
  };

  Emitter.checkInputTarget = function (e) {
    return ['INPUT', 'TEXTAREA'].includes(get(e, 'target.tagName'));
  };

  Emitter.checkMainOptions = function (e, options) {
    var altKey = options.altKey,
        ctrlKey = options.ctrlKey,
        shiftKey = options.shiftKey,
        metaKey = options.metaKey,
        skipInput = options.skipInput;
    var isInputTarget = Emitter.checkInputTarget(e);
    return (altKey ? e.altKey : true) && (ctrlKey ? e.ctrlKey : true) && (shiftKey ? e.shiftKey : true) && (metaKey ? e.metaKey : true) && !(isInputTarget && skipInput);
  };

  Emitter.getListenersTarget = function (subscribeType) {
    if (typeof subscribeType === 'number') {
      if (!listenersPredefinedLayers[subscribeType]) {
        listenersPredefinedLayers[subscribeType] = [];
      }

      return listenersPredefinedLayers[subscribeType];
    }

    if (subscribeType === EMITTER_FORCE_LAYER_TYPE) {
      return forceListeners;
    }

    if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
      return listenersLayers;
    }

    if (typeof subscribeType === 'string') {
      var layerId = get(layersMap.find(function (item) {
        return item.name === subscribeType;
      }), 'id');

      if (typeof layerId === 'number' && layerId >= 0) {
        return Emitter.getListenersTarget(layerId);
      }
    }

    return null;
  };

  Emitter.clearDownLists = function (subscribeType) {
    if (subscribeType === EMITTER_TOP_LAYER_TYPE) {
      Emitter.clearLayerDownLists();
      Emitter.clearPredefinedLayersDownLists();
    } else if (subscribeType === 'string' && subscribeType !== EMITTER_FORCE_LAYER_TYPE || typeof subscribeType === 'number') {
      var layerId = typeof subscribeType === 'string' ? get(layersMap.find(function (item) {
        return item.name === subscribeType;
      }), 'id') : subscribeType;
      var biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers).map(function (key) {
        return Number(key);
      }));

      if (layerId && layerId >= biggestLayerId) {
        Emitter.clearPredefinedLayersDownLists([layerId]);
      }
    }
  };

  Emitter.clearLayerDownLists = function () {
    clearTargetDownLists(listenersLayers);
  };

  Emitter.clearPredefinedLayersDownLists = function (skip) {
    if (skip === void 0) {
      skip = [];
    }

    Object.keys(listenersPredefinedLayers).forEach(function (key) {
      var normalizedKey = Number(key);

      if (!skip.includes(normalizedKey)) {
        clearTargetDownLists(listenersPredefinedLayers[normalizedKey]);
      }
    });
  };

  Emitter.prototype.clearDownList = function () {
    this.downList = [];
    this.releaseDictionary = {};
    this.pressReleaseDictionary = {};
  };

  Emitter.prototype.addListener = function (type, callback, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    switch (type) {
      case 'keyDown':
        this.keyDownListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'keyPress':
        this.keyPressListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'keyUp':
        this.keyUpListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'keyRelease':
        this.keyReleaseListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'pressRelease':
        this.pressReleaseListeners.push({
          callback: callback,
          options: options
        });
        break;
    }

    return function () {
      return _this.removeListener(type, callback);
    };
  };

  Emitter.prototype.removeListener = function (type, callback) {
    var collection = [];

    switch (type) {
      case 'keyDown':
        collection = this.keyDownListeners;
        break;

      case 'keyPress':
        collection = this.keyPressListeners;
        break;

      case 'keyUp':
        collection = this.keyUpListeners;
        break;

      case 'keyRelease':
        collection = this.keyReleaseListeners;
        break;

      case 'pressRelease':
        collection = this.pressReleaseListeners;
        break;
    }

    for (var i = 0, ln = collection.length; i < ln; i += 1) {
      if (collection[i].callback === callback) {
        collection.splice(i, 1);
        break;
      }
    }
  };

  Emitter.prototype.destroy = function () {
    this.removeListeners();
  };

  Emitter.prototype.updateLayerType = function (subscribeType) {
    this.removeListeners();
    this.subscribeType = subscribeType;
    this.addListeners();
  };

  Emitter.prototype.addListeners = function () {
    var subscribeType = this.subscribeType;
    var listenersTarget = Emitter.getListenersTarget(subscribeType);
    Emitter.clearDownLists(subscribeType);

    if (listenersTarget) {
      listenersTarget.push({
        id: this.id,
        instance: this,
        onPress: this.pressHandler,
        onDown: this.downHandler,
        onUp: this.upHandler
      });
    } else {
      console.warn('KeyLayersJS', 'Unknown subscribe type!');
    }
  };

  Emitter.prototype.removeListeners = function () {
    var listenersTarget = Emitter.getListenersTarget(this.subscribeType);

    if (listenersTarget) {
      for (var i = 0, ln = listenersTarget.length; i < ln; i += 1) {
        if (listenersTarget[i].id === this.id) {
          listenersTarget.splice(i, 1);
          break;
        }
      }
    }
  };

  Emitter.prototype.executeCallback = function (e, listener, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var callback = listener.callback,
        options = listener.options;

    if (Emitter.checkMainOptions(e, options) && this.checkCodeOptions(e, options, isPressCheck)) {
      callback(e);
    }
  };

  Emitter.prototype.executeReleaseCallback = function (e, listener, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var callback = listener.callback,
        options = listener.options;

    if (Emitter.checkMainOptions(e, options) && this.checkReleaseCodeOptions(e, options, isPressCheck)) {
      callback(e);
    }
  };

  Emitter.prototype.checkCodeOptions = function (e, options, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var code = options.code;
    var _a = options.codes,
        codes = _a === void 0 ? [] : _a;
    var downList = this.downList;
    var keyCode = Emitter.getEventKeyCode(e);
    codes = code && !codes.length ? [code] : codes;

    if (codes.length) {
      if (!codes.includes(keyCode)) {
        return false;
      }

      var _loop_1 = function (i, ln) {
        var checkCode = codes[i];

        if (checkCode !== keyCode && !downList.find(function (item) {
          return isPressCheck ? item.pressKeyCode === checkCode : item.keyCode === checkCode;
        })) {
          return {
            value: false
          };
        }
      };

      for (var i = 0, ln = codes.length; i < ln; i += 1) {
        var state_1 = _loop_1(i, ln);

        if (typeof state_1 === "object") return state_1.value;
      }
    }

    return true;
  };

  Emitter.prototype.checkReleaseCodeOptions = function (e, options, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var code = options.code;
    var _a = options.codes,
        codes = _a === void 0 ? [] : _a;

    var _b = this,
        releaseDictionary = _b.releaseDictionary,
        pressReleaseDictionary = _b.pressReleaseDictionary,
        releaseDelay = _b.releaseDelay;

    var keyCode = Emitter.getEventKeyCode(e);

    if (isPressCheck) {
      var keyPressInfo = pressReleaseDictionary[keyCode];

      if (e.timeStamp - keyPressInfo.timeStamp <= releaseDelay) {
        keyCode = keyPressInfo.pressKeyCode || 0;
      }
    }

    var timeStamp = e.timeStamp;
    codes = code && !codes.length ? [code] : codes;

    if (codes.length) {
      if (!codes.includes(keyCode)) {
        return false;
      }

      var _loop_2 = function (i, ln) {
        var checkCode = codes[i];
        var releaseCheckTimestamp = 0;

        if (isPressCheck) {
          var pressKey = Object.keys(pressReleaseDictionary).find(function (key) {
            return pressReleaseDictionary[Number(key)].pressKeyCode === checkCode;
          });
          releaseCheckTimestamp = pressKey ? pressReleaseDictionary[Number(pressKey)].timeStamp : 0;
        } else {
          releaseCheckTimestamp = releaseDictionary[checkCode];
        }

        if (checkCode !== keyCode && !(releaseCheckTimestamp && timeStamp - releaseCheckTimestamp <= releaseDelay)) {
          return {
            value: false
          };
        }
      };

      for (var i = 0, ln = codes.length; i < ln; i += 1) {
        var state_2 = _loop_2(i, ln);

        if (typeof state_2 === "object") return state_2.value;
      }
    }

    return true;
  };

  return Emitter;
}();

/** Detect free variable `global` from Node.js. */
var freeGlobal$1 = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */

var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();

/** Built-in value references. */

var Symbol$1 = root$1.Symbol;

/** Used for built-in method references. */

var objectProto$5 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$4 = objectProto$5.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$2 = objectProto$5.toString;
/** Built-in value references. */

var symToStringTag$2 = Symbol$1 ? Symbol$1.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag$1(value) {
  var isOwn = hasOwnProperty$4.call(value, symToStringTag$2),
      tag = value[symToStringTag$2];

  try {
    value[symToStringTag$2] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$2.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$2] = tag;
    } else {
      delete value[symToStringTag$2];
    }
  }

  return result;
}

/** Used for built-in method references. */
var objectProto$1$1 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1$1 = objectProto$1$1.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString$1(value) {
  return nativeObjectToString$1$1.call(value);
}

/** `Object#toString` result references. */

var nullTag$1 = '[object Null]',
    undefinedTag$1 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$1 : nullTag$1;
  }

  return symToStringTag$1$1 && symToStringTag$1$1 in Object(value) ? getRawTag$1(value) : objectToString$1(value);
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike$1(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */

var symbolTag$1 = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */

function isSymbol$1(value) {
  return typeof value == 'symbol' || isObjectLike$1(value) && baseGetTag$1(value) == symbolTag$1;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }

  return result;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray$1 = Array.isArray;

/** Used as references for various `Number` constants. */

var INFINITY$2 = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString$1 = symbolProto$1 ? symbolProto$1.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isArray$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$1(value, baseToString$1) + '';
  }

  if (isSymbol$1(value)) {
    return symbolToString$1 ? symbolToString$1.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$2 ? '-0' : result;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/** `Object#toString` result references. */

var asyncTag$1 = '[object AsyncFunction]',
    funcTag$1 = '[object Function]',
    genTag$1 = '[object GeneratorFunction]',
    proxyTag$1 = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction$1(value) {
  if (!isObject$1(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag$1(value);
  return tag == funcTag$1 || tag == genTag$1 || tag == asyncTag$1 || tag == proxyTag$1;
}

/** Used to detect overreaching core-js shims. */

var coreJsData$1 = root$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */

var maskSrcKey$1 = function () {
  var uid = /[^.]+$/.exec(coreJsData$1 && coreJsData$1.keys && coreJsData$1.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked$1(func) {
  return !!maskSrcKey$1 && maskSrcKey$1 in func;
}

/** Used for built-in method references. */
var funcProto$2 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$2 = funcProto$2.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource$1(func) {
  if (func != null) {
    try {
      return funcToString$2.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */

var reRegExpChar$1 = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor$1 = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto$1$1 = Function.prototype,
    objectProto$2$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1$1 = funcProto$1$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$1$1 = objectProto$2$1.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative$1 = RegExp('^' + funcToString$1$1.call(hasOwnProperty$1$1).replace(reRegExpChar$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative$1(value) {
  if (!isObject$1(value) || isMasked$1(value)) {
    return false;
  }

  var pattern = isFunction$1(value) ? reIsNative$1 : reIsHostCtor$1;
  return pattern.test(toSource$1(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$1(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */

function getNative$1(object, key) {
  var value = getValue$1(object, key);
  return baseIsNative$1(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */

var WeakMap$1 = getNative$1(root$1, 'WeakMap');

/** Built-in value references. */

var objectCreate = Object.create;
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */

var baseCreate = function () {
  function object() {}

  return function (proto) {
    if (!isObject$1(proto)) {
      return {};
    }

    if (objectCreate) {
      return objectCreate(proto);
    }

    object.prototype = proto;
    var result = new object();
    object.prototype = undefined;
    return result;
  };
}();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);

    case 1:
      return func.call(thisArg, args[0]);

    case 2:
      return func.call(thisArg, args[0], args[1]);

    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }

  return func.apply(thisArg, args);
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$1() {// No operation performed.
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));

  while (++index < length) {
    array[index] = source[index];
  }

  return array;
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT = 800,
    HOT_SPAN = 16;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeNow = Date.now;
/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */

function shortOut(func) {
  var count = 0,
      lastCalled = 0;
  return function () {
    var stamp = nativeNow(),
        remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;

    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }

    return func.apply(undefined, arguments);
  };
}

/**
 * Creates a function that returns `value`.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {*} value The value to return from the new function.
 * @returns {Function} Returns the new constant function.
 * @example
 *
 * var objects = _.times(2, _.constant({ 'a': 1 }));
 *
 * console.log(objects);
 * // => [{ 'a': 1 }, { 'a': 1 }]
 *
 * console.log(objects[0] === objects[1]);
 * // => true
 */
function constant(value) {
  return function () {
    return value;
  };
}

var defineProperty = function () {
  try {
    var func = getNative$1(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}();

/**
 * The base implementation of `setToString` without support for hot loop shorting.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */

var baseSetToString = !defineProperty ? identity : function (func, string) {
  return defineProperty(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant(string),
    'writable': true
  });
};

/**
 * Sets the `toString` method of `func` to return `string`.
 *
 * @private
 * @param {Function} func The function to modify.
 * @param {Function} string The `toString` result.
 * @returns {Function} Returns `func`.
 */

var setToString = shortOut(baseSetToString);

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }

  return array;
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/** Used to detect unsigned integer values. */

var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */

function isIndex(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint.test(value)) && value > -1 && value % 1 == 0 && value < length;
}

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */

function baseAssignValue(object, key, value) {
  if (key == '__proto__' && defineProperty) {
    defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$1(value, other) {
  return value === other || value !== value && other !== other;
}

/** Used for built-in method references. */

var objectProto$3$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2$1 = objectProto$3$1.hasOwnProperty;
/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */

function assignValue(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty$2$1.call(object, key) && eq$1(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue(object, key, value);
  }
}

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */

function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined;

    if (newValue === undefined) {
      newValue = source[key];
    }

    if (isNew) {
      baseAssignValue(object, key, newValue);
    } else {
      assignValue(object, key, newValue);
    }
  }

  return object;
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax = Math.max;
/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */

function overRest(func, start, transform) {
  start = nativeMax(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }

    index = -1;
    var otherArgs = Array(start + 1);

    while (++index < start) {
      otherArgs[index] = args[index];
    }

    otherArgs[start] = transform(array);
    return apply(func, this, otherArgs);
  };
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */

function baseRest(func, start) {
  return setToString(overRest(func, start, identity), func + '');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1 = 9007199254740991;
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */

function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */

function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction$1(value);
}

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */

function isIterateeCall(value, index, object) {
  if (!isObject$1(object)) {
    return false;
  }

  var type = typeof index;

  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq$1(object[index], value);
  }

  return false;
}

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */

function createAssigner(assigner) {
  return baseRest(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }

    object = Object(object);

    while (++index < length) {
      var source = sources[index];

      if (source) {
        assigner(object, source, index, customizer);
      }
    }

    return object;
  });
}

/** Used for built-in method references. */
var objectProto$4$1 = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */

function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$4$1;
  return value === proto;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

/** `Object#toString` result references. */

var argsTag = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments(value) {
  return isObjectLike$1(value) && baseGetTag$1(value) == argsTag;
}

/** Used for built-in method references. */

var objectProto$5$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3$1 = objectProto$5$1.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable = objectProto$5$1.propertyIsEnumerable;
/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */

var isArguments = baseIsArguments(function () {
  return arguments;
}()) ? baseIsArguments : function (value) {
  return isObjectLike$1(value) && hasOwnProperty$3$1.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

/** Detect free variable `exports`. */

var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports = freeModule && freeModule.exports === freeExports;
/** Built-in value references. */

var Buffer = moduleExports ? root$1.Buffer : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;
/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */

var isBuffer = nativeIsBuffer || stubFalse;

/** `Object#toString` result references. */

var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag$1$1 = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';
var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */

var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray(value) {
  return isObjectLike$1(value) && isLength(value.length) && !!typedArrayTags[baseGetTag$1(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */

var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;
/** Detect free variable `process` from Node.js. */

var freeProcess = moduleExports$1 && freeGlobal$1.process;
/** Used to access faster Node.js helpers. */

var nodeUtil = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

    if (types) {
      return types;
    } // Legacy `process.binding('util')` for Node.js < 10.


    return freeProcess && freeProcess.binding && freeProcess.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */

var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */

var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/** Used for built-in method references. */

var objectProto$6 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$4$1 = objectProto$6.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */

function arrayLikeKeys(value, inherited) {
  var isArr = isArray$1(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$4$1.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
    isIndex(key, length)))) {
      result.push(key);
    }
  }

  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeKeys = overArg(Object.keys, Object);

/** Used for built-in method references. */

var objectProto$7 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$5 = objectProto$7.hasOwnProperty;
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty$5.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }

  return result;
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */

function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

/** Used for built-in method references. */

var objectProto$8 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$6 = objectProto$8.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn(object) {
  if (!isObject$1(object)) {
    return nativeKeysIn(object);
  }

  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$6.call(object, key)))) {
      result.push(key);
    }
  }

  return result;
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */

function keysIn$1(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */

var assignInWith = createAssigner(function (object, source, srcIndex, customizer) {
  copyObject(source, keysIn$1(source), object, customizer);
});

/** Used to match property names within property paths. */

var reIsDeepProp$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$1 = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */

function isKey$1(value, object) {
  if (isArray$1(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$1(value)) {
    return true;
  }

  return reIsPlainProp$1.test(value) || !reIsDeepProp$1.test(value) || object != null && value in Object(object);
}

/* Built-in method references that are verified to be native. */

var nativeCreate$1 = getNative$1(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear$1() {
  this.__data__ = nativeCreate$1 ? nativeCreate$1(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$9 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$7 = objectProto$9.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet$1(key) {
  var data = this.__data__;

  if (nativeCreate$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$2 ? undefined : result;
  }

  return hasOwnProperty$7.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */

var objectProto$a = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$8 = objectProto$a.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas$1(key) {
  var data = this.__data__;
  return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$8.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$1$1 = '__lodash_hash_undefined__';
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */

function hashSet$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$1 && value === undefined ? HASH_UNDEFINED$1$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Hash$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash$1.prototype.clear = hashClear$1;
Hash$1.prototype['delete'] = hashDelete$1;
Hash$1.prototype.get = hashGet$1;
Hash$1.prototype.has = hashHas$1;
Hash$1.prototype.set = hashSet$1;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$1() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function assocIndexOf$1(array, key) {
  var length = array.length;

  while (length--) {
    if (eq$1(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}

/** Used for built-in method references. */

var arrayProto$1 = Array.prototype;
/** Built-in value references. */

var splice$1 = arrayProto$1.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1.call(data, index, 1);
  }

  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function listCacheGet$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);
  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function listCacheHas$1(key) {
  return assocIndexOf$1(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */

function listCacheSet$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$1(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function ListCache$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache$1.prototype.clear = listCacheClear$1;
ListCache$1.prototype['delete'] = listCacheDelete$1;
ListCache$1.prototype.get = listCacheGet$1;
ListCache$1.prototype.has = listCacheHas$1;
ListCache$1.prototype.set = listCacheSet$1;

/* Built-in method references that are verified to be native. */

var Map$1$1 = getNative$1(root$1, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash$1(),
    'map': new (Map$1$1 || ListCache$1)(),
    'string': new Hash$1()
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$1(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */

function getMapData$1(map, key) {
  var data = map.__data__;
  return isKeyable$1(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function mapCacheDelete$1(key) {
  var result = getMapData$1(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function mapCacheGet$1(key) {
  return getMapData$1(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function mapCacheHas$1(key) {
  return getMapData$1(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */

function mapCacheSet$1(key, value) {
  var data = getMapData$1(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function MapCache$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache$1.prototype.clear = mapCacheClear$1;
MapCache$1.prototype['delete'] = mapCacheDelete$1;
MapCache$1.prototype.get = mapCacheGet$1;
MapCache$1.prototype.has = mapCacheHas$1;
MapCache$1.prototype.set = mapCacheSet$1;

/** Error message constants. */

var FUNC_ERROR_TEXT$1 = 'Expected a function';
/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */

function memoize$1(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }

  var memoized = function () {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };

  memoized.cache = new (memoize$1.Cache || MapCache$1)();
  return memoized;
} // Expose `MapCache`.


memoize$1.Cache = MapCache$1;

/** Used as the maximum memoize cache size. */

var MAX_MEMOIZE_SIZE$1 = 500;
/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */

function memoizeCapped$1(func) {
  var result = memoize$1(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE$1) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */

var rePropName$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */

var reEscapeChar$1 = /\\(\\)?/g;
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */

var stringToPath$1 = memoizeCapped$1(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
      result.push('');
    }

  string.replace(rePropName$1, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar$1, '$1') : number || match);
  });
  return result;
});

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */

function toString$1(value) {
  return value == null ? '' : baseToString$1(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */

function castPath$1(value, object) {
  if (isArray$1(value)) {
    return value;
  }

  return isKey$1(value, object) ? [value] : stringToPath$1(toString$1(value));
}

/** Used as references for various `Number` constants. */

var INFINITY$1$1 = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey$1(value) {
  if (typeof value == 'string' || isSymbol$1(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1$1 ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */

function baseGet$1(object, path) {
  path = castPath$1(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$1(path[index++])];
  }

  return index && index == length ? object : undefined;
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */

function get$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$1(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}

/** Built-in value references. */

var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;
/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */

function isFlattenable(value) {
  return isArray$1(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
}

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */

function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;
  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];

    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }

  return result;
}

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */

function flatten(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten(array, 1) : [];
}

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */

function flatRest(func) {
  return setToString(overRest(func, undefined, flatten), func + '');
}

/** Built-in value references. */

var getPrototype = overArg(Object.getPrototypeOf, Object);

/** `Object#toString` result references. */

var objectTag$1 = '[object Object]';
/** Used for built-in method references. */

var funcProto$2$1 = Function.prototype,
    objectProto$b = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$2$1 = funcProto$2$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString = funcToString$2$1.call(Object);
/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */

function isPlainObject(value) {
  if (!isObjectLike$1(value) || baseGetTag$1(value) != objectTag$1) {
    return false;
  }

  var proto = getPrototype(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2$1.call(Ctor) == objectCtorString;
}

/** `Object#toString` result references. */

var domExcTag = '[object DOMException]',
    errorTag$1 = '[object Error]';
/**
 * Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`,
 * `SyntaxError`, `TypeError`, or `URIError` object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an error object, else `false`.
 * @example
 *
 * _.isError(new Error);
 * // => true
 *
 * _.isError(Error);
 * // => false
 */

function isError(value) {
  if (!isObjectLike$1(value)) {
    return false;
  }

  var tag = baseGetTag$1(value);
  return tag == errorTag$1 || tag == domExcTag || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject(value);
}

/**
 * Attempts to invoke `func`, returning either the result or the caught error
 * object. Any additional arguments are provided to `func` when it's invoked.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Util
 * @param {Function} func The function to attempt.
 * @param {...*} [args] The arguments to invoke `func` with.
 * @returns {*} Returns the `func` result or error object.
 * @example
 *
 * // Avoid throwing errors for invalid selectors.
 * var elements = _.attempt(function(selector) {
 *   return document.querySelectorAll(selector);
 * }, '>_>');
 *
 * if (_.isError(elements)) {
 *   elements = [];
 * }
 */

var attempt = baseRest(function (func, args) {
  try {
    return apply(func, undefined, args);
  } catch (e) {
    return isError(e) ? e : new Error(e);
  }
});

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : length + start;
  }

  end = end > length ? length : end;

  if (end < 0) {
    end += length;
  }

  length = start > end ? 0 : end - start >>> 0;
  start >>>= 0;
  var result = Array(length);

  while (++index < length) {
    result[index] = array[index + start];
  }

  return result;
}

/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function (key) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */

function stackClear() {
  this.__data__ = new ListCache$1();
  this.size = 0;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  var data = this.__data__,
      result = data['delete'](key);
  this.size = data.size;
  return result;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */

var LARGE_ARRAY_SIZE = 200;
/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */

function stackSet(key, value) {
  var data = this.__data__;

  if (data instanceof ListCache$1) {
    var pairs = data.__data__;

    if (!Map$1$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new MapCache$1(pairs);
  }

  data.set(key, value);
  this.size = data.size;
  return this;
}

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Stack(entries) {
  var data = this.__data__ = new ListCache$1(entries);
  this.size = data.size;
} // Add methods to `Stack`.


Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */

function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

/**
 * The base implementation of `_.assignIn` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */

function baseAssignIn(object, source) {
  return object && copyObject(source, keysIn$1(source), object);
}

/** Detect free variable `exports`. */

var freeExports$2 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$2 = freeExports$2 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$2 = freeModule$2 && freeModule$2.exports === freeExports$2;
/** Built-in value references. */

var Buffer$1 = moduleExports$2 ? root$1.Buffer : undefined,
    allocUnsafe = Buffer$1 ? Buffer$1.allocUnsafe : undefined;
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */

function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }

  var length = buffer.length,
      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
  buffer.copy(result);
  return result;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];

    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }

  return result;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

/** Used for built-in method references. */

var objectProto$c = Object.prototype;
/** Built-in value references. */

var propertyIsEnumerable$1 = objectProto$c.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbols = !nativeGetSymbols ? stubArray : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return arrayFilter(nativeGetSymbols(object), function (symbol) {
    return propertyIsEnumerable$1.call(object, symbol);
  });
};

/**
 * Copies own symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */

function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols$1 = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbolsIn = !nativeGetSymbols$1 ? stubArray : function (object) {
  var result = [];

  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }

  return result;
};

/**
 * Copies own and inherited symbols of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */

function copySymbolsIn(source, object) {
  return copyObject(source, getSymbolsIn(source), object);
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */

function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$1(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn$1, getSymbolsIn);
}

/* Built-in method references that are verified to be native. */

var DataView = getNative$1(root$1, 'DataView');

/* Built-in method references that are verified to be native. */

var Promise$1 = getNative$1(root$1, 'Promise');

/* Built-in method references that are verified to be native. */

var Set = getNative$1(root$1, 'Set');

/** `Object#toString` result references. */

var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';
var dataViewTag$1 = '[object DataView]';
/** Used to detect maps, sets, and weakmaps. */

var dataViewCtorString = toSource$1(DataView),
    mapCtorString = toSource$1(Map$1$1),
    promiseCtorString = toSource$1(Promise$1),
    setCtorString = toSource$1(Set),
    weakMapCtorString = toSource$1(WeakMap$1);
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

var getTag = baseGetTag$1; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1 || Map$1$1 && getTag(new Map$1$1()) != mapTag$1 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$1 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
  getTag = function (value) {
    var result = baseGetTag$1(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource$1(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag$1;

        case mapCtorString:
          return mapTag$1;

        case promiseCtorString:
          return promiseTag;

        case setCtorString:
          return setTag$1;

        case weakMapCtorString:
          return weakMapTag$1;
      }
    }

    return result;
  };
}

var getTag$1 = getTag;

/** Used for built-in method references. */
var objectProto$d = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$a = objectProto$d.hasOwnProperty;
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */

function initCloneArray(array) {
  var length = array.length,
      result = new array.constructor(length); // Add properties assigned by `RegExp#exec`.

  if (length && typeof array[0] == 'string' && hasOwnProperty$a.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }

  return result;
}

/** Built-in value references. */

var Uint8Array = root$1.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */

function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */

function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */

function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */

var symbolProto$1$1 = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolValueOf = symbolProto$1$1 ? symbolProto$1$1.valueOf : undefined;
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */

function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */

function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** `Object#toString` result references. */

var boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    mapTag$2 = '[object Map]',
    numberTag$1 = '[object Number]',
    regexpTag$1 = '[object RegExp]',
    setTag$2 = '[object Set]',
    stringTag$1 = '[object String]',
    symbolTag$1$1 = '[object Symbol]';
var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$2 = '[object DataView]',
    float32Tag$1 = '[object Float32Array]',
    float64Tag$1 = '[object Float64Array]',
    int8Tag$1 = '[object Int8Array]',
    int16Tag$1 = '[object Int16Array]',
    int32Tag$1 = '[object Int32Array]',
    uint8Tag$1 = '[object Uint8Array]',
    uint8ClampedTag$1 = '[object Uint8ClampedArray]',
    uint16Tag$1 = '[object Uint16Array]',
    uint32Tag$1 = '[object Uint32Array]';
/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;

  switch (tag) {
    case arrayBufferTag$1:
      return cloneArrayBuffer(object);

    case boolTag$1:
    case dateTag$1:
      return new Ctor(+object);

    case dataViewTag$2:
      return cloneDataView(object, isDeep);

    case float32Tag$1:
    case float64Tag$1:
    case int8Tag$1:
    case int16Tag$1:
    case int32Tag$1:
    case uint8Tag$1:
    case uint8ClampedTag$1:
    case uint16Tag$1:
    case uint32Tag$1:
      return cloneTypedArray(object, isDeep);

    case mapTag$2:
      return new Ctor();

    case numberTag$1:
    case stringTag$1:
      return new Ctor(object);

    case regexpTag$1:
      return cloneRegExp(object);

    case setTag$2:
      return new Ctor();

    case symbolTag$1$1:
      return cloneSymbol(object);
  }
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneObject(object) {
  return typeof object.constructor == 'function' && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
}

/** `Object#toString` result references. */

var mapTag$3 = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap(value) {
  return isObjectLike$1(value) && getTag$1(value) == mapTag$3;
}

/* Node.js helper references. */

var nodeIsMap = nodeUtil && nodeUtil.isMap;
/**
 * Checks if `value` is classified as a `Map` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 * @example
 *
 * _.isMap(new Map);
 * // => true
 *
 * _.isMap(new WeakMap);
 * // => false
 */

var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

/** `Object#toString` result references. */

var setTag$3 = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet(value) {
  return isObjectLike$1(value) && getTag$1(value) == setTag$3;
}

/* Node.js helper references. */

var nodeIsSet = nodeUtil && nodeUtil.isSet;
/**
 * Checks if `value` is classified as a `Set` object.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 * @example
 *
 * _.isSet(new Set);
 * // => true
 *
 * _.isSet(new WeakSet);
 * // => false
 */

var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG = 1,
    CLONE_FLAT_FLAG = 2,
    CLONE_SYMBOLS_FLAG = 4;
/** `Object#toString` result references. */

var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    boolTag$2 = '[object Boolean]',
    dateTag$2 = '[object Date]',
    errorTag$2 = '[object Error]',
    funcTag$2 = '[object Function]',
    genTag$1$1 = '[object GeneratorFunction]',
    mapTag$4 = '[object Map]',
    numberTag$2 = '[object Number]',
    objectTag$3 = '[object Object]',
    regexpTag$2 = '[object RegExp]',
    setTag$4 = '[object Set]',
    stringTag$2 = '[object String]',
    symbolTag$2 = '[object Symbol]',
    weakMapTag$2 = '[object WeakMap]';
var arrayBufferTag$2 = '[object ArrayBuffer]',
    dataViewTag$3 = '[object DataView]',
    float32Tag$2 = '[object Float32Array]',
    float64Tag$2 = '[object Float64Array]',
    int8Tag$2 = '[object Int8Array]',
    int16Tag$2 = '[object Int16Array]',
    int32Tag$2 = '[object Int32Array]',
    uint8Tag$2 = '[object Uint8Array]',
    uint8ClampedTag$2 = '[object Uint8ClampedArray]',
    uint16Tag$2 = '[object Uint16Array]',
    uint32Tag$2 = '[object Uint32Array]';
/** Used to identify `toStringTag` values supported by `_.clone`. */

var cloneableTags = {};
cloneableTags[argsTag$2] = cloneableTags[arrayTag$1] = cloneableTags[arrayBufferTag$2] = cloneableTags[dataViewTag$3] = cloneableTags[boolTag$2] = cloneableTags[dateTag$2] = cloneableTags[float32Tag$2] = cloneableTags[float64Tag$2] = cloneableTags[int8Tag$2] = cloneableTags[int16Tag$2] = cloneableTags[int32Tag$2] = cloneableTags[mapTag$4] = cloneableTags[numberTag$2] = cloneableTags[objectTag$3] = cloneableTags[regexpTag$2] = cloneableTags[setTag$4] = cloneableTags[stringTag$2] = cloneableTags[symbolTag$2] = cloneableTags[uint8Tag$2] = cloneableTags[uint8ClampedTag$2] = cloneableTags[uint16Tag$2] = cloneableTags[uint32Tag$2] = true;
cloneableTags[errorTag$2] = cloneableTags[funcTag$2] = cloneableTags[weakMapTag$2] = false;
/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} bitmask The bitmask flags.
 *  1 - Deep clone
 *  2 - Flatten inherited properties
 *  4 - Clone symbols
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */

function baseClone(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG,
      isFlat = bitmask & CLONE_FLAT_FLAG,
      isFull = bitmask & CLONE_SYMBOLS_FLAG;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }

  if (result !== undefined) {
    return result;
  }

  if (!isObject$1(value)) {
    return value;
  }

  var isArr = isArray$1(value);

  if (isArr) {
    result = initCloneArray(value);

    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag$2 || tag == genTag$1$1;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }

    if (tag == objectTag$3 || tag == argsTag$2 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject(value);

      if (!isDeep) {
        return isFlat ? copySymbolsIn(value, baseAssignIn(result, value)) : copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }

      result = initCloneByTag(value, tag, isDeep);
    }
  } // Check for circular references and return its corresponding clone.


  stack || (stack = new Stack());
  var stacked = stack.get(value);

  if (stacked) {
    return stacked;
  }

  stack.set(value, result);

  if (isSet(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
  var props = isArr ? undefined : keysFunc(value);
  arrayEach(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    } // Recursively populate clone (susceptible to call stack limits).


    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
  });
  return result;
}

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/** Used to map characters to HTML entities. */

var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};
/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */

var escapeHtmlChar = basePropertyOf(htmlEscapes);

/** Used to match HTML entities and HTML characters. */

var reUnescapedHtml = /[&<>"']/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */

function escape(string) {
  string = toString$1(string);
  return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
}

/** `Object#toString` result references. */

var stringTag$3 = '[object String]';
/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */

function isString(value) {
  return typeof value == 'string' || !isArray$1(value) && isObjectLike$1(value) && baseGetTag$1(value) == stringTag$3;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */

function baseValues(object, props) {
  return arrayMap$1(props, function (key) {
    return object[key];
  });
}

/**
 * Gets the parent value at `path` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} path The path to get the parent value of.
 * @returns {*} Returns the parent value.
 */

function parent(object, path) {
  return path.length < 2 ? object : baseGet$1(object, baseSlice(path, 0, -1));
}

/** `Object#toString` result references. */

var numberTag$3 = '[object Number]';
/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */

function isNumber(value) {
  return typeof value == 'number' || isObjectLike$1(value) && baseGetTag$1(value) == numberTag$3;
}

/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined$1(value) {
  return value === undefined;
}

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */

function baseUnset(object, path) {
  path = castPath$1(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey$1(last$1(path))];
}

/**
 * Used by `_.omit` to customize its `_.cloneDeep` use to only clone plain
 * objects.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {string} key The key of the property to inspect.
 * @returns {*} Returns the uncloned value or `undefined` to defer cloning to `_.cloneDeep`.
 */

function customOmitClone(value) {
  return isPlainObject(value) ? undefined : value;
}

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG$1 = 1,
    CLONE_FLAT_FLAG$1 = 2,
    CLONE_SYMBOLS_FLAG$1 = 4;
/**
 * The opposite of `_.pick`; this method creates an object composed of the
 * own and inherited enumerable property paths of `object` that are not omitted.
 *
 * **Note:** This method is considerably slower than `_.pick`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The source object.
 * @param {...(string|string[])} [paths] The property paths to omit.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.omit(object, ['a', 'c']);
 * // => { 'b': '2' }
 */

var omit = flatRest(function (object, paths) {
  var result = {};

  if (object == null) {
    return result;
  }

  var isDeep = false;
  paths = arrayMap$1(paths, function (path) {
    path = castPath$1(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject(object, getAllKeysIn(object), result);

  if (isDeep) {
    result = baseClone(result, CLONE_DEEP_FLAG$1 | CLONE_FLAT_FLAG$1 | CLONE_SYMBOLS_FLAG$1, customOmitClone);
  }

  var length = paths.length;

  while (length--) {
    baseUnset(result, paths[length]);
  }

  return result;
});

/** Used for built-in method references. */

var objectProto$e = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$b = objectProto$e.hasOwnProperty;
/**
 * Used by `_.defaults` to customize its `_.assignIn` use to assign properties
 * of source objects to the destination object for all destination properties
 * that resolve to `undefined`.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */

function customDefaultsAssignIn(objValue, srcValue, key, object) {
  if (objValue === undefined || eq$1(objValue, objectProto$e[key]) && !hasOwnProperty$b.call(object, key)) {
    return srcValue;
  }

  return objValue;
}

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes = {
  '\\': '\\',
  "'": "'",
  '\n': 'n',
  '\r': 'r',
  '\u2028': 'u2028',
  '\u2029': 'u2029'
};
/**
 * Used by `_.template` to escape characters for inclusion in compiled string literals.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */

function escapeStringChar(chr) {
  return '\\' + stringEscapes[chr];
}

/** Used to match template delimiters. */
var reInterpolate = /<%=([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEscape = /<%-([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEvaluate = /<%([\s\S]+?)%>/g;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB) as well as ES2015 template strings. Change the
 * following template settings to use alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */

var templateSettings = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate,

  /**
   * Used to reference the data object in the template text.
   *
   * @memberOf _.templateSettings
   * @type {string}
   */
  'variable': '',

  /**
   * Used to import variables into the compiled template.
   *
   * @memberOf _.templateSettings
   * @type {Object}
   */
  'imports': {
    /**
     * A reference to the `lodash` function.
     *
     * @memberOf _.templateSettings.imports
     * @type {Function}
     */
    '_': {
      'escape': escape
    }
  }
};

/** Used to match empty string literals in compiled template source. */

var reEmptyStringLeading = /\b__p \+= '';/g,
    reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */

var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
/** Used to ensure capturing order of template delimiters. */

var reNoMatch = /($^)/;
/** Used to match unescaped characters in compiled string literals. */

var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
/** Used for built-in method references. */

var objectProto$f = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$c = objectProto$f.hasOwnProperty;
/**
 * Creates a compiled template function that can interpolate data properties
 * in "interpolate" delimiters, HTML-escape interpolated data properties in
 * "escape" delimiters, and execute JavaScript in "evaluate" delimiters. Data
 * properties may be accessed as free variables in the template. If a setting
 * object is given, it takes precedence over `_.templateSettings` values.
 *
 * **Note:** In the development build `_.template` utilizes
 * [sourceURLs](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/#toc-sourceurl)
 * for easier debugging.
 *
 * For more information on precompiling templates see
 * [lodash's custom builds documentation](https://lodash.com/custom-builds).
 *
 * For more information on Chrome extension sandboxes see
 * [Chrome's extensions documentation](https://developer.chrome.com/extensions/sandboxingEval).
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The template string.
 * @param {Object} [options={}] The options object.
 * @param {RegExp} [options.escape=_.templateSettings.escape]
 *  The HTML "escape" delimiter.
 * @param {RegExp} [options.evaluate=_.templateSettings.evaluate]
 *  The "evaluate" delimiter.
 * @param {Object} [options.imports=_.templateSettings.imports]
 *  An object to import into the template as free variables.
 * @param {RegExp} [options.interpolate=_.templateSettings.interpolate]
 *  The "interpolate" delimiter.
 * @param {string} [options.sourceURL='templateSources[n]']
 *  The sourceURL of the compiled template.
 * @param {string} [options.variable='obj']
 *  The data object variable name.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Function} Returns the compiled template function.
 * @example
 *
 * // Use the "interpolate" delimiter to create a compiled template.
 * var compiled = _.template('hello <%= user %>!');
 * compiled({ 'user': 'fred' });
 * // => 'hello fred!'
 *
 * // Use the HTML "escape" delimiter to escape data property values.
 * var compiled = _.template('<b><%- value %></b>');
 * compiled({ 'value': '<script>' });
 * // => '<b>&lt;script&gt;</b>'
 *
 * // Use the "evaluate" delimiter to execute JavaScript and generate HTML.
 * var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the internal `print` function in "evaluate" delimiters.
 * var compiled = _.template('<% print("hello " + user); %>!');
 * compiled({ 'user': 'barney' });
 * // => 'hello barney!'
 *
 * // Use the ES template literal delimiter as an "interpolate" delimiter.
 * // Disable support by replacing the "interpolate" delimiter.
 * var compiled = _.template('hello ${ user }!');
 * compiled({ 'user': 'pebbles' });
 * // => 'hello pebbles!'
 *
 * // Use backslashes to treat delimiters as plain text.
 * var compiled = _.template('<%= "\\<%- value %\\>" %>');
 * compiled({ 'value': 'ignored' });
 * // => '<%- value %>'
 *
 * // Use the `imports` option to import `jQuery` as `jq`.
 * var text = '<% jq.each(users, function(user) { %><li><%- user %></li><% }); %>';
 * var compiled = _.template(text, { 'imports': { 'jq': jQuery } });
 * compiled({ 'users': ['fred', 'barney'] });
 * // => '<li>fred</li><li>barney</li>'
 *
 * // Use the `sourceURL` option to specify a custom sourceURL for the template.
 * var compiled = _.template('hello <%= user %>!', { 'sourceURL': '/basic/greeting.jst' });
 * compiled(data);
 * // => Find the source of "greeting.jst" under the Sources tab or Resources panel of the web inspector.
 *
 * // Use the `variable` option to ensure a with-statement isn't used in the compiled template.
 * var compiled = _.template('hi <%= data.user %>!', { 'variable': 'data' });
 * compiled.source;
 * // => function(data) {
 * //   var __t, __p = '';
 * //   __p += 'hi ' + ((__t = ( data.user )) == null ? '' : __t) + '!';
 * //   return __p;
 * // }
 *
 * // Use custom template delimiters.
 * _.templateSettings.interpolate = /{{([\s\S]+?)}}/g;
 * var compiled = _.template('hello {{ user }}!');
 * compiled({ 'user': 'mustache' });
 * // => 'hello mustache!'
 *
 * // Use the `source` property to inline compiled templates for meaningful
 * // line numbers in error messages and stack traces.
 * fs.writeFileSync(path.join(process.cwd(), 'jst.js'), '\
 *   var JST = {\
 *     "main": ' + _.template(mainText).source + '\
 *   };\
 * ');
 */

function template$1(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }

  string = toString$1(string);
  options = assignInWith({}, options, settings, customDefaultsAssignIn);
  var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn),
      importsKeys = keys(imports),
      importsValues = baseValues(imports, importsKeys);
  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch,
      source = "__p += '"; // Compile the regexp to match each delimiter.

  var reDelimiters = RegExp((options.escape || reNoMatch).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + '|' + (options.evaluate || reNoMatch).source + '|$', 'g'); // Use a sourceURL for easier debugging.
  // The sourceURL gets injected into the source that's eval-ed, so be careful
  // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
  // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.

  var sourceURL = hasOwnProperty$c.call(options, 'sourceURL') ? '//# sourceURL=' + (options.sourceURL + '').replace(/[\r\n]/g, ' ') + '\n' : '';
  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue); // Escape characters that can't be included in string literals.

    source += string.slice(index, offset).replace(reUnescapedString, escapeStringChar); // Replace delimiters with snippets.

    if (escapeValue) {
      isEscaping = true;
      source += "' +\n__e(" + escapeValue + ") +\n'";
    }

    if (evaluateValue) {
      isEvaluating = true;
      source += "';\n" + evaluateValue + ";\n__p += '";
    }

    if (interpolateValue) {
      source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
    }

    index = offset + match.length; // The JS engine embedded in Adobe products needs `match` returned in
    // order to produce the correct `offset` value.

    return match;
  });
  source += "';\n"; // If `variable` is not specified wrap a with-statement around the generated
  // code to add the data object to the top of the scope chain.
  // Like with sourceURL, we take care to not check the option's prototype,
  // as this configuration is a code injection vector.

  var variable = hasOwnProperty$c.call(options, 'variable') && options.variable;

  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  } // Cleanup code by stripping empty strings.


  source = (isEvaluating ? source.replace(reEmptyStringLeading, '') : source).replace(reEmptyStringMiddle, '$1').replace(reEmptyStringTrailing, '$1;'); // Frame code as the function body.

  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
  var result = attempt(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  }); // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.

  result.source = source;

  if (isError(result)) {
    throw result;
  }

  return result;
}

/** Used to map HTML entities to characters. */

var htmlUnescapes = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'"
};
/**
 * Used by `_.unescape` to convert HTML entities to characters.
 *
 * @private
 * @param {string} chr The matched character to unescape.
 * @returns {string} Returns the unescaped character.
 */

var unescapeHtmlChar = basePropertyOf(htmlUnescapes);

/** Used to match HTML entities and HTML characters. */

var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g,
    reHasEscapedHtml = RegExp(reEscapedHtml.source);
/**
 * The inverse of `_.escape`; this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to
 * their corresponding characters.
 *
 * **Note:** No other HTML entities are unescaped. To unescape additional
 * HTML entities use a third-party library like [_he_](https://mths.be/he).
 *
 * @static
 * @memberOf _
 * @since 0.6.0
 * @category String
 * @param {string} [string=''] The string to unescape.
 * @returns {string} Returns the unescaped string.
 * @example
 *
 * _.unescape('fred, barney, &amp; pebbles');
 * // => 'fred, barney, & pebbles'
 */

function unescape(string) {
  string = toString$1(string);
  return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
}

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */

/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim = function () {
  if (typeof Map !== 'undefined') {
    return Map;
  }
  /**
   * Returns index in provided array that matches the specified key.
   *
   * @param {Array<Array>} arr
   * @param {*} key
   * @returns {number}
   */


  function getIndex(arr, key) {
    var result = -1;
    arr.some(function (entry, index) {
      if (entry[0] === key) {
        result = index;
        return true;
      }

      return false;
    });
    return result;
  }

  return (
    /** @class */
    function () {
      function class_1() {
        this.__entries__ = [];
      }

      Object.defineProperty(class_1.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function () {
          return this.__entries__.length;
        },
        enumerable: true,
        configurable: true
      });
      /**
       * @param {*} key
       * @returns {*}
       */

      class_1.prototype.get = function (key) {
        var index = getIndex(this.__entries__, key);
        var entry = this.__entries__[index];
        return entry && entry[1];
      };
      /**
       * @param {*} key
       * @param {*} value
       * @returns {void}
       */


      class_1.prototype.set = function (key, value) {
        var index = getIndex(this.__entries__, key);

        if (~index) {
          this.__entries__[index][1] = value;
        } else {
          this.__entries__.push([key, value]);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */


      class_1.prototype.delete = function (key) {
        var entries = this.__entries__;
        var index = getIndex(entries, key);

        if (~index) {
          entries.splice(index, 1);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */


      class_1.prototype.has = function (key) {
        return !!~getIndex(this.__entries__, key);
      };
      /**
       * @returns {void}
       */


      class_1.prototype.clear = function () {
        this.__entries__.splice(0);
      };
      /**
       * @param {Function} callback
       * @param {*} [ctx=null]
       * @returns {void}
       */


      class_1.prototype.forEach = function (callback, ctx) {
        if (ctx === void 0) {
          ctx = null;
        }

        for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
          var entry = _a[_i];
          callback.call(ctx, entry[1], entry[0]);
        }
      };

      return class_1;
    }()
  );
}();
/**
 * Detects whether window and document objects are available in current environment.
 */


var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document; // Returns global object of a current environment.

var global$1 = function () {
  if (typeof global !== 'undefined' && global.Math === Math) {
    return global;
  }

  if (typeof self !== 'undefined' && self.Math === Math) {
    return self;
  }

  if (typeof window !== 'undefined' && window.Math === Math) {
    return window;
  } // eslint-disable-next-line no-new-func


  return Function('return this')();
}();
/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */


var requestAnimationFrame$1 = function () {
  if (typeof requestAnimationFrame === 'function') {
    // It's required to use a bounded function because IE sometimes throws
    // an "Invalid calling object" error if rAF is invoked without the global
    // object on the left hand side.
    return requestAnimationFrame.bind(global$1);
  }

  return function (callback) {
    return setTimeout(function () {
      return callback(Date.now());
    }, 1000 / 60);
  };
}(); // Defines minimum timeout before adding a trailing call.


var trailingTimeout = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */

function throttle(callback, delay) {
  var leadingCall = false,
      trailingCall = false,
      lastCallTime = 0;
  /**
   * Invokes the original callback function and schedules new invocation if
   * the "proxy" was called during current request.
   *
   * @returns {void}
   */

  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }

    if (trailingCall) {
      proxy();
    }
  }
  /**
   * Callback invoked after the specified delay. It will further postpone
   * invocation of the original function delegating it to the
   * requestAnimationFrame.
   *
   * @returns {void}
   */


  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  /**
   * Schedules invocation of the original function.
   *
   * @returns {void}
   */


  function proxy() {
    var timeStamp = Date.now();

    if (leadingCall) {
      // Reject immediately following calls.
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      } // Schedule new call to be in invoked when the pending one is resolved.
      // This is important for "transitions" which never actually start
      // immediately so there is a chance that we might miss one if change
      // happens amids the pending invocation.


      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }

    lastCallTime = timeStamp;
  }

  return proxy;
} // Minimum delay before invoking the update of observers.


var REFRESH_DELAY = 20; // A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.

var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight']; // Check if MutationObserver is available.

var mutationObserverSupported = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */

var ResizeObserverController =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserverController.
   *
   * @private
   */
  function ResizeObserverController() {
    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    this.connected_ = false;
    /**
     * Tells that controller has subscribed for Mutation Events.
     *
     * @private {boolean}
     */

    this.mutationEventsAdded_ = false;
    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */

    this.mutationsObserver_ = null;
    /**
     * A list of connected observers.
     *
     * @private {Array<ResizeObserverSPI>}
     */

    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
  }
  /**
   * Adds observer to observers list.
   *
   * @param {ResizeObserverSPI} observer - Observer to be added.
   * @returns {void}
   */


  ResizeObserverController.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    } // Add listeners if they haven't been added yet.


    if (!this.connected_) {
      this.connect_();
    }
  };
  /**
   * Removes observer from observers list.
   *
   * @param {ResizeObserverSPI} observer - Observer to be removed.
   * @returns {void}
   */


  ResizeObserverController.prototype.removeObserver = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer); // Remove observer if it's present in registry.

    if (~index) {
      observers.splice(index, 1);
    } // Remove listeners if controller has no connected observers.


    if (!observers.length && this.connected_) {
      this.disconnect_();
    }
  };
  /**
   * Invokes the update of observers. It will continue running updates insofar
   * it detects changes.
   *
   * @returns {void}
   */


  ResizeObserverController.prototype.refresh = function () {
    var changesDetected = this.updateObservers_(); // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.

    if (changesDetected) {
      this.refresh();
    }
  };
  /**
   * Updates every observer from observers list and notifies them of queued
   * entries.
   *
   * @private
   * @returns {boolean} Returns "true" if any observer has detected changes in
   *      dimensions of it's elements.
   */


  ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active observations.
    var activeObservers = this.observers_.filter(function (observer) {
      return observer.gatherActive(), observer.hasActive();
    }); // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers, e.g. when multiple instances of
    // ResizeObserver are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.

    activeObservers.forEach(function (observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  /**
   * Initializes DOM listeners.
   *
   * @private
   * @returns {void}
   */


  ResizeObserverController.prototype.connect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already added.
    if (!isBrowser || this.connected_) {
      return;
    } // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.


    document.addEventListener('transitionend', this.onTransitionEnd_);
    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    } else {
      document.addEventListener('DOMSubtreeModified', this.refresh);
      this.mutationEventsAdded_ = true;
    }

    this.connected_ = true;
  };
  /**
   * Removes DOM listeners.
   *
   * @private
   * @returns {void}
   */


  ResizeObserverController.prototype.disconnect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already removed.
    if (!isBrowser || !this.connected_) {
      return;
    }

    document.removeEventListener('transitionend', this.onTransitionEnd_);
    window.removeEventListener('resize', this.refresh);

    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }

    if (this.mutationEventsAdded_) {
      document.removeEventListener('DOMSubtreeModified', this.refresh);
    }

    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  /**
   * "Transitionend" event handler.
   *
   * @private
   * @param {TransitionEvent} event
   * @returns {void}
   */


  ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
    var _b = _a.propertyName,
        propertyName = _b === void 0 ? '' : _b; // Detect whether transition may affect dimensions of an element.

    var isReflowProperty = transitionKeys.some(function (key) {
      return !!~propertyName.indexOf(key);
    });

    if (isReflowProperty) {
      this.refresh();
    }
  };
  /**
   * Returns instance of the ResizeObserverController.
   *
   * @returns {ResizeObserverController}
   */


  ResizeObserverController.getInstance = function () {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController();
    }

    return this.instance_;
  };
  /**
   * Holds reference to the controller's instance.
   *
   * @private {ResizeObserverController}
   */


  ResizeObserverController.instance_ = null;
  return ResizeObserverController;
}();
/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */


var defineConfigurable = function (target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }

  return target;
};
/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */


var getWindowOf = function (target) {
  // Assume that the element is an instance of Node, which means that it
  // has the "ownerDocument" property from which we can retrieve a
  // corresponding global object.
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView; // Return the local global object if it's not possible extract one from
  // provided element.

  return ownerGlobal || global$1;
}; // Placeholder of an empty content rectangle.


var emptyRect = createRectInit(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */

function toFloat(value) {
  return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */


function getBordersSize(styles) {
  var positions = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }

  return positions.reduce(function (size, position) {
    var value = styles['border-' + position + '-width'];
    return size + toFloat(value);
  }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */


function getPaddings(styles) {
  var positions = ['top', 'right', 'bottom', 'left'];
  var paddings = {};

  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles['padding-' + position];
    paddings[position] = toFloat(value);
  }

  return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */


function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */


function getHTMLElementContentRect(target) {
  // Client width & height properties can't be
  // used exclusively as they provide rounded values.
  var clientWidth = target.clientWidth,
      clientHeight = target.clientHeight; // By this condition we can catch all non-replaced inline, hidden and
  // detached elements. Though elements with width & height properties less
  // than 0.5 will be discarded as well.
  //
  // Without it we would need to implement separate methods for each of
  // those cases and it's not possible to perform a precise and performance
  // effective test for hidden elements. E.g. even jQuery's ':visible' filter
  // gives wrong results for elements with width & height less than 0.5.

  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }

  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom; // Computed styles of width & height are being used because they are the
  // only dimensions available to JS that contain non-rounded values. It could
  // be possible to utilize the getBoundingClientRect if only it's data wasn't
  // affected by CSS transformations let alone paddings, borders and scroll bars.

  var width = toFloat(styles.width),
      height = toFloat(styles.height); // Width & height include paddings and borders when the 'border-box' box
  // model is applied (except for IE).

  if (styles.boxSizing === 'border-box') {
    // Following conditions are required to handle Internet Explorer which
    // doesn't include paddings and borders to computed CSS dimensions.
    //
    // We can say that if CSS dimensions + paddings are equal to the "client"
    // properties then it's either IE, and thus we don't need to subtract
    // anything, or an element merely doesn't have paddings/borders styles.
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, 'left', 'right') + horizPad;
    }

    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
    }
  } // Following steps can't be applied to the document's root element as its
  // client[Width/Height] properties represent viewport area of the window.
  // Besides, it's as well not necessary as the <html> itself neither has
  // rendered scroll bars nor it can be clipped.


  if (!isDocumentElement(target)) {
    // In some browsers (only in Firefox, actually) CSS width & height
    // include scroll bars size which can be removed at this step as scroll
    // bars are the only difference between rounded dimensions + paddings
    // and "client" properties, though that is not always true in Chrome.
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight; // Chrome has a rather weird rounding of "client" properties.
    // E.g. for an element with content width of 314.2px it sometimes gives
    // the client width of 315px and for the width of 314.7px it may give
    // 314px. And it doesn't happen all the time. So just ignore this delta
    // as a non-relevant.

    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }

    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }

  return createRectInit(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


var isSVGGraphicsElement = function () {
  // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
  // interface.
  if (typeof SVGGraphicsElement !== 'undefined') {
    return function (target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  } // If it's so, then check that element is at least an instance of the
  // SVGElement and that it has the "getBBox" method.
  // eslint-disable-next-line no-extra-parens


  return function (target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === 'function';
  };
}();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */


function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }

  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }

  return getHTMLElementContentRect(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */


function createReadOnlyRect(_a) {
  var x = _a.x,
      y = _a.y,
      width = _a.width,
      height = _a.height; // If DOMRectReadOnly is available use it as a prototype for the rectangle.

  var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype); // Rectangle's properties are not writable and non-enumerable.

  defineConfigurable(rect, {
    x: x,
    y: y,
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */


function createRectInit(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}
/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */


var ResizeObservation =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObservation.
   *
   * @param {Element} target - Element to be observed.
   */
  function ResizeObservation(target) {
    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */
    this.broadcastWidth = 0;
    /**
     * Broadcasted height of content rectangle.
     *
     * @type {number}
     */

    this.broadcastHeight = 0;
    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */

    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  /**
   * Updates content rectangle and tells whether it's width or height properties
   * have changed since the last broadcast.
   *
   * @returns {boolean}
   */


  ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  /**
   * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
   * from the corresponding properties of the last observed content rectangle.
   *
   * @returns {DOMRectInit} Last observed content rectangle.
   */


  ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };

  return ResizeObservation;
}();

var ResizeObserverEntry =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObserverEntry.
   *
   * @param {Element} target - Element that is being observed.
   * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
   */
  function ResizeObserverEntry(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit); // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.

    defineConfigurable(this, {
      target: target,
      contentRect: contentRect
    });
  }

  return ResizeObserverEntry;
}();

var ResizeObserverSPI =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserver.
   *
   * @param {ResizeObserverCallback} callback - Callback function that is invoked
   *      when one of the observed elements changes it's content dimensions.
   * @param {ResizeObserverController} controller - Controller instance which
   *      is responsible for the updates of observer.
   * @param {ResizeObserver} callbackCtx - Reference to the public
   *      ResizeObserver instance which will be passed to callback function.
   */
  function ResizeObserverSPI(callback, controller, callbackCtx) {
    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */
    this.activeObservations_ = [];
    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */

    this.observations_ = new MapShim();

    if (typeof callback !== 'function') {
      throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  /**
   * Starts observing provided element.
   *
   * @param {Element} target - Element to be observed.
   * @returns {void}
   */


  ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    } // Do nothing if current environment doesn't have the Element interface.


    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
      return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is already being observed.

    if (observations.has(target)) {
      return;
    }

    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this); // Force the update of observations.

    this.controller_.refresh();
  };
  /**
   * Stops observing provided element.
   *
   * @param {Element} target - Element to stop observing.
   * @returns {void}
   */


  ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    } // Do nothing if current environment doesn't have the Element interface.


    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
      return;
    }

    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is not being observed.

    if (!observations.has(target)) {
      return;
    }

    observations.delete(target);

    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  /**
   * Stops observing all elements.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  /**
   * Collects observation instances the associated element of which has changed
   * it's content rectangle.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.gatherActive = function () {
    var _this = this;

    this.clearActive();
    this.observations_.forEach(function (observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  /**
   * Invokes initial callback function with a list of ResizeObserverEntry
   * instances collected from active resize observations.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
      return;
    }

    var ctx = this.callbackCtx_; // Create ResizeObserverEntry instance for every active observation.

    var entries = this.activeObservations_.map(function (observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  /**
   * Clears the collection of active observations.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
  };
  /**
   * Tells whether observer has active observations.
   *
   * @returns {boolean}
   */


  ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
  };

  return ResizeObserverSPI;
}(); // Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.


var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */

var ResizeObserver =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserver.
   *
   * @param {ResizeObserverCallback} callback - Callback that is invoked when
   *      dimensions of the observed elements change.
   */
  function ResizeObserver(callback) {
    if (!(this instanceof ResizeObserver)) {
      throw new TypeError('Cannot call a class as a function.');
    }

    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    }

    var controller = ResizeObserverController.getInstance();
    var observer = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer);
  }

  return ResizeObserver;
}(); // Expose public methods of ResizeObserver.


['observe', 'unobserve', 'disconnect'].forEach(function (method) {
  ResizeObserver.prototype[method] = function () {
    var _a;

    return (_a = observers.get(this))[method].apply(_a, arguments);
  };
});

var index = function () {
  // Export existing implementation if available.
  if (typeof global$1.ResizeObserver !== 'undefined') {
    return global$1.ResizeObserver;
  }

  return ResizeObserver;
}();

var css$1 = {"term":"term-term-️src-Term-index","header":"header-term-️src-Term-index","hidden":"hidden-term-️src-Term-index","headerTextContainer":"headerTextContainer-term-️src-Term-index","headerText":"headerText-term-️src-Term-index","content":"content-term-️src-Term-index","linesContainer":"linesContainer-term-️src-Term-index","line":"line-term-️src-Term-index","editLine":"editLine-term-️src-Term-index"};

var template$1$1 = "<div ref=\"root\" class=\"term\">\n  <div ref=\"header\" class=\"header {hidden}\">\n    <div ref=\"headerTextContainer\" class=\"headerTextContainer\">\n      <span ref=\"headerText\" class=\"headerText\">{header}</span>\n    </div>\n  </div>\n  <div ref=\"content\" class=\"content\">\n    <div ref=\"linesContainer\" class=\"linesContainer\"></div>\n  </div>\n</div>\n";

class Animation {
    constructor() {
        Animation.activateRequestAnimationFrame();
        this.registerFrameHandler();
    }
    static activateRequestAnimationFrame() {
        if (!Animation.animationFrame) {
            Animation.animationFrame = window
                .requestAnimationFrame(Animation.requestAnimationFrameHandler);
        }
    }
    static deactivateRequestAnimationFrame() {
        if (!Animation.handlerList.length) {
            window.cancelAnimationFrame(Animation.animationFrame);
        }
    }
    static requestAnimationFrameHandler() {
        Animation.handlerList.forEach((handler) => handler());
        Animation.animationFrame = window
            .requestAnimationFrame(Animation.requestAnimationFrameHandler);
    }
    destroy() {
        this.removeHandler();
    }
    registerFrameHandler() {
        if (this.frameHandler)
            this.addHandler();
    }
    unregisterFrameHandler() {
        if (this.frameHandler)
            this.removeHandler();
    }
    addHandler() {
        const { frameHandler } = this;
        if (frameHandler) {
            Animation.activateRequestAnimationFrame();
            Animation.handlerList.push(frameHandler);
        }
    }
    removeHandler() {
        const { handlerList } = Animation;
        const { frameHandler } = this;
        if (frameHandler && handlerList.includes(frameHandler)) {
            const index = handlerList.indexOf(frameHandler);
            handlerList.splice(index, 1);
        }
        Animation.deactivateRequestAnimationFrame();
    }
}
Animation.handlerList = [];

const CLASS_NAME_PATTERN = /class="[^"]+"/ig;
const REF_PATTERN = /ref="[^"]+"/ig;
const IF_OPEN_PATTERN = /<If\scondition="\{[^"]+}">/gi;
const IF_CLOSE_PATTERN = /<\/If>/gi;
const CHOOSE_OPEN_PATTERN = /<Choose>/gi;
const CHOOSE_CLOSE_PATTERN = /<\/Choose>/gi;
const CHOOSE_PATTERN = /<Choose>(.(?!\/Choose>)|\n(?!\/Choose>)|\s(?!\/Choose>))+/gi;
const WHEN_PATTERN = /<When\scondition="\{[^"]+}">(.(?!\/When>)|\n(?!\/When>)|\s(?!\/When>))+/gi;
const WHEN_OPEN_PATTERN = /<When\scondition="\{[^"]+}">/gi;
const WHEN_CLOSE_PATTERN = /<\/When>/gi;
const OTHERWISE_PATTERN = /<Otherwise>(.(?!\/Otherwise>)|\n(?!\/Otherwise>)|\s(?!\/Otherwise>))+/gi;
const OTHERWISE_OPEN_PATTERN = /<Otherwise>/gi;
const OTHERWISE_CLOSE_PATTERN = /<\/Otherwise>/gi;

class TemplateEngine extends Animation {
    constructor(template, container) {
        super();
        this.childNodesField = [];
        this.templateField = '';
        this.isHidden = false;
        this.refMap = {};
        if (template)
            this.template = template;
        this.containerField = container || this.containerField;
    }
    static getProxyChildNodes(renderString) {
        const proxyContainer = document.createElement('div');
        const proxyChildNodes = [];
        proxyContainer.innerHTML = renderString;
        const { childNodes } = proxyContainer;
        for (let i = 0, ln = childNodes.length; i < ln; i += 1) {
            proxyChildNodes.push(childNodes[i]);
        }
        return proxyChildNodes;
    }
    static insertAfter(container, element, ref) {
        const { childNodes } = container;
        const index = Array.prototype.indexOf.call(childNodes, ref);
        if (index >= 0) {
            return index === childNodes.length - 1
                ? container.appendChild(element)
                : container.insertBefore(element, childNodes[index + 1]);
        }
    }
    static getRenderStringWithClassNames(renderString, params = {}) {
        const { css } = params;
        if (!css)
            return renderString;
        const classNameStringList = renderString.match(CLASS_NAME_PATTERN);
        if (!classNameStringList)
            return renderString;
        return classNameStringList.reduce((acc, classNameString) => {
            const classNameList = classNameString.replace('class="', '').replace('"', '').split(' ');
            const replacedClassNameList = classNameList
                .map((item) => css[item] || item).join(' ');
            const pattern = new RegExp(`class="${classNameList.join('\\s')}"`);
            return acc.replace(pattern, `class="${replacedClassNameList}"`);
        }, renderString);
    }
    static getRenderStringWithVariables(renderString, params = {}) {
        delete params.css;
        return Object.keys(params).reduce((acc, key) => {
            const pattern = new RegExp(`\\{${key}}`, 'g');
            return acc.replace(pattern, params[key]);
        }, renderString);
    }
    static getTemplateExecutor(template$1$1) {
        let processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashConditions(template$1$1);
        processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
            .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
        return template$1(processedTemplate);
    }
    static getTemplateExecutorStringWithLodashConditions(template) {
        const conditionList = template.match(IF_OPEN_PATTERN);
        if (!conditionList)
            return template;
        return conditionList.reduce((acc, item) => {
            const condition = item.replace(/^<If\scondition="\{/i, '').replace(/}">$/, '');
            return acc.replace(item, `<% if (${condition}) { %>`);
        }, template).replace(IF_CLOSE_PATTERN, '<% } %>');
    }
    static getTemplateExecutorStringWithLodashSwitches(template) {
        if (!CHOOSE_OPEN_PATTERN.test(template))
            return template;
        const chooseList = template.match(CHOOSE_PATTERN) || [];
        return chooseList.reduce((acc, item) => {
            return this.getTemplateExecutorStringWithLodashWhen(acc, item.replace(/<Choose>[^<]*/i, ''));
        }, template).replace(CHOOSE_OPEN_PATTERN, '').replace(CHOOSE_CLOSE_PATTERN, '');
    }
    static getTemplateExecutorStringWithLodashWhen(template, data) {
        const whenList = data.match(WHEN_PATTERN) || [];
        const otherwiseList = data.match(OTHERWISE_PATTERN) || [];
        const processedString = whenList.reduce((acc, item, index) => {
            const openBlockList = item.match(WHEN_OPEN_PATTERN);
            if (!openBlockList)
                return acc;
            const openBlock = openBlockList[0];
            const condition = openBlock.replace(/^<When\scondition="\{/i, '').replace(/}">$/, '');
            const processedBlock = item.replace(openBlock, `<%${index ? ' else' : ''} if (${condition}) { %>`);
            return acc.replace(item, processedBlock);
        }, template).replace(WHEN_CLOSE_PATTERN, '<% } %>');
        return otherwiseList.length === 1
            ? otherwiseList.reduce((acc, item) => {
                const processedBlock = item
                    .replace(OTHERWISE_OPEN_PATTERN, whenList.length ? '<% else {  %>' : '');
                return acc.replace(item, processedBlock);
            }, processedString).replace(OTHERWISE_CLOSE_PATTERN, whenList.length ? '<% } %>' : '')
            : processedString;
    }
    get childNodes() {
        return this.childNodesField;
    }
    set childNodes(value) {
        this.childNodesField = value;
    }
    get nodeList() {
        return this.childNodes || [];
    }
    get template() {
        return this.templateField;
    }
    set template(value) {
        this.templateExecutor = TemplateEngine.getTemplateExecutor(value);
        this.templateField = value;
    }
    get container() {
        return this.containerField;
    }
    set container(value) {
        this.containerField = value;
    }
    destroy() {
        super.destroy();
        const { container, childNodes } = this;
        childNodes === null || childNodes === void 0 ? void 0 : childNodes.forEach((childNode) => {
            container === null || container === void 0 ? void 0 : container.removeChild(childNode);
        });
    }
    show(append = true, ref) {
        if (!this.isHidden)
            return;
        this.isHidden = false;
        const { container, childNodes } = this;
        if (container && childNodes) {
            if (ref)
                return this.addChildNodesWithRef(append, ref);
            this.addChildNodesWithoutRef(append);
        }
    }
    hide() {
        if (this.isHidden)
            return;
        this.isHidden = true;
        const { container, childNodes } = this;
        if (container && childNodes) {
            childNodes.forEach((childNode) => {
                if (this.checkChildExists(childNode))
                    container.removeChild(childNode);
            });
        }
    }
    getRefMap() {
        return Object.assign({}, this.refMap);
    }
    getRef(name) {
        return this.refMap[name];
    }
    render(params, options) {
        const { container, template } = this;
        if (!container || !template)
            return;
        this.insertRenderString(this.getRenderString(params), options || {});
        this.saveRefs();
    }
    getRenderString(params) {
        const { templateExecutor } = this;
        if (!templateExecutor)
            return '';
        let renderString = templateExecutor(omit(params, ['css']));
        renderString = TemplateEngine.getRenderStringWithClassNames(renderString, params);
        return TemplateEngine.getRenderStringWithVariables(renderString, params);
    }
    saveRefs() {
        const { container } = this;
        const refs = this.template.match(REF_PATTERN);
        this.refMap = refs ? refs.reduce((acc, item) => {
            const name = item.replace(/^ref="/, '').replace(/"$/, '');
            if (!name)
                return acc;
            const element = container === null || container === void 0 ? void 0 : container.querySelector(`[ref="${name}"]`);
            if (!element)
                return acc;
            element.removeAttribute('ref');
            acc[name] = element;
            return acc;
        }, {}) : {};
    }
    insertRenderString(renderString, options) {
        const { replace, append = true, ref } = options;
        if (replace)
            return this.replaceRenderString(renderString, replace);
        if (ref)
            return this.addRenderStringWithRef(append, renderString, ref);
        this.addRenderStringWithoutRef(append, renderString);
    }
    replaceRenderString(renderString, replace) {
        const container = this.container;
        const { childNodes } = container;
        const proxyChildNodes = TemplateEngine.getProxyChildNodes(renderString);
        const replaceNodeList = replace.nodeList;
        if (!replaceNodeList || replaceNodeList.length !== proxyChildNodes.length)
            return;
        proxyChildNodes.forEach((childNode, index) => {
            const replaceItem = replaceNodeList[index];
            if (replaceItem && Array.prototype.includes.call(childNodes, replaceItem)) {
                container.replaceChild(childNode, replaceItem);
            }
        });
        this.childNodes = proxyChildNodes;
    }
    addRenderStringWithoutRef(append, renderString) {
        this.childNodes = TemplateEngine.getProxyChildNodes(renderString);
        this.addChildNodesWithoutRef(append);
    }
    addChildNodesWithoutRef(append) {
        const container = this.container;
        const childNodes = this.childNodes;
        const firstChild = container.firstChild;
        childNodes.forEach((childNode) => {
            if (append) {
                this.appendChild(childNode);
            }
            else {
                this.insertBefore(childNode, firstChild);
            }
        });
        this.childNodes = childNodes;
    }
    addRenderStringWithRef(append, renderString, ref) {
        this.childNodes = TemplateEngine.getProxyChildNodes(renderString);
        this.addChildNodesWithRef(append, ref);
    }
    addChildNodesWithRef(append, ref) {
        const childNodes = this.childNodes;
        const refNodeList = ref.nodeList;
        if (!(refNodeList === null || refNodeList === void 0 ? void 0 : refNodeList.length))
            return;
        const refNode = (append ? refNodeList[refNodeList.length - 1] : refNodeList[0]);
        (append ? Array.prototype.reverse.call(childNodes) : childNodes)
            .forEach((childNode, index) => {
            if (append) {
                return index
                    ? this.insertBefore(childNode, childNodes[0])
                    : this.insertAfter(childNode, refNode);
            }
            this.insertBefore(childNode, refNode);
        });
    }
    checkChildExists(childNode) {
        const { container } = this;
        if (container) {
            const containerChildNodes = container.childNodes;
            return Array.prototype.includes.call(containerChildNodes, childNode);
        }
        return false;
    }
    insertBefore(childNode, ref) {
        const { container } = this;
        if (container && this.checkChildExists(ref)) {
            container.insertBefore(childNode, ref);
        }
    }
    insertAfter(childNode, ref) {
        const { container } = this;
        if (container && this.checkChildExists(ref)) {
            TemplateEngine
                .insertAfter(container, childNode, ref);
        }
    }
    appendChild(childNode) {
        const { container } = this;
        if (container)
            container.appendChild(childNode);
    }
}

var template$2 = "<div ref=\"root\" class=\"root className\">\n  <div ref=\"virtualizedList\" class=\"virtualizedList\">\n    <div ref=\"itemsContainer\" class=\"itemsContainer\"></div>\n  </div>\n  <div ref=\"generalList\" class=\"generalList\"></div>\n</div>\n";

var css$1$1 = {"root":"root-term-️src-Term-VirtualizedList-index","virtualizedList":"virtualizedList-term-️src-Term-VirtualizedList-index","itemsContainer":"itemsContainer-term-️src-Term-VirtualizedList-index"};

class VirtualizedList extends TemplateEngine {
    constructor(container, params) {
        super(template$2, container);
        this.lengthValue = 0;
        this.height = 0;
        this.topOffset = 0;
        this.bottomOffset = 0;
        this.itemsCache = {};
        this.viewportItems = [];
        this.renderedItems = [];
        this.offset = 0;
        this.restoreParams = { index: -1, bottomOffset: -1, width: -1, height: -1 };
        this.renderViewportItems = () => {
            const { length, heightGetter, topOffset, bottomOffset } = this;
            const root = this.getRef('root');
            if (!root)
                return;
            this.restoreScrollTop();
            const viewportStart = Math.max(root.scrollTop - topOffset, 0);
            const visibleViewportEnd = viewportStart + root.offsetHeight + topOffset;
            const viewportEnd = visibleViewportEnd + bottomOffset;
            let itemOffsetStart = 0;
            let itemOffsetEnd = 0;
            let isFound = false;
            let isVisibleFound = false;
            let offset;
            let lastItemOffset = 0;
            let lastItemHeight = 0;
            let lastItemIndex = -1;
            let isVisibleLastNotFound = true;
            const items = [];
            for (let i = 0; i < length; i += 1) {
                const itemHeight = heightGetter(i);
                itemOffsetStart = itemOffsetEnd;
                itemOffsetEnd = itemOffsetStart + itemHeight;
                const isViewportItem = VirtualizedList.checkViewportItem({
                    viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd,
                });
                const isVisibleViewportItem = isVisibleLastNotFound ? VirtualizedList.checkFullViewportItem({
                    viewportStart, itemOffsetStart, itemOffsetEnd, viewportEnd: visibleViewportEnd,
                }) : isVisibleLastNotFound;
                isFound = isViewportItem || isFound;
                isVisibleFound = isVisibleViewportItem || isVisibleFound;
                if (isVisibleFound && !isVisibleViewportItem)
                    isVisibleLastNotFound = false;
                if (isVisibleLastNotFound) {
                    lastItemOffset += lastItemHeight;
                    lastItemHeight = itemHeight;
                    lastItemIndex = i;
                }
                if (isFound && !isViewportItem)
                    break;
                if (isViewportItem) {
                    items.push(i);
                    offset = isUndefined$1(offset) ? itemOffsetStart : offset;
                }
            }
            this.viewportItems = items;
            this.offset = offset || 0;
            this.updateRestoreParams(lastItemIndex, lastItemOffset, lastItemHeight);
            this.renderItems();
        };
        window.vl = this;
        this.lengthValue = params.length;
        this.itemGetter = params.itemGetter;
        this.heightGetter = params.heightGetter;
        this.topOffset = params.topOffset || this.topOffset;
        this.bottomOffset = params.bottomOffset || this.bottomOffset;
        this.render({
            css: Object.assign(Object.assign({}, css$1$1), { className: params.className || '' }),
        });
        this.renderViewportItems();
        this.frameHandler = this.renderViewportItems;
        this.registerFrameHandler();
    }
    set length(value) {
        this.lengthValue = value;
        this.updateHeight();
        this.renderViewportItems();
    }
    get length() {
        return this.lengthValue;
    }
    static checkFullViewportItem(params) {
        const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;
        return viewportStart <= itemOffsetStart && viewportEnd >= itemOffsetEnd;
    }
    static checkViewportItem(params) {
        const { viewportStart, viewportEnd, itemOffsetStart, itemOffsetEnd } = params;
        return (viewportStart <= itemOffsetStart && viewportEnd >= itemOffsetEnd)
            || (viewportStart > itemOffsetStart && viewportStart < itemOffsetEnd)
            || (viewportEnd > itemOffsetStart && viewportEnd < itemOffsetEnd);
    }
    scrollBottom() {
        if (!isUndefined$1(this.scrollTimeout))
            clearTimeout(this.scrollTimeout);
        const root = this.getRef('root');
        if (!root)
            return;
        this.scrollTimeout = setTimeout(() => {
            root.scrollTop = root.scrollHeight - root.offsetHeight;
        }, 0);
    }
    destroy() {
        if (!isUndefined$1(this.scrollTimeout))
            clearTimeout(this.scrollTimeout);
        super.destroy();
    }
    getGeneralItemsContainer() {
        return this.getRef('generalList');
    }
    getVirtualItemsContainer() {
        return this.getRef('itemsContainer');
    }
    render(params) {
        super.render(params);
        this.updateHeight();
    }
    updateViewport() {
        this.removeAllItems();
        this.updateHeight();
        this.renderItems();
    }
    clearCache() {
        this.itemsCache = {};
    }
    updateHeight() {
        const { length, heightGetter } = this;
        const virtualizedList = this.getRef('virtualizedList');
        let height = 0;
        for (let i = 0; i < length; i += 1) {
            height += heightGetter(i);
        }
        if (this.height !== height)
            virtualizedList.style.height = `${height}px`;
        this.height = height;
    }
    renderItems() {
        const { viewportItems, offset, renderedItems } = this;
        const itemsContainer = this.getRef('itemsContainer');
        const rerenderRequired = itemsContainer
            && (viewportItems.length !== renderedItems.length
                || renderedItems.some((index, i) => index !== viewportItems[i]));
        if (rerenderRequired) {
            if (!viewportItems.length)
                this.removeAllItems();
            this.removeStartItems();
            this.removeEndItems();
            viewportItems.forEach((index) => {
                this.renderItem(index);
            });
            itemsContainer.style.top = `${Math.round(offset)}px`;
        }
    }
    renderItem(index) {
        const { itemsCache, renderedItems, itemGetter } = this;
        let beforeRenderArrayIndex = -1;
        const beforeIndex = renderedItems.find((checkIndex, i) => {
            if (checkIndex > index) {
                beforeRenderArrayIndex = i;
                return true;
            }
            return false;
        });
        const container = this.getRef('itemsContainer');
        if (!container)
            return;
        if (isUndefined$1(beforeIndex)) {
            if (itemsCache[index]) {
                itemsCache[index].show();
                return renderedItems.includes(index) ? null : renderedItems.push(index);
            }
            const item = itemGetter(index, { container });
            if (item)
                itemsCache[index] = item;
            if (!renderedItems.includes(index))
                renderedItems.push(index);
        }
        else {
            const beforeCacheItem = itemsCache[beforeIndex];
            const renderCacheItem = itemsCache[index];
            if (!beforeCacheItem)
                return;
            if (renderCacheItem) {
                renderCacheItem.show(false, beforeCacheItem);
                return renderedItems.includes(index)
                    ? null
                    : renderedItems.splice(beforeRenderArrayIndex, 0, index);
            }
            const item = itemGetter(index, { container, append: false, ref: beforeCacheItem });
            if (item)
                itemsCache[index] = item;
            if (!renderedItems.includes(index))
                renderedItems.splice(beforeRenderArrayIndex, 0, index);
        }
    }
    removeStartItems() {
        const { viewportItems, renderedItems } = this;
        if (viewportItems.length) {
            const firstItem = viewportItems[0];
            let removeCount = 0;
            renderedItems.some((itemIndex) => {
                if (itemIndex >= firstItem)
                    return true;
                removeCount += 1;
                this.removeItem(itemIndex);
            });
            renderedItems.splice(0, removeCount);
        }
    }
    removeEndItems() {
        const { viewportItems, renderedItems } = this;
        if (viewportItems.length) {
            let removeCount = 0;
            const lastItem = last$1(viewportItems);
            renderedItems.reverse().some((itemIndex) => {
                if (itemIndex <= lastItem)
                    return true;
                removeCount += 1;
                this.removeItem(itemIndex);
            });
            renderedItems.splice(0, removeCount);
            renderedItems.reverse();
        }
    }
    removeAllItems() {
        const { renderedItems } = this;
        renderedItems.forEach((itemIndex) => this.removeItem(itemIndex));
        this.renderedItems = [];
    }
    removeItem(index) {
        const { itemsCache } = this;
        if (itemsCache[index])
            itemsCache[index].hide();
    }
    restoreScrollTop() {
        const { index, height, width } = this.restoreParams;
        if (index >= 0 && height >= 0 && width >= 0)
            this.updateScrollTop();
    }
    updateScrollTop() {
        const { length, heightGetter } = this;
        const { width, index, bottomOffset } = this.restoreParams;
        const root = this.getRef('root');
        if (!root || width === root.offsetWidth)
            return;
        const { offsetHeight } = root;
        let itemOffset = 0;
        let height = 0;
        for (let i = 0; i < length; i += 1) {
            if (i === index) {
                height = heightGetter(i);
                break;
            }
            else {
                itemOffset += heightGetter(i);
            }
        }
        root.scrollTop = Math.max(0, itemOffset + height + bottomOffset - offsetHeight);
    }
    updateRestoreParams(lastItemIndex, lastItemOffset, lastItemHeight) {
        const root = this.getRef('root');
        if (!root)
            return;
        const { offsetHeight, offsetWidth, scrollTop } = root;
        this.restoreParams = {
            index: lastItemIndex,
            width: offsetWidth,
            height: offsetHeight,
            bottomOffset: scrollTop + offsetHeight - lastItemOffset - lastItemHeight,
        };
    }
}

const getKeyCode = (e) => e ? e.which || e.keyCode : null;

const getStartIntersectionString = (main, target) => {
    if (target.indexOf(main) === 0)
        return { str: main, isFull: true };
    if (main[0] !== target[0])
        return { str: '', isFull: false };
    let startIntersectionString = main[0];
    for (let i = 1, ln = main.length; i < ln; i += 1) {
        const character = main[i];
        if (character === target[i]) {
            startIntersectionString += character;
        }
        else {
            break;
        }
    }
    return { str: startIntersectionString, isFull: false };
};
const escapeString = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const ENTER_CODE = 13;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;
const UP_CODE = 38;
const DOWN_CODE = 40;
const K_CODE = 75;

const DEFAULT_DELIMITER = '~';
const NON_BREAKING_SPACE = '&nbsp;';

const getScrollbarSize = (container) => {
    let { size } = getScrollbarSize;
    if (size)
        return size;
    const target = container || document.body;
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    div1.style.width = '100px';
    div1.style.height = '100px';
    div1.style.overflow = 'scroll';
    div2.style.height = '100px';
    target.appendChild(div1);
    div1.appendChild(div2);
    size = div1.offsetWidth - div2.offsetWidth;
    target.removeChild(div1);
    getScrollbarSize.size = size;
    return size;
};
const getItemSize = (() => {
    const cache = new Map();
    const addElement = (target) => {
        const cacheTextContainer = cache.get(target);
        if (cacheTextContainer)
            return cacheTextContainer;
        const textContainer = document.createElement('span');
        textContainer.innerHTML = NON_BREAKING_SPACE;
        textContainer.style.position = 'absolute';
        textContainer.style.left = '0';
        textContainer.style.top = '0';
        textContainer.style.visibility = 'hidden';
        textContainer.style.pointerEvents = 'none';
        textContainer.style.userSelect = 'none';
        target.appendChild(textContainer);
        return textContainer;
    };
    return (container, save = false) => {
        const target = container || document.body;
        const textContainer = addElement(target);
        const size = { width: textContainer.offsetWidth, height: textContainer.offsetHeight };
        if (container && save) {
            if (!cache.has(target))
                cache.set(target, textContainer);
            return size;
        }
        cache.delete(target);
        target.removeChild(textContainer);
        return size;
    };
})();
const compareItemSize = (first, second) => {
    return first.width === second.width && first.height === second.height;
};

var css$2 = {"root":"root-term-️src-Term-Line-index","visible":"visible-term-️src-Term-Line-index","content":"content-term-️src-Term-Line-index","helpContainer":"helpContainer-term-️src-Term-Line-index","inputContainer":"inputContainer-term-️src-Term-Line-index"};

var lineTemplate = "<div ref=\"root\" class=\"root visible {className}\">\n  <div ref=\"content\" class=\"content\">\n    <div ref=\"helpContainer\" class=\"labelText helpContainer\">{nbs}</div>\n    <div ref=\"labelContainer\"></div>\n    <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  </div>\n</div>\n";

class BaseCaret extends TemplateEngine {
    constructor() {
        super(...arguments);
        this.value = '';
        this.prevLock = false;
        this.lockField = false;
        this.prevBusy = false;
        this.busyField = false;
        this.prevHidden = false;
        this.hiddenField = false;
        this.left = 0;
        this.prevLeft = 0;
        this.top = 0;
        this.prevTop = 0;
    }
    get lock() {
        return this.lockField;
    }
    set lock(value) {
        this.lockField = value;
        this.updateStyles();
    }
    get busy() {
        return this.busyField;
    }
    set busy(value) {
        this.busyField = value;
        this.updateStyles();
    }
    get hidden() {
        return this.hiddenField;
    }
    set hidden(value) {
        this.hiddenField = value;
        this.updateStyles();
    }
    setPosition(left, top) {
        this.left = left;
        this.top = top;
        this.updateStyles();
    }
    updateStyles() {
        const { lock, busy, hidden, left, prevLeft, top, prevTop } = this;
        const root = this.getRef('root');
        if (!root)
            return;
        if (left !== prevLeft)
            root.style.left = `${left}px`;
        if (top !== prevTop)
            root.style.top = `${top}px`;
        this.updateLockStyles();
        this.updateBusyStyles();
        this.updateHiddenStyles();
        this.prevLeft = left;
        this.prevTop = top;
        this.prevLock = lock;
        this.prevBusy = busy;
        this.prevHidden = hidden;
    }
}

var SimpleCaretTemplate = "<span ref=\"root\" class=\"root\">\n  <span ref=\"character\" class=\"character\"></span>\n</span>\n";

var css$3 = {"root":"root-term-️src-Term-SimpleCaret-index","carriage-return-blink":"carriage-return-blink-term-️src-Term-SimpleCaret-index","lock":"lock-term-️src-Term-SimpleCaret-index","busy":"busy-term-️src-Term-SimpleCaret-index","none":"none-term-️src-Term-SimpleCaret-index","carriage-return-busy":"carriage-return-busy-term-️src-Term-SimpleCaret-index","hidden":"hidden-term-️src-Term-SimpleCaret-index"};

class SimpleCaret extends BaseCaret {
    constructor(container) {
        super(SimpleCaretTemplate, container);
        this.render({ css: css$3 });
    }
    updateLockStyles() {
        const root = this.getRef('root');
        const { lock, prevLock } = this;
        if (!root || lock === prevLock)
            return;
        return lock ? root.classList.add(css$3.lock) : root.classList.remove(css$3.lock);
    }
    updateBusyStyles() {
        const root = this.getRef('root');
        const { busy, prevBusy } = this;
        if (!root || busy === prevBusy)
            return;
        return busy ? root.classList.add(css$3.busy) : root.classList.remove(css$3.busy);
    }
    updateHiddenStyles() {
        const root = this.getRef('root');
        const { hidden, prevHidden } = this;
        if (!root || hidden === prevHidden)
            return;
        return hidden ? root.classList.add(css$3.hidden) : root.classList.remove(css$3.hidden);
    }
    setValue(value) {
        const character = this.getRef('character');
        if (character && this.value !== value) {
            this.value = value;
            character.innerHTML = value;
        }
    }
}

class CaretFactory {
    constructor() { }
    static registerCaret(name, caret) {
        CaretFactory.caretMap[name] = caret;
    }
    static getInstance() {
        if (!CaretFactory.instance)
            CaretFactory.instance = new CaretFactory();
        return CaretFactory.instance;
    }
    create(name, container) {
        return CaretFactory.caretMap[name]
            ? new CaretFactory.caretMap[name](container) : null;
    }
}
CaretFactory.caretMap = {
    simple: SimpleCaret,
};

const LOCK_TIMEOUT = 600;

var template$3 = "<div ref=\"root\" class=\"root\">\n  <div ref=\"input\" class=\"input\" contenteditable=\"true\"></div>\n  <div ref=\"hidden\" class=\"hidden\"></div>\n</div>\n";

var css$4 = {"root":"root-term-️src-Term-Line-Input-ContentEditableInput-index","input":"input-term-️src-Term-Line-Input-ContentEditableInput-index","hiddenCaret":"hiddenCaret-term-️src-Term-Line-Input-ContentEditableInput-index","hidden":"hidden-term-️src-Term-Line-Input-ContentEditableInput-index"};

var css$5 = {"secret":"secret-term-️src-Term-Line-Input-BaseInput-index"};

/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */
/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;
/**
 * Module exports.
 * @public
 */

var escapeHtml_1 = escapeHtml;
/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        // "
        escape = '&quot;';
        break;

      case 38:
        // &
        escape = '&amp;';
        break;

      case 39:
        // '
        escape = '&#39;';
        break;

      case 60:
        // <
        escape = '&lt;';
        break;

      case 62:
        // >
        escape = '&gt;';
        break;

      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

const DATA_INDEX_ATTRIBUTE_NAME = 'data-index';
const SECRET_CHARACTER = '•';

class BaseInput extends TemplateEngine {
    constructor(template, container, cssData) {
        super(template, container);
        this.characterWidth = 8;
        this.characterHeight = 16;
        this.valueField = '';
        this.isCaretHidden = false;
        this.secretField = false;
        this.mouseDownHandler = (e) => {
            const valueFieldItem = this.getEventFormattedValueFragment(e);
            if (valueFieldItem && valueFieldItem.clickHandler && valueFieldItem.lock) {
                e.preventDefault();
            }
        };
        this.clickHandler = (e) => {
            const valueFieldItem = this.getEventFormattedValueFragment(e);
            if (valueFieldItem && valueFieldItem.clickHandler) {
                valueFieldItem.clickHandler(e, valueFieldItem.id);
            }
        };
        this.render({ css: cssData });
        this.setCharacterContainer();
        this.addHandlers();
    }
    static getValueString(value, params = {}) {
        const { secret = false } = params;
        return isString(value)
            ? secret ? BaseInput.convertSecret(value) : value
            : value.reduce((acc, item) => {
                const str = isString(item) ? item : item.str;
                const val = secret && (isString(item) || !item.lock)
                    ? BaseInput.convertSecret(str) : str;
                return `${acc}${val}`;
            }, '');
    }
    static getFragmentTemplate(str, params) {
        const { className = '', secret = false, index } = params;
        const composedClassName = [secret ? css$5.secret : '', className].join(' ');
        const processedString = BaseInput.getNormalizedTemplateString(secret
            ? BaseInput.convertSecret(str) : str);
        return `<span
      ${DATA_INDEX_ATTRIBUTE_NAME}="${index}"
      ref="fragment-${index}"
      class="${composedClassName}">${processedString}</span>`;
    }
    static getNormalizedTemplateString(str) {
        return escapeHtml_1(str).replace(/\s/g, NON_BREAKING_SPACE);
    }
    static getValueFragmentTemplate(valueFragment, index, params = {}) {
        const { secret } = params;
        if (isString(valueFragment)) {
            return BaseInput.getFragmentTemplate(valueFragment, { index, secret });
        }
        const { str, className = '', lock } = valueFragment;
        const isSecret = !lock && secret;
        return BaseInput.getFragmentTemplate(str, { className, index, secret: isSecret });
    }
    static getValueTemplate(value, params = {}) {
        if (isString(value))
            return BaseInput.getNormalizedTemplateString(value);
        return value.reduce((acc, item, index) => {
            return `${acc}${BaseInput.getValueFragmentTemplate(item, index, params)}`;
        }, '');
    }
    static getUpdatedValueField(value, prevValue) {
        if (isString(prevValue))
            return value;
        let checkValue = value;
        let stop = false;
        const updatedValueField = prevValue.reduce((acc, item) => {
            const isStringItem = isString(item);
            const itemStr = (isStringItem ? item : item.str);
            const { str, isFull } = getStartIntersectionString(itemStr, checkValue);
            if (str && !stop) {
                acc.push(isStringItem ? str : Object.assign(Object.assign({}, item), { str }));
                checkValue = checkValue.substring(str.length);
                stop = !isFull;
            }
            return acc;
        }, []);
        checkValue.split('').forEach(char => updatedValueField.push(char));
        return updatedValueField.filter(item => isString(item) ? item : item.str);
    }
    static getLockString(value) {
        if (isString(value))
            return '';
        let str = '';
        let lockStr = '';
        value.forEach((item) => {
            if (isString(item)) {
                str += item;
            }
            else {
                str += item.str;
                if (item.lock)
                    lockStr = str;
            }
        });
        return lockStr;
    }
    static convertSecret(str) {
        return (new Array(str.length)).fill(SECRET_CHARACTER).join('');
    }
    get characterSize() {
        const { characterContainer } = this;
        return characterContainer
            ? { width: characterContainer.offsetWidth, height: characterContainer.offsetHeight }
            : { width: this.characterWidth, height: this.characterHeight };
    }
    get caretPosition() {
        return -1;
    }
    get selectedRange() {
        return { from: 0, to: 0 };
    }
    get disabled() {
        return true;
    }
    get value() {
        return this.valueField;
    }
    set value(val) {
        this.valueField = val;
    }
    get lockString() {
        const { valueField } = this;
        return BaseInput.getLockString(valueField);
    }
    get hiddenCaret() {
        return this.isCaretHidden;
    }
    set hiddenCaret(isCaretHidden) {
        this.isCaretHidden = isCaretHidden;
    }
    get secret() {
        return this.secretField;
    }
    set secret(secret) {
        this.secretField = secret;
    }
    get isFocused() {
        const { activeElement } = document;
        const root = this.getRef('input');
        return activeElement === root
            || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.parentNode) === root
            || (activeElement === null || activeElement === void 0 ? void 0 : activeElement.parentNode) === root;
    }
    addHandlers() {
        const root = this.getRootElement();
        if (root) {
            root.addEventListener('click', this.clickHandler);
            root.addEventListener('mousedown', this.mouseDownHandler);
        }
    }
    removeHandlers() {
        const root = this.getRootElement();
        if (root) {
            root.removeEventListener('click', this.clickHandler);
            root.removeEventListener('mousedown', this.mouseDownHandler);
        }
    }
    getValueItemString(index) {
        const { valueField } = this;
        if (isString(valueField))
            return index ? '' : valueField;
        const item = valueField[index];
        if (!item)
            return '';
        return isString(item) ? item : item.str;
    }
    getSimpleValue(showSecret = true) {
        const { secretField } = this;
        return BaseInput.getValueString(this.valueField, { secret: secretField && !showSecret });
    }
    // tslint:disable-next-line:no-empty
    moveCaretToEnd(isForce = false) { }
    addEventListener(type, listener, options) {
        const root = this.getRef('input');
        if (root)
            root.addEventListener(type, listener, options);
    }
    removeEventListener(type, listener, options) {
        const root = this.getRef('input');
        if (root)
            root.removeEventListener(type, listener, options);
    }
    focus() {
        const root = this.getRef('input');
        if (root)
            root.focus();
    }
    blur() {
        const root = this.getRef('input');
        if (root)
            root.blur();
    }
    destroy() {
        this.removeHandlers();
        super.destroy();
    }
    getCaretOffset() {
        const { caretPosition, characterSize } = this;
        const rowCharactersCount = this.getRowCharactersCount();
        if (!rowCharactersCount)
            return { left: 0, top: 0 };
        const row = Math.floor(caretPosition / rowCharactersCount);
        const relativePosition = caretPosition - row * rowCharactersCount;
        return {
            left: relativePosition * characterSize.width,
            top: row * characterSize.height,
        };
    }
    getEndOffset() {
        const { characterSize, valueField } = this;
        const rowCharactersCount = this.getRowCharactersCount();
        if (!rowCharactersCount)
            return { left: 0, top: 0 };
        const charactersCount = BaseInput.getValueString(valueField).length;
        const row = Math.floor(charactersCount / rowCharactersCount);
        const relativePosition = charactersCount - row * rowCharactersCount;
        return {
            left: relativePosition * characterSize.width,
            top: row * characterSize.height,
        };
    }
    getRowCharactersCount() {
        const { characterSize } = this;
        const root = this.getRef('input');
        return root ? Math.floor(root.offsetWidth / characterSize.width) : 0;
    }
    getEventFormattedValueFragment(e) {
        const target = e.target;
        if (!target)
            return null;
        return this.getElementFormattedValueFragment(target);
    }
    getElementFormattedValueFragment(element) {
        const { valueField } = this;
        if (isString(valueField))
            return null;
        const dataIndex = element.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
        const valueFieldItem = dataIndex ? valueField[Number(dataIndex)] : null;
        return !valueFieldItem || isString(valueFieldItem)
            ? null : valueFieldItem;
    }
    setCharacterContainer() {
        const root = this.getRef('root');
        if (root) {
            const characterContainer = document.createElement('span');
            characterContainer.style.position = 'absolute';
            characterContainer.style.visibility = 'hidden';
            characterContainer.style.pointerEvents = 'none';
            characterContainer.style.left = '0';
            characterContainer.style.top = '0';
            characterContainer.innerHTML = NON_BREAKING_SPACE;
            root.appendChild(characterContainer);
            this.characterContainer = characterContainer;
        }
    }
}

const NON_BREAKING_SPACE_PATTERN = /&nbsp;/g;

const TEXT_NODE_TYPE = 3;
const CHANGE_EVENT_TYPE = 'change';

class ContentEditableInput extends BaseInput {
    constructor(container) {
        super(template$3, container, css$4);
        this.externalChangeListeners = [];
        this.isDisabled = false;
        this.changeHandler = (e) => {
            this.updateValueField();
            this.externalChangeListeners.forEach(handler => handler.call(e.target, e));
        };
        this.addEventListener('input', this.changeHandler);
        this.addEventListener('cut', this.changeHandler);
        this.addEventListener('paste', this.changeHandler);
    }
    static getStyledValueTemplate(val, params = {}) {
        return BaseInput.getValueTemplate(val, params);
    }
    static getLastTextNode(root) {
        const { lastChild } = root;
        if (!lastChild)
            return null;
        if (lastChild.nodeType === TEXT_NODE_TYPE)
            return lastChild;
        return ContentEditableInput.getLastTextNode(lastChild);
    }
    static checkChildNode(root, checkNode) {
        if (root === checkNode)
            return true;
        const { parentNode } = checkNode;
        return parentNode ? ContentEditableInput.checkChildNode(root, parentNode) : false;
    }
    static getHtmlStringifyValue(html) {
        return html.replace(NON_BREAKING_SPACE_PATTERN, ' ');
    }
    static getNodeOffset(root, target, baseOffset = 0) {
        const { parentNode } = target;
        if (!parentNode || root === target)
            return 0;
        let isFound = false;
        const prevNodes = Array.prototype.filter.call(parentNode.childNodes, (childNode) => {
            const isTarget = childNode === target;
            if (isTarget && !isFound)
                isFound = true;
            return !isTarget && !isFound;
        });
        const offset = prevNodes.reduce((acc, node) => {
            const value = node.nodeType === TEXT_NODE_TYPE
                ? node.nodeValue
                : ContentEditableInput.getHtmlStringifyValue(node.innerHTML);
            return acc + (value ? value.length : 0);
        }, 0);
        return root === parentNode
            ? baseOffset + offset
            : ContentEditableInput.getNodeOffset(root, parentNode, baseOffset + offset);
    }
    set hiddenCaret(isCaretHidden) {
        if (this.isCaretHidden === isCaretHidden)
            return;
        const root = this.getRef('input');
        if (isCaretHidden) {
            root.classList.add(css$4.hiddenCaret);
        }
        else {
            root.classList.remove(css$4.hiddenCaret);
        }
        this.isCaretHidden = isCaretHidden;
    }
    set value(val) {
        this.valueField = val;
        this.updateContent();
    }
    get value() {
        return this.valueField;
    }
    set secret(secret) {
        this.secretField = secret;
        this.updateContent();
    }
    get caretPosition() {
        const root = this.getRef('input');
        const selection = window.getSelection();
        if (!selection || !selection.isCollapsed || !selection.anchorNode)
            return -1;
        const { anchorNode } = selection;
        if (!ContentEditableInput.checkChildNode(root, selection.anchorNode))
            return -1;
        return ContentEditableInput.getNodeOffset(root, anchorNode, anchorNode.nodeType === TEXT_NODE_TYPE ? selection.anchorOffset : 0);
    }
    set caretPosition(position) {
        if (position < 0)
            return;
        const root = this.getRef('input');
        let offset = 0;
        let relativeOffset = 0;
        const targetNode = Array.prototype.find.call(root.childNodes, (childNode) => {
            const length = ((childNode.nodeType === TEXT_NODE_TYPE
                ? childNode.nodeValue
                : ContentEditableInput.getHtmlStringifyValue(childNode.innerHTML)) || '')
                .length;
            relativeOffset = offset;
            offset += length;
            return position <= offset;
        });
        const selection = window.getSelection();
        if (!selection || !targetNode)
            return;
        const range = new Range();
        const targetChildNode = targetNode.nodeType === TEXT_NODE_TYPE
            ? targetNode : targetNode.firstChild;
        range.setStart(targetChildNode, position - relativeOffset);
        range.setEnd(targetChildNode, position - relativeOffset);
        selection.removeAllRanges();
        selection.addRange(range);
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(value) {
        this.isDisabled = value;
    }
    moveCaretToEnd(isForce = false) {
        const root = this.getRef('input');
        if (isForce)
            this.focus();
        if (!root || !this.isFocused)
            return;
        const range = document.createRange();
        const selection = window.getSelection();
        const node = ContentEditableInput.getLastTextNode(root);
        if (!node)
            return;
        range.selectNodeContents(node);
        range.collapse(false);
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
    addEventListener(type, listener, options) {
        if (type === CHANGE_EVENT_TYPE) {
            this.externalChangeListeners.push(listener);
        }
        else {
            super.addEventListener(type, listener, options);
        }
    }
    removeEventListener(type, listener, options) {
        if (type === CHANGE_EVENT_TYPE) {
            this.externalChangeListeners = this.externalChangeListeners.filter((item) => item !== listener);
        }
        else {
            super.removeEventListener(type, listener, options);
        }
    }
    destroy() {
        super.destroy();
        this.removeEventListener('input', this.changeHandler);
        this.removeEventListener('cut', this.changeHandler);
        this.removeEventListener('paste', this.changeHandler);
    }
    getRootElement() {
        return this.getRef('input');
    }
    getInputValue() {
        const root = this.getRef('input');
        const data = unescape(root.innerHTML);
        const items = data.replace(/<\/span>[^<]*</g, '</span><').split('</span>').filter(identity);
        return items.reduce((acc, item) => {
            var _a;
            const index = (((_a = item.match(/data-index="[0-9]+"/)) === null || _a === void 0 ? void 0 : _a[0]) || '').replace(/[^0-9]/g, '');
            if (index) {
                const prevValue = this.getValueItemString(Number(index));
                const updatedValue = ContentEditableInput.getHtmlStringifyValue(item)
                    .replace(new RegExp(`${SECRET_CHARACTER}+`), prevValue);
                return `${acc}${updatedValue}`;
            }
            return `${acc}${ContentEditableInput.getHtmlStringifyValue(item)}`;
        }, '');
    }
    updateValueField() {
        if (this.preventLockUpdate())
            return;
        const { caretPosition, isDisabled } = this;
        let updatedCaretPosition = caretPosition;
        if (isDisabled) {
            updatedCaretPosition = Math.min(caretPosition, BaseInput.getValueString(this.valueField).length);
        }
        else {
            const inputValue = this.getInputValue();
            this.valueField = BaseInput.getUpdatedValueField(inputValue, this.valueField);
        }
        this.updateContent();
        this.caretPosition = updatedCaretPosition;
    }
    preventLockUpdate() {
        const { valueField } = this;
        if (isString(valueField))
            return false;
        const value = this.getInputValue();
        const lockStr = BaseInput.getLockString(valueField);
        const deleteUnlockPart = lockStr
            && lockStr.indexOf(value) === 0
            && lockStr.length > value.length;
        if (deleteUnlockPart) {
            const lastLockIndex = this.valueField
                .reduce((acc, item, index) => {
                return !isString(item) && item.lock ? index : acc;
            }, -1);
            this.valueField = this.valueField
                .filter((_, index) => index <= lastLockIndex);
        }
        if ((lockStr && value.indexOf(lockStr) !== 0) || deleteUnlockPart) {
            this.updateContent();
            this.moveCaretToEnd();
            return true;
        }
        return false;
    }
    updateContent() {
        this.setString();
        this.updateStyles();
    }
    setString() {
        const { secretField } = this;
        const input = this.getRef('input');
        const hidden = this.getRef('hidden');
        if (input && hidden) {
            const str = ContentEditableInput.getStyledValueTemplate(this.valueField, {
                secret: secretField,
            });
            input.innerHTML = str;
            hidden.innerHTML = str;
        }
    }
    updateStyles() {
        const input = this.getRef('input');
        const hidden = this.getRef('hidden');
        if (input && hidden) {
            Array.prototype.forEach.call(hidden.childNodes, (childNode, index) => {
                if (childNode.nodeType !== TEXT_NODE_TYPE) {
                    const { color } = window.getComputedStyle(childNode);
                    if (color)
                        input.childNodes[index].style.textShadow = `0 0 0 ${color}`;
                }
            });
        }
    }
}

var template$4 = "<div ref=\"root\">\n  <div ref=\"input\" class=\"root\">{value}</div>\n</div>\n";

var css$6 = {"root":"root-term-️src-Term-Line-Input-ViewableInput-index"};

class ViewableInput extends BaseInput {
    set value(val) {
        this.valueField = val;
        const root = this.getRef('input');
        if (root)
            root.innerHTML = BaseInput.getValueTemplate(this.valueField);
    }
    constructor(container) {
        super(template$4, container, css$6);
    }
    render() {
        super.render({ css: css$6, value: BaseInput.getValueTemplate(this.valueField) });
    }
    getRootElement() {
        return this.getRef('input');
    }
}

var css$7 = {"label":"label-term-️src-Term-Line-Label-index","labelTextContainer":"labelTextContainer-term-️src-Term-Line-Label-index","labelText":"labelText-term-️src-Term-Line-Label-index"};

var template$5 = "<if condition=\"{label || delimiter}\">\n  <div class=\"label\">\n    <if condition=\"{label}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"label\">{label}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n    <if condition=\"{delimiter}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"delimiter\">{delimiter}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n  </div>\n</if>\n\n";

class Label extends TemplateEngine {
    constructor(container, params = {}) {
        super(template$5, container);
        this.label = '';
        this.delimiter = '';
        this.reRender = false;
        this.label = params.label || '';
        this.delimiter = params.delimiter || '';
        this.render();
    }
    set params(params) {
        this.label = params.label || this.label;
        this.delimiter = params.delimiter || this.delimiter;
        this.render();
    }
    get params() {
        const { label, delimiter } = this;
        return { label, delimiter };
    }
    render() {
        const { label, delimiter } = this;
        super.render({
            css: css$7, label, delimiter, nbs: NON_BREAKING_SPACE,
        }, this.reRender ? { replace: this } : {});
        this.reRender = true;
    }
}

class Line extends TemplateEngine {
    constructor(container, params = {}) {
        super(lineTemplate, container);
        this.isVisible = true;
        this.heightField = 0;
        this.secretField = false;
        this.initialValue = '';
        this.className = '';
        this.editable = false;
        this.onSubmit = noop$1;
        this.onChange = noop$1;
        this.onUpdateCaretPosition = noop$1;
        this.caretPosition = -1;
        this.updateHeight = () => {
            const root = this.getRef('root');
            if (!root)
                return;
            this.heightField = root.offsetHeight;
        };
        this.keyDownHandler = (e) => {
            ({
                [ENTER_CODE]: this.submitHandler,
                [LEFT_CODE]: this.lockCaret,
                [RIGHT_CODE]: this.lockCaret,
                [UP_CODE]: this.lockCaret,
                [DOWN_CODE]: this.lockCaret,
            }[Number(getKeyCode(e))] || noop$1)(e);
        };
        this.submitHandler = (e) => {
            const { onSubmit, inputField, secret } = this;
            const value = (inputField === null || inputField === void 0 ? void 0 : inputField.value) || '';
            let formattedValue = '';
            if (isString(value)) {
                formattedValue = secret ? '' : value;
            }
            else if (isArray$1(value)) {
                formattedValue = secret ? value.filter(item => get$1(item, 'lock')) : value;
            }
            e === null || e === void 0 ? void 0 : e.preventDefault();
            if (inputField && onSubmit) {
                onSubmit({
                    formattedValue,
                    value: inputField.getSimpleValue(),
                    lockString: inputField.lockString,
                });
            }
        };
        this.changeHandler = () => {
            const { inputField } = this;
            if (inputField) {
                this.updateInputSize();
                this.lockCaret();
                this.onChange(inputField.getSimpleValue());
            }
        };
        this.updateInputSize = () => {
            const { width } = this.characterSize;
            const inputContainer = this.getRef('inputContainer');
            const input = this.getRef('input');
            const { offsetWidth } = inputContainer;
            if (!input)
                return this.updateRowsCount(2);
            const value = this.editable ? input.value : input.innerHTML;
            if (!width || !value || !offsetWidth)
                return this.updateRowsCount(2);
            const rowLength = Math.floor(offsetWidth / width);
            this.updateRowsCount(Math.ceil(value.length / rowLength) + 1);
        };
        this.updateCaretData = () => {
            const { editable, caret, inputField, onUpdateCaretPosition, caretPosition: caretPositionPrev, } = this;
            if (!editable || !inputField || !caret) {
                if (caretPositionPrev !== -1) {
                    this.caretPosition = -1;
                    onUpdateCaretPosition(this.caretPosition, this.caret);
                }
                return;
            }
            const { caretPosition } = inputField;
            if (inputField.isFocused && caretPosition >= 0) {
                this.showCaret(caretPosition);
            }
            else {
                this.hideCaret();
            }
            if (caretPositionPrev !== caretPosition) {
                this.caretPosition = caretPosition;
                onUpdateCaretPosition(this.caretPosition, this.caret);
            }
        };
        this.lockCaret = () => {
            const { caret, lockTimeout } = this;
            if (lockTimeout)
                clearTimeout(lockTimeout);
            if (!caret)
                return;
            caret.lock = true;
            this.lockTimeout = setTimeout(() => caret.lock = false, LOCK_TIMEOUT);
        };
        this.setParams(params);
        this.container = container;
        this.render({ label: params.label, delimiter: params.delimiter });
        this.setCaret(params.caret || 'simple');
        this.addEventListeners();
        this.updateHeight();
        this.frameHandler = this.updateCaretData;
        this.setupEditing();
    }
    static getHeight(params) {
        const { delimiter, label, value, width, itemSize } = params;
        const { width: itemWidth, height: itemHeight } = itemSize;
        const valueString = BaseInput.getValueString(value);
        const labelLength = (delimiter ? delimiter.length + 1 : 0)
            + (label ? label.length + 1 : 0);
        const rowItemsCount = Math
            .floor((width - Line.itemHorizontalPadding - labelLength * itemWidth) / itemWidth);
        return Math.ceil((valueString.length || 1) / rowItemsCount) * itemHeight
            + 2 * Line.itemVerticalPadding;
    }
    get value() {
        const { inputField } = this;
        return inputField ? inputField.value : '';
    }
    set value(val) {
        const { inputField } = this;
        if (inputField) {
            inputField.value = val;
            inputField.moveCaretToEnd();
        }
    }
    get disabled() {
        const { input, editable } = this;
        return editable && input ? input.disabled : true;
    }
    set disabled(value) {
        const { input, editable } = this;
        if (input && editable)
            input.disabled = value;
    }
    get visible() {
        return this.isVisible;
    }
    set visible(value) {
        const root = this.getRef('root');
        if (this.isVisible === value || !root)
            return;
        this.isVisible = value;
        if (value) {
            root.classList.add(css$2.visible);
        }
        else {
            root.classList.remove(css$2.visible);
        }
    }
    get hidden() {
        return this.isHidden;
    }
    get height() {
        return this.heightField;
    }
    get characterSize() {
        const { offsetWidth, offsetHeight } = this.getRef('helpContainer');
        return { width: offsetWidth, height: offsetHeight };
    }
    get input() {
        return this.inputField;
    }
    get secret() {
        return this.secretField;
    }
    set secret(secret) {
        const { inputField } = this;
        this.secretField = secret;
        if (inputField)
            inputField.secret = secret;
    }
    get caretOffset() {
        const { input } = this;
        return this.getInputRootOffset(input ? input.getCaretOffset() : { left: 0, top: 0 });
    }
    get endOffset() {
        const { input } = this;
        return this.getInputRootOffset(input ? input.getEndOffset() : { left: 0, top: 0 });
    }
    get labelWidth() {
        var _a, _b;
        const { label, characterSize: { width } } = this;
        return label
            ? ((((_a = label.params.label) === null || _a === void 0 ? void 0 : _a.length) || -1) + (((_b = label.params.delimiter) === null || _b === void 0 ? void 0 : _b.length) || -1) + 2) * width
            : 0;
    }
    get contentPadding() {
        const content = this.getRef('content');
        if (!content)
            return { left: 0, top: 0 };
        const styles = window.getComputedStyle(content);
        return {
            left: Number(styles.paddingLeft.replace('px', '')),
            top: Number(styles.paddingTop.replace('px', '')),
        };
    }
    stopEdit() {
        const { label } = this;
        const labelParams = label ? label.params : { label: '', delimiter: '' };
        this.removeCaret();
        this.removeEventListeners();
        this.editable = false;
        this.unregisterFrameHandler();
        this.render(labelParams);
    }
    focus() {
        const { inputField } = this;
        if (!inputField)
            return;
        const { isFocused } = inputField;
        if (!isFocused) {
            inputField.focus();
            inputField.moveCaretToEnd();
        }
    }
    blur() {
        const { inputField } = this;
        if (!inputField)
            return;
        const { isFocused } = inputField;
        if (isFocused)
            inputField.blur();
    }
    submit() {
        this.submitHandler();
    }
    render(params) {
        const { editable, className, secret } = this;
        const reRender = Boolean(this.getRef('root'));
        if (this.inputField) {
            this.initialValue = this.inputField.value;
            this.inputField.destroy();
        }
        if (this.label)
            this.label.destroy();
        super.render({
            css: css$2, editable, className, nbs: NON_BREAKING_SPACE,
        }, reRender ? { replace: this } : {});
        this.inputField = editable
            ? new ContentEditableInput(this.getRef('inputContainer'))
            : new ViewableInput(this.getRef('inputContainer'));
        this.label = new Label(this.getRef('labelContainer'), params);
        this.inputField.value = this.initialValue;
        this.inputField.secret = secret;
    }
    setCaret(name = 'simple') {
        const { inputField, editable } = this;
        this.removeCaret();
        const caret = Line.cf.create(name, this.getRef('inputContainer'));
        if (!inputField)
            return;
        if (caret && editable) {
            inputField.hiddenCaret = true;
        }
        else {
            inputField.hiddenCaret = false;
            return;
        }
        this.caret = caret;
        this.updateCaretData();
    }
    updateViewport() {
        const { isHidden } = this;
        if (isHidden)
            this.show();
        this.updateInputSize();
        if (isHidden)
            this.hide();
    }
    destroy() {
        super.destroy();
        const { lockTimeout } = this;
        if (lockTimeout)
            clearTimeout(lockTimeout);
        this.removeCaret();
        this.removeEventListeners();
    }
    moveCaretToEnd(isForce = false) {
        const { inputField, editable } = this;
        if (inputField && editable)
            inputField.moveCaretToEnd(isForce);
    }
    clear() {
        this.value = '';
    }
    setParams(params) {
        const { onUpdateCaretPosition = noop$1, onChange = noop$1, onSubmit = noop$1, editable = true, className = '', value, secret = false, } = params;
        this.className = className;
        this.onSubmit = onSubmit;
        this.onChange = onChange;
        this.onUpdateCaretPosition = onUpdateCaretPosition;
        this.editable = editable;
        this.secret = secret;
        this.initialValue = value || '';
    }
    addEventListeners() {
        const { editable, inputField } = this;
        if (editable && inputField) {
            inputField.addEventListener('keydown', this.keyDownHandler);
            inputField.addEventListener('change', this.changeHandler);
        }
    }
    removeEventListeners() {
        const { editable, inputField } = this;
        if (editable && inputField) {
            inputField.removeEventListener('keydown', this.keyDownHandler);
            inputField.removeEventListener('change', this.changeHandler);
        }
    }
    setupEditing() {
        if (this.editable && this.inputField) {
            this.registerFrameHandler();
            this.inputField.moveCaretToEnd(true);
        }
    }
    updateRowsCount(count) {
        const input = this.getRef('input');
        if (this.editable && input && Number(input.getAttribute('rows')) !== count) {
            input.setAttribute('rows', String(count));
        }
        this.updateHeight();
    }
    showCaret(caretPosition) {
        const { caret, inputField } = this;
        const { width, height } = this.characterSize;
        const inputContainer = this.getRef('inputContainer');
        if (!caret || !inputContainer || !inputField)
            return;
        const { offsetWidth } = inputContainer;
        const value = inputField.getSimpleValue(false);
        const rowLength = Math.floor(offsetWidth / width);
        const row = Math.floor(caretPosition / rowLength);
        caret.hidden = false;
        const character = value[caretPosition] === ' '
            ? NON_BREAKING_SPACE : value[caretPosition] || NON_BREAKING_SPACE;
        const top = Math.round(height * row);
        const left = Math.round((caretPosition - row * rowLength) * width);
        caret.setPosition(left, top);
        caret.setValue(character);
    }
    hideCaret() {
        const { caret } = this;
        if (!caret)
            return;
        caret.hidden = true;
    }
    removeCaret() {
        const { caret } = this;
        if (!caret)
            return;
        this.caret = undefined;
        caret.destroy();
    }
    getInputRootOffset(offset) {
        const { label, input, labelWidth, contentPadding: { top: pt, left: pl } } = this;
        if (!input && !label)
            return { left: pl, top: pt };
        return input
            ? { left: offset.left + labelWidth + pl, top: offset.top + pt }
            : { left: labelWidth + pl, top: pt };
    }
}
Line.cf = CaretFactory.getInstance();
Line.itemVerticalPadding = 4;
Line.itemHorizontalPadding = 16;

function unwrapExports$1(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$1(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var guid$1 = createCommonjsModule$1(function (module, exports) {
  exports.__esModule = true;

  var Guid =
  /** @class */
  function () {
    function Guid(guid) {
      if (!guid) {
        throw new TypeError("Invalid argument; `value` has no value.");
      }

      this.value = Guid.EMPTY;

      if (guid && Guid.isGuid(guid)) {
        this.value = guid;
      }
    }

    Guid.isGuid = function (guid) {
      var value = guid.toString();
      return guid && (guid instanceof Guid || Guid.validator.test(value));
    };

    Guid.create = function () {
      return new Guid([Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-"));
    };

    Guid.createEmpty = function () {
      return new Guid("emptyguid");
    };

    Guid.parse = function (guid) {
      return new Guid(guid);
    };

    Guid.raw = function () {
      return [Guid.gen(2), Guid.gen(1), Guid.gen(1), Guid.gen(1), Guid.gen(3)].join("-");
    };

    Guid.gen = function (count) {
      var out = "";

      for (var i = 0; i < count; i++) {
        // tslint:disable-next-line:no-bitwise
        out += ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
      }

      return out;
    };

    Guid.prototype.equals = function (other) {
      // Comparing string `value` against provided `guid` will auto-call
      // toString on `guid` for comparison
      return Guid.isGuid(other) && this.value === other.toString();
    };

    Guid.prototype.isEmpty = function () {
      return this.value === Guid.EMPTY;
    };

    Guid.prototype.toString = function () {
      return this.value;
    };

    Guid.prototype.toJSON = function () {
      return {
        value: this.value
      };
    };

    Guid.validator = new RegExp("^[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}$", "i");
    Guid.EMPTY = "00000000-0000-0000-0000-000000000000";
    return Guid;
  }();

  exports.Guid = Guid;
});
unwrapExports$1(guid$1);
var guid_1$1 = guid$1.Guid;
/** Detect free variable `global` from Node.js. */

var freeGlobal$1$1 = typeof global == 'object' && global && global.Object === Object && global;
/** Detect free variable `self`. */

var freeSelf$1$1 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$1$1 = freeGlobal$1$1 || freeSelf$1$1 || Function('return this')();
/** Built-in value references. */

var Symbol$1$1 = root$1$1.Symbol;
/** Used for built-in method references. */

var objectProto$g = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$d = objectProto$g.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$2$1 = objectProto$g.toString;
/** Built-in value references. */

var symToStringTag$2$1 = Symbol$1$1 ? Symbol$1$1.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag$1$1(value) {
  var isOwn = hasOwnProperty$d.call(value, symToStringTag$2$1),
      tag = value[symToStringTag$2$1];

  try {
    value[symToStringTag$2$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$2$1.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$2$1] = tag;
    } else {
      delete value[symToStringTag$2$1];
    }
  }

  return result;
}
/** Used for built-in method references. */


var objectProto$1$1$1 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1$1$1 = objectProto$1$1$1.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString$1$1(value) {
  return nativeObjectToString$1$1$1.call(value);
}
/** `Object#toString` result references. */


var nullTag$1$1 = '[object Null]',
    undefinedTag$1$1 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1$1$1 = Symbol$1$1 ? Symbol$1$1.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag$1$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$1$1 : nullTag$1$1;
  }

  return symToStringTag$1$1$1 && symToStringTag$1$1$1 in Object(value) ? getRawTag$1$1(value) : objectToString$1$1(value);
}
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */


function isObjectLike$1$1(value) {
  return value != null && typeof value == 'object';
}
/** `Object#toString` result references. */


var symbolTag$3 = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */

function isSymbol$1$1(value) {
  return typeof value == 'symbol' || isObjectLike$1$1(value) && baseGetTag$1$1(value) == symbolTag$3;
}
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */


function arrayMap$1$1(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }

  return result;
}
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */


var isArray$1$1 = Array.isArray;
/** Used as references for various `Number` constants. */

var INFINITY$2$1 = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto$2 = Symbol$1$1 ? Symbol$1$1.prototype : undefined,
    symbolToString$1$1 = symbolProto$2 ? symbolProto$2.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString$1$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isArray$1$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$1$1(value, baseToString$1$1) + '';
  }

  if (isSymbol$1$1(value)) {
    return symbolToString$1$1 ? symbolToString$1$1.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$2$1 ? '-0' : result;
}
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */


function isObject$1$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
/** `Object#toString` result references. */


var asyncTag$1$1 = '[object AsyncFunction]',
    funcTag$3 = '[object Function]',
    genTag$2 = '[object GeneratorFunction]',
    proxyTag$1$1 = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction$1$1(value) {
  if (!isObject$1$1(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag$1$1(value);
  return tag == funcTag$3 || tag == genTag$2 || tag == asyncTag$1$1 || tag == proxyTag$1$1;
}
/** Used to detect overreaching core-js shims. */


var coreJsData$1$1 = root$1$1['__core-js_shared__'];
/** Used to detect methods masquerading as native. */

var maskSrcKey$1$1 = function () {
  var uid = /[^.]+$/.exec(coreJsData$1$1 && coreJsData$1$1.keys && coreJsData$1$1.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked$1$1(func) {
  return !!maskSrcKey$1$1 && maskSrcKey$1$1 in func;
}
/** Used for built-in method references. */


var funcProto$3 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$3 = funcProto$3.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource$1$1(func) {
  if (func != null) {
    try {
      return funcToString$3.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}
/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */


var reRegExpChar$1$1 = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor$1$1 = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto$1$1$1 = Function.prototype,
    objectProto$2$1$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1$1$1 = funcProto$1$1$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$1$1$1 = objectProto$2$1$1.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative$1$1 = RegExp('^' + funcToString$1$1$1.call(hasOwnProperty$1$1$1).replace(reRegExpChar$1$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative$1$1(value) {
  if (!isObject$1$1(value) || isMasked$1$1(value)) {
    return false;
  }

  var pattern = isFunction$1$1(value) ? reIsNative$1$1 : reIsHostCtor$1$1;
  return pattern.test(toSource$1$1(value));
}
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */


function getValue$1$1(object, key) {
  return object == null ? undefined : object[key];
}
/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */


function getNative$1$1(object, key) {
  var value = getValue$1$1(object, key);
  return baseIsNative$1$1(value) ? value : undefined;
}
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */


function noop$1$1() {} // No operation performed.

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */


function eq$1$1(value, other) {
  return value === other || value !== value && other !== other;
}
/** Used to match property names within property paths. */


var reIsDeepProp$1$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$1$1 = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */

function isKey$1$1(value, object) {
  if (isArray$1$1(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$1$1(value)) {
    return true;
  }

  return reIsPlainProp$1$1.test(value) || !reIsDeepProp$1$1.test(value) || object != null && value in Object(object);
}
/* Built-in method references that are verified to be native. */


var nativeCreate$1$1 = getNative$1$1(Object, 'create');
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear$1$1() {
  this.__data__ = nativeCreate$1$1 ? nativeCreate$1$1(null) : {};
  this.size = 0;
}
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function hashDelete$1$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
/** Used to stand-in for `undefined` hash values. */


var HASH_UNDEFINED$2$1 = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$3$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2$1$1 = objectProto$3$1$1.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet$1$1(key) {
  var data = this.__data__;

  if (nativeCreate$1$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$2$1 ? undefined : result;
  }

  return hasOwnProperty$2$1$1.call(data, key) ? data[key] : undefined;
}
/** Used for built-in method references. */


var objectProto$4$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3$1$1 = objectProto$4$1$1.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas$1$1(key) {
  var data = this.__data__;
  return nativeCreate$1$1 ? data[key] !== undefined : hasOwnProperty$3$1$1.call(data, key);
}
/** Used to stand-in for `undefined` hash values. */


var HASH_UNDEFINED$1$1$1 = '__lodash_hash_undefined__';
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */

function hashSet$1$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$1$1 && value === undefined ? HASH_UNDEFINED$1$1$1 : value;
  return this;
}
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function Hash$1$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash$1$1.prototype.clear = hashClear$1$1;
Hash$1$1.prototype['delete'] = hashDelete$1$1;
Hash$1$1.prototype.get = hashGet$1$1;
Hash$1$1.prototype.has = hashHas$1$1;
Hash$1$1.prototype.set = hashSet$1$1;
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear$1$1() {
  this.__data__ = [];
  this.size = 0;
}
/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */


function assocIndexOf$1$1(array, key) {
  var length = array.length;

  while (length--) {
    if (eq$1$1(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}
/** Used for built-in method references. */


var arrayProto$1$1 = Array.prototype;
/** Built-in value references. */

var splice$1$1 = arrayProto$1$1.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete$1$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1$1(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1$1.call(data, index, 1);
  }

  --this.size;
  return true;
}
/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function listCacheGet$1$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1$1(data, key);
  return index < 0 ? undefined : data[index][1];
}
/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function listCacheHas$1$1(key) {
  return assocIndexOf$1$1(this.__data__, key) > -1;
}
/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */


function listCacheSet$1$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$1$1(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}
/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function ListCache$1$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache$1$1.prototype.clear = listCacheClear$1$1;
ListCache$1$1.prototype['delete'] = listCacheDelete$1$1;
ListCache$1$1.prototype.get = listCacheGet$1$1;
ListCache$1$1.prototype.has = listCacheHas$1$1;
ListCache$1$1.prototype.set = listCacheSet$1$1;
/* Built-in method references that are verified to be native. */

var Map$2 = getNative$1$1(root$1$1, 'Map');
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear$1$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash$1$1(),
    'map': new (Map$2 || ListCache$1$1)(),
    'string': new Hash$1$1()
  };
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */


function isKeyable$1$1(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}
/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */


function getMapData$1$1(map, key) {
  var data = map.__data__;
  return isKeyable$1$1(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}
/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */


function mapCacheDelete$1$1(key) {
  var result = getMapData$1$1(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}
/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */


function mapCacheGet$1$1(key) {
  return getMapData$1$1(this, key).get(key);
}
/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */


function mapCacheHas$1$1(key) {
  return getMapData$1$1(this, key).has(key);
}
/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */


function mapCacheSet$1$1(key, value) {
  var data = getMapData$1$1(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}
/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function MapCache$1$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache$1$1.prototype.clear = mapCacheClear$1$1;
MapCache$1$1.prototype['delete'] = mapCacheDelete$1$1;
MapCache$1$1.prototype.get = mapCacheGet$1$1;
MapCache$1$1.prototype.has = mapCacheHas$1$1;
MapCache$1$1.prototype.set = mapCacheSet$1$1;
/** Error message constants. */

var FUNC_ERROR_TEXT$1$1 = 'Expected a function';
/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `clear`, `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */

function memoize$1$1(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1$1);
  }

  var memoized = function () {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }

    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };

  memoized.cache = new (memoize$1$1.Cache || MapCache$1$1)();
  return memoized;
} // Expose `MapCache`.


memoize$1$1.Cache = MapCache$1$1;
/** Used as the maximum memoize cache size. */

var MAX_MEMOIZE_SIZE$1$1 = 500;
/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */

function memoizeCapped$1$1(func) {
  var result = memoize$1$1(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE$1$1) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}
/** Used to match property names within property paths. */


var rePropName$1$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */

var reEscapeChar$1$1 = /\\(\\)?/g;
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */

var stringToPath$1$1 = memoizeCapped$1$1(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
      result.push('');
    }

  string.replace(rePropName$1$1, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar$1$1, '$1') : number || match);
  });
  return result;
});
/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */

function toString$1$1(value) {
  return value == null ? '' : baseToString$1$1(value);
}
/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */


function castPath$1$1(value, object) {
  if (isArray$1$1(value)) {
    return value;
  }

  return isKey$1$1(value, object) ? [value] : stringToPath$1$1(toString$1$1(value));
}
/** Used as references for various `Number` constants. */


var INFINITY$1$1$1 = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey$1$1(value) {
  if (typeof value == 'string' || isSymbol$1$1(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1$1$1 ? '-0' : result;
}
/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */


function baseGet$1$1(object, path) {
  path = castPath$1$1(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$1$1(path[index++])];
  }

  return index && index == length ? object : undefined;
}
/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */


function get$1$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$1$1(object, path);
  return result === undefined ? defaultValue : result;
}
/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */


function last$1$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */


function isUndefined$1$1(value) {
  return value === undefined;
}

var ID$1 = guid_1$1.create().toString();
var RELEASE_DELAY$1 = 150;
var EMITTER_FORCE_LAYER_TYPE$1 = "EMITTER_FORCE_LAYER_TYPE_" + ID$1;
var EMITTER_TOP_LAYER_TYPE$1 = "EMITTER_TOP_LAYER_TYPE_" + ID$1;
var isListenersSet$1 = false;
var layersMap$1 = [];
var listenersLayers$1 = [];
var listenersPredefinedLayers$1 = {};
var forceListeners$1 = [];

var onEvent$1 = function (e, type) {
  forceListeners$1.forEach(function (listener) {
    get$1$1(listener, type, noop$1$1)(e);
  });

  if (listenersLayers$1.length) {
    get$1$1(last$1$1(listenersLayers$1), type, noop$1$1)(e);
  } else {
    var layers = Object.keys(listenersPredefinedLayers$1).filter(function (key) {
      return listenersPredefinedLayers$1[Number(key)].length > 0;
    }).sort(function (a, b) {
      return Number(a) - Number(b);
    });
    (listenersPredefinedLayers$1[Number(last$1$1(layers))] || []).forEach(function (listener) {
      get$1$1(listener, type, noop$1$1)(e);
    });
  }
};

var clearTargetDownLists$1 = function (target) {
  target.forEach(function (item) {
    item.instance.clearDownList();
  });
};

var onPress$1 = function (e) {
  onEvent$1(e, 'onPress');
};

var onDown$1 = function (e) {
  onEvent$1(e, 'onDown');
};

var onUp$1 = function (e) {
  onEvent$1(e, 'onUp');
};

var onWindowBlur$1 = function () {
  clearTargetDownLists$1(listenersLayers$1);
  clearTargetDownLists$1(forceListeners$1);
  Object.keys(listenersPredefinedLayers$1).forEach(function (key) {
    return clearTargetDownLists$1(listenersPredefinedLayers$1[Number(key)]);
  });
};

var Emitter$1 =
/** @class */
function () {
  /**
   * Constructor of the class.
   * @param {boolean|number|string} subscribeType - Layer type,
   * EMITTER_TOP_LAYER_TYPE - creates new layer at the top of the layers
   * EMITTER_FORCE_LAYER_TYPE - add to layer witch execute permanently
   * 5 - add to the layer with index 5.
   * @param {number} releaseDelay - Delay between keyDown and keyUp events for
   * fires keyRelease event.
   */
  function Emitter(subscribeType, releaseDelay) {
    var _this = this;

    if (releaseDelay === void 0) {
      releaseDelay = RELEASE_DELAY$1;
    }

    this.id = guid_1$1.create().toString();
    this.downList = [];
    this.releaseDictionary = {};
    this.pressReleaseDictionary = {};
    this.keyDownListeners = [];
    this.keyPressListeners = [];
    this.keyUpListeners = [];
    this.keyReleaseListeners = [];
    this.pressReleaseListeners = [];

    this.pressHandler = function (e) {
      var downList = _this.downList;
      var keyCode = Emitter.getEventKeyCode(e);
      var timeStamp = e.timeStamp;
      var downData = downList.find(function (item) {
        return item.timeStamp === timeStamp;
      });

      if (downData) {
        downData.pressKeyCode = keyCode;

        _this.keyPressListeners.forEach(function (listener) {
          return _this.executeCallback(e, listener, true);
        });
      }
    };

    this.downHandler = function (e) {
      var downList = _this.downList;
      var keyCode = Emitter.getEventKeyCode(e);

      if (!downList.find(function (item) {
        return item.keyCode === keyCode;
      })) {
        downList.push({
          keyCode: keyCode,
          timeStamp: e.timeStamp
        });
      }

      _this.keyDownListeners.forEach(function (listener) {
        return _this.executeCallback(e, listener);
      });
    };

    this.upHandler = function (e) {
      var _a = _this,
          downList = _a.downList,
          releaseDictionary = _a.releaseDictionary,
          pressReleaseDictionary = _a.pressReleaseDictionary,
          releaseDelay = _a.releaseDelay;
      var keyCode = Emitter.getEventKeyCode(e);
      var keyDownInfo = null;

      for (var i = 0, ln = downList.length; i < ln; i += 1) {
        if (downList[i].keyCode === keyCode) {
          keyDownInfo = downList[i];
          downList.splice(i, 1);
          break;
        }
      }

      _this.keyUpListeners.forEach(function (listener) {
        return _this.executeCallback(e, listener);
      });

      if (keyDownInfo && e.timeStamp - keyDownInfo.timeStamp <= releaseDelay) {
        releaseDictionary[keyDownInfo.keyCode] = keyDownInfo.timeStamp;

        _this.keyReleaseListeners.forEach(function (listener) {
          return _this.executeReleaseCallback(e, listener);
        });

        if (keyDownInfo.pressKeyCode) {
          pressReleaseDictionary[keyDownInfo.keyCode] = keyDownInfo;

          _this.pressReleaseListeners.forEach(function (listener) {
            return _this.executeReleaseCallback(e, listener, true);
          });
        }
      }
    };

    this.subscribeType = subscribeType || EMITTER_TOP_LAYER_TYPE$1;
    this.releaseDelay = releaseDelay;
    Emitter.setGeneralListeners();
    this.addListeners();
  }
  /**
   * @public
   *
   * Sets names for layers indexes.
   * @param {string|number|array[]|object[]|object} firstParam - Name or id of the layer.
   * For array or object it's a
   * layers config.
   *
   * @param {string} firstParam.name - Name of the layer.
   * @param {number} firstParam.id - Id of the layer.
   * @example
   * Emitter.setLayersMap({ name: 'fileBrowsing', id: 1 })
   *
   * @param {string} firstParam[0] - Name of the layer.
   * @param {number} firstParam[1] - Id of the layer.
   * @example
   * Emitter.setLayersMap(['fileBrowsing', 1])
   *
   * @param {number} firstParam[0] - Id of the layer.
   * @param {string} firstParam[1] - Name of the layer.
   * @example
   * Emitter.setLayersMap([1, 'fileBrowsing'])
   *
   * @param {string} firstParam[].name - Name of the layer.
   * @param {number} firstParam[].id - Id of the layer.
   * @example
   * Emitter.setLayersMap([
   *    { name: 'fileBrowsing', id: 1 },
   *    { name: 'preview', id: 5},
   * ])
   *
   * @param {string} firstParam[][0] - Name of the layer.
   * @param {number} firstParam[][1] - Id of the layer.
   * @example
   * Emitter.setLayersMap([
   *    ['fileBrowsing', 1],
   *    ['preview', 5],
   * ])
   *
   * @param {number} firstParam[][0] - Id of the layer.
   * @param {string} firstParam[][1] - Name of the layer.
   * @example
   * Emitter.setLayersMap([
   *    [1, 'fileBrowsing'],
   *    [5, 'preview'],
   * ])
   *
   * @param {Object.<string, number>} firstParam - Map of the Layers with name/id pairs.
   * @example
   * Emitter.setLayersMap({
   *    fileBrowsing: 1,
   *    preview: 5
   * })
   *
   * @param {string|number} secondParam - Name or id of the Layer.
   * @example
   * Emitter.setLayersMap('fileBrowsing', 1);
   * @example
   * Emitter.setLayersMap(1, 'fileBrowsing');
   *
   * @returns {number} Count of the set names;
   */


  Emitter.setLayersMap = function (firstParam, secondParam) {
    if (typeof firstParam === 'string' && typeof secondParam === 'number') {
      return Number(Emitter.setLayerMap({
        name: firstParam,
        id: secondParam
      }));
    }

    if (typeof firstParam === 'number' && typeof secondParam === 'string') {
      return Number(Emitter.setLayerMap({
        name: secondParam,
        id: firstParam
      }));
    }

    if (isArray$1$1(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray$1$1(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray$1$1(firstParam) && isUndefined$1$1(secondParam)) {
      var setCount_1 = 0;
      firstParam.forEach(function (layerMap) {
        setCount_1 += Number(Emitter.setLayerMap(layerMap));
      });
      return setCount_1;
    }

    if (!isArray$1$1(firstParam) && typeof firstParam === 'object' && !isUndefined$1$1(firstParam.name) && !isUndefined$1$1(firstParam.id)) {
      return Number(Emitter.setLayerMap(firstParam));
    }

    if (!isArray$1$1(firstParam) && typeof firstParam === 'object') {
      var setCount_2 = 0;
      Object.keys(firstParam).forEach(function (key) {
        var id = firstParam[key];
        setCount_2 += Number(Emitter.setLayerMap({
          id: id,
          name: key
        }));
      });
      return setCount_2;
    }

    return 0;
  };

  Emitter.setLayerMap = function (data) {
    if (typeof data === 'object' && !isArray$1$1(data)) {
      return Emitter.setLayerMapFromObject(data);
    }

    if (isArray$1$1(data)) {
      return Emitter.setLayerMapFromArray(data);
    }

    return false;
  };

  Emitter.setLayerMapFromObject = function (data) {
    var _a = data || {
      name: '',
      id: 0
    },
        name = _a.name,
        id = _a.id;

    if (name) {
      layersMap$1.push({
        name: name,
        id: id
      });
      return true;
    }

    return false;
  };

  Emitter.setLayerMapFromArray = function (data) {
    var name = data[0];
    var id = data[1];

    if (typeof name === 'number' && typeof id === 'string') {
      name = data[1];
      id = data[0];
    }

    return Emitter.setLayerMapFromObject({
      name: name,
      id: id
    });
  };

  Emitter.setGeneralListeners = function () {
    if (!isListenersSet$1) {
      window.addEventListener('keypress', onPress$1, true);
      window.addEventListener('keyup', onUp$1, true);
      window.addEventListener('keydown', onDown$1, true);
      window.addEventListener('blur', onWindowBlur$1, true);
      isListenersSet$1 = true;
    }
  };

  Emitter.getEventKeyCode = function (e) {
    return e.which || e.keyCode;
  };

  Emitter.checkInputTarget = function (e) {
    return ['INPUT', 'TEXTAREA'].includes(get$1$1(e, 'target.tagName'));
  };

  Emitter.checkMainOptions = function (e, options) {
    var altKey = options.altKey,
        ctrlKey = options.ctrlKey,
        shiftKey = options.shiftKey,
        metaKey = options.metaKey,
        skipInput = options.skipInput;
    var isInputTarget = Emitter.checkInputTarget(e);
    return (altKey ? e.altKey : true) && (ctrlKey ? e.ctrlKey : true) && (shiftKey ? e.shiftKey : true) && (metaKey ? e.metaKey : true) && !(isInputTarget && skipInput);
  };

  Emitter.getListenersTarget = function (subscribeType) {
    if (typeof subscribeType === 'number') {
      if (!listenersPredefinedLayers$1[subscribeType]) {
        listenersPredefinedLayers$1[subscribeType] = [];
      }

      return listenersPredefinedLayers$1[subscribeType];
    }

    if (subscribeType === EMITTER_FORCE_LAYER_TYPE$1) {
      return forceListeners$1;
    }

    if (subscribeType === EMITTER_TOP_LAYER_TYPE$1) {
      return listenersLayers$1;
    }

    if (typeof subscribeType === 'string') {
      var layerId = get$1$1(layersMap$1.find(function (item) {
        return item.name === subscribeType;
      }), 'id');

      if (typeof layerId === 'number' && layerId >= 0) {
        return Emitter.getListenersTarget(layerId);
      }
    }

    return null;
  };

  Emitter.clearDownLists = function (subscribeType) {
    if (subscribeType === EMITTER_TOP_LAYER_TYPE$1) {
      Emitter.clearLayerDownLists();
      Emitter.clearPredefinedLayersDownLists();
    } else if (subscribeType === 'string' && subscribeType !== EMITTER_FORCE_LAYER_TYPE$1 || typeof subscribeType === 'number') {
      var layerId = typeof subscribeType === 'string' ? get$1$1(layersMap$1.find(function (item) {
        return item.name === subscribeType;
      }), 'id') : subscribeType;
      var biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers$1).map(function (key) {
        return Number(key);
      }));

      if (layerId && layerId >= biggestLayerId) {
        Emitter.clearPredefinedLayersDownLists([layerId]);
      }
    }
  };

  Emitter.clearLayerDownLists = function () {
    clearTargetDownLists$1(listenersLayers$1);
  };

  Emitter.clearPredefinedLayersDownLists = function (skip) {
    if (skip === void 0) {
      skip = [];
    }

    Object.keys(listenersPredefinedLayers$1).forEach(function (key) {
      var normalizedKey = Number(key);

      if (!skip.includes(normalizedKey)) {
        clearTargetDownLists$1(listenersPredefinedLayers$1[normalizedKey]);
      }
    });
  };

  Emitter.prototype.clearDownList = function () {
    this.downList = [];
    this.releaseDictionary = {};
    this.pressReleaseDictionary = {};
  };

  Emitter.prototype.addListener = function (type, callback, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    switch (type) {
      case 'keyDown':
        this.keyDownListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'keyPress':
        this.keyPressListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'keyUp':
        this.keyUpListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'keyRelease':
        this.keyReleaseListeners.push({
          callback: callback,
          options: options
        });
        break;

      case 'pressRelease':
        this.pressReleaseListeners.push({
          callback: callback,
          options: options
        });
        break;
    }

    return function () {
      return _this.removeListener(type, callback);
    };
  };

  Emitter.prototype.removeListener = function (type, callback) {
    var collection = [];

    switch (type) {
      case 'keyDown':
        collection = this.keyDownListeners;
        break;

      case 'keyPress':
        collection = this.keyPressListeners;
        break;

      case 'keyUp':
        collection = this.keyUpListeners;
        break;

      case 'keyRelease':
        collection = this.keyReleaseListeners;
        break;

      case 'pressRelease':
        collection = this.pressReleaseListeners;
        break;
    }

    for (var i = 0, ln = collection.length; i < ln; i += 1) {
      if (collection[i].callback === callback) {
        collection.splice(i, 1);
        break;
      }
    }
  };

  Emitter.prototype.destroy = function () {
    this.removeListeners();
  };

  Emitter.prototype.updateLayerType = function (subscribeType) {
    this.removeListeners();
    this.subscribeType = subscribeType;
    this.addListeners();
  };

  Emitter.prototype.addListeners = function () {
    var subscribeType = this.subscribeType;
    var listenersTarget = Emitter.getListenersTarget(subscribeType);
    Emitter.clearDownLists(subscribeType);

    if (listenersTarget) {
      listenersTarget.push({
        id: this.id,
        instance: this,
        onPress: this.pressHandler,
        onDown: this.downHandler,
        onUp: this.upHandler
      });
    } else {
      console.warn('KeyLayersJS', 'Unknown subscribe type!');
    }
  };

  Emitter.prototype.removeListeners = function () {
    var listenersTarget = Emitter.getListenersTarget(this.subscribeType);

    if (listenersTarget) {
      for (var i = 0, ln = listenersTarget.length; i < ln; i += 1) {
        if (listenersTarget[i].id === this.id) {
          listenersTarget.splice(i, 1);
          break;
        }
      }
    }
  };

  Emitter.prototype.executeCallback = function (e, listener, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var callback = listener.callback,
        options = listener.options;

    if (Emitter.checkMainOptions(e, options) && this.checkCodeOptions(e, options, isPressCheck)) {
      callback(e);
    }
  };

  Emitter.prototype.executeReleaseCallback = function (e, listener, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var callback = listener.callback,
        options = listener.options;

    if (Emitter.checkMainOptions(e, options) && this.checkReleaseCodeOptions(e, options, isPressCheck)) {
      callback(e);
    }
  };

  Emitter.prototype.checkCodeOptions = function (e, options, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var code = options.code;
    var _a = options.codes,
        codes = _a === void 0 ? [] : _a;
    var downList = this.downList;
    var keyCode = Emitter.getEventKeyCode(e);
    codes = code && !codes.length ? [code] : codes;

    if (codes.length) {
      if (!codes.includes(keyCode)) {
        return false;
      }

      var _loop_1 = function (i, ln) {
        var checkCode = codes[i];

        if (checkCode !== keyCode && !downList.find(function (item) {
          return isPressCheck ? item.pressKeyCode === checkCode : item.keyCode === checkCode;
        })) {
          return {
            value: false
          };
        }
      };

      for (var i = 0, ln = codes.length; i < ln; i += 1) {
        var state_1 = _loop_1(i, ln);

        if (typeof state_1 === "object") return state_1.value;
      }
    }

    return true;
  };

  Emitter.prototype.checkReleaseCodeOptions = function (e, options, isPressCheck) {
    if (isPressCheck === void 0) {
      isPressCheck = false;
    }

    var code = options.code;
    var _a = options.codes,
        codes = _a === void 0 ? [] : _a;

    var _b = this,
        releaseDictionary = _b.releaseDictionary,
        pressReleaseDictionary = _b.pressReleaseDictionary,
        releaseDelay = _b.releaseDelay;

    var keyCode = Emitter.getEventKeyCode(e);

    if (isPressCheck) {
      var keyPressInfo = pressReleaseDictionary[keyCode];

      if (e.timeStamp - keyPressInfo.timeStamp <= releaseDelay) {
        keyCode = keyPressInfo.pressKeyCode || 0;
      }
    }

    var timeStamp = e.timeStamp;
    codes = code && !codes.length ? [code] : codes;

    if (codes.length) {
      if (!codes.includes(keyCode)) {
        return false;
      }

      var _loop_2 = function (i, ln) {
        var checkCode = codes[i];
        var releaseCheckTimestamp = 0;

        if (isPressCheck) {
          var pressKey = Object.keys(pressReleaseDictionary).find(function (key) {
            return pressReleaseDictionary[Number(key)].pressKeyCode === checkCode;
          });
          releaseCheckTimestamp = pressKey ? pressReleaseDictionary[Number(pressKey)].timeStamp : 0;
        } else {
          releaseCheckTimestamp = releaseDictionary[checkCode];
        }

        if (checkCode !== keyCode && !(releaseCheckTimestamp && timeStamp - releaseCheckTimestamp <= releaseDelay)) {
          return {
            value: false
          };
        }
      };

      for (var i = 0, ln = codes.length; i < ln; i += 1) {
        var state_2 = _loop_2(i, ln);

        if (typeof state_2 === "object") return state_2.value;
      }
    }

    return true;
  };

  return Emitter;
}();

function rng() {
  return crypto.randomBytes(16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];

for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex; // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4

  return [bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], '-', bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]], bth[buf[i++]]].join('');
}

//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

var _nodeId;

var _clockseq; // Previous uuid creation time


var _lastMSecs = 0;
var _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  var i = buf && offset || 0;
  var b = buf || [];
  options = options || {};
  var node = options.node || _nodeId;
  var clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    var seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  var msecs = options.msecs !== undefined ? options.msecs : new Date().getTime(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  var nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  var dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  var tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (var n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf ? buf : bytesToUuid(b);
}

const checkArraysEqual = (first, second) => first.length === second.length && first.every(item => second.includes(item));

class KeyboardShortcutsManager {
    constructor(params = {}, unlockKey) {
        this.layerField = 1;
        this.shortcutsMapField = {};
        this.listeners = {};
        this.isLock = false;
        this.lockWhiteList = [];
        this.actionHandler = params.onAction;
        this.unlockKey = unlockKey || v1();
    }
    static checkShortcutsEqual(first, second) {
        const firstNormalized = KeyboardShortcutsManager.getNormalizedShortcut(first);
        const secondNormalized = KeyboardShortcutsManager.getNormalizedShortcut(second);
        return firstNormalized.ctrlKey === secondNormalized.ctrlKey
            && firstNormalized.metaKey === secondNormalized.metaKey
            && firstNormalized.altKey === secondNormalized.altKey
            && firstNormalized.shiftKey === secondNormalized.shiftKey
            && checkArraysEqual(firstNormalized.codes, secondNormalized.codes);
    }
    static getNormalizedShortcut(shortcut) {
        const normalizedShortcut = {
            codes: [], ctrlKey: false, metaKey: false, altKey: false, shiftKey: false,
        };
        if (isNumber(shortcut)) {
            normalizedShortcut.codes = [shortcut];
        }
        else if (isArray$1(shortcut) && isNumber(shortcut[0])) {
            normalizedShortcut.codes = shortcut;
        }
        else {
            normalizedShortcut.codes = isArray$1(shortcut.code)
                ? shortcut.code : [shortcut.code];
            normalizedShortcut.ctrlKey = shortcut.ctrl
                || normalizedShortcut.ctrlKey;
            normalizedShortcut.metaKey = shortcut.meta
                || normalizedShortcut.metaKey;
            normalizedShortcut.altKey = shortcut.alt || normalizedShortcut.altKey;
            normalizedShortcut.shiftKey = shortcut.shift
                || normalizedShortcut.shiftKey;
        }
        return normalizedShortcut;
    }
    get layer() {
        return this.layerField;
    }
    set layer(val) {
        const { layerField, emitter } = this;
        if (layerField === val)
            return;
        this.layerField = val;
        if (emitter)
            emitter.updateLayerType(val);
    }
    addListener(action, callback, info) {
        const { listeners } = this;
        if (!listeners[action])
            listeners[action] = [];
        listeners[action].push({ callback, info });
    }
    removeListener(callback) {
        const { listeners } = this;
        Object.keys(listeners).some((action) => {
            const index = listeners[action].findIndex(item => item.callback === callback);
            if (index >= 0) {
                listeners[action].splice(index, 1);
                return true;
            }
            return false;
        });
    }
    addShortcut(action, shortcut, info) {
        const { shortcutsMapField } = this;
        const shortcutIndex = this.getShortcutIndex(action, shortcut);
        if (shortcutIndex >= 0)
            return;
        if (!shortcutsMapField[action])
            shortcutsMapField[action] = [];
        shortcutsMapField[action].push({
            info, actionShortcut: shortcut,
        });
        this.deactivate();
        this.activate();
    }
    removeShortcut(action, shortcut) {
        const { shortcutsMapField } = this;
        if (!shortcut)
            return delete shortcutsMapField[action];
        const shortcutIndex = this.getShortcutIndex(action, shortcut);
        if (shortcutIndex === true)
            return delete shortcutsMapField[action];
        if (shortcutIndex >= 0) {
            shortcutsMapField[action].splice(shortcutIndex, 1);
            this.deactivate();
            this.activate();
        }
    }
    activate() {
        if (!this.emitter) {
            this.emitter = new Emitter$1(this.layerField);
            this.addListeners();
        }
    }
    deactivate() {
        const { emitter } = this;
        if (emitter)
            emitter.destroy();
        delete this.emitter;
    }
    destroy() {
        this.deactivate();
    }
    lock(whiteList = []) {
        if (this.isLock)
            return;
        this.isLock = true;
        this.lockWhiteList = whiteList;
        return () => this.unlock(this.unlockKey);
    }
    unlock(key) {
        if (this.unlockKey === key) {
            this.isLock = false;
            this.lockWhiteList = [];
        }
    }
    getShortcutIndex(action, shortcut) {
        const info = this.shortcutsMapField[action];
        if (!info)
            return -1;
        return info.findIndex(item => KeyboardShortcutsManager.checkShortcutsEqual(item.actionShortcut, shortcut));
    }
    addListeners() {
        const { emitter, shortcutsMapField, listeners, actionHandler, isLock, lockWhiteList } = this;
        if (!emitter)
            return;
        Object.keys(shortcutsMapField).forEach((action) => {
            shortcutsMapField[action].forEach((item) => {
                const { info: shortcut } = item;
                const actionShortcut = KeyboardShortcutsManager.getNormalizedShortcut(item.actionShortcut);
                emitter.addListener('keyDown', (e) => {
                    if (isLock && !lockWhiteList.includes(action))
                        return;
                    const callbackList = listeners[action];
                    if (callbackList) {
                        callbackList.some(({ callback, info: listener }) => callback(action, e, { listener, shortcut }));
                    }
                    if (actionHandler)
                        actionHandler(action, e);
                }, actionShortcut);
            });
        });
    }
}

class ValueEvent {
    constructor(value, typedValue) {
        this.value = value;
        this.typedValue = typedValue;
    }
}

const SUBMIT_EVENT_NAME = 'submit';
const ACTION_EVENT_NAME = 'action';
const UPDATE_CARET_POSITION_EVENT_NAME = 'caretPosition';
const INPUT_EVENT_LIST = [
    'change',
    'focus',
    'blur',
    'keydown',
    'keypress',
    'keyup',
];
const CLEAR_ACTION_NAME = 'clear';

class ActionEvent {
    constructor(params) {
        this.action = params.action;
        this.data = params.data;
        this.target = params.target;
    }
}

class PluginManager {
    constructor(termInfo, keyboardShortcutsManager) {
        this.pluginList = [];
        this.termInfo = termInfo;
        this.keyboardShortcutsManager = keyboardShortcutsManager;
    }
    updateTermInfo(termInfo) {
        this.termInfo = termInfo;
        this.pluginList.forEach(({ inst }) => {
            inst.updateTermInfo(termInfo);
        });
    }
    register(plugin, name) {
        const { pluginList, termInfo } = this;
        const pluginName = name || plugin.name;
        if (this.getPluginIndex(pluginName, plugin) >= 0)
            return;
        pluginList.push({ name: pluginName, inst: plugin });
        this.clearPlugins();
        plugin.setTermInfo(termInfo, this.keyboardShortcutsManager);
    }
    unregister(descriptor) {
        const { pluginList } = this;
        const index = typeof descriptor === 'string'
            ? this.getPluginIndex(descriptor)
            : this.getPluginIndex(descriptor.name, descriptor);
        if (index < 0)
            return;
        pluginList.splice(index, 1);
        const item = pluginList[index];
        if (!item)
            return;
        this.clearPlugins();
        item.inst.destroy();
    }
    destroy() {
        this.pluginList.forEach(({ inst }) => inst.destroy());
        this.pluginList = [];
    }
    getPlugin(descriptor) {
        var _a, _b;
        const { pluginList } = this;
        return isString(descriptor)
            ? ((_a = pluginList.find(({ name }) => name === descriptor)) === null || _a === void 0 ? void 0 : _a.inst) || null
            : ((_b = pluginList.find(({ inst }) => inst instanceof descriptor)) === null || _b === void 0 ? void 0 : _b.inst) || null;
    }
    getPluginIndex(name, plugin) {
        const { pluginList } = this;
        const nameIndex = pluginList.findIndex(item => item.name === name);
        if (nameIndex >= 0 || !plugin)
            return nameIndex;
        return pluginList.findIndex(item => item.inst.equal(plugin));
    }
    clearPlugins() {
        this.pluginList.forEach(({ inst }) => inst.clear());
    }
}

class CaretEvent {
    constructor(position, caret) {
        this.position = position;
        this.caret = caret;
    }
}

const IS_MAC = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

class Term extends TemplateEngine {
    constructor(container, params = { lines: [], editLine: '' }) {
        super(template$1$1, container);
        this.isDisabled = false;
        this.headerField = '';
        this.history = {
            list: [], index: -1, stopHistory: false,
        };
        this.params = {
            label: '', delimiter: DEFAULT_DELIMITER, header: '', caret: '', scrollbarSize: 20,
            size: { width: 1, height: 1 },
        };
        this.isEditing = false;
        this.itemSize = { width: 1, height: 1 };
        this.heightCache = [];
        this.lines = [];
        this.listeners = {};
        this.addEventListener = (type, handler, options) => {
            const { listeners } = this;
            if (!listeners[type])
                listeners[type] = [];
            listeners[type].push({ handler, options });
            this.registerListener(type, handler, options);
        };
        this.removeEventListener = (type, handler, options) => {
            const list = this.listeners[type];
            if (!list)
                return;
            const index = list.findIndex(item => item.handler === handler);
            if (index >= 0)
                list.splice(index, 1);
            this.unregisterListener(type, handler, options);
        };
        this.setLabel = (params = {}) => {
            const { editLine, params: currentParams } = this;
            const { label, delimiter } = params;
            let isUpdated = false;
            if (!isUndefined$1(label)) {
                currentParams.label = label;
                isUpdated = true;
            }
            if (!isUndefined$1(delimiter)) {
                currentParams.delimiter = delimiter;
                isUpdated = true;
            }
            if (editLine && editLine.label)
                editLine.label.params = params;
            if (isUpdated)
                this.updateTermInfo();
        };
        this.write = (data, options = {}) => {
            const { editLine, isEditing } = this;
            const { withSubmit, duration = 0 } = options;
            if (!editLine || isEditing)
                return duration ? Promise.resolve(false) : false;
            this.isEditing = true;
            editLine.disabled = true;
            if (duration >= 0) {
                const { value: original } = editLine;
                const str = isString(data) ? data : data.str;
                const millisecondCharactersCount = str.length / duration;
                let milliseconds = 0;
                const updatingValue = isString(data) ? { str: data } : Object.assign(Object.assign({}, data), { str: '' });
                return new Promise((res) => {
                    this.writingInterval = setInterval(() => {
                        milliseconds += 1;
                        const substr = str.substr(0, Math.floor(millisecondCharactersCount * milliseconds));
                        if (substr === str) {
                            clearInterval(this.writingInterval);
                            this.updateEditLine(data, true, original);
                            if (withSubmit)
                                editLine.submit();
                            return res(true);
                        }
                        if (updatingValue.str !== substr) {
                            updatingValue.str = substr;
                            this.updateEditLine(updatingValue, false, original);
                        }
                    }, 1);
                });
            }
            this.updateEditLine(data, true);
            if (withSubmit)
                editLine.submit();
            return true;
        };
        this.characterUpdater = () => {
            const { vl, itemSize, editLine } = this;
            const newItemSize = getItemSize(this.getRef('root'), true);
            if (!compareItemSize(itemSize, newItemSize)) {
                this.heightCache = [];
                this.itemSize = newItemSize;
                vl.updateViewport();
            }
        };
        this.itemGetter = (index, params) => {
            const { lines, vl, params: { delimiter, label } } = this;
            const { container, ref, append } = params || {};
            const virtualItemsContainer = container || (vl
                ? vl.getVirtualItemsContainer() : undefined);
            return virtualItemsContainer ? new Line(virtualItemsContainer, {
                ref, append, delimiter, label, editable: false, value: lines[index], className: css$1.line,
            }) : null;
        };
        this.heightGetter = (index) => {
            const { heightCache, itemSize, lines, params: { delimiter, label, size, scrollbarSize }, } = this;
            if (isUndefined$1(heightCache[index])) {
                heightCache[index] = Line.getHeight({
                    itemSize,
                    delimiter,
                    label,
                    value: lines[index],
                    width: size.width - scrollbarSize,
                });
            }
            return heightCache[index];
        };
        this.observeHandler = (entries) => {
            const { params: { size }, vl } = this;
            const { width, height } = get$1(entries, '[0].contentRect');
            if (size.width !== width) {
                size.width = width;
                size.height = height;
                this.heightCache = [];
                vl.updateViewport();
                this.updateTermInfo();
            }
            else if (size.height !== height) {
                size.width = width;
                size.height = height;
                vl.updateViewport();
                this.updateTermInfo();
            }
        };
        this.clickHandler = (e) => {
            if (e.target === this.vl.getRef('root'))
                this.lastLineFocus();
        };
        this.submitHandler = (params) => {
            const { value, formattedValue, lockString } = params;
            const { vl, editLine, listeners, history: { list } } = this;
            const historyValue = value.substring(lockString.length);
            if (historyValue && last$1(list) !== historyValue && !(editLine === null || editLine === void 0 ? void 0 : editLine.secret))
                list.push(historyValue);
            if (!editLine)
                return;
            editLine.visible = false;
            this.lines.push(formattedValue);
            this.clearHistoryState();
            this.history.list = list;
            vl.length = this.lines.length;
            vl.scrollBottom();
            editLine.clear();
            editLine.secret = false;
            this.updateTermInfo();
            this.submitTimeout = setTimeout(() => {
                editLine.visible = true;
                editLine.focus();
                if (listeners[SUBMIT_EVENT_NAME]) {
                    const event = new ValueEvent(value, historyValue || undefined);
                    listeners[SUBMIT_EVENT_NAME].forEach(item => item.handler(event));
                }
            }, 10);
        };
        this.changeHandler = (value) => {
            const { history: { list, index }, vl } = this;
            if (list[index] !== value)
                this.history.stopHistory = true;
            if (!value)
                this.history.stopHistory = false;
            vl.scrollBottom();
        };
        this.updateCaretPositionHandler = (position, caret) => {
            const { listeners } = this;
            this.updateTermInfo();
            if (listeners[UPDATE_CARET_POSITION_EVENT_NAME]) {
                const caretEvent = new CaretEvent(position, caret);
                listeners[UPDATE_CARET_POSITION_EVENT_NAME].forEach(item => item.handler(caretEvent));
            }
        };
        this.lineKeydownHandler = (e) => {
            const keyCode = Number(getKeyCode(e));
            if (keyCode === UP_CODE) {
                this.prevHistory(e);
            }
            else if (keyCode === DOWN_CODE) {
                this.nextHistory(e);
            }
        };
        this.prevHistory = (e) => {
            const { index, list } = this.history;
            this.applyHistory(e, index < 0 ? list.length - 1 : Math.max(0, index - 1));
        };
        this.nextHistory = (e) => {
            const { index, list } = this.history;
            return index < 0
                ? this.applyHistory(e, -1)
                : this.applyHistory(e, index === list.length - 1 ? -1 : index + 1);
        };
        this.clearHandler = () => {
            this.setLines([]);
            this.updateTermInfo();
        };
        this.actionHandler = (action, e) => {
            const { listeners } = this;
            if (listeners[ACTION_EVENT_NAME]) {
                const event = new ActionEvent({ action });
                listeners[ACTION_EVENT_NAME].forEach(item => item.handler(event));
            }
        };
        this.setLines = (lines) => {
            const { vl } = this;
            this.lines = lines;
            vl.length = lines.length;
            vl.clearCache();
            this.updateTermInfo();
        };
        this.updateTermInfo = () => {
            this.pluginManager.updateTermInfo(this.getTermInfo());
        };
        const { virtualizedTopOffset, virtualizedBottomOffset, header } = params;
        this.headerField = header || '';
        this.init(container, params);
        this.ro = new index(this.observeHandler);
        this.keyboardShortcutsManager = new KeyboardShortcutsManager({ onAction: this.actionHandler });
        this.vl = new VirtualizedList(this.getRef('linesContainer'), {
            length: this.lines.length, itemGetter: this.itemGetter, heightGetter: this.heightGetter,
            topOffset: virtualizedTopOffset || 0, bottomOffset: virtualizedBottomOffset || 0,
        });
        this.preStart(container, params);
        this.pluginManager = new PluginManager(this.getTermInfo(), this.keyboardShortcutsManager);
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled, editLine, keyboardShortcutsManager } = this;
        if (isDisabled === val)
            return;
        this.isDisabled = val;
        if (editLine)
            editLine.disabled = val;
        if (val)
            keyboardShortcutsManager.deactivate();
        else
            keyboardShortcutsManager.activate();
    }
    get header() {
        return this.headerField;
    }
    set header(val) {
        const { headerField } = this;
        if (headerField !== val) {
            const headerText = this.getRef('headerText');
            headerText.innerHTML = escapeString(val);
        }
        this.headerField = val;
    }
    destroy() {
        var _a;
        clearInterval(this.writingInterval);
        clearTimeout(this.submitTimeout);
        this.removeKeyDownHandler();
        this.unregisterAllListeners();
        (_a = this.editLine) === null || _a === void 0 ? void 0 : _a.destroy();
        this.removeListeners();
        this.pluginManager.destroy();
        this.keyboardShortcutsManager.destroy();
        getItemSize(this.getRef('root'));
        // TODO: add unobserve.
        super.destroy();
    }
    setCaret(caret) {
        this.params.caret = caret;
        if (!this.editLine)
            return;
        this.editLine.setCaret(caret);
        this.updateTermInfo();
    }
    setHeader(text) {
        const header = this.getRef('header');
        const headerText = this.getRef('headerText');
        if (text) {
            headerText.innerHTML = text;
            header === null || header === void 0 ? void 0 : header.classList.remove(css$1.hidden);
        }
        else {
            header === null || header === void 0 ? void 0 : header.classList.add(css$1.hidden);
        }
        this.params.header = '';
        this.updateTermInfo();
    }
    blur() {
        const { editLine } = this;
        if (editLine)
            editLine.blur();
    }
    updateEditLine(data, stopEdit, original) {
        const { editLine } = this;
        if (editLine) {
            const value = isUndefined$1(original) ? editLine.value : original;
            editLine.value = isArray$1(value) ? [...value, data] : [value, data];
            editLine.moveCaretToEnd();
            if (stopEdit)
                editLine.disabled = false;
        }
        if (stopEdit)
            this.isEditing = false;
    }
    init(container, params) {
        const { header = '' } = params;
        this.setParams(container, params);
        this.render({ css: css$1, header, hidden: header ? '' : css$1.hidden });
        this.params.scrollbarSize = getScrollbarSize(this.getRef('root'));
        this.itemSize = getItemSize(this.getRef('root'), true);
        this.addListeners();
    }
    preStart(container, params) {
        this.addEditLine(params.editLine || '');
        this.ro.observe(container);
        this.vl.scrollBottom();
        this.lastLineFocus();
        this.frameHandler = this.characterUpdater;
        this.registerFrameHandler();
        this.addKeyboardShortcutsManagerListeners();
        this.keyboardShortcutsManager.activate();
    }
    setParams(container, params) {
        const { params: currentParams } = this;
        this.lines = params.lines;
        currentParams.size.width = container.offsetWidth;
        currentParams.size.height = container.offsetHeight;
        currentParams.header = params.header || currentParams.header;
        currentParams.caret = params.caret || currentParams.caret;
        currentParams.label = params.label || currentParams.label;
        currentParams.delimiter = params.delimiter || currentParams.delimiter;
    }
    addListeners() {
        var _a;
        const { editLine } = this;
        const root = this.getRef('root');
        if (root)
            root.addEventListener('click', this.clickHandler);
        if (editLine)
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.addEventListener(CHANGE_EVENT_TYPE, this.updateTermInfo);
    }
    removeListeners() {
        var _a;
        const { editLine } = this;
        const root = this.getRef('root');
        if (root)
            root.removeEventListener('click', this.clickHandler);
        if (editLine)
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.removeEventListener(CHANGE_EVENT_TYPE, this.updateTermInfo);
    }
    addEditLine(editLineParams) {
        const { vl, params: { delimiter, label, caret } } = this;
        const generalItemsContainer = vl.getGeneralItemsContainer();
        if (!generalItemsContainer)
            return;
        this.editLine = new Line(generalItemsContainer, {
            label,
            delimiter,
            caret,
            className: [css$1.line, css$1.editLine].join(' '),
            value: isArray$1(editLineParams) || isString(editLineParams)
                ? editLineParams : editLineParams.value,
            editable: true,
            onSubmit: this.submitHandler,
            onChange: this.changeHandler,
            onUpdateCaretPosition: this.updateCaretPositionHandler,
            secret: get$1(editLineParams, 'secret') || false,
        });
        this.clearHistoryState();
        this.addKeyDownHandler();
    }
    lastLineFocus() {
        if (document.hasFocus() && this.editLine) {
            this.editLine.focus();
        }
    }
    clearHistoryState() {
        this.history = { list: [], index: -1, stopHistory: false };
    }
    addKeyDownHandler() {
        const { editLine } = this;
        if (!editLine || !editLine.input)
            return;
        editLine.input.addEventListener('keydown', this.lineKeydownHandler);
    }
    removeKeyDownHandler() {
        const { editLine } = this;
        if (!editLine || !editLine.input)
            return;
        editLine.input.removeEventListener('keydown', this.lineKeydownHandler);
    }
    applyHistory(e, newIndex) {
        const { history: { index, list, stopHistory }, editLine } = this;
        if (!list.length || !editLine || stopHistory)
            return;
        if (index === newIndex)
            return e.stopPropagation();
        this.history.index = newIndex;
        editLine.value = newIndex >= 0 ? list[newIndex] || '' : '';
        editLine.moveCaretToEnd();
        e.preventDefault();
    }
    addKeyboardShortcutsManagerListeners() {
        const { keyboardShortcutsManager } = this;
        if (IS_MAC) {
            keyboardShortcutsManager.addShortcut(CLEAR_ACTION_NAME, { code: K_CODE, meta: true });
        }
        else {
            keyboardShortcutsManager.addShortcut(CLEAR_ACTION_NAME, { code: K_CODE, ctrl: true });
        }
        keyboardShortcutsManager.addListener(CLEAR_ACTION_NAME, this.clearHandler);
    }
    registerListener(type, handler, options) {
        var _a;
        const { editLine } = this;
        if (editLine && INPUT_EVENT_LIST.includes(type)) {
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.addEventListener(type, handler, options);
        }
    }
    unregisterAllListeners() {
        const { listeners } = this;
        Object.keys(listeners).forEach((type) => {
            if (INPUT_EVENT_LIST.includes(type)) {
                listeners[type].forEach((item) => {
                    this.unregisterListener(type, item.handler, item.options);
                });
            }
        });
    }
    unregisterListener(type, handler, options) {
        var _a;
        const { editLine } = this;
        if (editLine && INPUT_EVENT_LIST.includes(type)) {
            (_a = editLine.input) === null || _a === void 0 ? void 0 : _a.removeEventListener(type, handler, options);
        }
    }
    getTermInfo() {
        const { params: { header } } = this;
        return {
            title: header,
            elements: this.getTermInfoElements(),
            label: this.getTermInfoLabel(),
            caret: this.getTermInfoCaret(),
            edit: this.getTermInfoEdit(),
            lines: this.getTermInfoLines(),
            history: this.history.list,
            pluginManager: this.pluginManager,
            addEventListener: this.addEventListener,
            removeEventListener: this.removeEventListener,
        };
    }
    getTermInfoElements() {
        const { editLine } = this;
        return {
            root: this.getRef('content'),
            edit: editLine === null || editLine === void 0 ? void 0 : editLine.getRef('content'),
            title: this.getRef('header'),
        };
    }
    getTermInfoLabel() {
        const { label, delimiter } = this.params;
        return { label, delimiter, set: this.setLabel };
    }
    getTermInfoCaret() {
        var _a;
        const { editLine, itemSize } = this;
        return {
            position: ((_a = editLine === null || editLine === void 0 ? void 0 : editLine.input) === null || _a === void 0 ? void 0 : _a.caretPosition) || 0,
            offset: (editLine === null || editLine === void 0 ? void 0 : editLine.caretOffset) || { left: 0, top: 0 },
            size: { width: itemSize.width, height: itemSize.height },
            setCaretPosition: (position) => {
                if (position < 0) {
                    editLine === null || editLine === void 0 ? void 0 : editLine.moveCaretToEnd();
                    this.updateTermInfo();
                }
                else if (editLine && editLine.input && position >= 0) {
                    editLine.input.caretPosition = position;
                    this.updateTermInfo();
                }
            },
        };
    }
    getTermInfoEdit() {
        const { editLine } = this;
        return {
            value: BaseInput.getValueString((editLine === null || editLine === void 0 ? void 0 : editLine.value) || ''),
            parameterizedValue: (editLine === null || editLine === void 0 ? void 0 : editLine.value) || '',
            write: this.write,
            focus: () => editLine === null || editLine === void 0 ? void 0 : editLine.focus(),
            blur: () => editLine === null || editLine === void 0 ? void 0 : editLine.blur(),
            update: (params) => {
                if (!editLine)
                    return;
                if (isObject$1(params) && !isArray$1(params)) {
                    editLine.secret = Boolean(params.secret);
                    editLine.value = params.value;
                }
                else {
                    editLine.value = params;
                }
                this.updateTermInfo();
            },
            endOffset: (editLine === null || editLine === void 0 ? void 0 : editLine.endOffset) || { left: 0, top: 0 },
        };
    }
    getTermInfoLines() {
        const { lines } = this;
        return {
            list: lines.map((line) => BaseInput.getValueString(line)),
            parameterizedList: lines,
            update: this.setLines,
        };
    }
}

const BASE_PLUGIN_NAME = 'base';

class Plugin {
    constructor() {
        this.name = BASE_PLUGIN_NAME;
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        this.termInfo = termInfo;
        this.keyboardShortcutsManager = keyboardShortcutsManager;
    }
    updateTermInfo(termInfo) {
        this.termInfo = termInfo;
    }
    destroy() {
        this.clear();
    }
    equal(plugin) {
        return plugin.name === this.name;
    }
    clear() { }
}

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */

/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim$1 = function () {
  if (typeof Map !== 'undefined') {
    return Map;
  }
  /**
   * Returns index in provided array that matches the specified key.
   *
   * @param {Array<Array>} arr
   * @param {*} key
   * @returns {number}
   */


  function getIndex(arr, key) {
    var result = -1;
    arr.some(function (entry, index) {
      if (entry[0] === key) {
        result = index;
        return true;
      }

      return false;
    });
    return result;
  }

  return (
    /** @class */
    function () {
      function class_1() {
        this.__entries__ = [];
      }

      Object.defineProperty(class_1.prototype, "size", {
        /**
         * @returns {boolean}
         */
        get: function () {
          return this.__entries__.length;
        },
        enumerable: true,
        configurable: true
      });
      /**
       * @param {*} key
       * @returns {*}
       */

      class_1.prototype.get = function (key) {
        var index = getIndex(this.__entries__, key);
        var entry = this.__entries__[index];
        return entry && entry[1];
      };
      /**
       * @param {*} key
       * @param {*} value
       * @returns {void}
       */


      class_1.prototype.set = function (key, value) {
        var index = getIndex(this.__entries__, key);

        if (~index) {
          this.__entries__[index][1] = value;
        } else {
          this.__entries__.push([key, value]);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */


      class_1.prototype.delete = function (key) {
        var entries = this.__entries__;
        var index = getIndex(entries, key);

        if (~index) {
          entries.splice(index, 1);
        }
      };
      /**
       * @param {*} key
       * @returns {void}
       */


      class_1.prototype.has = function (key) {
        return !!~getIndex(this.__entries__, key);
      };
      /**
       * @returns {void}
       */


      class_1.prototype.clear = function () {
        this.__entries__.splice(0);
      };
      /**
       * @param {Function} callback
       * @param {*} [ctx=null]
       * @returns {void}
       */


      class_1.prototype.forEach = function (callback, ctx) {
        if (ctx === void 0) {
          ctx = null;
        }

        for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
          var entry = _a[_i];
          callback.call(ctx, entry[1], entry[0]);
        }
      };

      return class_1;
    }()
  );
}();
/**
 * Detects whether window and document objects are available in current environment.
 */


var isBrowser$1 = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document; // Returns global object of a current environment.

var global$1$1 = function () {
  if (typeof global !== 'undefined' && global.Math === Math) {
    return global;
  }

  if (typeof self !== 'undefined' && self.Math === Math) {
    return self;
  }

  if (typeof window !== 'undefined' && window.Math === Math) {
    return window;
  } // eslint-disable-next-line no-new-func


  return Function('return this')();
}();
/**
 * A shim for the requestAnimationFrame which falls back to the setTimeout if
 * first one is not supported.
 *
 * @returns {number} Requests' identifier.
 */


var requestAnimationFrame$1$1 = function () {
  if (typeof requestAnimationFrame === 'function') {
    // It's required to use a bounded function because IE sometimes throws
    // an "Invalid calling object" error if rAF is invoked without the global
    // object on the left hand side.
    return requestAnimationFrame.bind(global$1$1);
  }

  return function (callback) {
    return setTimeout(function () {
      return callback(Date.now());
    }, 1000 / 60);
  };
}(); // Defines minimum timeout before adding a trailing call.


var trailingTimeout$1 = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */

function throttle$1(callback, delay) {
  var leadingCall = false,
      trailingCall = false,
      lastCallTime = 0;
  /**
   * Invokes the original callback function and schedules new invocation if
   * the "proxy" was called during current request.
   *
   * @returns {void}
   */

  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }

    if (trailingCall) {
      proxy();
    }
  }
  /**
   * Callback invoked after the specified delay. It will further postpone
   * invocation of the original function delegating it to the
   * requestAnimationFrame.
   *
   * @returns {void}
   */


  function timeoutCallback() {
    requestAnimationFrame$1$1(resolvePending);
  }
  /**
   * Schedules invocation of the original function.
   *
   * @returns {void}
   */


  function proxy() {
    var timeStamp = Date.now();

    if (leadingCall) {
      // Reject immediately following calls.
      if (timeStamp - lastCallTime < trailingTimeout$1) {
        return;
      } // Schedule new call to be in invoked when the pending one is resolved.
      // This is important for "transitions" which never actually start
      // immediately so there is a chance that we might miss one if change
      // happens amids the pending invocation.


      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }

    lastCallTime = timeStamp;
  }

  return proxy;
} // Minimum delay before invoking the update of observers.


var REFRESH_DELAY$1 = 20; // A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.

var transitionKeys$1 = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight']; // Check if MutationObserver is available.

var mutationObserverSupported$1 = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */

var ResizeObserverController$1 =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserverController.
   *
   * @private
   */
  function ResizeObserverController() {
    /**
     * Indicates whether DOM listeners have been added.
     *
     * @private {boolean}
     */
    this.connected_ = false;
    /**
     * Tells that controller has subscribed for Mutation Events.
     *
     * @private {boolean}
     */

    this.mutationEventsAdded_ = false;
    /**
     * Keeps reference to the instance of MutationObserver.
     *
     * @private {MutationObserver}
     */

    this.mutationsObserver_ = null;
    /**
     * A list of connected observers.
     *
     * @private {Array<ResizeObserverSPI>}
     */

    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle$1(this.refresh.bind(this), REFRESH_DELAY$1);
  }
  /**
   * Adds observer to observers list.
   *
   * @param {ResizeObserverSPI} observer - Observer to be added.
   * @returns {void}
   */


  ResizeObserverController.prototype.addObserver = function (observer) {
    if (!~this.observers_.indexOf(observer)) {
      this.observers_.push(observer);
    } // Add listeners if they haven't been added yet.


    if (!this.connected_) {
      this.connect_();
    }
  };
  /**
   * Removes observer from observers list.
   *
   * @param {ResizeObserverSPI} observer - Observer to be removed.
   * @returns {void}
   */


  ResizeObserverController.prototype.removeObserver = function (observer) {
    var observers = this.observers_;
    var index = observers.indexOf(observer); // Remove observer if it's present in registry.

    if (~index) {
      observers.splice(index, 1);
    } // Remove listeners if controller has no connected observers.


    if (!observers.length && this.connected_) {
      this.disconnect_();
    }
  };
  /**
   * Invokes the update of observers. It will continue running updates insofar
   * it detects changes.
   *
   * @returns {void}
   */


  ResizeObserverController.prototype.refresh = function () {
    var changesDetected = this.updateObservers_(); // Continue running updates if changes have been detected as there might
    // be future ones caused by CSS transitions.

    if (changesDetected) {
      this.refresh();
    }
  };
  /**
   * Updates every observer from observers list and notifies them of queued
   * entries.
   *
   * @private
   * @returns {boolean} Returns "true" if any observer has detected changes in
   *      dimensions of it's elements.
   */


  ResizeObserverController.prototype.updateObservers_ = function () {
    // Collect observers that have active observations.
    var activeObservers = this.observers_.filter(function (observer) {
      return observer.gatherActive(), observer.hasActive();
    }); // Deliver notifications in a separate cycle in order to avoid any
    // collisions between observers, e.g. when multiple instances of
    // ResizeObserver are tracking the same element and the callback of one
    // of them changes content dimensions of the observed target. Sometimes
    // this may result in notifications being blocked for the rest of observers.

    activeObservers.forEach(function (observer) {
      return observer.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  /**
   * Initializes DOM listeners.
   *
   * @private
   * @returns {void}
   */


  ResizeObserverController.prototype.connect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already added.
    if (!isBrowser$1 || this.connected_) {
      return;
    } // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.


    document.addEventListener('transitionend', this.onTransitionEnd_);
    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported$1) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    } else {
      document.addEventListener('DOMSubtreeModified', this.refresh);
      this.mutationEventsAdded_ = true;
    }

    this.connected_ = true;
  };
  /**
   * Removes DOM listeners.
   *
   * @private
   * @returns {void}
   */


  ResizeObserverController.prototype.disconnect_ = function () {
    // Do nothing if running in a non-browser environment or if listeners
    // have been already removed.
    if (!isBrowser$1 || !this.connected_) {
      return;
    }

    document.removeEventListener('transitionend', this.onTransitionEnd_);
    window.removeEventListener('resize', this.refresh);

    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }

    if (this.mutationEventsAdded_) {
      document.removeEventListener('DOMSubtreeModified', this.refresh);
    }

    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  /**
   * "Transitionend" event handler.
   *
   * @private
   * @param {TransitionEvent} event
   * @returns {void}
   */


  ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
    var _b = _a.propertyName,
        propertyName = _b === void 0 ? '' : _b; // Detect whether transition may affect dimensions of an element.

    var isReflowProperty = transitionKeys$1.some(function (key) {
      return !!~propertyName.indexOf(key);
    });

    if (isReflowProperty) {
      this.refresh();
    }
  };
  /**
   * Returns instance of the ResizeObserverController.
   *
   * @returns {ResizeObserverController}
   */


  ResizeObserverController.getInstance = function () {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController();
    }

    return this.instance_;
  };
  /**
   * Holds reference to the controller's instance.
   *
   * @private {ResizeObserverController}
   */


  ResizeObserverController.instance_ = null;
  return ResizeObserverController;
}();
/**
 * Defines non-writable/enumerable properties of the provided target object.
 *
 * @param {Object} target - Object for which to define properties.
 * @param {Object} props - Properties to be defined.
 * @returns {Object} Target object.
 */


var defineConfigurable$1 = function (target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true
    });
  }

  return target;
};
/**
 * Returns the global object associated with provided element.
 *
 * @param {Object} target
 * @returns {Object}
 */


var getWindowOf$1 = function (target) {
  // Assume that the element is an instance of Node, which means that it
  // has the "ownerDocument" property from which we can retrieve a
  // corresponding global object.
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView; // Return the local global object if it's not possible extract one from
  // provided element.

  return ownerGlobal || global$1$1;
}; // Placeholder of an empty content rectangle.


var emptyRect$1 = createRectInit$1(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */

function toFloat$1(value) {
  return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */


function getBordersSize$1(styles) {
  var positions = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }

  return positions.reduce(function (size, position) {
    var value = styles['border-' + position + '-width'];
    return size + toFloat$1(value);
  }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */


function getPaddings$1(styles) {
  var positions = ['top', 'right', 'bottom', 'left'];
  var paddings = {};

  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles['padding-' + position];
    paddings[position] = toFloat$1(value);
  }

  return paddings;
}
/**
 * Calculates content rectangle of provided SVG element.
 *
 * @param {SVGGraphicsElement} target - Element content rectangle of which needs
 *      to be calculated.
 * @returns {DOMRectInit}
 */


function getSVGContentRect$1(target) {
  var bbox = target.getBBox();
  return createRectInit$1(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */


function getHTMLElementContentRect$1(target) {
  // Client width & height properties can't be
  // used exclusively as they provide rounded values.
  var clientWidth = target.clientWidth,
      clientHeight = target.clientHeight; // By this condition we can catch all non-replaced inline, hidden and
  // detached elements. Though elements with width & height properties less
  // than 0.5 will be discarded as well.
  //
  // Without it we would need to implement separate methods for each of
  // those cases and it's not possible to perform a precise and performance
  // effective test for hidden elements. E.g. even jQuery's ':visible' filter
  // gives wrong results for elements with width & height less than 0.5.

  if (!clientWidth && !clientHeight) {
    return emptyRect$1;
  }

  var styles = getWindowOf$1(target).getComputedStyle(target);
  var paddings = getPaddings$1(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom; // Computed styles of width & height are being used because they are the
  // only dimensions available to JS that contain non-rounded values. It could
  // be possible to utilize the getBoundingClientRect if only it's data wasn't
  // affected by CSS transformations let alone paddings, borders and scroll bars.

  var width = toFloat$1(styles.width),
      height = toFloat$1(styles.height); // Width & height include paddings and borders when the 'border-box' box
  // model is applied (except for IE).

  if (styles.boxSizing === 'border-box') {
    // Following conditions are required to handle Internet Explorer which
    // doesn't include paddings and borders to computed CSS dimensions.
    //
    // We can say that if CSS dimensions + paddings are equal to the "client"
    // properties then it's either IE, and thus we don't need to subtract
    // anything, or an element merely doesn't have paddings/borders styles.
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize$1(styles, 'left', 'right') + horizPad;
    }

    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize$1(styles, 'top', 'bottom') + vertPad;
    }
  } // Following steps can't be applied to the document's root element as its
  // client[Width/Height] properties represent viewport area of the window.
  // Besides, it's as well not necessary as the <html> itself neither has
  // rendered scroll bars nor it can be clipped.


  if (!isDocumentElement$1(target)) {
    // In some browsers (only in Firefox, actually) CSS width & height
    // include scroll bars size which can be removed at this step as scroll
    // bars are the only difference between rounded dimensions + paddings
    // and "client" properties, though that is not always true in Chrome.
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight; // Chrome has a rather weird rounding of "client" properties.
    // E.g. for an element with content width of 314.2px it sometimes gives
    // the client width of 315px and for the width of 314.7px it may give
    // 314px. And it doesn't happen all the time. So just ignore this delta
    // as a non-relevant.

    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }

    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }

  return createRectInit$1(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


var isSVGGraphicsElement$1 = function () {
  // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
  // interface.
  if (typeof SVGGraphicsElement !== 'undefined') {
    return function (target) {
      return target instanceof getWindowOf$1(target).SVGGraphicsElement;
    };
  } // If it's so, then check that element is at least an instance of the
  // SVGElement and that it has the "getBBox" method.
  // eslint-disable-next-line no-extra-parens


  return function (target) {
    return target instanceof getWindowOf$1(target).SVGElement && typeof target.getBBox === 'function';
  };
}();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


function isDocumentElement$1(target) {
  return target === getWindowOf$1(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */


function getContentRect$1(target) {
  if (!isBrowser$1) {
    return emptyRect$1;
  }

  if (isSVGGraphicsElement$1(target)) {
    return getSVGContentRect$1(target);
  }

  return getHTMLElementContentRect$1(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */


function createReadOnlyRect$1(_a) {
  var x = _a.x,
      y = _a.y,
      width = _a.width,
      height = _a.height; // If DOMRectReadOnly is available use it as a prototype for the rectangle.

  var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype); // Rectangle's properties are not writable and non-enumerable.

  defineConfigurable$1(rect, {
    x: x,
    y: y,
    width: width,
    height: height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x
  });
  return rect;
}
/**
 * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
 * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
 *
 * @param {number} x - X coordinate.
 * @param {number} y - Y coordinate.
 * @param {number} width - Rectangle's width.
 * @param {number} height - Rectangle's height.
 * @returns {DOMRectInit}
 */


function createRectInit$1(x, y, width, height) {
  return {
    x: x,
    y: y,
    width: width,
    height: height
  };
}
/**
 * Class that is responsible for computations of the content rectangle of
 * provided DOM element and for keeping track of it's changes.
 */


var ResizeObservation$1 =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObservation.
   *
   * @param {Element} target - Element to be observed.
   */
  function ResizeObservation(target) {
    /**
     * Broadcasted width of content rectangle.
     *
     * @type {number}
     */
    this.broadcastWidth = 0;
    /**
     * Broadcasted height of content rectangle.
     *
     * @type {number}
     */

    this.broadcastHeight = 0;
    /**
     * Reference to the last observed content rectangle.
     *
     * @private {DOMRectInit}
     */

    this.contentRect_ = createRectInit$1(0, 0, 0, 0);
    this.target = target;
  }
  /**
   * Updates content rectangle and tells whether it's width or height properties
   * have changed since the last broadcast.
   *
   * @returns {boolean}
   */


  ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect$1(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  /**
   * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
   * from the corresponding properties of the last observed content rectangle.
   *
   * @returns {DOMRectInit} Last observed content rectangle.
   */


  ResizeObservation.prototype.broadcastRect = function () {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };

  return ResizeObservation;
}();

var ResizeObserverEntry$1 =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObserverEntry.
   *
   * @param {Element} target - Element that is being observed.
   * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
   */
  function ResizeObserverEntry(target, rectInit) {
    var contentRect = createReadOnlyRect$1(rectInit); // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.

    defineConfigurable$1(this, {
      target: target,
      contentRect: contentRect
    });
  }

  return ResizeObserverEntry;
}();

var ResizeObserverSPI$1 =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserver.
   *
   * @param {ResizeObserverCallback} callback - Callback function that is invoked
   *      when one of the observed elements changes it's content dimensions.
   * @param {ResizeObserverController} controller - Controller instance which
   *      is responsible for the updates of observer.
   * @param {ResizeObserver} callbackCtx - Reference to the public
   *      ResizeObserver instance which will be passed to callback function.
   */
  function ResizeObserverSPI(callback, controller, callbackCtx) {
    /**
     * Collection of resize observations that have detected changes in dimensions
     * of elements.
     *
     * @private {Array<ResizeObservation>}
     */
    this.activeObservations_ = [];
    /**
     * Registry of the ResizeObservation instances.
     *
     * @private {Map<Element, ResizeObservation>}
     */

    this.observations_ = new MapShim$1();

    if (typeof callback !== 'function') {
      throw new TypeError('The callback provided as parameter 1 is not a function.');
    }

    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  /**
   * Starts observing provided element.
   *
   * @param {Element} target - Element to be observed.
   * @returns {void}
   */


  ResizeObserverSPI.prototype.observe = function (target) {
    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    } // Do nothing if current environment doesn't have the Element interface.


    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
      return;
    }

    if (!(target instanceof getWindowOf$1(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is already being observed.

    if (observations.has(target)) {
      return;
    }

    observations.set(target, new ResizeObservation$1(target));
    this.controller_.addObserver(this); // Force the update of observations.

    this.controller_.refresh();
  };
  /**
   * Stops observing provided element.
   *
   * @param {Element} target - Element to stop observing.
   * @returns {void}
   */


  ResizeObserverSPI.prototype.unobserve = function (target) {
    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    } // Do nothing if current environment doesn't have the Element interface.


    if (typeof Element === 'undefined' || !(Element instanceof Object)) {
      return;
    }

    if (!(target instanceof getWindowOf$1(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is not being observed.

    if (!observations.has(target)) {
      return;
    }

    observations.delete(target);

    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  /**
   * Stops observing all elements.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  /**
   * Collects observation instances the associated element of which has changed
   * it's content rectangle.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.gatherActive = function () {
    var _this = this;

    this.clearActive();
    this.observations_.forEach(function (observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  /**
   * Invokes initial callback function with a list of ResizeObserverEntry
   * instances collected from active resize observations.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.broadcastActive = function () {
    // Do nothing if observer doesn't have active observations.
    if (!this.hasActive()) {
      return;
    }

    var ctx = this.callbackCtx_; // Create ResizeObserverEntry instance for every active observation.

    var entries = this.activeObservations_.map(function (observation) {
      return new ResizeObserverEntry$1(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  /**
   * Clears the collection of active observations.
   *
   * @returns {void}
   */


  ResizeObserverSPI.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
  };
  /**
   * Tells whether observer has active observations.
   *
   * @returns {boolean}
   */


  ResizeObserverSPI.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
  };

  return ResizeObserverSPI;
}(); // Registry of internal observers. If WeakMap is not available use current shim
// for the Map collection as it has all required methods and because WeakMap
// can't be fully polyfilled anyway.


var observers$1 = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim$1();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */

var ResizeObserver$1 =
/** @class */
function () {
  /**
   * Creates a new instance of ResizeObserver.
   *
   * @param {ResizeObserverCallback} callback - Callback that is invoked when
   *      dimensions of the observed elements change.
   */
  function ResizeObserver(callback) {
    if (!(this instanceof ResizeObserver)) {
      throw new TypeError('Cannot call a class as a function.');
    }

    if (!arguments.length) {
      throw new TypeError('1 argument required, but only 0 present.');
    }

    var controller = ResizeObserverController$1.getInstance();
    var observer = new ResizeObserverSPI$1(callback, controller, this);
    observers$1.set(this, observer);
  }

  return ResizeObserver;
}(); // Expose public methods of ResizeObserver.


['observe', 'unobserve', 'disconnect'].forEach(function (method) {
  ResizeObserver$1.prototype[method] = function () {
    var _a;

    return (_a = observers$1.get(this))[method].apply(_a, arguments);
  };
});

var index$1 = function () {
  // Export existing implementation if available.
  if (typeof global$1$1.ResizeObserver !== 'undefined') {
    return global$1$1.ResizeObserver;
  }

  return ResizeObserver$1;
}();

var template$6 = "<div ref=\"root\" class=\"root\">\n  <div ref=\"checkContainer\" class=\"checkContainer hidden\">check text</div>\n  <button ref=\"left-more\" class=\"down hidden\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M7 10l5 5 5-5z\"/>\n    </svg>\n  </button>\n  <div ref=\"leftAdditional\" class=\"leftAdditional hidden\"></div>\n  <div ref=\"list\" class=\"list\"></div>\n  <div class=\"addContainer\">\n    <div ref=\"rightAdditional\" class=\"rightAdditional hidden\"></div>\n    <button ref=\"right-more\" class=\"down hidden\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M7 10l5 5 5-5z\"/>\n      </svg>\n    </button>\n    <button ref=\"add\" type=\"button\" class=\"add\">\n      <svg class=\"addIcon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/>\n      </svg>\n    </button>\n  </div>\n</div>\n";

var css$8 = {"root":"root-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","checkContainer":"checkContainer-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","down":"down-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","hidden":"hidden-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","draggable":"draggable-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","leftAdditional":"leftAdditional-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","rightAdditional":"rightAdditional-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","leftTwo":"leftTwo-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","rightTwo":"rightTwo-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","list":"list-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","navigationContainer":"navigationContainer-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","addContainer":"addContainer-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","add":"add-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","leftList":"leftList-terminals-orchestrator-️32767fb230043e09a6e46992228726e7","rightList":"rightList-terminals-orchestrator-️32767fb230043e09a6e46992228726e7"};

var template$7 = "<button draggable=\"true\" ref=\"root\" class=\"root {hidden} {invisible} {active} {reverse} {first}\">\n  <div ref=\"close\" class=\"close\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n    </svg>\n  </div>\n  <div ref=\"title\" class=\"title\">\n    <span ref=\"titleText\" class=\"titleText\">{title}</span>\n    <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  </div>\n  <div class=\"rightAction\">\n    <div ref=\"shortcut\" class=\"shortcut\">\n      <span ref=\"shortcutText\" class=\"shortcutText\">{shortcut}</span>\n    </div>\n    <div ref=\"rename\" class=\"rename\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n      </svg>\n    </div>\n  </div>\n</button>\n";

var css$9 = {"root":"root-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","reverse":"reverse-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","skipHover":"skipHover-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","active":"active-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","draggable":"draggable-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","invisible":"invisible-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","hidden":"hidden-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","close":"close-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","title":"title-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","editable":"editable-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","titleText":"titleText-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","input":"input-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","inputContainer":"inputContainer-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","rightAction":"rightAction-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","shortcut":"shortcut-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","shortcutText":"shortcutText-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5","rename":"rename-terminals-orchestrator-️00c66dbf3b77e267fe7449a31678b3d5"};

const IS_MAC$1 = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const escapeString$1 = (str) => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
const safeTemplate = (template, data) => Object.keys(data)
    .reduce((acc, key) => acc.replace(new RegExp(`{${key}}`, 'g'), escapeString$1(data[key])), template);

const ENTER_KEY_CODE = 13;
const ESC_KEY_CODE = 27;
const ONE_KEY_CODE = 49;
const E_KEY_CODE = 69;

var template$8 = "<input ref=\"root\" class=\"root {className}\" type=\"text\">\n";

var css$a = {"root":"root-terminals-orchestrator-️1fb1e5ff957640d096217b4738ff5678","disabled":"disabled-terminals-orchestrator-️1fb1e5ff957640d096217b4738ff5678"};

class SelectInput extends TemplateEngine {
    constructor(container, options = { value: '' }) {
        super(template$8, container);
        this.isDisabled = false;
        this.keyDownHandler = (e) => {
            const { onSubmit } = this.options;
            const { keyCode } = e;
            if (keyCode === ENTER_KEY_CODE && onSubmit)
                onSubmit(e);
        };
        this.options = options;
        this.render();
        this.addListeners();
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled } = this;
        this.isDisabled = val;
        if (isDisabled === val)
            return;
        const root = this.getRef('root');
        if (val) {
            root.classList.add(css$a.disabled);
            root.setAttribute('disabled', 'true');
        }
        else {
            root.removeAttribute('disabled');
            root.classList.remove(css$a.disabled);
        }
    }
    get value() {
        const root = this.getRef('root');
        return root.value;
    }
    set value(val) {
        const root = this.getRef('root');
        root.value = val;
    }
    render() {
        const { value, disabled = false, className = '' } = this.options;
        super.render({ css: css$a, className });
        this.disabled = disabled;
        this.getRef('root').value = value;
    }
    select() {
        const root = this.getRef('root');
        root.select();
    }
    focus() {
        const root = this.getRef('root');
        root.focus();
    }
    blur() {
        const root = this.getRef('root');
        root.blur();
    }
    destroy() {
        this.removeListeners();
        super.destroy();
    }
    addListeners() {
        const root = this.getRef('root');
        const { onBlur, onSubmit } = this.options;
        if (onBlur)
            root.addEventListener('blur', onBlur);
        if (onSubmit)
            root.addEventListener('keydown', this.keyDownHandler);
    }
    removeListeners() {
        const root = this.getRef('root');
        const { onBlur, onSubmit } = this.options;
        if (onBlur)
            root.removeEventListener('blur', onBlur);
        if (onSubmit)
            root.removeEventListener('keydown', this.keyDownHandler);
    }
}

class Tab extends TemplateEngine {
    constructor(container, options) {
        super(template$7, container);
        this.shortcutIndexField = 0;
        this.indexField = -1;
        this.titleField = '';
        this.isActive = false;
        this.isHiddenField = false;
        this.leftField = 0;
        this.disabledHoverField = false;
        this.handlers = { click: [], close: [], drag: [], dragend: [], rename: [] };
        this.emitter = new Emitter(EMITTER_FORCE_LAYER_TYPE);
        this.rename = () => {
            this.editableTitle = true;
        };
        this.clickHandler = (e) => {
            const { index, handlers } = this;
            handlers.click.forEach(handler => handler(index, e));
        };
        this.keyboardSelectHandler = (e) => {
            e.preventDefault();
            const { index, handlers } = this;
            handlers.click.forEach(handler => handler(index, e));
        };
        this.closeHandler = (e) => {
            const { index, handlers } = this;
            e.stopPropagation();
            handlers.close.forEach(handler => handler(index, e));
        };
        this.dragStartHandler = () => {
            const root = this.getRef('root');
            root.classList.add(css$9.draggable);
        };
        this.dragHandler = (e) => {
            const { handlers, index } = this;
            handlers.drag.forEach(handler => handler(index, e));
        };
        this.dragEndHandler = (e) => {
            const { handlers, index } = this;
            const root = this.getRef('root');
            root.classList.remove(css$9.draggable);
            handlers.dragend.forEach(handler => handler(index, e));
        };
        this.dragoverHandler = (e) => {
            e.preventDefault();
        };
        this.submitTitleHandler = () => {
            const { titleInput, index, handlers } = this;
            this.title = titleInput.value;
            this.editableTitle = false;
            handlers.rename.forEach((handler) => {
                handler(index, this.title);
            });
        };
        this.isActive = options.active || false;
        this.isInvisible = options.invisible || false;
        this.titleField = options.title || '';
        this.indexField = options.index === undefined ? -1 : options.index;
        this.options = options;
        this.render();
        this.titleInput = new SelectInput(this.getRef('inputContainer'), {
            className: css$9.input, value: this.titleField, disabled: true,
            onSubmit: this.submitTitleHandler, onBlur: this.submitTitleHandler,
        });
        this.addListeners();
    }
    get editableTitle() {
        return !this.titleInput.disabled;
    }
    set editableTitle(val) {
        const { titleInput } = this;
        if (titleInput.disabled !== val)
            return;
        const title = this.getRef('title');
        if (val) {
            titleInput.disabled = false;
            titleInput.focus();
            titleInput.select();
            title.classList.add(css$9.editable);
        }
        else {
            titleInput.blur();
            titleInput.disabled = true;
            title.classList.remove(css$9.editable);
        }
    }
    set shortcutIndex(val) {
        const { shortcutIndexField, emitter } = this;
        const shortcutText = this.getRef('shortcutText');
        this.shortcutIndexField = val;
        if (shortcutText && val !== shortcutIndexField) {
            shortcutText.innerHTML = this.shortcut;
            if (val && val < 10) {
                emitter.removeListener('keyDown', this.keyboardSelectHandler);
                emitter.addListener('keyDown', this.keyboardSelectHandler, Object.assign({ code: ONE_KEY_CODE + val - 1 }, (IS_MAC$1 ? { metaKey: true } : { altKey: true })));
            }
            else {
                emitter.removeListener('keyDown', this.keyboardSelectHandler);
            }
        }
    }
    get shortcutIndex() {
        return this.shortcutIndexField;
    }
    set index(val) {
        this.indexField = val;
    }
    get index() {
        return this.indexField;
    }
    get width() {
        const root = this.getRef('root');
        return root ? root.offsetWidth : 0;
    }
    set title(val) {
        const titleText = this.getRef('titleText');
        if (titleText && val !== this.titleField)
            titleText.innerHTML = escapeString$1(val);
        this.titleField = val;
    }
    get title() {
        return this.titleField;
    }
    set active(val) {
        const root = this.getRef('root');
        if (root && val !== this.isActive) {
            if (val)
                root.classList.add(css$9.active);
            else
                root.classList.remove(css$9.active);
        }
        this.isActive = val;
    }
    get active() {
        return this.isActive;
    }
    set invisible(val) {
        if (this.isInvisible === val)
            return;
        this.isInvisible = val;
        const root = this.getRef('root');
        if (!root)
            return;
        if (val)
            root.classList.add(css$9.invisible);
        else
            root.classList.remove(css$9.invisible);
    }
    get invisible() {
        return this.isInvisible;
    }
    set hidden(val) {
        if (this.isHiddenField === val)
            return;
        this.isHiddenField = val;
        const root = this.getRef('root');
        if (!root)
            return;
        if (val)
            root.classList.add(css$9.hidden);
        else
            root.classList.remove(css$9.hidden);
    }
    get hidden() {
        return this.isHiddenField;
    }
    get left() {
        return this.leftField;
    }
    set left(val) {
        if (this.leftField === val)
            return;
        const root = this.getRef('root');
        this.leftField = val;
        root.style.left = `${val}px`;
    }
    get disabledHover() {
        return this.disabledHoverField;
    }
    set disabledHover(val) {
        if (this.disabledHoverField === val)
            return;
        this.disabledHoverField = val;
        const root = this.getRef('root');
        if (val)
            root.classList.add(css$9.skipHover);
        else
            root.classList.remove(css$9.skipHover);
    }
    get shortcut() {
        const { shortcutIndexField } = this;
        if (!shortcutIndexField)
            return '';
        return IS_MAC$1 ? `⌘${shortcutIndexField}` : `alt${shortcutIndexField}`;
    }
    render() {
        const { title, active, shortcut, index } = this;
        super.render({
            shortcut,
            css: css$9,
            title: escapeString$1(title),
            active: active ? css$9.active : '',
            reverse: IS_MAC$1 ? '' : css$9.reverse,
            first: index === 0 ? css$9.first : '',
            invisible: this.isInvisible ? css$9.invisible : '',
            hidden: this.isHiddenField ? css$9.hidden : '',
        });
    }
    addEventListener(event, handler) {
        const list = this.handlers[event];
        if (list)
            list.push(handler);
    }
    removeEventListener(event, handler) {
        const list = this.handlers[event];
        if (!list)
            return;
        const index = list.indexOf(handler);
        if (index >= 0)
            list.splice(index, 1);
    }
    destroy() {
        this.emitter.destroy();
        this.removeListeners();
        super.destroy();
    }
    addListeners() {
        const root = this.getRef('root');
        const close = this.getRef('close');
        const rename = this.getRef('rename');
        root.addEventListener('click', this.clickHandler);
        root.addEventListener('dragstart', this.dragStartHandler);
        root.addEventListener('drag', this.dragHandler);
        document.addEventListener('dragover', this.dragoverHandler);
        root.addEventListener('dragend', this.dragEndHandler);
        close.addEventListener('click', this.closeHandler);
        rename.addEventListener('click', this.rename);
    }
    removeListeners() {
        const root = this.getRef('root');
        const close = this.getRef('close');
        const rename = this.getRef('rename');
        root.removeEventListener('click', this.clickHandler);
        root.removeEventListener('dragstart', this.dragStartHandler);
        root.removeEventListener('drag', this.dragHandler);
        document.removeEventListener('dragover', this.dragoverHandler);
        root.addEventListener('dragend', this.dragEndHandler);
        close.removeEventListener('click', this.closeHandler);
        rename.removeEventListener('click', this.rename);
        this.emitter.removeListener('keyDown', this.keyboardSelectHandler);
    }
}

const FOCUS_EVENT_TYPE = 'focus';
const CLOSE_EVENT_TYPE = 'close';
const CLICK_EVENT_TYPE = 'click';
const DRAG_EVENT_TYPE = 'drag';
const DRAG_END_EVENT_TYPE = 'dragend';
const RENAME_EVENT_TYPE = 'rename';
const ADD_EVENT_TYPE = 'add';
const TAB_EVENTS = [FOCUS_EVENT_TYPE, CLOSE_EVENT_TYPE];

var template$9 = "<div ref=\"root\" class=\"container\">\n  <ul ref=\"list\" class=\"list {className}\"></ul>\n</div>\n";

var css$b = {"container":"container-terminals-orchestrator-️3219d13463fc603703e7200ef6fa62c8","list":"list-terminals-orchestrator-️3219d13463fc603703e7200ef6fa62c8"};

var template$a = "<li class=\"root\">\n  <button data-index=\"{index}\" class=\"button\">\n    <span class=\"text\">{text}</span>\n  </button>\n</li>\n";

var css$c = {"root":"root-terminals-orchestrator-️2539e7faf0ca977b17ae54fba23acaa6","button":"button-terminals-orchestrator-️2539e7faf0ca977b17ae54fba23acaa6","text":"text-terminals-orchestrator-️2539e7faf0ca977b17ae54fba23acaa6"};

class HiddenListItem extends TemplateEngine {
    constructor(container, options) {
        super(template$a, container);
        this.text = options.text;
        this.index = options.index;
        this.render();
    }
    render() {
        const { text, index } = this;
        super.render({ css: css$c, text, index });
    }
}

class HiddenList extends TemplateEngine {
    constructor(container, options = { items: [] }) {
        super(template$9, container);
        this.options = { items: [] };
        this.items = [];
        this.emitter = new Emitter(EMITTER_TOP_LAYER_TYPE);
        this.onListClick = (e) => {
            const { onSelect } = this.options;
            e.stopPropagation();
            const dataIndex = e.target.getAttribute('data-index');
            if (dataIndex && onSelect)
                onSelect(Number(dataIndex), e);
        };
        this.options = options;
        this.render();
    }
    render() {
        super.render({ css: css$b, className: this.options.className || '' });
        this.renderItems();
        this.updatePosition();
        this.addListeners();
    }
    destroy() {
        this.removeListeners();
        this.items.forEach(item => item.destroy());
        this.emitter.destroy();
        super.destroy();
    }
    renderItems() {
        const { items } = this.options;
        const list = this.getRef('list');
        this.items = items.map(({ text, id }) => {
            return new HiddenListItem(list, { text, index: id });
        });
    }
    updatePosition() {
        const { position = {} } = this.options;
        const root = this.getRef('root');
        root.style.left = position.left ? `${position.left || 0}px` : '';
        root.style.right = position.right ? `${position.right || 0}px` : '';
        root.style.top = position.top ? `${position.top || 0}px` : '';
        root.style.bottom = position.bottom ? `${position.bottom || 0}px` : '';
    }
    addListeners() {
        const { onClose } = this.options;
        if (onClose) {
            this.emitter.addListener('keyDown', onClose, { code: ESC_KEY_CODE });
            this.getRef('root').addEventListener('click', onClose);
        }
        this.getRef('list').addEventListener('click', this.onListClick);
    }
    removeListeners() {
        const { onClose } = this.options;
        if (onClose) {
            this.emitter.removeListener('keyDown', onClose);
            this.getRef('root').removeEventListener('click', onClose);
        }
        this.getRef('list').removeEventListener('click', this.onListClick);
    }
}

class Tabs extends TemplateEngine {
    constructor(container, options = {}) {
        super(template$6, container);
        this.tabsField = [];
        this.activeTabField = 0;
        this.visibleListWidth = 0;
        this.checkWidth = 0;
        this.tabsInfo = [];
        this.handlers = { focus: [], close: [], add: [], dragend: [] };
        this.observeHandler = (entries) => {
            const checkContainer = this.getRef('checkContainer');
            const checkContainerEntry = entries.find(item => item.target === checkContainer);
            if (checkContainerEntry && (checkContainerEntry === null || checkContainerEntry === void 0 ? void 0 : checkContainerEntry.contentRect.width) !== this.checkWidth) {
                this.updateTabsInfoSizes();
            }
            this.closeHiddenTabsHandler();
            this.updateListView();
        };
        this.updateListView = () => {
            this.updateVisibleListWidth();
            const { visibleListWidth, tabsInfo } = this;
            const width = tabsInfo.reduce((acc, item) => acc + item.width, 0);
            if (width > visibleListWidth) {
                this.hideTabs();
            }
            else {
                this.showTabs();
            }
        };
        this.addClickHandler = () => {
            this.handlers[ADD_EVENT_TYPE].forEach(handler => handler());
        };
        this.tabDragHandler = (index, e) => {
            const { dragInfo, tabsInfo } = this;
            if (dragInfo) {
                this.updateDragInfo(e);
                this.updateTabsPosition();
            }
            else {
                tabsInfo.forEach(item => item.tab.disabledHover = true);
                const root = this.getRef('root');
                root.classList.add(css$8.draggable);
                const { left } = this.getRef('list').getBoundingClientRect();
                const { clientX } = e;
                this.dragInfo = { index, left: clientX - left, replaceIndex: index };
            }
        };
        this.tabDragEndHandler = () => {
            const { tabsInfo, handlers, tabs } = this;
            const root = this.getRef('root');
            tabsInfo.forEach(item => item.tab.disabledHover = false);
            root.classList.remove(css$8.draggable);
            this.updateOrder();
            delete this.dragInfo;
            handlers.dragend.forEach(callback => callback(tabs));
        };
        this.showLeftHiddenTabs = () => {
            const { tabsInfo } = this;
            let stop = false;
            const leftList = tabsInfo.reduce((acc, item, index) => {
                if (!item.isVisible && !stop)
                    acc.push({ text: item.tab.title, id: index });
                else
                    stop = true;
                return acc;
            }, []);
            if (leftList.length) {
                this.hiddenList = new HiddenList(this.container, {
                    items: leftList, className: css$8.leftList, onClose: this.closeHiddenTabsHandler,
                    onSelect: this.selectHiddenTabHandler,
                });
            }
        };
        this.showRightHiddenTabs = () => {
            const { tabsInfo } = this;
            let start = false;
            const rightList = tabsInfo.reduce((acc, item, index) => {
                if (item.isVisible && !start)
                    start = true;
                else if (start && !item.isVisible)
                    acc.push({ text: item.tab.title, id: index });
                return acc;
            }, []);
            if (rightList.length) {
                this.hiddenList = new HiddenList(this.container, {
                    items: rightList, className: css$8.rightList, onClose: this.closeHiddenTabsHandler,
                    onSelect: this.selectHiddenTabHandler,
                });
            }
        };
        this.closeHiddenTabsHandler = () => {
            var _a;
            (_a = this.hiddenList) === null || _a === void 0 ? void 0 : _a.destroy();
            delete this.hiddenList;
        };
        this.selectHiddenTabHandler = (index) => {
            this.closeHiddenTabsHandler();
            this.activeTab = index;
        };
        this.renameTabHandler = (index, title) => {
            const tabField = this.tabsField[index];
            if (tabField)
                tabField.title = title;
        };
        this.options = options;
        this.ro = new index$1(this.observeHandler);
        this.render();
    }
    get tabs() {
        return this.tabsField;
    }
    set tabs(val) {
        const { tabsInfo } = this;
        this.tabsField = val;
        tabsInfo.forEach(item => item.tab.destroy());
        this.tabsInfo = [];
        this.activeTabField = 0;
        this.renderTabs();
        this.updateListView();
    }
    get activeTab() {
        return this.activeTabField;
    }
    set activeTab(val) {
        const { tabsField, tabsInfo, activeTabField } = this;
        if (val >= 0 && val <= tabsField.length - 1) {
            if (tabsInfo[activeTabField])
                tabsInfo[activeTabField].tab.active = false;
            const tabInfo = tabsInfo[val];
            this.activeTabField = val;
            if (tabInfo)
                tabInfo.tab.active = true;
            if (!tabInfo.isVisible)
                this.updateListView();
        }
    }
    render() {
        super.render({ css: css$8 });
        this.checkWidth = this.getRef('checkContainer').offsetWidth;
        this.addListeners();
        const addButton = this.getRef('add');
        addButton.setAttribute('title', 'alt + E');
    }
    destroy() {
        this.removeListeners();
        super.destroy();
    }
    addEventListener(event, handler) {
        const { handlers, tabsInfo } = this;
        const list = handlers[event];
        if (!list)
            return;
        list.push(handler);
        if (TAB_EVENTS.includes(event)) {
            tabsInfo.forEach((tabInfo) => {
                const tabEvent = event === FOCUS_EVENT_TYPE ? CLICK_EVENT_TYPE : event;
                tabInfo.tab.addEventListener(tabEvent, handler);
            });
        }
    }
    removeEventListener(event, handler) {
        const { handlers, tabsInfo } = this;
        const list = handlers[event];
        if (!list)
            return;
        const index = list.indexOf(handler);
        if (index < 0)
            return;
        list.splice(index, 1);
        if (TAB_EVENTS.includes(event)) {
            tabsInfo.forEach((tabInfo) => {
                const tabEvent = event === FOCUS_EVENT_TYPE ? CLICK_EVENT_TYPE : event;
                tabInfo.tab.removeEventListener(tabEvent, handler);
            });
        }
    }
    addListeners() {
        this.getRef('add').addEventListener('click', this.addClickHandler);
        this.getRef('left-more').addEventListener('click', this.showLeftHiddenTabs);
        this.getRef('right-more').addEventListener('click', this.showRightHiddenTabs);
        this.ro.observe(this.getRef('root'));
        this.ro.observe(this.getRef('checkContainer'));
    }
    removeListeners() {
        this.ro.unobserve(this.getRef('root'));
        this.ro.unobserve(this.getRef('checkContainer'));
        this.getRef('add').removeEventListener('click', this.addClickHandler);
        this.getRef('left-more').removeEventListener('click', this.showLeftHiddenTabs);
        this.getRef('right-more')
            .removeEventListener('click', this.showRightHiddenTabs);
    }
    renderTabs() {
        const { activeTab, tabs, options: { localizations }, handlers: { close, focus } } = this;
        const list = this.getRef('list');
        if (list) {
            this.tabsInfo = tabs.map(({ title }, index) => {
                const tab = new Tab(list, {
                    title, index, localizations, active: index === activeTab, invisible: true,
                });
                if (close.length) {
                    close.forEach(handler => tab.addEventListener(CLOSE_EVENT_TYPE, handler));
                }
                if (focus.length) {
                    focus.forEach(handler => tab.addEventListener(CLICK_EVENT_TYPE, handler));
                }
                tab.addEventListener(DRAG_EVENT_TYPE, this.tabDragHandler);
                tab.addEventListener(DRAG_END_EVENT_TYPE, this.tabDragEndHandler);
                tab.addEventListener(RENAME_EVENT_TYPE, this.renameTabHandler);
                return { tab, isVisible: true, width: tab.width };
            });
        }
    }
    updateVisibleListWidth() {
        const root = this.getRef('root');
        const leftMore = this.getRef('left-more');
        const rightMore = this.getRef('right-more');
        const add = this.getRef('add');
        this.visibleListWidth = root.offsetWidth - leftMore.offsetWidth - rightMore.offsetWidth
            - add.offsetWidth;
    }
    hideTabs() {
        this.updateTabsInfo();
        const { tabsInfo } = this;
        let shortcutIndex = 1;
        tabsInfo.forEach((item) => {
            if (item.isVisible) {
                item.tab.hidden = false;
                item.tab.invisible = false;
                item.tab.shortcutIndex = shortcutIndex < 10 ? shortcutIndex : 0;
                shortcutIndex += 1;
            }
            else {
                item.tab.shortcutIndex = 0;
                item.tab.hidden = true;
            }
        });
        this.updateLeftMoreView();
        this.updateRightMoreView();
    }
    updateTabsInfoSizes() {
        this.tabsInfo.forEach((item) => {
            item.width = item.tab.width;
        });
    }
    updateTabsInfo() {
        const { visibleListWidth, activeTabField, tabsInfo } = this;
        tabsInfo.forEach(item => item.isVisible = false);
        let usedWidth = 0;
        for (let i = activeTabField; i >= 0; i -= 1) {
            const tabInfo = tabsInfo[i];
            const updatedUsedWidth = usedWidth + tabInfo.width;
            if (activeTabField !== i && updatedUsedWidth > visibleListWidth)
                break;
            usedWidth = updatedUsedWidth;
            tabInfo.isVisible = true;
        }
        const afterActiveTabIndex = activeTabField + 1;
        const tabsInfoLength = tabsInfo.length;
        if (usedWidth < visibleListWidth && afterActiveTabIndex < tabsInfoLength) {
            for (let i = afterActiveTabIndex; i < tabsInfoLength; i += 1) {
                const tabInfo = tabsInfo[i];
                const updatedUsedWidth = usedWidth + tabInfo.width;
                if (updatedUsedWidth > visibleListWidth)
                    break;
                usedWidth = updatedUsedWidth;
                tabInfo.isVisible = true;
            }
        }
    }
    updateLeftMoreView() {
        const { tabsInfo } = this;
        let leftMoreCount = 0;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            const { isVisible } = tabsInfo[i];
            if (isVisible)
                break;
            else
                leftMoreCount += 1;
        }
        if (leftMoreCount)
            this.showLeftMore(leftMoreCount);
        else
            this.hideLeftMore();
    }
    updateRightMoreView() {
        const { tabsInfo } = this;
        let rightMoreCount = 0;
        for (let i = tabsInfo.length - 1; i >= 0; i -= 1) {
            const { isVisible } = tabsInfo[i];
            if (isVisible)
                break;
            else
                rightMoreCount += 1;
        }
        if (rightMoreCount)
            this.showRightMore(rightMoreCount);
        else
            this.hideRightMore();
    }
    showTabs() {
        const { tabsInfo } = this;
        this.hideLeftMore();
        this.hideRightMore();
        let shortcutIndex = 1;
        tabsInfo.forEach((item) => {
            item.isVisible = true;
            item.tab.hidden = false;
            item.tab.invisible = false;
            item.tab.shortcutIndex = shortcutIndex < 10 ? shortcutIndex : 0;
            shortcutIndex += 1;
        });
    }
    hideLeftMore() {
        const leftMore = this.getRef('left-more');
        const leftAdditional = this.getRef('leftAdditional');
        leftMore.classList.add(css$8.hidden);
        leftAdditional.classList.add(css$8.hidden);
    }
    showLeftMore(count = 1) {
        const leftMore = this.getRef('left-more');
        const leftAdditional = this.getRef('leftAdditional');
        leftMore.classList.remove(css$8.hidden);
        leftAdditional.classList.remove(css$8.hidden);
        if (count > 1)
            leftAdditional.classList.add(css$8.leftTwo);
        else
            leftAdditional.classList.remove(css$8.leftTwo);
    }
    hideRightMore() {
        const rightMore = this.getRef('right-more');
        const rightAdditional = this.getRef('rightAdditional');
        rightMore.classList.add(css$8.hidden);
        rightAdditional.classList.add(css$8.hidden);
    }
    showRightMore(count = 1) {
        const rightMore = this.getRef('right-more');
        const rightAdditional = this.getRef('rightAdditional');
        rightMore.classList.remove(css$8.hidden);
        rightAdditional.classList.remove(css$8.hidden);
        if (count > 1)
            rightAdditional.classList.add(css$8.rightTwo);
        else
            rightAdditional.classList.remove(css$8.rightTwo);
    }
    updateDragInfo(e) {
        const { dragInfo } = this;
        if (!dragInfo)
            return;
        const { clientX } = e;
        const { width: maxLeft, left } = this.getRef('list').getBoundingClientRect();
        const newLeft = clientX - left;
        if (newLeft < -2)
            return;
        dragInfo.left = Math.min(maxLeft, Math.max(0, newLeft));
    }
    updateTabsPosition() {
        const { dragInfo } = this;
        if (!dragInfo)
            return;
        const { replaceIndex } = dragInfo;
        const dragOverIndex = this.getDragOverIndex();
        if (dragOverIndex < 0)
            return;
        if (dragOverIndex !== replaceIndex) {
            dragInfo.replaceIndex = dragOverIndex;
            this.updateTabsViewOrder();
        }
    }
    getDragOverIndex() {
        const { tabsInfo, dragInfo } = this;
        if (!dragInfo)
            return -1;
        const { left } = dragInfo;
        let index = -1;
        let startOffset = 0;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            const { width, isVisible } = tabsInfo[i];
            if (!isVisible)
                continue;
            const endOffset = startOffset + width;
            if (left >= 0 && left < endOffset) {
                index = i;
                break;
            }
            startOffset = endOffset;
        }
        return index;
    }
    updateOrder() {
        this.updateTabsInfoOrder();
        this.updateTabsOrder();
    }
    updateTabsInfoOrder() {
        const { tabsInfo, dragInfo, activeTab, tabsField } = this;
        if (!dragInfo)
            return;
        const { index, replaceIndex } = dragInfo;
        const activeTabInfo = tabsInfo[activeTab];
        const spliced = tabsInfo.splice(index, 1);
        const splicedTab = tabsField.splice(index, 1);
        if (!spliced.length)
            return;
        tabsInfo.splice(replaceIndex, 0, spliced[0]);
        tabsField.splice(replaceIndex, 0, splicedTab[0]);
        this.activeTab = tabsInfo.indexOf(activeTabInfo) || 0;
        dragInfo.index = replaceIndex;
    }
    updateTabsOrder() {
        const { tabsInfo } = this;
        const list = this.getRef('list');
        if (!list)
            return;
        let shortcutIndex = 1;
        tabsInfo.forEach(({ tab, isVisible }, index) => {
            const tabRoot = tab.getRef('root');
            list.removeChild(tabRoot);
            tab.left = 0;
            list.appendChild(tabRoot);
            tab.index = index;
            if (isVisible) {
                tab.shortcutIndex = shortcutIndex;
                shortcutIndex += 1;
            }
            else {
                tab.shortcutIndex = 0;
            }
        });
    }
    getTabOffset(index) {
        const { tabsInfo } = this;
        return tabsInfo.reduce((acc, tabInfo, i) => {
            if (i >= index || !tabInfo.isVisible)
                return acc;
            return acc + tabInfo.width;
        }, 0);
    }
    updateTabsViewOrder() {
        const { dragInfo } = this;
        if (!dragInfo)
            return;
        const { index, replaceIndex } = dragInfo;
        if (replaceIndex <= index) {
            this.updateLeftDraggableTabPosition();
            this.updateLeftTabsViewOrder();
        }
        else {
            this.updateRightDraggableTabPosition();
            this.updateRightTabsViewOrder();
        }
    }
    updateLeftDraggableTabPosition() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        const targetLeft = this.getTabOffset(index) - tabsInfo.reduce((acc, tabInfo, i) => {
            return !tabInfo.isVisible || i >= replaceIndex ? acc : acc + tabInfo.width;
        }, 0);
        tabsInfo[index].tab.left = -1 * targetLeft;
    }
    updateRightDraggableTabPosition() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        tabsInfo[index].tab.left = tabsInfo.reduce((acc, tabInfo, i) => {
            return !tabInfo.isVisible || i < index || i > replaceIndex ? acc : acc + tabInfo.width;
        }, 0) - tabsInfo[index].width;
    }
    updateLeftTabsViewOrder() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        const offsetWidth = tabsInfo[index].width;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            if (i === index)
                continue;
            tabsInfo[i].tab.left = i < replaceIndex || i > index ? 0 : offsetWidth;
        }
    }
    updateRightTabsViewOrder() {
        const { dragInfo, tabsInfo } = this;
        const { index, replaceIndex } = dragInfo;
        const offsetWidth = tabsInfo[index].width;
        for (let i = 0, ln = tabsInfo.length; i < ln; i += 1) {
            if (i === index)
                continue;
            if (i > index && i <= replaceIndex)
                tabsInfo[i].tab.left = -1 * offsetWidth;
            else
                tabsInfo[i].tab.left = 0;
        }
    }
}

/** Detect free variable `global` from Node.js. */
var freeGlobal$2 = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */

var freeSelf$2 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$2 = freeGlobal$2 || freeSelf$2 || Function('return this')();

/** Built-in value references. */

var Symbol$2 = root$2.Symbol;

/** Used for built-in method references. */

var objectProto$h = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$e = objectProto$h.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$3 = objectProto$h.toString;
/** Built-in value references. */

var symToStringTag$3 = Symbol$2 ? Symbol$2.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag$2(value) {
  var isOwn = hasOwnProperty$e.call(value, symToStringTag$3),
      tag = value[symToStringTag$3];

  try {
    value[symToStringTag$3] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$3.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$3] = tag;
    } else {
      delete value[symToStringTag$3];
    }
  }

  return result;
}

/** Used for built-in method references. */
var objectProto$i = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$4 = objectProto$i.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString$2(value) {
  return nativeObjectToString$4.call(value);
}

/** `Object#toString` result references. */

var nullTag$2 = '[object Null]',
    undefinedTag$2 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$4 = Symbol$2 ? Symbol$2.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag$2(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$2 : nullTag$2;
  }

  return symToStringTag$4 && symToStringTag$4 in Object(value) ? getRawTag$2(value) : objectToString$2(value);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject$2(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

/** `Object#toString` result references. */

var asyncTag$2 = '[object AsyncFunction]',
    funcTag$4 = '[object Function]',
    genTag$3 = '[object GeneratorFunction]',
    proxyTag$2 = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */

function isFunction$2(value) {
  if (!isObject$2(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag$2(value);
  return tag == funcTag$4 || tag == genTag$3 || tag == asyncTag$2 || tag == proxyTag$2;
}

/** Used to detect overreaching core-js shims. */

var coreJsData$2 = root$2['__core-js_shared__'];

/** Used to detect methods masquerading as native. */

var maskSrcKey$2 = function () {
  var uid = /[^.]+$/.exec(coreJsData$2 && coreJsData$2.keys && coreJsData$2.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked$2(func) {
  return !!maskSrcKey$2 && maskSrcKey$2 in func;
}

/** Used for built-in method references. */
var funcProto$4 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$4 = funcProto$4.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource$2(func) {
  if (func != null) {
    try {
      return funcToString$4.call(func);
    } catch (e) {}

    try {
      return func + '';
    } catch (e) {}
  }

  return '';
}

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */

var reRegExpChar$2 = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor$2 = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto$5 = Function.prototype,
    objectProto$j = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$5 = funcProto$5.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$f = objectProto$j.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative$2 = RegExp('^' + funcToString$5.call(hasOwnProperty$f).replace(reRegExpChar$2, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative$2(value) {
  if (!isObject$2(value) || isMasked$2(value)) {
    return false;
  }

  var pattern = isFunction$2(value) ? reIsNative$2 : reIsHostCtor$2;
  return pattern.test(toSource$2(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */

function getNative$2(object, key) {
  var value = getValue$2(object, key);
  return baseIsNative$2(value) ? value : undefined;
}

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop$2() {// No operation performed.
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while (fromRight ? index-- : ++index < length) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }

  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }

  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function baseIndexOf(array, value, fromIndex) {
  return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */

function arrayIncludes(array, value) {
  var length = array == null ? 0 : array.length;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq$2(value, other) {
  return value === other || value !== value && other !== other;
}

/* Built-in method references that are verified to be native. */

var nativeCreate$2 = getNative$2(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear$2() {
  this.__data__ = nativeCreate$2 ? nativeCreate$2(null) : {};
  this.size = 0;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete$2(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$3 = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$k = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$g = objectProto$k.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet$2(key) {
  var data = this.__data__;

  if (nativeCreate$2) {
    var result = data[key];
    return result === HASH_UNDEFINED$3 ? undefined : result;
  }

  return hasOwnProperty$g.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */

var objectProto$l = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$h = objectProto$l.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas$2(key) {
  var data = this.__data__;
  return nativeCreate$2 ? data[key] !== undefined : hasOwnProperty$h.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$4 = '__lodash_hash_undefined__';
/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */

function hashSet$2(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$2 && value === undefined ? HASH_UNDEFINED$4 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Hash$2(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash$2.prototype.clear = hashClear$2;
Hash$2.prototype['delete'] = hashDelete$2;
Hash$2.prototype.get = hashGet$2;
Hash$2.prototype.has = hashHas$2;
Hash$2.prototype.set = hashSet$2;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$2() {
  this.__data__ = [];
  this.size = 0;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */

function assocIndexOf$2(array, key) {
  var length = array.length;

  while (length--) {
    if (eq$2(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}

/** Used for built-in method references. */

var arrayProto$2 = Array.prototype;
/** Built-in value references. */

var splice$2 = arrayProto$2.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete$2(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice$2.call(data, index, 1);
  }

  --this.size;
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function listCacheGet$2(key) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);
  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function listCacheHas$2(key) {
  return assocIndexOf$2(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */

function listCacheSet$2(key, value) {
  var data = this.__data__,
      index = assocIndexOf$2(data, key);

  if (index < 0) {
    ++this.size;
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }

  return this;
}

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function ListCache$2(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache$2.prototype.clear = listCacheClear$2;
ListCache$2.prototype['delete'] = listCacheDelete$2;
ListCache$2.prototype.get = listCacheGet$2;
ListCache$2.prototype.has = listCacheHas$2;
ListCache$2.prototype.set = listCacheSet$2;

/* Built-in method references that are verified to be native. */

var Map$3 = getNative$2(root$2, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear$2() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash$2(),
    'map': new (Map$3 || ListCache$2)(),
    'string': new Hash$2()
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$2(value) {
  var type = typeof value;
  return type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean' ? value !== '__proto__' : value === null;
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */

function getMapData$2(map, key) {
  var data = map.__data__;
  return isKeyable$2(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function mapCacheDelete$2(key) {
  var result = getMapData$2(this, key)['delete'](key);
  this.size -= result ? 1 : 0;
  return result;
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function mapCacheGet$2(key) {
  return getMapData$2(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function mapCacheHas$2(key) {
  return getMapData$2(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */

function mapCacheSet$2(key, value) {
  var data = getMapData$2(this, key),
      size = data.size;
  data.set(key, value);
  this.size += data.size == size ? 0 : 1;
  return this;
}

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function MapCache$2(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache$2.prototype.clear = mapCacheClear$2;
MapCache$2.prototype['delete'] = mapCacheDelete$2;
MapCache$2.prototype.get = mapCacheGet$2;
MapCache$2.prototype.has = mapCacheHas$2;
MapCache$2.prototype.set = mapCacheSet$2;

/* Built-in method references that are verified to be native. */

var Set$1 = getNative$2(root$2, 'Set');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED$5 = '__lodash_hash_undefined__';
/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */

function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED$5);

  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */

function SetCache(values) {
  var index = -1,
      length = values == null ? 0 : values.length;
  this.__data__ = new MapCache$2();

  while (++index < length) {
    this.add(values[index]);
  }
} // Add methods to `SetCache`.


SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);
  set.forEach(function (value) {
    result[++index] = value;
  });
  return result;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }

  return false;
}

/** Used as references for various `Number` constants. */

var INFINITY$3 = 1 / 0;
/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */

var createSet = !(Set$1 && 1 / setToArray(new Set$1([, -0]))[1] == INFINITY$3) ? noop$2 : function (values) {
  return new Set$1(values);
};

/** Used as the size to enable large array optimizations. */

var LARGE_ARRAY_SIZE$1 = 200;
/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */

function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  } else if (length >= LARGE_ARRAY_SIZE$1) {
    var set = iteratee ? null : createSet(array);

    if (set) {
      return setToArray(set);
    }

    isCommon = false;
    includes = cacheHas;
    seen = new SetCache();
  } else {
    seen = iteratee ? [] : result;
  }

  outer: while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;
    value = comparator || value !== 0 ? value : 0;

    if (isCommon && computed === computed) {
      var seenIndex = seen.length;

      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }

      if (iteratee) {
        seen.push(computed);
      }

      result.push(value);
    } else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }

      result.push(value);
    }
  }

  return result;
}

/**
 * Creates a duplicate-free version of an array, using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons, in which only the first occurrence of each element
 * is kept. The order of result values is determined by the order they occur
 * in the array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniq([2, 1, 2]);
 * // => [2, 1]
 */

function uniq(array) {
  return array && array.length ? baseUniq(array) : [];
}

var template$b = "<div ref=\"root\" class=\"root {className} {hidden}\">\n  <div class=\"addWindowContainer\">\n    <button ref=\"addWindowButton\" class=\"addWindowButton\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n        <path stroke=\"none\" d=\"M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z\"/>\n      </svg>\n    </button>\n    <div class=\"addWindowShortcutContainer\">\n      <span ref=\"addWindowShortcutText\" class=\"addWindowShortcutText\"></span>\n    </div>\n  </div>\n  <div ref=\"contentContainer\" class=\"contentContainer\"></div>\n</div>\n";

var css$d = {"root":"root-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","horizontalResize":"horizontalResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","verticalResize":"verticalResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","leftBottomResize":"leftBottomResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","rightBottomResize":"rightBottomResize-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","hidden":"hidden-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","addWindowContainer":"addWindowContainer-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","addWindowButton":"addWindowButton-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","addWindowShortcutText":"addWindowShortcutText-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8","contentContainer":"contentContainer-terminals-orchestrator-️d86dc76e3099f2824d3bd37bf609d7b8"};

var template$c = "<div ref=\"root\" class=\"root\" tabindex=\"0\" style=\"--z-index: {zIndex}; left:{left}%; right:{right}%; top:{top}%; bottom:{bottom}%\">\n  <div ref=\"content\" class=\"content\">\n\n  </div>\n  <div data-type=\"leftTop\" ref=\"leftTop\" class=\"resize corner leftTop\"></div>\n  <div data-type=\"rightTop\" ref=\"rightTop\" class=\"resize corner rightTop\"></div>\n  <div data-type=\"leftBottom\" ref=\"leftBottom\" class=\"resize corner leftBottom\"></div>\n  <div data-type=\"rightBottom\" ref=\"rightBottom\" class=\"resize corner rightBottom\"></div>\n\n  <div data-type=\"left\" ref=\"left\" class=\"resize left\"></div>\n  <div data-type=\"right\" ref=\"right\" class=\"resize right\"></div>\n  <div data-type=\"top\" ref=\"top\" class=\"resize top\"></div>\n  <div data-type=\"bottom\" ref=\"bottom\" class=\"resize bottom\"></div>\n</div>\n";

var css$e = {"root":"root-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","lockSelection":"lockSelection-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","content":"content-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","resize":"resize-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","corner":"corner-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","leftTop":"leftTop-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","rightBottom":"rightBottom-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","rightTop":"rightTop-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","leftBottom":"leftBottom-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","left":"left-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","right":"right-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","top":"top-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b","bottom":"bottom-terminals-orchestrator-️a2890ac42d6182286908aa9f8540cc0b"};

const MIN_CONTENT_WINDOW_WIDTH = 50;
const MIN_CONTENT_WINDOW_HEIGHT = 50;
const ANCHOR_SIZE = 12;
const LEFT_MOVE_TYPE = 'left';
const RIGHT_MOVE_TYPE = 'right';
const TOP_MOVE_TYPE = 'top';
const BOTTOM_MOVE_TYPE = 'bottom';
const LEFT_TOP_MOVE_TYPE = 'leftTop';
const RIGHT_TOP_MOVE_TYPE = 'rightTop';
const LEFT_BOTTOM_MOVE_TYPE = 'leftBottom';
const RIGHT_BOTTOM_MOVE_TYPE = 'rightBottom';
const HEADER_MOVE_TYPE = 'header';
const MOVE_TYPES = [
    LEFT_MOVE_TYPE, RIGHT_MOVE_TYPE, TOP_MOVE_TYPE, BOTTOM_MOVE_TYPE,
    LEFT_TOP_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE,
    HEADER_MOVE_TYPE,
];

var css$f = {"header":"header-terminals-orchestrator-️16cb72c51d3ce56e49912e0c4469a9e4","editable":"editable-terminals-orchestrator-️16cb72c51d3ce56e49912e0c4469a9e4"};

var template$d = "<div ref=\"root\" class=\"root {reverse}\">\n  <div ref=\"close\" class=\"close\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z\"/>\n    </svg>\n  </div>\n  <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  <div ref=\"rename\" class=\"rename\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" stroke=\"none\">\n      <path stroke=\"none\" d=\"M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z\"/>\n    </svg>\n  </div>\n</div>\n";

var css$g = {"root":"root-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","reverse":"reverse-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","close":"close-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","rename":"rename-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","inputContainer":"inputContainer-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6","input":"input-terminals-orchestrator-️a67032e8856fd89fcad9174a021feec6"};

class TermHeader extends TemplateEngine {
    constructor(container, options) {
        super(template$d, container);
        this.submitTitleHandler = () => {
            const { options: { onRename }, selectInput } = this;
            selectInput.disabled = true;
            if (onRename)
                onRename(selectInput.value);
        };
        this.onRename = () => {
            const { selectInput } = this;
            const { onRenaming } = this.options;
            selectInput.disabled = false;
            selectInput.focus();
            selectInput.select();
            if (onRenaming)
                onRenaming();
        };
        this.options = options;
        this.render();
        this.selectInput = new SelectInput(this.getRef('inputContainer'), {
            className: css$g.input, value: options.title, disabled: true,
            onSubmit: this.submitTitleHandler, onBlur: this.submitTitleHandler,
        });
    }
    get draggableElement() {
        return this.getRef('inputContainer');
    }
    render() {
        super.render({ css: css$g, reverse: IS_MAC$1 ? '' : css$g.reverse });
        this.addListeners();
    }
    destroy() {
        this.removeListeners();
        this.selectInput.destroy();
        super.destroy();
    }
    addListeners() {
        const { onClose } = this.options;
        const rename = this.getRef('rename');
        const close = this.getRef('close');
        if (onClose)
            close.addEventListener('click', onClose);
        rename.addEventListener('click', this.onRename);
    }
    removeListeners() {
        const { onClose } = this.options;
        const rename = this.getRef('rename');
        const close = this.getRef('close');
        if (onClose)
            close.removeEventListener('click', onClose);
        rename.removeEventListener('click', this.onRename);
    }
}

class TermHeaderPlugin extends Plugin {
    constructor(options) {
        super();
        this.onStartRenaming = () => {
            const { termInfo } = this;
            if (!termInfo)
                return;
            const title = termInfo.elements.title;
            title.classList.add(css$f.editable);
        };
        this.onRename = (name) => {
            const { termInfo, options: { onRename } } = this;
            if (!termInfo)
                return;
            const title = termInfo.elements.title;
            title.classList.remove(css$f.editable);
            if (onRename)
                onRename(name);
        };
        this.options = options;
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        const { title } = termInfo.elements;
        if (title) {
            this.addTermHeader();
            this.addListeners();
        }
    }
    destroy() {
        var _a;
        this.removeListeners();
        (_a = this.termHeader) === null || _a === void 0 ? void 0 : _a.destroy();
        super.destroy();
    }
    addListeners() {
        const { termHeader, options: { onStartMove } } = this;
        const draggableElement = termHeader === null || termHeader === void 0 ? void 0 : termHeader.draggableElement;
        if (!draggableElement || !onStartMove)
            return;
        draggableElement.addEventListener('mousedown', onStartMove);
    }
    removeListeners() {
        const { termHeader, options: { onStartMove } } = this;
        const draggableElement = termHeader === null || termHeader === void 0 ? void 0 : termHeader.draggableElement;
        if (!draggableElement || !onStartMove)
            return;
        draggableElement.removeEventListener('mousedown', onStartMove);
    }
    addTermHeader() {
        const { termInfo, options: { onClose } } = this;
        if (!termInfo)
            return;
        const title = termInfo.elements.title;
        const titleText = termInfo.title;
        title.classList.add(css$f.header);
        this.termHeader = new TermHeader(title, {
            onClose, title: titleText, onRenaming: this.onStartRenaming, onRename: this.onRename,
        });
        this.termHeader.draggableElement.setAttribute('data-type', 'header');
    }
}

var strings = {
    untitledTab: 'Untitled',
    untitledTerm: 'Untitled',
    tabConfirmationModalSubmit: 'Close',
    tabConfirmationModalCancel: 'Cancel',
    tabConfirmationModalTitle: 'Close tab',
    tabConfirmationModalText: 'Are you sure you want to close tab <span>"{name}"</span>?',
    termConfirmationModalSubmit: 'Close',
    termConfirmationModalCancel: 'Cancel',
    termConfirmationModalTitle: 'Close terminal',
    termConfirmationModalText: 'Are you sure you want to close terminal <span>"{name}"</span>?',
};

class ContentWindow extends TemplateEngine {
    constructor(container, options) {
        super(template$c, container);
        this.isDisabled = false;
        this.zIndexField = 0;
        this.lockSelectionField = false;
        this.onMouseDown = (e) => {
            const { onStartMove } = this.options;
            const { target } = e;
            if (!target || !onStartMove)
                return;
            const dataType = target.getAttribute('data-type');
            if (dataType && MOVE_TYPES.includes(dataType)) {
                this.moveType = dataType;
                onStartMove(dataType, this, e);
            }
        };
        this.onEndMove = (e) => {
            const { moveType, options: { onEndMove } } = this;
            if (!moveType)
                return;
            delete this.moveType;
            if (onEndMove)
                onEndMove(moveType, this, e);
        };
        this.onMove = (e) => {
            const { moveType, options: { onMove } } = this;
            if (moveType && onMove)
                onMove(moveType, this, e);
        };
        this.onFocus = (e) => {
            const { onFocus } = this.options;
            if (onFocus)
                onFocus(this, e);
        };
        this.onRename = (name) => {
            this.term.header = name;
        };
        this.onClose = () => {
            const { options: { onClose } } = this;
            if (onClose)
                onClose(this);
        };
        this.options = options;
        this.zIndexField = options.zIndex || 0;
        this.render();
        this.term = new Term(this.getRef('content'), {
            lines: [],
            header: options.title || strings.untitledTerm,
        });
        this.term.keyboardShortcutsManager.layer = this.zIndexField;
        this.termHeaderPlugin = new TermHeaderPlugin({
            onStartMove: this.onMouseDown, onRename: this.onRename, onClose: this.onClose,
        });
        this.term.pluginManager.register(this.termHeaderPlugin);
        this.addListeners();
    }
    get title() {
        return this.term.header;
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled, term } = this;
        if (isDisabled === val)
            return;
        this.isDisabled = val;
        if (val)
            term.blur();
        term.disabled = val;
    }
    get zIndex() {
        return this.zIndexField;
    }
    set zIndex(val) {
        const { zIndexField } = this;
        this.zIndexField = val;
        if (zIndexField !== val) {
            const root = this.getRef('root');
            root.style.setProperty('--z-index', String(val));
            this.term.keyboardShortcutsManager.layer = val;
        }
    }
    get lockSelection() {
        return this.lockSelectionField;
    }
    set lockSelection(val) {
        const { lockSelectionField } = this;
        this.lockSelectionField = val;
        const root = this.getRef('root');
        if (!root || lockSelectionField === val)
            return;
        if (val)
            root.classList.add(css$e.lockSelection);
        else
            root.classList.remove(css$e.lockSelection);
    }
    get position() {
        const { left, right, top, bottom } = this.options.position;
        return { left, right, top, bottom };
    }
    set position(val) {
        const { left, right, top, bottom } = val;
        const { position } = this.options;
        this.options.position = { left, right, top, bottom };
        const root = this.getRef('root');
        if (position.left !== left)
            root.style.left = `${left}%`;
        if (position.right !== right)
            root.style.right = `${right}%`;
        if (position.top !== top)
            root.style.top = `${top}%`;
        if (position.bottom !== bottom)
            root.style.bottom = `${bottom}%`;
    }
    get dragElements() {
        return {
            leftTop: this.getRef('leftTop'),
            rightTop: this.getRef('rightTop'),
            leftBottom: this.getRef('leftBottom'),
            rightBottom: this.getRef('rightBottom'),
            left: this.getRef('left'),
            right: this.getRef('right'),
            top: this.getRef('top'),
            bottom: this.getRef('bottom'),
        };
    }
    render() {
        super.render(Object.assign(Object.assign({ css: css$e }, this.options.position), { zIndex: this.zIndex }));
    }
    destroy() {
        this.removeListeners();
        this.term.destroy();
        super.destroy();
    }
    addListeners() {
        const { leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom, } = this.dragElements;
        const root = this.getRef('root');
        leftTop.addEventListener('mousedown', this.onMouseDown);
        rightTop.addEventListener('mousedown', this.onMouseDown);
        leftBottom.addEventListener('mousedown', this.onMouseDown);
        rightBottom.addEventListener('mousedown', this.onMouseDown);
        left.addEventListener('mousedown', this.onMouseDown);
        right.addEventListener('mousedown', this.onMouseDown);
        top.addEventListener('mousedown', this.onMouseDown);
        bottom.addEventListener('mousedown', this.onMouseDown);
        root.addEventListener('focus', this.onFocus);
        this.term.addEventListener('focus', this.onFocus);
        window.addEventListener('mouseup', this.onEndMove);
        window.addEventListener('mouseleave', this.onEndMove);
        window.addEventListener('mousemove', this.onMove);
    }
    removeListeners() {
        const { leftTop, rightTop, leftBottom, rightBottom, left, right, top, bottom, } = this.dragElements;
        const root = this.getRef('root');
        leftTop.removeEventListener('mousedown', this.onMouseDown);
        rightTop.removeEventListener('mousedown', this.onMouseDown);
        leftBottom.removeEventListener('mousedown', this.onMouseDown);
        rightBottom.removeEventListener('mousedown', this.onMouseDown);
        left.removeEventListener('mousedown', this.onMouseDown);
        right.removeEventListener('mousedown', this.onMouseDown);
        top.removeEventListener('mousedown', this.onMouseDown);
        bottom.removeEventListener('mousedown', this.onMouseDown);
        root.removeEventListener('focus', this.onFocus);
        this.term.removeEventListener('focus', this.onFocus);
        window.removeEventListener('mouseup', this.onEndMove);
        window.removeEventListener('mouseleave', this.onEndMove);
        window.removeEventListener('mousemove', this.onMove);
    }
}

var template$e = "<div class=\"overlay\" ref=\"overlay\">\n  <div ref=\"root\" class=\"modal\">\n    <if condition=\"{title}\">\n      <div class=\"title\">\n        <div class=\"titleTextContainer\">\n          <span>{title}</span>\n        </div>\n      </div>\n    </if>\n    <div class=\"content\">\n      <div class=\"contentTextContainer\">\n        <span class=\"contentText\">{text}</span>\n      </div>\n    </div>\n    <if condition=\"{cancel || submit}\">\n      <div class=\"controls\">\n        <if condition=\"{submit}\">\n          <button class=\"submit\" ref=\"submit\">\n            {submit}\n          </button>\n        </if>\n        <if condition=\"{cancel}\">\n          <button class=\"cancel\" ref=\"cancel\">\n            {cancel}\n          </button>\n        </if>\n      </div>\n    </if>\n  </div>\n</div>\n";

var css$h = {"overlay":"overlay-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","modal":"modal-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","title":"title-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","titleTextContainer":"titleTextContainer-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","content":"content-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","contentTextContainer":"contentTextContainer-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","contentText":"contentText-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","controls":"controls-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","submit":"submit-terminals-orchestrator-️34e4e38956f7adea50854106743b646e","cancel":"cancel-terminals-orchestrator-️34e4e38956f7adea50854106743b646e"};

const stopPropagation = (e) => e.stopPropagation();

class ConfirmationModal extends TemplateEngine {
    constructor(container, options) {
        super(template$e, container);
        this.options = options;
        this.render();
        this.emitter = new Emitter(EMITTER_TOP_LAYER_TYPE);
        this.addListeners();
    }
    render() {
        const { title, text, submit, cancel, onSubmit, onCancel } = this.options;
        super.render({
            css: css$h, title, text, submit: onSubmit ? submit : '', cancel: onCancel ? cancel : '',
        });
    }
    destroy() {
        this.removeListeners();
        this.emitter.destroy();
        super.destroy();
    }
    addListeners() {
        const { emitter, options: { onSubmit, onCancel } } = this;
        const root = this.getRef('root');
        root.addEventListener('click', stopPropagation);
        if (onSubmit) {
            const submit = this.getRef('submit');
            if (submit)
                submit.addEventListener('click', onSubmit);
            emitter.addListener('keyDown', onSubmit, { code: ENTER_KEY_CODE });
        }
        if (onCancel) {
            const cancel = this.getRef('cancel');
            const overlay = this.getRef('overlay');
            overlay.addEventListener('click', onCancel);
            if (cancel)
                cancel.addEventListener('click', onCancel);
            emitter.addListener('keyDown', onCancel, { code: ESC_KEY_CODE });
        }
    }
    removeListeners() {
        const { emitter, options: { onSubmit, onCancel } } = this;
        if (onSubmit) {
            const submit = this.getRef('submit');
            if (submit)
                submit.removeEventListener('click', onSubmit);
            emitter.removeListener('keyDown', onSubmit);
        }
        if (onCancel) {
            const cancel = this.getRef('cancel');
            const overlay = this.getRef('overlay');
            overlay.removeEventListener('click', onCancel);
            if (cancel)
                cancel.removeEventListener('click', onCancel);
            emitter.removeListener('keyDown', onCancel);
        }
    }
}

class Content extends TemplateEngine {
    constructor(container, options = { id: -1 }) {
        super(template$b, container);
        this.isDisabled = false;
        this.hiddenField = false;
        this.contentWindows = [];
        this.addContentWindow = () => {
            var _a, _b;
            const cn = new ContentWindow(this.getRef('contentContainer'), {
                position: { left: 20, right: 20, top: 20, bottom: 20 },
                onStartMove: this.onStartMove,
                onEndMove: this.onEndMove,
                onMove: this.onMove,
                onFocus: this.onFocus,
                onClose: this.onClose,
                title: (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.localization) === null || _b === void 0 ? void 0 : _b.untitledTerm,
                zIndex: this.nextZIndex,
            });
            this.contentWindows.push(cn);
            this.onFocus(cn);
            return cn;
        };
        this.onStartMove = (type, contentWindow, e) => {
            this.moveInfo = {
                type, contentWindow, startPosition: { left: e.clientX, top: e.clientY },
                startOffsets: contentWindow.position,
            };
            contentWindow.lockSelection = true;
            this.updateGlobalCursor();
        };
        this.onEndMove = () => {
            const { moveInfo } = this;
            if (moveInfo)
                moveInfo.contentWindow.lockSelection = false;
            this.removeGlobalCursor();
            delete this.moveInfo;
        };
        this.onMove = (type, contentWindow, e) => {
            const { moveInfo } = this;
            if (!moveInfo)
                return;
            if ([LEFT_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, LEFT_TOP_MOVE_TYPE].includes(type)) {
                this.onLeftSideMove(e);
            }
            if ([RIGHT_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
                this.onRightSideMove(e);
            }
            if ([TOP_MOVE_TYPE, LEFT_TOP_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
                this.onTopSideMove(e);
            }
            if ([BOTTOM_MOVE_TYPE, LEFT_BOTTOM_MOVE_TYPE, RIGHT_BOTTOM_MOVE_TYPE].includes(type)) {
                this.onBottomSideMove(e);
            }
            if (HEADER_MOVE_TYPE === type)
                this.onWindowMove(e);
        };
        this.onFocus = (contentWindow) => {
            const sortedWindows = this.contentWindows.sort((f, s) => f.zIndex - s.zIndex);
            const zIndexMax = sortedWindows.length - 1;
            contentWindow.zIndex = zIndexMax;
            let isUpdating = false;
            sortedWindows.forEach((item) => {
                if (isUpdating)
                    item.zIndex -= 1;
                if (item === contentWindow)
                    isUpdating = true;
            });
        };
        this.onClose = (contentWindow) => {
            var _a;
            const { contentWindows, options: { localization } } = this;
            const index = contentWindows.indexOf(contentWindow);
            if (index < 0 || this.disabled)
                return;
            this.disabled = true;
            this.cm = new ConfirmationModal(this.getRef('root'), {
                submit: (localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalSubmit) || strings.termConfirmationModalSubmit,
                cancel: (localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalCancel) || strings.termConfirmationModalCancel,
                title: (localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalTitle) || strings.termConfirmationModalTitle,
                text: safeTemplate((localization === null || localization === void 0 ? void 0 : localization.termConfirmationModalText) || strings.termConfirmationModalText, { name: ((_a = contentWindows[index]) === null || _a === void 0 ? void 0 : _a.title) || '' }),
                onCancel: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    this.disabled = false;
                },
                onSubmit: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    this.disabled = false;
                    contentWindows.splice(index, 1);
                    contentWindow.destroy();
                },
            });
        };
        this.options = options;
        this.id = options.id;
        this.hiddenField = options.hidden || false;
        this.render();
    }
    get disabled() {
        return this.isDisabled;
    }
    set disabled(val) {
        const { isDisabled, contentWindows } = this;
        if (isDisabled === val)
            return;
        this.isDisabled = val;
        contentWindows.forEach(cn => cn.disabled = val);
    }
    get hidden() {
        return this.hiddenField;
    }
    set hidden(val) {
        const { hiddenField } = this;
        this.hiddenField = val;
        if (hiddenField === val)
            return;
        if (val)
            this.getRef('root').classList.add(css$d.hidden);
        else
            this.getRef('root').classList.remove(css$d.hidden);
    }
    get relativeAnchorSize() {
        const root = this.getRef('root');
        const { offsetWidth } = root;
        return ANCHOR_SIZE / offsetWidth * 100;
    }
    get nextZIndex() {
        const { contentWindows } = this;
        return contentWindows.length
            ? contentWindows.sort((f, s) => s.zIndex - f.zIndex)[0].zIndex + 1
            : 0;
    }
    render() {
        const { className = '', hidden } = this.options;
        super.render({ css: css$d, className, hidden: hidden ? css$d.hidden : '' });
        const addWindowShortcutText = this.getRef('addWindowShortcutText');
        addWindowShortcutText.innerHTML = IS_MAC$1 ? '⌘E' : 'ctrl E';
        this.addListeners();
    }
    destroy() {
        var _a;
        this.removeListeners();
        (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
        super.destroy();
    }
    addListeners() {
        const addWindowButton = this.getRef('addWindowButton');
        addWindowButton.addEventListener('click', this.addContentWindow);
    }
    removeListeners() {
        const addWindowButton = this.getRef('addWindowButton');
        addWindowButton.removeEventListener('click', this.addContentWindow);
    }
    updateGlobalCursor() {
        const { type } = this.moveInfo;
        const root = this.getRef('root');
        if ([LEFT_MOVE_TYPE, RIGHT_MOVE_TYPE].includes(type))
            root.classList.add(css$d.horizontalResize);
        if ([TOP_MOVE_TYPE, BOTTOM_MOVE_TYPE].includes(type))
            root.classList.add(css$d.verticalResize);
        if ([LEFT_BOTTOM_MOVE_TYPE, RIGHT_TOP_MOVE_TYPE].includes(type)) {
            root.classList.add(css$d.leftBottomResize);
        }
        if ([RIGHT_BOTTOM_MOVE_TYPE, LEFT_TOP_MOVE_TYPE].includes(type)) {
            root.classList.add(css$d.rightBottomResize);
        }
    }
    removeGlobalCursor() {
        const root = this.getRef('root');
        root.classList.remove(css$d.horizontalResize);
        root.classList.remove(css$d.verticalResize);
        root.classList.remove(css$d.leftBottomResize);
        root.classList.remove(css$d.rightBottomResize);
    }
    getFilteredContentWindows(skip) {
        const { contentWindows } = this;
        return contentWindows.filter(item => item !== skip);
    }
    getHorizontalAnchorPoints(contentWindow) {
        const { relativeAnchorSize } = this;
        return uniq(this.getFilteredContentWindows(contentWindow).reduce((acc, item) => {
            const { left, right } = item.position;
            acc.push(left);
            acc.push(100 - right);
            return acc;
        }, [])).filter((item) => 0 !== item && 100 !== item).sort((first, second) => {
            return first - second;
        }).reduce((acc, position, index, arr) => {
            const prevPosition = arr[index - 1] || -1;
            const nextPosition = arr[index + 1] || -1;
            if (position <= 0)
                return acc;
            acc.push({
                position,
                startOffset: prevPosition >= 0 ? Math.min(relativeAnchorSize, (position - prevPosition) / 2)
                    : relativeAnchorSize,
                endOffset: nextPosition >= 0 ? Math.min(relativeAnchorSize, (position + nextPosition) / 2)
                    : relativeAnchorSize,
            });
            return acc;
        }, []);
    }
    getVerticalAnchorPoints(contentWindow) {
        const { relativeAnchorSize } = this;
        return uniq(this.getFilteredContentWindows(contentWindow).reduce((acc, item) => {
            const { top, bottom } = item.position;
            acc.push(top);
            acc.push(100 - bottom);
            return acc;
        }, [])).filter((item) => 0 !== item && 100 !== item).sort((first, second) => {
            return first - second;
        }).reduce((acc, position, index, arr) => {
            const prevPosition = arr[index - 1] || -1;
            const nextPosition = arr[index + 1] || -1;
            if (position <= 0)
                return acc;
            acc.push({
                position,
                startOffset: prevPosition >= 0 ? Math.min(relativeAnchorSize, (position - prevPosition) / 2)
                    : relativeAnchorSize,
                endOffset: nextPosition >= 0 ? Math.min(relativeAnchorSize, (position + nextPosition) / 2)
                    : relativeAnchorSize,
            });
            return acc;
        }, []);
    }
    onLeftSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { left, right }, } = this.moveInfo;
        const horizontalAnchorPoints = this.getHorizontalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootWidth = root.offsetWidth;
        const offset = e.clientX - startPosition.left;
        const relativeOffset = offset / rootWidth * 100;
        let newLeft = left + relativeOffset;
        horizontalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const anchorMin = position - startOffset;
            const anchorMax = position + endOffset;
            if (newLeft < anchorMin || newLeft > anchorMax)
                return false;
            newLeft = position;
            return true;
        });
        const maxLeft = Math.max(100 - right - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { left: Math.max(0, Math.min(newLeft, maxLeft)) });
    }
    onRightSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { left, right }, } = this.moveInfo;
        const horizontalAnchorPoints = this.getHorizontalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootWidth = root.offsetWidth;
        const offset = e.clientX - startPosition.left;
        const relativeOffset = offset / rootWidth * 100;
        let newRight = right - relativeOffset;
        horizontalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const rightPosition = 100 - position;
            const anchorMin = rightPosition - endOffset;
            const anchorMax = 100 - position + startOffset;
            if (newRight < anchorMin || newRight > anchorMax)
                return false;
            newRight = rightPosition;
            return true;
        });
        const maxRight = Math.max(100 - left - MIN_CONTENT_WINDOW_WIDTH / rootWidth * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { right: Math.max(0, Math.min(newRight, maxRight)) });
    }
    onTopSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { top, bottom }, } = this.moveInfo;
        const verticalAnchorPoints = this.getVerticalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootHeight = root.offsetHeight;
        const offset = e.clientY - startPosition.top;
        const relativeOffset = offset / rootHeight * 100;
        let newTop = top + relativeOffset;
        verticalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const anchorMin = position - startOffset;
            const anchorMax = position + endOffset;
            if (newTop < anchorMin || newTop > anchorMax)
                return false;
            newTop = position;
            return true;
        });
        const maxTop = Math.max(100 - bottom - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { top: Math.max(0, Math.min(newTop, maxTop)) });
    }
    onBottomSideMove(e) {
        const { contentWindow, startPosition, startOffsets: { top, bottom }, } = this.moveInfo;
        const verticalAnchorPoints = this.getVerticalAnchorPoints(contentWindow);
        const root = this.getRef('root');
        const rootHeight = root.offsetHeight;
        const offset = e.clientY - startPosition.top;
        const relativeOffset = offset / rootHeight * 100;
        let newBottom = bottom - relativeOffset;
        verticalAnchorPoints.some((item) => {
            const { startOffset, position, endOffset } = item;
            const bottomPosition = 100 - position;
            const anchorMin = bottomPosition - endOffset;
            const anchorMax = 100 - position + startOffset;
            if (newBottom < anchorMin || newBottom > anchorMax)
                return false;
            newBottom = bottomPosition;
            return true;
        });
        const maxBottom = Math.max(100 - top - MIN_CONTENT_WINDOW_HEIGHT / rootHeight * 100, 0);
        contentWindow.position = Object.assign(Object.assign({}, contentWindow.position), { bottom: Math.max(0, Math.min(newBottom, maxBottom)) });
    }
    onWindowMove(e) {
        const { contentWindow, startPosition, startOffsets: { left, right, top, bottom }, } = this.moveInfo;
        const root = this.getRef('root');
        const verticalOffset = e.clientY - startPosition.top;
        const horizontalOffset = e.clientX - startPosition.left;
        const { offsetHeight: rootHeight, offsetWidth: rootWidth } = root;
        const relativeVerticalOffset = verticalOffset / rootHeight * 100;
        const relativeHorizontalOffset = horizontalOffset / rootWidth * 100;
        const relativeWidth = 100 - left - right;
        const relativeHeight = 100 - top - bottom;
        let newLeft = Math.max(left + relativeHorizontalOffset, 0);
        let newRight = 100 - relativeWidth - newLeft;
        let newTop = Math.max(top + relativeVerticalOffset, 0);
        let newBottom = 100 - relativeHeight - newTop;
        if (newRight < 0) {
            newRight = 0;
            newLeft = 100 - relativeWidth;
        }
        if (newBottom < 0) {
            newBottom = 0;
            newTop = 100 - relativeHeight;
        }
        contentWindow.position = { left: newLeft, right: newRight, top: newTop, bottom: newBottom };
    }
}

class Workspace extends TemplateEngine {
    constructor(container, options = {}) {
        super(template, container);
        this.nextTabId = 1;
        this.contentList = [];
        this.emitter = new Emitter(EMITTER_FORCE_LAYER_TYPE);
        this.newContentWindowHandler = (e) => {
            const { activeContent } = this;
            e.preventDefault();
            if (activeContent) {
                activeContent.addContentWindow();
            }
        };
        this.focusTabHandler = (index) => {
            const content = this.getTabContent(index);
            if (content) {
                this.tabsView.activeTab = index;
                this.contentList.forEach((item) => {
                    item.hidden = item !== content;
                });
            }
        };
        this.closeTabHandler = (index) => {
            const { tabsView, contentList, options: { localization } } = this;
            contentList.forEach(c => c.disabled = true);
            this.cm = new ConfirmationModal(this.getRef('root'), {
                submit: (localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalSubmit) || strings.tabConfirmationModalSubmit,
                cancel: (localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalCancel) || strings.tabConfirmationModalCancel,
                title: (localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalTitle) || strings.tabConfirmationModalTitle,
                text: safeTemplate((localization === null || localization === void 0 ? void 0 : localization.tabConfirmationModalText) || strings.tabConfirmationModalText, { name: tabsView.tabs[index].title }),
                onCancel: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    contentList.forEach(c => c.disabled = false);
                },
                onSubmit: () => {
                    var _a;
                    (_a = this.cm) === null || _a === void 0 ? void 0 : _a.destroy();
                    contentList.forEach(c => c.disabled = false);
                    const content = this.getTabContent(index);
                    const activeTab = tabsView.activeTab;
                    let newActiveTab = index === activeTab ? Math.max(0, activeTab - 1) : activeTab;
                    if (activeTab > index)
                        newActiveTab = activeTab - 1;
                    tabsView.tabs = this.tabsView.tabs.filter((_, i) => i !== index);
                    if (content) {
                        const contentIndex = contentList.indexOf(content);
                        content.destroy();
                        if (contentIndex >= 0)
                            contentList.splice(contentIndex, 1);
                    }
                    this.focusTabHandler(newActiveTab);
                },
            });
        };
        this.addTabHandler = () => {
            var _a;
            const { tabsView, options } = this;
            const tabInfo = {
                title: ((_a = options === null || options === void 0 ? void 0 : options.localization) === null || _a === void 0 ? void 0 : _a.untitledTab) || strings.untitledTab, id: this.nextTabId,
            };
            tabsView.tabs = [...tabsView.tabs, tabInfo];
            this.nextTabId += 1;
            this.addContentWindow(tabInfo.id);
            this.focusTabHandler(tabsView.tabs.length - 1);
        };
        this.options = options;
        this.render();
        const tabsView = new Tabs(this.getRef('tabs'));
        tabsView.addEventListener('focus', this.focusTabHandler);
        tabsView.addEventListener('close', this.closeTabHandler);
        tabsView.addEventListener('add', this.addTabHandler);
        this.emitter.addListener('keyDown', this.addTabHandler, { code: E_KEY_CODE, altKey: true });
        this.emitter.addListener('keyDown', this.newContentWindowHandler, Object.assign({ code: E_KEY_CODE }, (IS_MAC$1 ? { metaKey: true } : { ctrlKey: true })));
        this.tabsView = tabsView;
    }
    set tabs(val) {
        const { tabsView } = this;
        tabsView.tabs = val.map((item) => {
            if (typeof item === 'string') {
                const tabInfo = { title: item, id: this.nextTabId };
                this.nextTabId += 1;
                this.addContentWindow(tabInfo.id);
                return tabInfo;
            }
            return item;
        });
        this.focusTabHandler(tabsView.activeTab);
    }
    get tabs() {
        return this.tabsView.tabs;
    }
    set activeTab(val) {
        this.tabsView.activeTab = val;
    }
    get activeTab() {
        return this.tabsView.activeTab;
    }
    get activeContent() {
        const { activeTab } = this.tabsView;
        return this.getTabContent(activeTab);
    }
    getTabContent(index) {
        const tabInfo = this.tabsView.tabs[index];
        if (!tabInfo)
            return null;
        const { id } = tabInfo;
        return this.contentList.find(item => item.id === id) || null;
    }
    render() {
        super.render({ css });
    }
    destroy() {
        const { tabsView, contentList, emitter, cm } = this;
        emitter.removeListener('keyDown', this.newContentWindowHandler);
        emitter.removeListener('keyDown', this.addTabHandler);
        emitter.destroy();
        contentList.forEach(item => item.destroy());
        tabsView.destroy();
        cm === null || cm === void 0 ? void 0 : cm.destroy();
        super.destroy();
    }
    addContentWindow(id, hidden = true) {
        const { contentList, options } = this;
        contentList.push(new Content(this.getRef('content'), {
            id, hidden, className: css.contentItem, localization: options.localization,
        }));
    }
}

class TerminalsOrchestrator {
    constructor(container, options) {
        this.workspace = new Workspace(container, { localization: options.localization });
        let activeIndex = 0;
        this.workspace.tabs = options.tabs.map(({ name, focused }, index) => {
            if (focused)
                activeIndex = index;
            return name || '';
        });
        this.workspace.activeTab = activeIndex;
    }
    destroy() {
        this.workspace.destroy();
    }
}

export { TerminalsOrchestrator };
//# sourceMappingURL=index.es.js.map
