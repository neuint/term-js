import crypto from 'crypto';

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

/* Built-in method references that are verified to be native. */

var WeakMap$1 = getNative(root, 'WeakMap');

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
    if (!isObject(proto)) {
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
function noop() {// No operation performed.
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
    var func = getNative(Object, 'defineProperty');
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
function eq(value, other) {
  return value === other || value !== value && other !== other;
}

/** Used for built-in method references. */

var objectProto$3 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2 = objectProto$3.hasOwnProperty;
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

  if (!(hasOwnProperty$2.call(object, key) && eq(objValue, value)) || value === undefined && !(key in object)) {
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
  return value != null && isLength(value.length) && !isFunction(value);
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
  if (!isObject(object)) {
    return false;
  }

  var type = typeof index;

  if (type == 'number' ? isArrayLike(object) && isIndex(index, object.length) : type == 'string' && index in object) {
    return eq(object[index], value);
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
var objectProto$4 = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */

function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$4;
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
  return isObjectLike(value) && baseGetTag(value) == argsTag;
}

/** Used for built-in method references. */

var objectProto$5 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3 = objectProto$5.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;
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
  return isObjectLike(value) && hasOwnProperty$3.call(value, 'callee') && !propertyIsEnumerable.call(value, 'callee');
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

var Buffer = moduleExports ? root.Buffer : undefined;
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
    funcTag$1 = '[object Function]',
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
typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag$1] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray(value) {
  return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
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

var freeProcess = moduleExports$1 && freeGlobal.process;
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

var hasOwnProperty$4 = objectProto$6.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */

function arrayLikeKeys(value, inherited) {
  var isArr = isArray(value),
      isArg = !isArr && isArguments(value),
      isBuff = !isArr && !isArg && isBuffer(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$4.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
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
  if (!isObject(object)) {
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

function hashGet(key) {
  var data = this.__data__;

  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
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

function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty$8.call(data, key);
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

var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;
/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */

function isFlattenable(value) {
  return isArray(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
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

var funcProto$2 = Function.prototype,
    objectProto$b = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$2 = funcProto$2.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$9 = objectProto$b.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString = funcToString$2.call(Object);
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
  if (!isObjectLike(value) || baseGetTag(value) != objectTag$1) {
    return false;
  }

  var proto = getPrototype(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2.call(Ctor) == objectCtorString;
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
  if (!isObjectLike(value)) {
    return false;
  }

  var tag = baseGetTag(value);
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
  this.__data__ = new ListCache();
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

  if (data instanceof ListCache) {
    var pairs = data.__data__;

    if (!Map$1 || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new MapCache(pairs);
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
  var data = this.__data__ = new ListCache(entries);
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

var Buffer$1 = moduleExports$2 ? root.Buffer : undefined,
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
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
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

var DataView = getNative(root, 'DataView');

/* Built-in method references that are verified to be native. */

var Promise$1 = getNative(root, 'Promise');

/* Built-in method references that are verified to be native. */

var Set = getNative(root, 'Set');

/** `Object#toString` result references. */

var mapTag$1 = '[object Map]',
    objectTag$2 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$1 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';
var dataViewTag$1 = '[object DataView]';
/** Used to detect maps, sets, and weakmaps. */

var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map$1),
    promiseCtorString = toSource(Promise$1),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap$1);
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

var getTag = baseGetTag; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1 || Map$1 && getTag(new Map$1()) != mapTag$1 || Promise$1 && getTag(Promise$1.resolve()) != promiseTag || Set && getTag(new Set()) != setTag$1 || WeakMap$1 && getTag(new WeakMap$1()) != weakMapTag$1) {
  getTag = function (value) {
    var result = baseGetTag(value),
        Ctor = result == objectTag$2 ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : '';

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

var Uint8Array = root.Uint8Array;

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

var symbolProto$1 = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;
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
    symbolTag$1 = '[object Symbol]';
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

    case symbolTag$1:
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
  return isObjectLike(value) && getTag$1(value) == mapTag$3;
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
  return isObjectLike(value) && getTag$1(value) == setTag$3;
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
    genTag$1 = '[object GeneratorFunction]',
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

  if (!isObject(value)) {
    return value;
  }

  var isArr = isArray(value);

  if (isArr) {
    result = initCloneArray(value);

    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag$1(value),
        isFunc = tag == funcTag$2 || tag == genTag$1;

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
function last(array) {
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
  string = toString(string);
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
  return typeof value == 'string' || !isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag$3;
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
  return arrayMap(props, function (key) {
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
  return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
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
  path = castPath(path, object);
  object = parent(object, path);
  return object == null || delete object[toKey(last(path))];
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
  paths = arrayMap(paths, function (path) {
    path = castPath(path, object);
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
  if (objValue === undefined || eq(objValue, objectProto$e[key]) && !hasOwnProperty$b.call(object, key)) {
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

function template(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings.imports._.templateSettings || templateSettings;

  if (guard && isIterateeCall(string, options, guard)) {
    options = undefined;
  }

  string = toString(string);
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
    static getTemplateExecutor(template$1) {
        let processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashConditions(template$1);
        processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
            .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
        return template(processedTemplate);
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

const getKeyCode = (e) => e ? e.which || e.keyCode : null;

const ENTER_CODE = 13;
const LEFT_CODE = 37;
const RIGHT_CODE = 39;
const UP_CODE = 38;
const DOWN_CODE = 40;
const NON_BREAKING_SPACE = '&nbsp;';

var css$2 = {"root":"root-term-️cab119304dc90a90f699151e7c15d7ee","visible":"visible-term-️cab119304dc90a90f699151e7c15d7ee","content":"content-term-️cab119304dc90a90f699151e7c15d7ee","helpContainer":"helpContainer-term-️cab119304dc90a90f699151e7c15d7ee","inputContainer":"inputContainer-term-️cab119304dc90a90f699151e7c15d7ee"};

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

var css$3 = {"root":"root-term-️e70267db75c0341d98d4d4a58c7a4fe6","carriage-return-blink":"carriage-return-blink-term-️e70267db75c0341d98d4d4a58c7a4fe6","lock":"lock-term-️e70267db75c0341d98d4d4a58c7a4fe6","busy":"busy-term-️e70267db75c0341d98d4d4a58c7a4fe6","none":"none-term-️e70267db75c0341d98d4d4a58c7a4fe6","carriage-return-busy":"carriage-return-busy-term-️e70267db75c0341d98d4d4a58c7a4fe6","hidden":"hidden-term-️e70267db75c0341d98d4d4a58c7a4fe6"};

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

var css$4 = {"root":"root-term-️f48df653df791725509e2a00ded23e06","input":"input-term-️f48df653df791725509e2a00ded23e06","hiddenCaret":"hiddenCaret-term-️f48df653df791725509e2a00ded23e06","hidden":"hidden-term-️f48df653df791725509e2a00ded23e06"};

var css$5 = {"secret":"secret-term-️d139f1b48647dd08a4d620b7f948a15f"};

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

const STRINGIFY_HTML_PATTERN = /<[^>]+>/g;
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
        return html.replace(NON_BREAKING_SPACE_PATTERN, ' ').replace(STRINGIFY_HTML_PATTERN, '');
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
        const data = root.innerHTML;
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
            this.valueField = BaseInput.getUpdatedValueField(this.getInputValue(), this.valueField);
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

var css$6 = {"root":"root-term-️457efebe90f812d594ffccb8790b07ab"};

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

var css$7 = {"label":"label-term-️679afd4849096768cfa38bb85a2048b8","labelTextContainer":"labelTextContainer-term-️679afd4849096768cfa38bb85a2048b8","labelText":"labelText-term-️679afd4849096768cfa38bb85a2048b8"};

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
        this.onSubmit = noop;
        this.onChange = noop;
        this.onUpdateCaretPosition = noop;
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
            }[Number(getKeyCode(e))] || noop)(e);
        };
        this.submitHandler = (e) => {
            const { onSubmit, inputField, secret } = this;
            const value = (inputField === null || inputField === void 0 ? void 0 : inputField.value) || '';
            let formattedValue = '';
            if (isString(value)) {
                formattedValue = secret ? '' : value;
            }
            else if (isArray(value)) {
                formattedValue = secret ? value.filter(item => get(item, 'lock')) : value;
            }
            e.preventDefault();
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
            if (document.hasFocus() && caretPosition >= 0) {
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
        const { onUpdateCaretPosition = noop, onChange = noop, onSubmit = noop, editable = true, className = '', value, secret = false, } = params;
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

var freeGlobal$1 = typeof global == 'object' && global && global.Object === Object && global;
/** Detect free variable `self`. */

var freeSelf$1 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$1 = freeGlobal$1 || freeSelf$1 || Function('return this')();
/** Built-in value references. */

var Symbol$1 = root$1.Symbol;
/** Used for built-in method references. */

var objectProto$g = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$d = objectProto$g.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$2 = objectProto$g.toString;
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
  var isOwn = hasOwnProperty$d.call(value, symToStringTag$2),
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

function isSymbol$1(value) {
  return typeof value == 'symbol' || isObjectLike$1(value) && baseGetTag$1(value) == symbolTag$3;
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

var symbolProto$2 = Symbol$1 ? Symbol$1.prototype : undefined,
    symbolToString$1 = symbolProto$2 ? symbolProto$2.toString : undefined;
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
/** `Object#toString` result references. */


var asyncTag$1 = '[object AsyncFunction]',
    funcTag$3 = '[object Function]',
    genTag$2 = '[object GeneratorFunction]',
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
  return tag == funcTag$3 || tag == genTag$2 || tag == asyncTag$1 || tag == proxyTag$1;
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

function toSource$1(func) {
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


function noop$1() {} // No operation performed.

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

var objectProto$3$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2$1 = objectProto$3$1.hasOwnProperty;
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

  return hasOwnProperty$2$1.call(data, key) ? data[key] : undefined;
}
/** Used for built-in method references. */


var objectProto$4$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3$1 = objectProto$4$1.hasOwnProperty;
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
  return nativeCreate$1 ? data[key] !== undefined : hasOwnProperty$3$1.call(data, key);
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

var Map$2 = getNative$1(root$1, 'Map');
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
    'map': new (Map$2 || ListCache$1)(),
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
    get$1(listener, type, noop$1)(e);
  });

  if (listenersLayers.length) {
    get$1(last$1(listenersLayers), type, noop$1)(e);
  } else {
    var layers = Object.keys(listenersPredefinedLayers).filter(function (key) {
      return listenersPredefinedLayers[Number(key)].length > 0;
    }).sort(function (a, b) {
      return Number(a) - Number(b);
    });
    (listenersPredefinedLayers[Number(last$1(layers))] || []).forEach(function (listener) {
      get$1(listener, type, noop$1)(e);
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

    if (isArray$1(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray$1(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray$1(firstParam) && isUndefined$1(secondParam)) {
      var setCount_1 = 0;
      firstParam.forEach(function (layerMap) {
        setCount_1 += Number(Emitter.setLayerMap(layerMap));
      });
      return setCount_1;
    }

    if (!isArray$1(firstParam) && typeof firstParam === 'object' && !isUndefined$1(firstParam.name) && !isUndefined$1(firstParam.id)) {
      return Number(Emitter.setLayerMap(firstParam));
    }

    if (!isArray$1(firstParam) && typeof firstParam === 'object') {
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
    if (typeof data === 'object' && !isArray$1(data)) {
      return Emitter.setLayerMapFromObject(data);
    }

    if (isArray$1(data)) {
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
    return ['INPUT', 'TEXTAREA'].includes(get$1(e, 'target.tagName'));
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
      var layerId = get$1(layersMap.find(function (item) {
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
      var layerId = typeof subscribeType === 'string' ? get$1(layersMap.find(function (item) {
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

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex$1 = [];

for (var i$1 = 0; i$1 < 256; ++i$1) {
  byteToHex$1[i$1] = (i$1 + 0x100).toString(16).substr(1);
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
var objectProto$1$2 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1$2 = objectProto$1$2.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString$2(value) {
  return nativeObjectToString$1$2.call(value);
}

/** `Object#toString` result references. */

var nullTag$2 = '[object Null]',
    undefinedTag$2 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1$2 = Symbol$2 ? Symbol$2.toStringTag : undefined;
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

  return symToStringTag$1$2 && symToStringTag$1$2 in Object(value) ? getRawTag$2(value) : objectToString$2(value);
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
function isObjectLike$2(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */

var symbolTag$4 = '[object Symbol]';
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

function isSymbol$2(value) {
  return typeof value == 'symbol' || isObjectLike$2(value) && baseGetTag$2(value) == symbolTag$4;
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
function arrayMap$2(array, iteratee) {
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
var isArray$2 = Array.isArray;

/** Used as references for various `Number` constants. */

var INFINITY$3 = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto$3 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolToString$2 = symbolProto$3 ? symbolProto$3.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString$2(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isArray$2(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$2(value, baseToString$2) + '';
  }

  if (isSymbol$2(value)) {
    return symbolToString$2 ? symbolToString$2.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$3 ? '-0' : result;
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
function identity$1(value) {
  return value;
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

var funcProto$1$2 = Function.prototype,
    objectProto$2$2 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1$2 = funcProto$1$2.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$1$2 = objectProto$2$2.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative$2 = RegExp('^' + funcToString$1$2.call(hasOwnProperty$1$2).replace(reRegExpChar$2, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
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

/* Built-in method references that are verified to be native. */

var WeakMap$1$1 = getNative$2(root$2, 'WeakMap');

/** Built-in value references. */

var objectCreate$1 = Object.create;
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */

var baseCreate$1 = function () {
  function object() {}

  return function (proto) {
    if (!isObject$2(proto)) {
      return {};
    }

    if (objectCreate$1) {
      return objectCreate$1(proto);
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
function apply$1(func, thisArg, args) {
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
function noop$2() {// No operation performed.
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray$1(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));

  while (++index < length) {
    array[index] = source[index];
  }

  return array;
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT$1 = 800,
    HOT_SPAN$1 = 16;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeNow$1 = Date.now;
/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */

function shortOut$1(func) {
  var count = 0,
      lastCalled = 0;
  return function () {
    var stamp = nativeNow$1(),
        remaining = HOT_SPAN$1 - (stamp - lastCalled);
    lastCalled = stamp;

    if (remaining > 0) {
      if (++count >= HOT_COUNT$1) {
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
function constant$1(value) {
  return function () {
    return value;
  };
}

var defineProperty$1 = function () {
  try {
    var func = getNative$2(Object, 'defineProperty');
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

var baseSetToString$1 = !defineProperty$1 ? identity$1 : function (func, string) {
  return defineProperty$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant$1(string),
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

var setToString$1 = shortOut$1(baseSetToString$1);

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach$1(array, iteratee) {
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
var MAX_SAFE_INTEGER$2 = 9007199254740991;
/** Used to detect unsigned integer values. */

var reIsUint$1 = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */

function isIndex$1(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$2 : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint$1.test(value)) && value > -1 && value % 1 == 0 && value < length;
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

function baseAssignValue$1(object, key, value) {
  if (key == '__proto__' && defineProperty$1) {
    defineProperty$1(object, key, {
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
function eq$2(value, other) {
  return value === other || value !== value && other !== other;
}

/** Used for built-in method references. */

var objectProto$3$2 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2$2 = objectProto$3$2.hasOwnProperty;
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

function assignValue$1(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty$2$2.call(object, key) && eq$2(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue$1(object, key, value);
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

function copyObject$1(source, props, object, customizer) {
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
      baseAssignValue$1(object, key, newValue);
    } else {
      assignValue$1(object, key, newValue);
    }
  }

  return object;
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax$1 = Math.max;
/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */

function overRest$1(func, start, transform) {
  start = nativeMax$1(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax$1(args.length - start, 0),
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
    return apply$1(func, this, otherArgs);
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

function baseRest$1(func, start) {
  return setToString$1(overRest$1(func, start, identity$1), func + '');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1$1 = 9007199254740991;
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

function isLength$1(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1$1;
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

function isArrayLike$1(value) {
  return value != null && isLength$1(value.length) && !isFunction$2(value);
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

function isIterateeCall$1(value, index, object) {
  if (!isObject$2(object)) {
    return false;
  }

  var type = typeof index;

  if (type == 'number' ? isArrayLike$1(object) && isIndex$1(index, object.length) : type == 'string' && index in object) {
    return eq$2(object[index], value);
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

function createAssigner$1(assigner) {
  return baseRest$1(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall$1(sources[0], sources[1], guard)) {
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
var objectProto$4$2 = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */

function isPrototype$1(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$4$2;
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
function baseTimes$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

/** `Object#toString` result references. */

var argsTag$3 = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments$1(value) {
  return isObjectLike$2(value) && baseGetTag$2(value) == argsTag$3;
}

/** Used for built-in method references. */

var objectProto$5$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3$2 = objectProto$5$1.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable$2 = objectProto$5$1.propertyIsEnumerable;
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

var isArguments$1 = baseIsArguments$1(function () {
  return arguments;
}()) ? baseIsArguments$1 : function (value) {
  return isObjectLike$2(value) && hasOwnProperty$3$2.call(value, 'callee') && !propertyIsEnumerable$2.call(value, 'callee');
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
function stubFalse$1() {
  return false;
}

/** Detect free variable `exports`. */

var freeExports$3 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$3 = freeExports$3 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$3 = freeModule$3 && freeModule$3.exports === freeExports$3;
/** Built-in value references. */

var Buffer$2 = moduleExports$3 ? root$2.Buffer : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeIsBuffer$1 = Buffer$2 ? Buffer$2.isBuffer : undefined;
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

var isBuffer$1 = nativeIsBuffer$1 || stubFalse$1;

/** `Object#toString` result references. */

var argsTag$1$1 = '[object Arguments]',
    arrayTag$2 = '[object Array]',
    boolTag$3 = '[object Boolean]',
    dateTag$3 = '[object Date]',
    errorTag$3 = '[object Error]',
    funcTag$1$1 = '[object Function]',
    mapTag$5 = '[object Map]',
    numberTag$3 = '[object Number]',
    objectTag$4 = '[object Object]',
    regexpTag$3 = '[object RegExp]',
    setTag$5 = '[object Set]',
    stringTag$4 = '[object String]',
    weakMapTag$3 = '[object WeakMap]';
var arrayBufferTag$3 = '[object ArrayBuffer]',
    dataViewTag$4 = '[object DataView]',
    float32Tag$3 = '[object Float32Array]',
    float64Tag$3 = '[object Float64Array]',
    int8Tag$3 = '[object Int8Array]',
    int16Tag$3 = '[object Int16Array]',
    int32Tag$3 = '[object Int32Array]',
    uint8Tag$3 = '[object Uint8Array]',
    uint8ClampedTag$3 = '[object Uint8ClampedArray]',
    uint16Tag$3 = '[object Uint16Array]',
    uint32Tag$3 = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */

var typedArrayTags$1 = {};
typedArrayTags$1[float32Tag$3] = typedArrayTags$1[float64Tag$3] = typedArrayTags$1[int8Tag$3] = typedArrayTags$1[int16Tag$3] = typedArrayTags$1[int32Tag$3] = typedArrayTags$1[uint8Tag$3] = typedArrayTags$1[uint8ClampedTag$3] = typedArrayTags$1[uint16Tag$3] = typedArrayTags$1[uint32Tag$3] = true;
typedArrayTags$1[argsTag$1$1] = typedArrayTags$1[arrayTag$2] = typedArrayTags$1[arrayBufferTag$3] = typedArrayTags$1[boolTag$3] = typedArrayTags$1[dataViewTag$4] = typedArrayTags$1[dateTag$3] = typedArrayTags$1[errorTag$3] = typedArrayTags$1[funcTag$1$1] = typedArrayTags$1[mapTag$5] = typedArrayTags$1[numberTag$3] = typedArrayTags$1[objectTag$4] = typedArrayTags$1[regexpTag$3] = typedArrayTags$1[setTag$5] = typedArrayTags$1[stringTag$4] = typedArrayTags$1[weakMapTag$3] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray$1(value) {
  return isObjectLike$2(value) && isLength$1(value.length) && !!typedArrayTags$1[baseGetTag$2(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary$1(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */

var freeExports$1$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$1$1 = freeExports$1$1 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$1$1 = freeModule$1$1 && freeModule$1$1.exports === freeExports$1$1;
/** Detect free variable `process` from Node.js. */

var freeProcess$1 = moduleExports$1$1 && freeGlobal$2.process;
/** Used to access faster Node.js helpers. */

var nodeUtil$1 = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1$1 && freeModule$1$1.require && freeModule$1$1.require('util').types;

    if (types) {
      return types;
    } // Legacy `process.binding('util')` for Node.js < 10.


    return freeProcess$1 && freeProcess$1.binding && freeProcess$1.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */

var nodeIsTypedArray$1 = nodeUtil$1 && nodeUtil$1.isTypedArray;
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

var isTypedArray$1 = nodeIsTypedArray$1 ? baseUnary$1(nodeIsTypedArray$1) : baseIsTypedArray$1;

/** Used for built-in method references. */

var objectProto$6$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$4$1 = objectProto$6$1.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */

function arrayLikeKeys$1(value, inherited) {
  var isArr = isArray$2(value),
      isArg = !isArr && isArguments$1(value),
      isBuff = !isArr && !isArg && isBuffer$1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes$1(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$4$1.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
    isIndex$1(key, length)))) {
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
function overArg$1(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeKeys$1 = overArg$1(Object.keys, Object);

/** Used for built-in method references. */

var objectProto$7$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$5$1 = objectProto$7$1.hasOwnProperty;
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeys$1(object) {
  if (!isPrototype$1(object)) {
    return nativeKeys$1(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty$5$1.call(object, key) && key != 'constructor') {
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

function keys$1(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object) : baseKeys$1(object);
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
function nativeKeysIn$1(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

/** Used for built-in method references. */

var objectProto$8$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$6$1 = objectProto$8$1.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn$1(object) {
  if (!isObject$2(object)) {
    return nativeKeysIn$1(object);
  }

  var isProto = isPrototype$1(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$6$1.call(object, key)))) {
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

function keysIn$1$1(object) {
  return isArrayLike$1(object) ? arrayLikeKeys$1(object, true) : baseKeysIn$1(object);
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

var assignInWith$1 = createAssigner$1(function (object, source, srcIndex, customizer) {
  copyObject$1(source, keysIn$1$1(source), object, customizer);
});

/** Used to match property names within property paths. */

var reIsDeepProp$2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$2 = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */

function isKey$2(value, object) {
  if (isArray$2(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$2(value)) {
    return true;
  }

  return reIsPlainProp$2.test(value) || !reIsDeepProp$2.test(value) || object != null && value in Object(object);
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

var objectProto$9$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$7$1 = objectProto$9$1.hasOwnProperty;
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

  return hasOwnProperty$7$1.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */

var objectProto$a$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$8$1 = objectProto$a$1.hasOwnProperty;
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
  return nativeCreate$2 ? data[key] !== undefined : hasOwnProperty$8$1.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$1$2 = '__lodash_hash_undefined__';
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
  data[key] = nativeCreate$2 && value === undefined ? HASH_UNDEFINED$1$2 : value;
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

var Map$1$1 = getNative$2(root$2, 'Map');

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
    'map': new (Map$1$1 || ListCache$2)(),
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

/** Error message constants. */

var FUNC_ERROR_TEXT$2 = 'Expected a function';
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

function memoize$2(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$2);
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

  memoized.cache = new (memoize$2.Cache || MapCache$2)();
  return memoized;
} // Expose `MapCache`.


memoize$2.Cache = MapCache$2;

/** Used as the maximum memoize cache size. */

var MAX_MEMOIZE_SIZE$2 = 500;
/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */

function memoizeCapped$2(func) {
  var result = memoize$2(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE$2) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */

var rePropName$2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */

var reEscapeChar$2 = /\\(\\)?/g;
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */

var stringToPath$2 = memoizeCapped$2(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
      result.push('');
    }

  string.replace(rePropName$2, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar$2, '$1') : number || match);
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

function toString$2(value) {
  return value == null ? '' : baseToString$2(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */

function castPath$2(value, object) {
  if (isArray$2(value)) {
    return value;
  }

  return isKey$2(value, object) ? [value] : stringToPath$2(toString$2(value));
}

/** Used as references for various `Number` constants. */

var INFINITY$1$2 = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey$2(value) {
  if (typeof value == 'string' || isSymbol$2(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1$2 ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */

function baseGet$2(object, path) {
  path = castPath$2(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$2(path[index++])];
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

function get$2(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$2(object, path);
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
function arrayPush$1(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}

/** Built-in value references. */

var spreadableSymbol$1 = Symbol$2 ? Symbol$2.isConcatSpreadable : undefined;
/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */

function isFlattenable$1(value) {
  return isArray$2(value) || isArguments$1(value) || !!(spreadableSymbol$1 && value && value[spreadableSymbol$1]);
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

function baseFlatten$1(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;
  predicate || (predicate = isFlattenable$1);
  result || (result = []);

  while (++index < length) {
    var value = array[index];

    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$1(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$1(result, value);
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

function flatten$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten$1(array, 1) : [];
}

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */

function flatRest$1(func) {
  return setToString$1(overRest$1(func, undefined, flatten$1), func + '');
}

/** Built-in value references. */

var getPrototype$1 = overArg$1(Object.getPrototypeOf, Object);

/** `Object#toString` result references. */

var objectTag$1$1 = '[object Object]';
/** Used for built-in method references. */

var funcProto$2$1 = Function.prototype,
    objectProto$b$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$2$1 = funcProto$2$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$9$1 = objectProto$b$1.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString$1 = funcToString$2$1.call(Object);
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

function isPlainObject$1(value) {
  if (!isObjectLike$2(value) || baseGetTag$2(value) != objectTag$1$1) {
    return false;
  }

  var proto = getPrototype$1(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty$9$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2$1.call(Ctor) == objectCtorString$1;
}

/** `Object#toString` result references. */

var domExcTag$1 = '[object DOMException]',
    errorTag$1$1 = '[object Error]';
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

function isError$1(value) {
  if (!isObjectLike$2(value)) {
    return false;
  }

  var tag = baseGetTag$2(value);
  return tag == errorTag$1$1 || tag == domExcTag$1 || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject$1(value);
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

var attempt$1 = baseRest$1(function (func, args) {
  try {
    return apply$1(func, undefined, args);
  } catch (e) {
    return isError$1(e) ? e : new Error(e);
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
function baseSlice$1(array, start, end) {
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
function basePropertyOf$1(object) {
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

function stackClear$1() {
  this.__data__ = new ListCache$2();
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
function stackDelete$1(key) {
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
function stackGet$1(key) {
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
function stackHas$1(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */

var LARGE_ARRAY_SIZE$1 = 200;
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

function stackSet$1(key, value) {
  var data = this.__data__;

  if (data instanceof ListCache$2) {
    var pairs = data.__data__;

    if (!Map$1$1 || pairs.length < LARGE_ARRAY_SIZE$1 - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new MapCache$2(pairs);
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

function Stack$1(entries) {
  var data = this.__data__ = new ListCache$2(entries);
  this.size = data.size;
} // Add methods to `Stack`.


Stack$1.prototype.clear = stackClear$1;
Stack$1.prototype['delete'] = stackDelete$1;
Stack$1.prototype.get = stackGet$1;
Stack$1.prototype.has = stackHas$1;
Stack$1.prototype.set = stackSet$1;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */

function baseAssign$1(object, source) {
  return object && copyObject$1(source, keys$1(source), object);
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

function baseAssignIn$1(object, source) {
  return object && copyObject$1(source, keysIn$1$1(source), object);
}

/** Detect free variable `exports`. */

var freeExports$2$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$2$1 = freeExports$2$1 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$2$1 = freeModule$2$1 && freeModule$2$1.exports === freeExports$2$1;
/** Built-in value references. */

var Buffer$1$1 = moduleExports$2$1 ? root$2.Buffer : undefined,
    allocUnsafe$1 = Buffer$1$1 ? Buffer$1$1.allocUnsafe : undefined;
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */

function cloneBuffer$1(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }

  var length = buffer.length,
      result = allocUnsafe$1 ? allocUnsafe$1(length) : new buffer.constructor(length);
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
function arrayFilter$1(array, predicate) {
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
function stubArray$1() {
  return [];
}

/** Used for built-in method references. */

var objectProto$c$1 = Object.prototype;
/** Built-in value references. */

var propertyIsEnumerable$1$1 = objectProto$c$1.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols$2 = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbols$1 = !nativeGetSymbols$2 ? stubArray$1 : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return arrayFilter$1(nativeGetSymbols$2(object), function (symbol) {
    return propertyIsEnumerable$1$1.call(object, symbol);
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

function copySymbols$1(source, object) {
  return copyObject$1(source, getSymbols$1(source), object);
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols$1$1 = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbolsIn$1 = !nativeGetSymbols$1$1 ? stubArray$1 : function (object) {
  var result = [];

  while (object) {
    arrayPush$1(result, getSymbols$1(object));
    object = getPrototype$1(object);
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

function copySymbolsIn$1(source, object) {
  return copyObject$1(source, getSymbolsIn$1(source), object);
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

function baseGetAllKeys$1(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$2(object) ? result : arrayPush$1(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeys$1(object) {
  return baseGetAllKeys$1(object, keys$1, getSymbols$1);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeysIn$1(object) {
  return baseGetAllKeys$1(object, keysIn$1$1, getSymbolsIn$1);
}

/* Built-in method references that are verified to be native. */

var DataView$1 = getNative$2(root$2, 'DataView');

/* Built-in method references that are verified to be native. */

var Promise$1$1 = getNative$2(root$2, 'Promise');

/* Built-in method references that are verified to be native. */

var Set$1 = getNative$2(root$2, 'Set');

/** `Object#toString` result references. */

var mapTag$1$1 = '[object Map]',
    objectTag$2$1 = '[object Object]',
    promiseTag$1 = '[object Promise]',
    setTag$1$1 = '[object Set]',
    weakMapTag$1$1 = '[object WeakMap]';
var dataViewTag$1$1 = '[object DataView]';
/** Used to detect maps, sets, and weakmaps. */

var dataViewCtorString$1 = toSource$2(DataView$1),
    mapCtorString$1 = toSource$2(Map$1$1),
    promiseCtorString$1 = toSource$2(Promise$1$1),
    setCtorString$1 = toSource$2(Set$1),
    weakMapCtorString$1 = toSource$2(WeakMap$1$1);
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

var getTag$2 = baseGetTag$2; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

if (DataView$1 && getTag$2(new DataView$1(new ArrayBuffer(1))) != dataViewTag$1$1 || Map$1$1 && getTag$2(new Map$1$1()) != mapTag$1$1 || Promise$1$1 && getTag$2(Promise$1$1.resolve()) != promiseTag$1 || Set$1 && getTag$2(new Set$1()) != setTag$1$1 || WeakMap$1$1 && getTag$2(new WeakMap$1$1()) != weakMapTag$1$1) {
  getTag$2 = function (value) {
    var result = baseGetTag$2(value),
        Ctor = result == objectTag$2$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource$2(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString$1:
          return dataViewTag$1$1;

        case mapCtorString$1:
          return mapTag$1$1;

        case promiseCtorString$1:
          return promiseTag$1;

        case setCtorString$1:
          return setTag$1$1;

        case weakMapCtorString$1:
          return weakMapTag$1$1;
      }
    }

    return result;
  };
}

var getTag$1$1 = getTag$2;

/** Used for built-in method references. */
var objectProto$d$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$a$1 = objectProto$d$1.hasOwnProperty;
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */

function initCloneArray$1(array) {
  var length = array.length,
      result = new array.constructor(length); // Add properties assigned by `RegExp#exec`.

  if (length && typeof array[0] == 'string' && hasOwnProperty$a$1.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }

  return result;
}

/** Built-in value references. */

var Uint8Array$1 = root$2.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */

function cloneArrayBuffer$1(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1(result).set(new Uint8Array$1(arrayBuffer));
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

function cloneDataView$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags$1 = /\w*$/;
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */

function cloneRegExp$1(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags$1.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */

var symbolProto$1$1 = Symbol$2 ? Symbol$2.prototype : undefined,
    symbolValueOf$1 = symbolProto$1$1 ? symbolProto$1$1.valueOf : undefined;
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */

function cloneSymbol$1(symbol) {
  return symbolValueOf$1 ? Object(symbolValueOf$1.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */

function cloneTypedArray$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** `Object#toString` result references. */

var boolTag$1$1 = '[object Boolean]',
    dateTag$1$1 = '[object Date]',
    mapTag$2$1 = '[object Map]',
    numberTag$1$1 = '[object Number]',
    regexpTag$1$1 = '[object RegExp]',
    setTag$2$1 = '[object Set]',
    stringTag$1$1 = '[object String]',
    symbolTag$1$1 = '[object Symbol]';
var arrayBufferTag$1$1 = '[object ArrayBuffer]',
    dataViewTag$2$1 = '[object DataView]',
    float32Tag$1$1 = '[object Float32Array]',
    float64Tag$1$1 = '[object Float64Array]',
    int8Tag$1$1 = '[object Int8Array]',
    int16Tag$1$1 = '[object Int16Array]',
    int32Tag$1$1 = '[object Int32Array]',
    uint8Tag$1$1 = '[object Uint8Array]',
    uint8ClampedTag$1$1 = '[object Uint8ClampedArray]',
    uint16Tag$1$1 = '[object Uint16Array]',
    uint32Tag$1$1 = '[object Uint32Array]';
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

function initCloneByTag$1(object, tag, isDeep) {
  var Ctor = object.constructor;

  switch (tag) {
    case arrayBufferTag$1$1:
      return cloneArrayBuffer$1(object);

    case boolTag$1$1:
    case dateTag$1$1:
      return new Ctor(+object);

    case dataViewTag$2$1:
      return cloneDataView$1(object, isDeep);

    case float32Tag$1$1:
    case float64Tag$1$1:
    case int8Tag$1$1:
    case int16Tag$1$1:
    case int32Tag$1$1:
    case uint8Tag$1$1:
    case uint8ClampedTag$1$1:
    case uint16Tag$1$1:
    case uint32Tag$1$1:
      return cloneTypedArray$1(object, isDeep);

    case mapTag$2$1:
      return new Ctor();

    case numberTag$1$1:
    case stringTag$1$1:
      return new Ctor(object);

    case regexpTag$1$1:
      return cloneRegExp$1(object);

    case setTag$2$1:
      return new Ctor();

    case symbolTag$1$1:
      return cloneSymbol$1(object);
  }
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneObject$1(object) {
  return typeof object.constructor == 'function' && !isPrototype$1(object) ? baseCreate$1(getPrototype$1(object)) : {};
}

/** `Object#toString` result references. */

var mapTag$3$1 = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap$1(value) {
  return isObjectLike$2(value) && getTag$1$1(value) == mapTag$3$1;
}

/* Node.js helper references. */

var nodeIsMap$1 = nodeUtil$1 && nodeUtil$1.isMap;
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

var isMap$1 = nodeIsMap$1 ? baseUnary$1(nodeIsMap$1) : baseIsMap$1;

/** `Object#toString` result references. */

var setTag$3$1 = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet$1(value) {
  return isObjectLike$2(value) && getTag$1$1(value) == setTag$3$1;
}

/* Node.js helper references. */

var nodeIsSet$1 = nodeUtil$1 && nodeUtil$1.isSet;
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

var isSet$1 = nodeIsSet$1 ? baseUnary$1(nodeIsSet$1) : baseIsSet$1;

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG$2 = 1,
    CLONE_FLAT_FLAG$2 = 2,
    CLONE_SYMBOLS_FLAG$2 = 4;
/** `Object#toString` result references. */

var argsTag$2$1 = '[object Arguments]',
    arrayTag$1$1 = '[object Array]',
    boolTag$2$1 = '[object Boolean]',
    dateTag$2$1 = '[object Date]',
    errorTag$2$1 = '[object Error]',
    funcTag$2$1 = '[object Function]',
    genTag$1$1 = '[object GeneratorFunction]',
    mapTag$4$1 = '[object Map]',
    numberTag$2$1 = '[object Number]',
    objectTag$3$1 = '[object Object]',
    regexpTag$2$1 = '[object RegExp]',
    setTag$4$1 = '[object Set]',
    stringTag$2$1 = '[object String]',
    symbolTag$2$1 = '[object Symbol]',
    weakMapTag$2$1 = '[object WeakMap]';
var arrayBufferTag$2$1 = '[object ArrayBuffer]',
    dataViewTag$3$1 = '[object DataView]',
    float32Tag$2$1 = '[object Float32Array]',
    float64Tag$2$1 = '[object Float64Array]',
    int8Tag$2$1 = '[object Int8Array]',
    int16Tag$2$1 = '[object Int16Array]',
    int32Tag$2$1 = '[object Int32Array]',
    uint8Tag$2$1 = '[object Uint8Array]',
    uint8ClampedTag$2$1 = '[object Uint8ClampedArray]',
    uint16Tag$2$1 = '[object Uint16Array]',
    uint32Tag$2$1 = '[object Uint32Array]';
/** Used to identify `toStringTag` values supported by `_.clone`. */

var cloneableTags$1 = {};
cloneableTags$1[argsTag$2$1] = cloneableTags$1[arrayTag$1$1] = cloneableTags$1[arrayBufferTag$2$1] = cloneableTags$1[dataViewTag$3$1] = cloneableTags$1[boolTag$2$1] = cloneableTags$1[dateTag$2$1] = cloneableTags$1[float32Tag$2$1] = cloneableTags$1[float64Tag$2$1] = cloneableTags$1[int8Tag$2$1] = cloneableTags$1[int16Tag$2$1] = cloneableTags$1[int32Tag$2$1] = cloneableTags$1[mapTag$4$1] = cloneableTags$1[numberTag$2$1] = cloneableTags$1[objectTag$3$1] = cloneableTags$1[regexpTag$2$1] = cloneableTags$1[setTag$4$1] = cloneableTags$1[stringTag$2$1] = cloneableTags$1[symbolTag$2$1] = cloneableTags$1[uint8Tag$2$1] = cloneableTags$1[uint8ClampedTag$2$1] = cloneableTags$1[uint16Tag$2$1] = cloneableTags$1[uint32Tag$2$1] = true;
cloneableTags$1[errorTag$2$1] = cloneableTags$1[funcTag$2$1] = cloneableTags$1[weakMapTag$2$1] = false;
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

function baseClone$1(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$2,
      isFlat = bitmask & CLONE_FLAT_FLAG$2,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$2;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }

  if (result !== undefined) {
    return result;
  }

  if (!isObject$2(value)) {
    return value;
  }

  var isArr = isArray$2(value);

  if (isArr) {
    result = initCloneArray$1(value);

    if (!isDeep) {
      return copyArray$1(value, result);
    }
  } else {
    var tag = getTag$1$1(value),
        isFunc = tag == funcTag$2$1 || tag == genTag$1$1;

    if (isBuffer$1(value)) {
      return cloneBuffer$1(value, isDeep);
    }

    if (tag == objectTag$3$1 || tag == argsTag$2$1 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject$1(value);

      if (!isDeep) {
        return isFlat ? copySymbolsIn$1(value, baseAssignIn$1(result, value)) : copySymbols$1(value, baseAssign$1(result, value));
      }
    } else {
      if (!cloneableTags$1[tag]) {
        return object ? value : {};
      }

      result = initCloneByTag$1(value, tag, isDeep);
    }
  } // Check for circular references and return its corresponding clone.


  stack || (stack = new Stack$1());
  var stacked = stack.get(value);

  if (stacked) {
    return stacked;
  }

  stack.set(value, result);

  if (isSet$1(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone$1(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap$1(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull ? isFlat ? getAllKeysIn$1 : getAllKeys$1 : isFlat ? keysIn : keys$1;
  var props = isArr ? undefined : keysFunc(value);
  arrayEach$1(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    } // Recursively populate clone (susceptible to call stack limits).


    assignValue$1(result, key, baseClone$1(subValue, bitmask, customizer, key, value, stack));
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
function last$2(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/** Used to map characters to HTML entities. */

var htmlEscapes$1 = {
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

var escapeHtmlChar$1 = basePropertyOf$1(htmlEscapes$1);

/** Used to match HTML entities and HTML characters. */

var reUnescapedHtml$1 = /[&<>"']/g,
    reHasUnescapedHtml$1 = RegExp(reUnescapedHtml$1.source);
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

function escape$1(string) {
  string = toString$2(string);
  return string && reHasUnescapedHtml$1.test(string) ? string.replace(reUnescapedHtml$1, escapeHtmlChar$1) : string;
}

/** `Object#toString` result references. */

var stringTag$3$1 = '[object String]';
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

function isString$1(value) {
  return typeof value == 'string' || !isArray$2(value) && isObjectLike$2(value) && baseGetTag$2(value) == stringTag$3$1;
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

function baseValues$1(object, props) {
  return arrayMap$2(props, function (key) {
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

function parent$1(object, path) {
  return path.length < 2 ? object : baseGet$2(object, baseSlice$1(path, 0, -1));
}

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */

function baseUnset$1(object, path) {
  path = castPath$2(path, object);
  object = parent$1(object, path);
  return object == null || delete object[toKey$2(last$2(path))];
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

function customOmitClone$1(value) {
  return isPlainObject$1(value) ? undefined : value;
}

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG$1$1 = 1,
    CLONE_FLAT_FLAG$1$1 = 2,
    CLONE_SYMBOLS_FLAG$1$1 = 4;
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

var omit$1 = flatRest$1(function (object, paths) {
  var result = {};

  if (object == null) {
    return result;
  }

  var isDeep = false;
  paths = arrayMap$2(paths, function (path) {
    path = castPath$2(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject$1(object, getAllKeysIn$1(object), result);

  if (isDeep) {
    result = baseClone$1(result, CLONE_DEEP_FLAG$1$1 | CLONE_FLAT_FLAG$1$1 | CLONE_SYMBOLS_FLAG$1$1, customOmitClone$1);
  }

  var length = paths.length;

  while (length--) {
    baseUnset$1(result, paths[length]);
  }

  return result;
});

/** Used for built-in method references. */

var objectProto$e$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$b$1 = objectProto$e$1.hasOwnProperty;
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

function customDefaultsAssignIn$1(objValue, srcValue, key, object) {
  if (objValue === undefined || eq$2(objValue, objectProto$e$1[key]) && !hasOwnProperty$b$1.call(object, key)) {
    return srcValue;
  }

  return objValue;
}

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes$1 = {
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

function escapeStringChar$1(chr) {
  return '\\' + stringEscapes$1[chr];
}

/** Used to match template delimiters. */
var reInterpolate$1 = /<%=([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEscape$1 = /<%-([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEvaluate$1 = /<%([\s\S]+?)%>/g;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB) as well as ES2015 template strings. Change the
 * following template settings to use alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */

var templateSettings$1 = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape$1,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate$1,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate$1,

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
      'escape': escape$1
    }
  }
};

/** Used to match empty string literals in compiled template source. */

var reEmptyStringLeading$1 = /\b__p \+= '';/g,
    reEmptyStringMiddle$1 = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing$1 = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */

var reEsTemplate$1 = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
/** Used to ensure capturing order of template delimiters. */

var reNoMatch$1 = /($^)/;
/** Used to match unescaped characters in compiled string literals. */

var reUnescapedString$1 = /['\n\r\u2028\u2029\\]/g;
/** Used for built-in method references. */

var objectProto$f$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$c$1 = objectProto$f$1.hasOwnProperty;
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
  var settings = templateSettings$1.imports._.templateSettings || templateSettings$1;

  if (guard && isIterateeCall$1(string, options, guard)) {
    options = undefined;
  }

  string = toString$2(string);
  options = assignInWith$1({}, options, settings, customDefaultsAssignIn$1);
  var imports = assignInWith$1({}, options.imports, settings.imports, customDefaultsAssignIn$1),
      importsKeys = keys$1(imports),
      importsValues = baseValues$1(imports, importsKeys);
  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch$1,
      source = "__p += '"; // Compile the regexp to match each delimiter.

  var reDelimiters = RegExp((options.escape || reNoMatch$1).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate$1 ? reEsTemplate$1 : reNoMatch$1).source + '|' + (options.evaluate || reNoMatch$1).source + '|$', 'g'); // Use a sourceURL for easier debugging.
  // The sourceURL gets injected into the source that's eval-ed, so be careful
  // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
  // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.

  var sourceURL = hasOwnProperty$c$1.call(options, 'sourceURL') ? '//# sourceURL=' + (options.sourceURL + '').replace(/[\r\n]/g, ' ') + '\n' : '';
  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue); // Escape characters that can't be included in string literals.

    source += string.slice(index, offset).replace(reUnescapedString$1, escapeStringChar$1); // Replace delimiters with snippets.

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

  var variable = hasOwnProperty$c$1.call(options, 'variable') && options.variable;

  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  } // Cleanup code by stripping empty strings.


  source = (isEvaluating ? source.replace(reEmptyStringLeading$1, '') : source).replace(reEmptyStringMiddle$1, '$1').replace(reEmptyStringTrailing$1, '$1;'); // Frame code as the function body.

  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
  var result = attempt$1(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  }); // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.

  result.source = source;

  if (isError$1(result)) {
    throw result;
  }

  return result;
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

class Animation$1 {
    constructor() {
        Animation$1.activateRequestAnimationFrame();
        this.registerFrameHandler();
    }
    static activateRequestAnimationFrame() {
        if (!Animation$1.animationFrame) {
            Animation$1.animationFrame = window
                .requestAnimationFrame(Animation$1.requestAnimationFrameHandler);
        }
    }
    static deactivateRequestAnimationFrame() {
        if (!Animation$1.handlerList.length) {
            window.cancelAnimationFrame(Animation$1.animationFrame);
        }
    }
    static requestAnimationFrameHandler() {
        Animation$1.handlerList.forEach((handler) => handler());
        Animation$1.animationFrame = window
            .requestAnimationFrame(Animation$1.requestAnimationFrameHandler);
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
            Animation$1.activateRequestAnimationFrame();
            Animation$1.handlerList.push(frameHandler);
        }
    }
    removeHandler() {
        const { handlerList } = Animation$1;
        const { frameHandler } = this;
        if (frameHandler && handlerList.includes(frameHandler)) {
            const index = handlerList.indexOf(frameHandler);
            handlerList.splice(index, 1);
        }
        Animation$1.deactivateRequestAnimationFrame();
    }
}
Animation$1.handlerList = [];

const CLASS_NAME_PATTERN$1 = /class="[^"]+"/ig;
const REF_PATTERN$1 = /ref="[^"]+"/ig;
const IF_OPEN_PATTERN$1 = /<If\scondition="\{[^"]+}">/gi;
const IF_CLOSE_PATTERN$1 = /<\/If>/gi;
const CHOOSE_OPEN_PATTERN$1 = /<Choose>/gi;
const CHOOSE_CLOSE_PATTERN$1 = /<\/Choose>/gi;
const CHOOSE_PATTERN$1 = /<Choose>(.(?!\/Choose>)|\n(?!\/Choose>)|\s(?!\/Choose>))+/gi;
const WHEN_PATTERN$1 = /<When\scondition="\{[^"]+}">(.(?!\/When>)|\n(?!\/When>)|\s(?!\/When>))+/gi;
const WHEN_OPEN_PATTERN$1 = /<When\scondition="\{[^"]+}">/gi;
const WHEN_CLOSE_PATTERN$1 = /<\/When>/gi;
const OTHERWISE_PATTERN$1 = /<Otherwise>(.(?!\/Otherwise>)|\n(?!\/Otherwise>)|\s(?!\/Otherwise>))+/gi;
const OTHERWISE_OPEN_PATTERN$1 = /<Otherwise>/gi;
const OTHERWISE_CLOSE_PATTERN$1 = /<\/Otherwise>/gi;

class TemplateEngine$1 extends Animation$1 {
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
        const classNameStringList = renderString.match(CLASS_NAME_PATTERN$1);
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
        let processedTemplate = TemplateEngine$1
            .getTemplateExecutorStringWithLodashConditions(template$1$1);
        processedTemplate = TemplateEngine$1
            .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
            .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
        return template$1(processedTemplate);
    }
    static getTemplateExecutorStringWithLodashConditions(template) {
        const conditionList = template.match(IF_OPEN_PATTERN$1);
        if (!conditionList)
            return template;
        return conditionList.reduce((acc, item) => {
            const condition = item.replace(/^<If\scondition="\{/i, '').replace(/}">$/, '');
            return acc.replace(item, `<% if (${condition}) { %>`);
        }, template).replace(IF_CLOSE_PATTERN$1, '<% } %>');
    }
    static getTemplateExecutorStringWithLodashSwitches(template) {
        if (!CHOOSE_OPEN_PATTERN$1.test(template))
            return template;
        const chooseList = template.match(CHOOSE_PATTERN$1) || [];
        return chooseList.reduce((acc, item) => {
            return this.getTemplateExecutorStringWithLodashWhen(acc, item.replace(/<Choose>[^<]*/i, ''));
        }, template).replace(CHOOSE_OPEN_PATTERN$1, '').replace(CHOOSE_CLOSE_PATTERN$1, '');
    }
    static getTemplateExecutorStringWithLodashWhen(template, data) {
        const whenList = data.match(WHEN_PATTERN$1) || [];
        const otherwiseList = data.match(OTHERWISE_PATTERN$1) || [];
        const processedString = whenList.reduce((acc, item, index) => {
            const openBlockList = item.match(WHEN_OPEN_PATTERN$1);
            if (!openBlockList)
                return acc;
            const openBlock = openBlockList[0];
            const condition = openBlock.replace(/^<When\scondition="\{/i, '').replace(/}">$/, '');
            const processedBlock = item.replace(openBlock, `<%${index ? ' else' : ''} if (${condition}) { %>`);
            return acc.replace(item, processedBlock);
        }, template).replace(WHEN_CLOSE_PATTERN$1, '<% } %>');
        return otherwiseList.length === 1
            ? otherwiseList.reduce((acc, item) => {
                const processedBlock = item
                    .replace(OTHERWISE_OPEN_PATTERN$1, whenList.length ? '<% else {  %>' : '');
                return acc.replace(item, processedBlock);
            }, processedString).replace(OTHERWISE_CLOSE_PATTERN$1, whenList.length ? '<% } %>' : '')
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
        this.templateExecutor = TemplateEngine$1.getTemplateExecutor(value);
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
        let renderString = templateExecutor(omit$1(params, ['css']));
        renderString = TemplateEngine$1.getRenderStringWithClassNames(renderString, params);
        return TemplateEngine$1.getRenderStringWithVariables(renderString, params);
    }
    saveRefs() {
        const { container } = this;
        const refs = this.template.match(REF_PATTERN$1);
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
        const proxyChildNodes = TemplateEngine$1.getProxyChildNodes(renderString);
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
        this.childNodes = TemplateEngine$1.getProxyChildNodes(renderString);
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
        this.childNodes = TemplateEngine$1.getProxyChildNodes(renderString);
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
            TemplateEngine$1
                .insertAfter(container, childNode, ref);
        }
    }
    appendChild(childNode) {
        const { container } = this;
        if (container)
            container.appendChild(childNode);
    }
}

const getKeyCode$1 = (e) => e ? e.which || e.keyCode : null;

const ENTER_CODE$1 = 13;
const LEFT_CODE$1 = 37;
const RIGHT_CODE$1 = 39;
const UP_CODE$1 = 38;
const DOWN_CODE$1 = 40;
const NON_BREAKING_SPACE$1 = '&nbsp;';

var css$2$1 = {"root":"root-term-️cab119304dc90a90f699151e7c15d7ee","visible":"visible-term-️cab119304dc90a90f699151e7c15d7ee","content":"content-term-️cab119304dc90a90f699151e7c15d7ee","helpContainer":"helpContainer-term-️cab119304dc90a90f699151e7c15d7ee","inputContainer":"inputContainer-term-️cab119304dc90a90f699151e7c15d7ee"};

var lineTemplate$1 = "<div ref=\"root\" class=\"root visible {className}\">\n  <div ref=\"content\" class=\"content\">\n    <div ref=\"helpContainer\" class=\"labelText helpContainer\">{nbs}</div>\n    <div ref=\"labelContainer\"></div>\n    <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  </div>\n</div>\n";

class BaseCaret$1 extends TemplateEngine$1 {
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

var SimpleCaretTemplate$1 = "<span ref=\"root\" class=\"root\">\n  <span ref=\"character\" class=\"character\"></span>\n</span>\n";

var css$3$1 = {"root":"root-term-️e70267db75c0341d98d4d4a58c7a4fe6","carriage-return-blink":"carriage-return-blink-term-️e70267db75c0341d98d4d4a58c7a4fe6","lock":"lock-term-️e70267db75c0341d98d4d4a58c7a4fe6","busy":"busy-term-️e70267db75c0341d98d4d4a58c7a4fe6","none":"none-term-️e70267db75c0341d98d4d4a58c7a4fe6","carriage-return-busy":"carriage-return-busy-term-️e70267db75c0341d98d4d4a58c7a4fe6","hidden":"hidden-term-️e70267db75c0341d98d4d4a58c7a4fe6"};

class SimpleCaret$1 extends BaseCaret$1 {
    constructor(container) {
        super(SimpleCaretTemplate$1, container);
        this.render({ css: css$3$1 });
    }
    updateLockStyles() {
        const root = this.getRef('root');
        const { lock, prevLock } = this;
        if (!root || lock === prevLock)
            return;
        return lock ? root.classList.add(css$3$1.lock) : root.classList.remove(css$3$1.lock);
    }
    updateBusyStyles() {
        const root = this.getRef('root');
        const { busy, prevBusy } = this;
        if (!root || busy === prevBusy)
            return;
        return busy ? root.classList.add(css$3$1.busy) : root.classList.remove(css$3$1.busy);
    }
    updateHiddenStyles() {
        const root = this.getRef('root');
        const { hidden, prevHidden } = this;
        if (!root || hidden === prevHidden)
            return;
        return hidden ? root.classList.add(css$3$1.hidden) : root.classList.remove(css$3$1.hidden);
    }
    setValue(value) {
        const character = this.getRef('character');
        if (character && this.value !== value) {
            this.value = value;
            character.innerHTML = value;
        }
    }
}

class CaretFactory$1 {
    constructor() { }
    static registerCaret(name, caret) {
        CaretFactory$1.caretMap[name] = caret;
    }
    static getInstance() {
        if (!CaretFactory$1.instance)
            CaretFactory$1.instance = new CaretFactory$1();
        return CaretFactory$1.instance;
    }
    create(name, container) {
        return CaretFactory$1.caretMap[name]
            ? new CaretFactory$1.caretMap[name](container) : null;
    }
}
CaretFactory$1.caretMap = {
    simple: SimpleCaret$1,
};

const LOCK_TIMEOUT$1 = 600;

var template$3$1 = "<div ref=\"root\" class=\"root\">\n  <div ref=\"input\" class=\"input\" contenteditable=\"true\"></div>\n  <div ref=\"hidden\" class=\"hidden\"></div>\n</div>\n";

var css$4$1 = {"root":"root-term-️f48df653df791725509e2a00ded23e06","input":"input-term-️f48df653df791725509e2a00ded23e06","hiddenCaret":"hiddenCaret-term-️f48df653df791725509e2a00ded23e06","hidden":"hidden-term-️f48df653df791725509e2a00ded23e06"};

var css$5$1 = {"secret":"secret-term-️d139f1b48647dd08a4d620b7f948a15f"};

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

var matchHtmlRegExp$1 = /["'&<>]/;
/**
 * Module exports.
 * @public
 */

var escapeHtml_1$1 = escapeHtml$1;
/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml$1(string) {
  var str = '' + string;
  var match = matchHtmlRegExp$1.exec(str);

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

const getStartIntersectionString$1 = (main, target) => {
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

const DATA_INDEX_ATTRIBUTE_NAME$1 = 'data-index';
const SECRET_CHARACTER$1 = '•';

class BaseInput$1 extends TemplateEngine$1 {
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
        return isString$1(value)
            ? secret ? BaseInput$1.convertSecret(value) : value
            : value.reduce((acc, item) => {
                const str = isString$1(item) ? item : item.str;
                const val = secret && (isString$1(item) || !item.lock)
                    ? BaseInput$1.convertSecret(str) : str;
                return `${acc}${val}`;
            }, '');
    }
    static getFragmentTemplate(str, params) {
        const { className = '', secret = false, index } = params;
        const composedClassName = [secret ? css$5$1.secret : '', className].join(' ');
        const processedString = BaseInput$1.getNormalizedTemplateString(secret
            ? BaseInput$1.convertSecret(str) : str);
        return `<span
      ${DATA_INDEX_ATTRIBUTE_NAME$1}="${index}"
      ref="fragment-${index}"
      class="${composedClassName}">${processedString}</span>`;
    }
    static getNormalizedTemplateString(str) {
        return escapeHtml_1$1(str).replace(/\s/g, NON_BREAKING_SPACE$1);
    }
    static getValueFragmentTemplate(valueFragment, index, params = {}) {
        const { secret } = params;
        if (isString$1(valueFragment)) {
            return BaseInput$1.getFragmentTemplate(valueFragment, { index, secret });
        }
        const { str, className = '', lock } = valueFragment;
        const isSecret = !lock && secret;
        return BaseInput$1.getFragmentTemplate(str, { className, index, secret: isSecret });
    }
    static getValueTemplate(value, params = {}) {
        if (isString$1(value))
            return BaseInput$1.getNormalizedTemplateString(value);
        return value.reduce((acc, item, index) => {
            return `${acc}${BaseInput$1.getValueFragmentTemplate(item, index, params)}`;
        }, '');
    }
    static getUpdatedValueField(value, prevValue) {
        if (isString$1(prevValue))
            return value;
        let checkValue = value;
        let stop = false;
        const updatedValueField = prevValue.reduce((acc, item) => {
            const isStringItem = isString$1(item);
            const itemStr = (isStringItem ? item : item.str);
            const { str, isFull } = getStartIntersectionString$1(itemStr, checkValue);
            if (str && !stop) {
                acc.push(isStringItem ? str : Object.assign(Object.assign({}, item), { str }));
                checkValue = checkValue.substring(str.length);
                stop = !isFull;
            }
            return acc;
        }, []);
        checkValue.split('').forEach(char => updatedValueField.push(char));
        return updatedValueField.filter(item => isString$1(item) ? item : item.str);
    }
    static getLockString(value) {
        if (isString$1(value))
            return '';
        let str = '';
        let lockStr = '';
        value.forEach((item) => {
            if (isString$1(item)) {
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
        return (new Array(str.length)).fill(SECRET_CHARACTER$1).join('');
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
        return BaseInput$1.getLockString(valueField);
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
        if (isString$1(valueField))
            return index ? '' : valueField;
        const item = valueField[index];
        if (!item)
            return '';
        return isString$1(item) ? item : item.str;
    }
    getSimpleValue(showSecret = true) {
        const { secretField } = this;
        return BaseInput$1.getValueString(this.valueField, { secret: secretField && !showSecret });
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
        const charactersCount = BaseInput$1.getValueString(valueField).length;
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
        if (isString$1(valueField))
            return null;
        const dataIndex = element.getAttribute(DATA_INDEX_ATTRIBUTE_NAME$1);
        const valueFieldItem = dataIndex ? valueField[Number(dataIndex)] : null;
        return !valueFieldItem || isString$1(valueFieldItem)
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
            characterContainer.innerHTML = NON_BREAKING_SPACE$1;
            root.appendChild(characterContainer);
            this.characterContainer = characterContainer;
        }
    }
}

const STRINGIFY_HTML_PATTERN$1 = /<[^>]+>/g;
const NON_BREAKING_SPACE_PATTERN$1 = /&nbsp;/g;

const TEXT_NODE_TYPE$1 = 3;
const CHANGE_EVENT_TYPE$1 = 'change';

class ContentEditableInput$1 extends BaseInput$1 {
    constructor(container) {
        super(template$3$1, container, css$4$1);
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
        return BaseInput$1.getValueTemplate(val, params);
    }
    static getLastTextNode(root) {
        const { lastChild } = root;
        if (!lastChild)
            return null;
        if (lastChild.nodeType === TEXT_NODE_TYPE$1)
            return lastChild;
        return ContentEditableInput$1.getLastTextNode(lastChild);
    }
    static checkChildNode(root, checkNode) {
        if (root === checkNode)
            return true;
        const { parentNode } = checkNode;
        return parentNode ? ContentEditableInput$1.checkChildNode(root, parentNode) : false;
    }
    static getHtmlStringifyValue(html) {
        return html.replace(NON_BREAKING_SPACE_PATTERN$1, ' ').replace(STRINGIFY_HTML_PATTERN$1, '');
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
            const value = node.nodeType === TEXT_NODE_TYPE$1
                ? node.nodeValue
                : ContentEditableInput$1.getHtmlStringifyValue(node.innerHTML);
            return acc + (value ? value.length : 0);
        }, 0);
        return root === parentNode
            ? baseOffset + offset
            : ContentEditableInput$1.getNodeOffset(root, parentNode, baseOffset + offset);
    }
    set hiddenCaret(isCaretHidden) {
        if (this.isCaretHidden === isCaretHidden)
            return;
        const root = this.getRef('input');
        if (isCaretHidden) {
            root.classList.add(css$4$1.hiddenCaret);
        }
        else {
            root.classList.remove(css$4$1.hiddenCaret);
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
        if (!ContentEditableInput$1.checkChildNode(root, selection.anchorNode))
            return -1;
        return ContentEditableInput$1.getNodeOffset(root, anchorNode, anchorNode.nodeType === TEXT_NODE_TYPE$1 ? selection.anchorOffset : 0);
    }
    set caretPosition(position) {
        if (position < 0)
            return;
        const root = this.getRef('input');
        let offset = 0;
        let relativeOffset = 0;
        const targetNode = Array.prototype.find.call(root.childNodes, (childNode) => {
            const length = ((childNode.nodeType === TEXT_NODE_TYPE$1
                ? childNode.nodeValue
                : ContentEditableInput$1.getHtmlStringifyValue(childNode.innerHTML)) || '')
                .length;
            relativeOffset = offset;
            offset += length;
            return position <= offset;
        });
        const selection = window.getSelection();
        if (!selection || !targetNode)
            return;
        const range = new Range();
        const targetChildNode = targetNode.nodeType === TEXT_NODE_TYPE$1
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
        const node = ContentEditableInput$1.getLastTextNode(root);
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
        if (type === CHANGE_EVENT_TYPE$1) {
            this.externalChangeListeners.push(listener);
        }
        else {
            super.addEventListener(type, listener, options);
        }
    }
    removeEventListener(type, listener, options) {
        if (type === CHANGE_EVENT_TYPE$1) {
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
        const data = root.innerHTML;
        const items = data.replace(/<\/span>[^<]*</g, '</span><').split('</span>').filter(identity$1);
        return items.reduce((acc, item) => {
            var _a;
            const index = (((_a = item.match(/data-index="[0-9]+"/)) === null || _a === void 0 ? void 0 : _a[0]) || '').replace(/[^0-9]/g, '');
            if (index) {
                const prevValue = this.getValueItemString(Number(index));
                const updatedValue = ContentEditableInput$1.getHtmlStringifyValue(item)
                    .replace(new RegExp(`${SECRET_CHARACTER$1}+`), prevValue);
                return `${acc}${updatedValue}`;
            }
            return `${acc}${ContentEditableInput$1.getHtmlStringifyValue(item)}`;
        }, '');
    }
    updateValueField() {
        if (this.preventLockUpdate())
            return;
        const { caretPosition, isDisabled } = this;
        let updatedCaretPosition = caretPosition;
        if (isDisabled) {
            updatedCaretPosition = Math.min(caretPosition, BaseInput$1.getValueString(this.valueField).length);
        }
        else {
            this.valueField = BaseInput$1.getUpdatedValueField(this.getInputValue(), this.valueField);
        }
        this.updateContent();
        this.caretPosition = updatedCaretPosition;
    }
    preventLockUpdate() {
        const { valueField } = this;
        if (isString$1(valueField))
            return false;
        const value = this.getInputValue();
        const lockStr = BaseInput$1.getLockString(valueField);
        const deleteUnlockPart = lockStr
            && lockStr.indexOf(value) === 0
            && lockStr.length > value.length;
        if (deleteUnlockPart) {
            const lastLockIndex = this.valueField
                .reduce((acc, item, index) => {
                return !isString$1(item) && item.lock ? index : acc;
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
            const str = ContentEditableInput$1.getStyledValueTemplate(this.valueField, {
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
                if (childNode.nodeType !== TEXT_NODE_TYPE$1) {
                    const { color } = window.getComputedStyle(childNode);
                    if (color)
                        input.childNodes[index].style.textShadow = `0 0 0 ${color}`;
                }
            });
        }
    }
}

var template$4$1 = "<div ref=\"root\">\n  <div ref=\"input\" class=\"root\">{value}</div>\n</div>\n";

var css$6$1 = {"root":"root-term-️457efebe90f812d594ffccb8790b07ab"};

class ViewableInput$1 extends BaseInput$1 {
    set value(val) {
        this.valueField = val;
        const root = this.getRef('input');
        if (root)
            root.innerHTML = BaseInput$1.getValueTemplate(this.valueField);
    }
    constructor(container) {
        super(template$4$1, container, css$6$1);
    }
    render() {
        super.render({ css: css$6$1, value: BaseInput$1.getValueTemplate(this.valueField) });
    }
    getRootElement() {
        return this.getRef('input');
    }
}

var css$7$1 = {"label":"label-term-️679afd4849096768cfa38bb85a2048b8","labelTextContainer":"labelTextContainer-term-️679afd4849096768cfa38bb85a2048b8","labelText":"labelText-term-️679afd4849096768cfa38bb85a2048b8"};

var template$5$1 = "<if condition=\"{label || delimiter}\">\n  <div class=\"label\">\n    <if condition=\"{label}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"label\">{label}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n    <if condition=\"{delimiter}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"delimiter\">{delimiter}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n  </div>\n</if>\n\n";

class Label$1 extends TemplateEngine$1 {
    constructor(container, params = {}) {
        super(template$5$1, container);
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
            css: css$7$1, label, delimiter, nbs: NON_BREAKING_SPACE$1,
        }, this.reRender ? { replace: this } : {});
        this.reRender = true;
    }
}

class Line$1 extends TemplateEngine$1 {
    constructor(container, params = {}) {
        super(lineTemplate$1, container);
        this.isVisible = true;
        this.heightField = 0;
        this.secretField = false;
        this.initialValue = '';
        this.className = '';
        this.editable = false;
        this.onSubmit = noop$2;
        this.onChange = noop$2;
        this.onUpdateCaretPosition = noop$2;
        this.caretPosition = -1;
        this.updateHeight = () => {
            const root = this.getRef('root');
            if (!root)
                return;
            this.heightField = root.offsetHeight;
        };
        this.keyDownHandler = (e) => {
            ({
                [ENTER_CODE$1]: this.submitHandler,
                [LEFT_CODE$1]: this.lockCaret,
                [RIGHT_CODE$1]: this.lockCaret,
                [UP_CODE$1]: this.lockCaret,
                [DOWN_CODE$1]: this.lockCaret,
            }[Number(getKeyCode$1(e))] || noop$2)(e);
        };
        this.submitHandler = (e) => {
            const { onSubmit, inputField, secret } = this;
            const value = (inputField === null || inputField === void 0 ? void 0 : inputField.value) || '';
            let formattedValue = '';
            if (isString$1(value)) {
                formattedValue = secret ? '' : value;
            }
            else if (isArray$2(value)) {
                formattedValue = secret ? value.filter(item => get$2(item, 'lock')) : value;
            }
            e.preventDefault();
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
            if (document.hasFocus() && caretPosition >= 0) {
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
            this.lockTimeout = setTimeout(() => caret.lock = false, LOCK_TIMEOUT$1);
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
        const valueString = BaseInput$1.getValueString(value);
        const labelLength = (delimiter ? delimiter.length + 1 : 0)
            + (label ? label.length + 1 : 0);
        const rowItemsCount = Math
            .floor((width - Line$1.itemHorizontalPadding - labelLength * itemWidth) / itemWidth);
        return Math.ceil((valueString.length || 1) / rowItemsCount) * itemHeight
            + 2 * Line$1.itemVerticalPadding;
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
            root.classList.add(css$2$1.visible);
        }
        else {
            root.classList.remove(css$2$1.visible);
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
            css: css$2$1, editable, className, nbs: NON_BREAKING_SPACE$1,
        }, reRender ? { replace: this } : {});
        this.inputField = editable
            ? new ContentEditableInput$1(this.getRef('inputContainer'))
            : new ViewableInput$1(this.getRef('inputContainer'));
        this.label = new Label$1(this.getRef('labelContainer'), params);
        this.inputField.value = this.initialValue;
        this.inputField.secret = secret;
    }
    setCaret(name = 'simple') {
        const { inputField, editable } = this;
        this.removeCaret();
        const caret = Line$1.cf.create(name, this.getRef('inputContainer'));
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
        const { onUpdateCaretPosition = noop$2, onChange = noop$2, onSubmit = noop$2, editable = true, className = '', value, secret = false, } = params;
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
            ? NON_BREAKING_SPACE$1 : value[caretPosition] || NON_BREAKING_SPACE$1;
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
Line$1.cf = CaretFactory$1.getInstance();
Line$1.itemVerticalPadding = 4;
Line$1.itemHorizontalPadding = 16;

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

var objectProto$g$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$d$1 = objectProto$g$1.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$2$1 = objectProto$g$1.toString;
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
  var isOwn = hasOwnProperty$d$1.call(value, symToStringTag$2$1),
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


var symbolTag$3$1 = '[object Symbol]';
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
  return typeof value == 'symbol' || isObjectLike$1$1(value) && baseGetTag$1$1(value) == symbolTag$3$1;
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

var symbolProto$2$1 = Symbol$1$1 ? Symbol$1$1.prototype : undefined,
    symbolToString$1$1 = symbolProto$2$1 ? symbolProto$2$1.toString : undefined;
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
    funcTag$3$1 = '[object Function]',
    genTag$2$1 = '[object GeneratorFunction]',
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
  return tag == funcTag$3$1 || tag == genTag$2$1 || tag == asyncTag$1$1 || tag == proxyTag$1$1;
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


var funcProto$3$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$3$1 = funcProto$3$1.toString;
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
      return funcToString$3$1.call(func);
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

var Map$2$1 = getNative$1$1(root$1$1, 'Map');
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
    'map': new (Map$2$1 || ListCache$1$1)(),
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

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex$2 = [];

for (var i$2 = 0; i$2 < 256; ++i$2) {
  byteToHex$2[i$2] = (i$2 + 0x100).toString(16).substr(1);
}

const BASE_PLUGIN_NAME$1 = 'base';

class Plugin$1 {
    constructor() {
        this.name = BASE_PLUGIN_NAME$1;
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

/** Detect free variable `global` from Node.js. */
var freeGlobal$2$1 = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */

var freeSelf$2$1 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$2$1 = freeGlobal$2$1 || freeSelf$2$1 || Function('return this')();

/** Built-in value references. */

var Symbol$2$1 = root$2$1.Symbol;

/** Used for built-in method references. */

var objectProto$h$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$e$1 = objectProto$h$1.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$3$1 = objectProto$h$1.toString;
/** Built-in value references. */

var symToStringTag$3$1 = Symbol$2$1 ? Symbol$2$1.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag$2$1(value) {
  var isOwn = hasOwnProperty$e$1.call(value, symToStringTag$3$1),
      tag = value[symToStringTag$3$1];

  try {
    value[symToStringTag$3$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$3$1.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$3$1] = tag;
    } else {
      delete value[symToStringTag$3$1];
    }
  }

  return result;
}

/** Used for built-in method references. */
var objectProto$1$2$1 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1$2$1 = objectProto$1$2$1.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString$2$1(value) {
  return nativeObjectToString$1$2$1.call(value);
}

/** `Object#toString` result references. */

var nullTag$2$1 = '[object Null]',
    undefinedTag$2$1 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1$2$1 = Symbol$2$1 ? Symbol$2$1.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag$2$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$2$1 : nullTag$2$1;
  }

  return symToStringTag$1$2$1 && symToStringTag$1$2$1 in Object(value) ? getRawTag$2$1(value) : objectToString$2$1(value);
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
function isObjectLike$2$1(value) {
  return value != null && typeof value == 'object';
}

/** `Object#toString` result references. */

var symbolTag$4$1 = '[object Symbol]';
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

function isSymbol$2$1(value) {
  return typeof value == 'symbol' || isObjectLike$2$1(value) && baseGetTag$2$1(value) == symbolTag$4$1;
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
function arrayMap$2$1(array, iteratee) {
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
var isArray$2$1 = Array.isArray;

/** Used as references for various `Number` constants. */

var INFINITY$3$1 = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto$3$1 = Symbol$2$1 ? Symbol$2$1.prototype : undefined,
    symbolToString$2$1 = symbolProto$3$1 ? symbolProto$3$1.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString$2$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isArray$2$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$2$1(value, baseToString$2$1) + '';
  }

  if (isSymbol$2$1(value)) {
    return symbolToString$2$1 ? symbolToString$2$1.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$3$1 ? '-0' : result;
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
function isObject$2$1(value) {
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
function identity$1$1(value) {
  return value;
}

/** `Object#toString` result references. */

var asyncTag$2$1 = '[object AsyncFunction]',
    funcTag$4$1 = '[object Function]',
    genTag$3$1 = '[object GeneratorFunction]',
    proxyTag$2$1 = '[object Proxy]';
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

function isFunction$2$1(value) {
  if (!isObject$2$1(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag$2$1(value);
  return tag == funcTag$4$1 || tag == genTag$3$1 || tag == asyncTag$2$1 || tag == proxyTag$2$1;
}

/** Used to detect overreaching core-js shims. */

var coreJsData$2$1 = root$2$1['__core-js_shared__'];

/** Used to detect methods masquerading as native. */

var maskSrcKey$2$1 = function () {
  var uid = /[^.]+$/.exec(coreJsData$2$1 && coreJsData$2$1.keys && coreJsData$2$1.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked$2$1(func) {
  return !!maskSrcKey$2$1 && maskSrcKey$2$1 in func;
}

/** Used for built-in method references. */
var funcProto$4$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$4$1 = funcProto$4$1.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource$2$1(func) {
  if (func != null) {
    try {
      return funcToString$4$1.call(func);
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

var reRegExpChar$2$1 = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor$2$1 = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto$1$2$1 = Function.prototype,
    objectProto$2$2$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1$2$1 = funcProto$1$2$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$1$2$1 = objectProto$2$2$1.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative$2$1 = RegExp('^' + funcToString$1$2$1.call(hasOwnProperty$1$2$1).replace(reRegExpChar$2$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative$2$1(value) {
  if (!isObject$2$1(value) || isMasked$2$1(value)) {
    return false;
  }

  var pattern = isFunction$2$1(value) ? reIsNative$2$1 : reIsHostCtor$2$1;
  return pattern.test(toSource$2$1(value));
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue$2$1(object, key) {
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

function getNative$2$1(object, key) {
  var value = getValue$2$1(object, key);
  return baseIsNative$2$1(value) ? value : undefined;
}

/* Built-in method references that are verified to be native. */

var WeakMap$1$1$1 = getNative$2$1(root$2$1, 'WeakMap');

/** Built-in value references. */

var objectCreate$1$1 = Object.create;
/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} proto The object to inherit from.
 * @returns {Object} Returns the new object.
 */

var baseCreate$1$1 = function () {
  function object() {}

  return function (proto) {
    if (!isObject$2$1(proto)) {
      return {};
    }

    if (objectCreate$1$1) {
      return objectCreate$1$1(proto);
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
function apply$1$1(func, thisArg, args) {
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
function noop$2$1() {// No operation performed.
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray$1$1(source, array) {
  var index = -1,
      length = source.length;
  array || (array = Array(length));

  while (++index < length) {
    array[index] = source[index];
  }

  return array;
}

/** Used to detect hot functions by number of calls within a span of milliseconds. */
var HOT_COUNT$1$1 = 800,
    HOT_SPAN$1$1 = 16;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeNow$1$1 = Date.now;
/**
 * Creates a function that'll short out and invoke `identity` instead
 * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
 * milliseconds.
 *
 * @private
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new shortable function.
 */

function shortOut$1$1(func) {
  var count = 0,
      lastCalled = 0;
  return function () {
    var stamp = nativeNow$1$1(),
        remaining = HOT_SPAN$1$1 - (stamp - lastCalled);
    lastCalled = stamp;

    if (remaining > 0) {
      if (++count >= HOT_COUNT$1$1) {
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
function constant$1$1(value) {
  return function () {
    return value;
  };
}

var defineProperty$1$1 = function () {
  try {
    var func = getNative$2$1(Object, 'defineProperty');
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

var baseSetToString$1$1 = !defineProperty$1$1 ? identity$1$1 : function (func, string) {
  return defineProperty$1$1(func, 'toString', {
    'configurable': true,
    'enumerable': false,
    'value': constant$1$1(string),
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

var setToString$1$1 = shortOut$1$1(baseSetToString$1$1);

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach$1$1(array, iteratee) {
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
var MAX_SAFE_INTEGER$2$1 = 9007199254740991;
/** Used to detect unsigned integer values. */

var reIsUint$1$1 = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */

function isIndex$1$1(value, length) {
  var type = typeof value;
  length = length == null ? MAX_SAFE_INTEGER$2$1 : length;
  return !!length && (type == 'number' || type != 'symbol' && reIsUint$1$1.test(value)) && value > -1 && value % 1 == 0 && value < length;
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

function baseAssignValue$1$1(object, key, value) {
  if (key == '__proto__' && defineProperty$1$1) {
    defineProperty$1$1(object, key, {
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
function eq$2$1(value, other) {
  return value === other || value !== value && other !== other;
}

/** Used for built-in method references. */

var objectProto$3$2$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2$2$1 = objectProto$3$2$1.hasOwnProperty;
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

function assignValue$1$1(object, key, value) {
  var objValue = object[key];

  if (!(hasOwnProperty$2$2$1.call(object, key) && eq$2$1(objValue, value)) || value === undefined && !(key in object)) {
    baseAssignValue$1$1(object, key, value);
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

function copyObject$1$1(source, props, object, customizer) {
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
      baseAssignValue$1$1(object, key, newValue);
    } else {
      assignValue$1$1(object, key, newValue);
    }
  }

  return object;
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeMax$1$1 = Math.max;
/**
 * A specialized version of `baseRest` which transforms the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @param {Function} transform The rest array transform.
 * @returns {Function} Returns the new function.
 */

function overRest$1$1(func, start, transform) {
  start = nativeMax$1$1(start === undefined ? func.length - 1 : start, 0);
  return function () {
    var args = arguments,
        index = -1,
        length = nativeMax$1$1(args.length - start, 0),
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
    return apply$1$1(func, this, otherArgs);
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

function baseRest$1$1(func, start) {
  return setToString$1$1(overRest$1$1(func, start, identity$1$1), func + '');
}

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER$1$1$1 = 9007199254740991;
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

function isLength$1$1(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1$1$1;
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

function isArrayLike$1$1(value) {
  return value != null && isLength$1$1(value.length) && !isFunction$2$1(value);
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

function isIterateeCall$1$1(value, index, object) {
  if (!isObject$2$1(object)) {
    return false;
  }

  var type = typeof index;

  if (type == 'number' ? isArrayLike$1$1(object) && isIndex$1$1(index, object.length) : type == 'string' && index in object) {
    return eq$2$1(object[index], value);
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

function createAssigner$1$1(assigner) {
  return baseRest$1$1(function (object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;
    customizer = assigner.length > 3 && typeof customizer == 'function' ? (length--, customizer) : undefined;

    if (guard && isIterateeCall$1$1(sources[0], sources[1], guard)) {
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
var objectProto$4$2$1 = Object.prototype;
/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */

function isPrototype$1$1(value) {
  var Ctor = value && value.constructor,
      proto = typeof Ctor == 'function' && Ctor.prototype || objectProto$4$2$1;
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
function baseTimes$1$1(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
}

/** `Object#toString` result references. */

var argsTag$3$1 = '[object Arguments]';
/**
 * The base implementation of `_.isArguments`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 */

function baseIsArguments$1$1(value) {
  return isObjectLike$2$1(value) && baseGetTag$2$1(value) == argsTag$3$1;
}

/** Used for built-in method references. */

var objectProto$5$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3$2$1 = objectProto$5$1$1.hasOwnProperty;
/** Built-in value references. */

var propertyIsEnumerable$2$1 = objectProto$5$1$1.propertyIsEnumerable;
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

var isArguments$1$1 = baseIsArguments$1$1(function () {
  return arguments;
}()) ? baseIsArguments$1$1 : function (value) {
  return isObjectLike$2$1(value) && hasOwnProperty$3$2$1.call(value, 'callee') && !propertyIsEnumerable$2$1.call(value, 'callee');
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
function stubFalse$1$1() {
  return false;
}

/** Detect free variable `exports`. */

var freeExports$3$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$3$1 = freeExports$3$1 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$3$1 = freeModule$3$1 && freeModule$3$1.exports === freeExports$3$1;
/** Built-in value references. */

var Buffer$2$1 = moduleExports$3$1 ? root$2$1.Buffer : undefined;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeIsBuffer$1$1 = Buffer$2$1 ? Buffer$2$1.isBuffer : undefined;
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

var isBuffer$1$1 = nativeIsBuffer$1$1 || stubFalse$1$1;

/** `Object#toString` result references. */

var argsTag$1$1$1 = '[object Arguments]',
    arrayTag$2$1 = '[object Array]',
    boolTag$3$1 = '[object Boolean]',
    dateTag$3$1 = '[object Date]',
    errorTag$3$1 = '[object Error]',
    funcTag$1$1$1 = '[object Function]',
    mapTag$5$1 = '[object Map]',
    numberTag$3$1 = '[object Number]',
    objectTag$4$1 = '[object Object]',
    regexpTag$3$1 = '[object RegExp]',
    setTag$5$1 = '[object Set]',
    stringTag$4$1 = '[object String]',
    weakMapTag$3$1 = '[object WeakMap]';
var arrayBufferTag$3$1 = '[object ArrayBuffer]',
    dataViewTag$4$1 = '[object DataView]',
    float32Tag$3$1 = '[object Float32Array]',
    float64Tag$3$1 = '[object Float64Array]',
    int8Tag$3$1 = '[object Int8Array]',
    int16Tag$3$1 = '[object Int16Array]',
    int32Tag$3$1 = '[object Int32Array]',
    uint8Tag$3$1 = '[object Uint8Array]',
    uint8ClampedTag$3$1 = '[object Uint8ClampedArray]',
    uint16Tag$3$1 = '[object Uint16Array]',
    uint32Tag$3$1 = '[object Uint32Array]';
/** Used to identify `toStringTag` values of typed arrays. */

var typedArrayTags$1$1 = {};
typedArrayTags$1$1[float32Tag$3$1] = typedArrayTags$1$1[float64Tag$3$1] = typedArrayTags$1$1[int8Tag$3$1] = typedArrayTags$1$1[int16Tag$3$1] = typedArrayTags$1$1[int32Tag$3$1] = typedArrayTags$1$1[uint8Tag$3$1] = typedArrayTags$1$1[uint8ClampedTag$3$1] = typedArrayTags$1$1[uint16Tag$3$1] = typedArrayTags$1$1[uint32Tag$3$1] = true;
typedArrayTags$1$1[argsTag$1$1$1] = typedArrayTags$1$1[arrayTag$2$1] = typedArrayTags$1$1[arrayBufferTag$3$1] = typedArrayTags$1$1[boolTag$3$1] = typedArrayTags$1$1[dataViewTag$4$1] = typedArrayTags$1$1[dateTag$3$1] = typedArrayTags$1$1[errorTag$3$1] = typedArrayTags$1$1[funcTag$1$1$1] = typedArrayTags$1$1[mapTag$5$1] = typedArrayTags$1$1[numberTag$3$1] = typedArrayTags$1$1[objectTag$4$1] = typedArrayTags$1$1[regexpTag$3$1] = typedArrayTags$1$1[setTag$5$1] = typedArrayTags$1$1[stringTag$4$1] = typedArrayTags$1$1[weakMapTag$3$1] = false;
/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */

function baseIsTypedArray$1$1(value) {
  return isObjectLike$2$1(value) && isLength$1$1(value.length) && !!typedArrayTags$1$1[baseGetTag$2$1(value)];
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary$1$1(func) {
  return function (value) {
    return func(value);
  };
}

/** Detect free variable `exports`. */

var freeExports$1$1$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$1$1$1 = freeExports$1$1$1 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$1$1$1 = freeModule$1$1$1 && freeModule$1$1$1.exports === freeExports$1$1$1;
/** Detect free variable `process` from Node.js. */

var freeProcess$1$1 = moduleExports$1$1$1 && freeGlobal$2$1.process;
/** Used to access faster Node.js helpers. */

var nodeUtil$1$1 = function () {
  try {
    // Use `util.types` for Node.js 10+.
    var types = freeModule$1$1$1 && freeModule$1$1$1.require && freeModule$1$1$1.require('util').types;

    if (types) {
      return types;
    } // Legacy `process.binding('util')` for Node.js < 10.


    return freeProcess$1$1 && freeProcess$1$1.binding && freeProcess$1$1.binding('util');
  } catch (e) {}
}();

/* Node.js helper references. */

var nodeIsTypedArray$1$1 = nodeUtil$1$1 && nodeUtil$1$1.isTypedArray;
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

var isTypedArray$1$1 = nodeIsTypedArray$1$1 ? baseUnary$1$1(nodeIsTypedArray$1$1) : baseIsTypedArray$1$1;

/** Used for built-in method references. */

var objectProto$6$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$4$1$1 = objectProto$6$1$1.hasOwnProperty;
/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */

function arrayLikeKeys$1$1(value, inherited) {
  var isArr = isArray$2$1(value),
      isArg = !isArr && isArguments$1$1(value),
      isBuff = !isArr && !isArg && isBuffer$1$1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray$1$1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? baseTimes$1$1(value.length, String) : [],
      length = result.length;

  for (var key in value) {
    if ((inherited || hasOwnProperty$4$1$1.call(value, key)) && !(skipIndexes && ( // Safari 9 has enumerable `arguments.length` in strict mode.
    key == 'length' || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == 'offset' || key == 'parent') || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset') || // Skip index properties.
    isIndex$1$1(key, length)))) {
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
function overArg$1$1(func, transform) {
  return function (arg) {
    return func(transform(arg));
  };
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeKeys$1$1 = overArg$1$1(Object.keys, Object);

/** Used for built-in method references. */

var objectProto$7$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$5$1$1 = objectProto$7$1$1.hasOwnProperty;
/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeys$1$1(object) {
  if (!isPrototype$1$1(object)) {
    return nativeKeys$1$1(object);
  }

  var result = [];

  for (var key in Object(object)) {
    if (hasOwnProperty$5$1$1.call(object, key) && key != 'constructor') {
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

function keys$1$1(object) {
  return isArrayLike$1$1(object) ? arrayLikeKeys$1$1(object) : baseKeys$1$1(object);
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
function nativeKeysIn$1$1(object) {
  var result = [];

  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }

  return result;
}

/** Used for built-in method references. */

var objectProto$8$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$6$1$1 = objectProto$8$1$1.hasOwnProperty;
/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

function baseKeysIn$1$1(object) {
  if (!isObject$2$1(object)) {
    return nativeKeysIn$1$1(object);
  }

  var isProto = isPrototype$1$1(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty$6$1$1.call(object, key)))) {
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

function keysIn$1$1$1(object) {
  return isArrayLike$1$1(object) ? arrayLikeKeys$1$1(object, true) : baseKeysIn$1$1(object);
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

var assignInWith$1$1 = createAssigner$1$1(function (object, source, srcIndex, customizer) {
  copyObject$1$1(source, keysIn$1$1$1(source), object, customizer);
});

/** Used to match property names within property paths. */

var reIsDeepProp$2$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$2$1 = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */

function isKey$2$1(value, object) {
  if (isArray$2$1(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$2$1(value)) {
    return true;
  }

  return reIsPlainProp$2$1.test(value) || !reIsDeepProp$2$1.test(value) || object != null && value in Object(object);
}

/* Built-in method references that are verified to be native. */

var nativeCreate$2$1 = getNative$2$1(Object, 'create');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear$2$1() {
  this.__data__ = nativeCreate$2$1 ? nativeCreate$2$1(null) : {};
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
function hashDelete$2$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$3$1 = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$9$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$7$1$1 = objectProto$9$1$1.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet$2$1(key) {
  var data = this.__data__;

  if (nativeCreate$2$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$3$1 ? undefined : result;
  }

  return hasOwnProperty$7$1$1.call(data, key) ? data[key] : undefined;
}

/** Used for built-in method references. */

var objectProto$a$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$8$1$1 = objectProto$a$1$1.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas$2$1(key) {
  var data = this.__data__;
  return nativeCreate$2$1 ? data[key] !== undefined : hasOwnProperty$8$1$1.call(data, key);
}

/** Used to stand-in for `undefined` hash values. */

var HASH_UNDEFINED$1$2$1 = '__lodash_hash_undefined__';
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

function hashSet$2$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$2$1 && value === undefined ? HASH_UNDEFINED$1$2$1 : value;
  return this;
}

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */

function Hash$2$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash$2$1.prototype.clear = hashClear$2$1;
Hash$2$1.prototype['delete'] = hashDelete$2$1;
Hash$2$1.prototype.get = hashGet$2$1;
Hash$2$1.prototype.has = hashHas$2$1;
Hash$2$1.prototype.set = hashSet$2$1;

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear$2$1() {
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

function assocIndexOf$2$1(array, key) {
  var length = array.length;

  while (length--) {
    if (eq$2$1(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}

/** Used for built-in method references. */

var arrayProto$2$1 = Array.prototype;
/** Built-in value references. */

var splice$2$1 = arrayProto$2$1.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete$2$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2$1(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice$2$1.call(data, index, 1);
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

function listCacheGet$2$1(key) {
  var data = this.__data__,
      index = assocIndexOf$2$1(data, key);
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

function listCacheHas$2$1(key) {
  return assocIndexOf$2$1(this.__data__, key) > -1;
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

function listCacheSet$2$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$2$1(data, key);

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

function ListCache$2$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache$2$1.prototype.clear = listCacheClear$2$1;
ListCache$2$1.prototype['delete'] = listCacheDelete$2$1;
ListCache$2$1.prototype.get = listCacheGet$2$1;
ListCache$2$1.prototype.has = listCacheHas$2$1;
ListCache$2$1.prototype.set = listCacheSet$2$1;

/* Built-in method references that are verified to be native. */

var Map$1$1$1 = getNative$2$1(root$2$1, 'Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear$2$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash$2$1(),
    'map': new (Map$1$1$1 || ListCache$2$1)(),
    'string': new Hash$2$1()
  };
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable$2$1(value) {
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

function getMapData$2$1(map, key) {
  var data = map.__data__;
  return isKeyable$2$1(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
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

function mapCacheDelete$2$1(key) {
  var result = getMapData$2$1(this, key)['delete'](key);
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

function mapCacheGet$2$1(key) {
  return getMapData$2$1(this, key).get(key);
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

function mapCacheHas$2$1(key) {
  return getMapData$2$1(this, key).has(key);
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

function mapCacheSet$2$1(key, value) {
  var data = getMapData$2$1(this, key),
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

function MapCache$2$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache$2$1.prototype.clear = mapCacheClear$2$1;
MapCache$2$1.prototype['delete'] = mapCacheDelete$2$1;
MapCache$2$1.prototype.get = mapCacheGet$2$1;
MapCache$2$1.prototype.has = mapCacheHas$2$1;
MapCache$2$1.prototype.set = mapCacheSet$2$1;

/** Error message constants. */

var FUNC_ERROR_TEXT$2$1 = 'Expected a function';
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

function memoize$2$1(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$2$1);
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

  memoized.cache = new (memoize$2$1.Cache || MapCache$2$1)();
  return memoized;
} // Expose `MapCache`.


memoize$2$1.Cache = MapCache$2$1;

/** Used as the maximum memoize cache size. */

var MAX_MEMOIZE_SIZE$2$1 = 500;
/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */

function memoizeCapped$2$1(func) {
  var result = memoize$2$1(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE$2$1) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}

/** Used to match property names within property paths. */

var rePropName$2$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */

var reEscapeChar$2$1 = /\\(\\)?/g;
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */

var stringToPath$2$1 = memoizeCapped$2$1(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
      result.push('');
    }

  string.replace(rePropName$2$1, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar$2$1, '$1') : number || match);
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

function toString$2$1(value) {
  return value == null ? '' : baseToString$2$1(value);
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */

function castPath$2$1(value, object) {
  if (isArray$2$1(value)) {
    return value;
  }

  return isKey$2$1(value, object) ? [value] : stringToPath$2$1(toString$2$1(value));
}

/** Used as references for various `Number` constants. */

var INFINITY$1$2$1 = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey$2$1(value) {
  if (typeof value == 'string' || isSymbol$2$1(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1$2$1 ? '-0' : result;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */

function baseGet$2$1(object, path) {
  path = castPath$2$1(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$2$1(path[index++])];
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

function get$2$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$2$1(object, path);
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
function arrayPush$1$1(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }

  return array;
}

/** Built-in value references. */

var spreadableSymbol$1$1 = Symbol$2$1 ? Symbol$2$1.isConcatSpreadable : undefined;
/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */

function isFlattenable$1$1(value) {
  return isArray$2$1(value) || isArguments$1$1(value) || !!(spreadableSymbol$1$1 && value && value[spreadableSymbol$1$1]);
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

function baseFlatten$1$1(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;
  predicate || (predicate = isFlattenable$1$1);
  result || (result = []);

  while (++index < length) {
    var value = array[index];

    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten$1$1(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush$1$1(result, value);
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

function flatten$1$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseFlatten$1$1(array, 1) : [];
}

/**
 * A specialized version of `baseRest` which flattens the rest array.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @returns {Function} Returns the new function.
 */

function flatRest$1$1(func) {
  return setToString$1$1(overRest$1$1(func, undefined, flatten$1$1), func + '');
}

/** Built-in value references. */

var getPrototype$1$1 = overArg$1$1(Object.getPrototypeOf, Object);

/** `Object#toString` result references. */

var objectTag$1$1$1 = '[object Object]';
/** Used for built-in method references. */

var funcProto$2$1$1 = Function.prototype,
    objectProto$b$1$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$2$1$1 = funcProto$2$1$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$9$1$1 = objectProto$b$1$1.hasOwnProperty;
/** Used to infer the `Object` constructor. */

var objectCtorString$1$1 = funcToString$2$1$1.call(Object);
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

function isPlainObject$1$1(value) {
  if (!isObjectLike$2$1(value) || baseGetTag$2$1(value) != objectTag$1$1$1) {
    return false;
  }

  var proto = getPrototype$1$1(value);

  if (proto === null) {
    return true;
  }

  var Ctor = hasOwnProperty$9$1$1.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor && funcToString$2$1$1.call(Ctor) == objectCtorString$1$1;
}

/** `Object#toString` result references. */

var domExcTag$1$1 = '[object DOMException]',
    errorTag$1$1$1 = '[object Error]';
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

function isError$1$1(value) {
  if (!isObjectLike$2$1(value)) {
    return false;
  }

  var tag = baseGetTag$2$1(value);
  return tag == errorTag$1$1$1 || tag == domExcTag$1$1 || typeof value.message == 'string' && typeof value.name == 'string' && !isPlainObject$1$1(value);
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

var attempt$1$1 = baseRest$1$1(function (func, args) {
  try {
    return apply$1$1(func, undefined, args);
  } catch (e) {
    return isError$1$1(e) ? e : new Error(e);
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
function baseSlice$1$1(array, start, end) {
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
function basePropertyOf$1$1(object) {
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

function stackClear$1$1() {
  this.__data__ = new ListCache$2$1();
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
function stackDelete$1$1(key) {
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
function stackGet$1$1(key) {
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
function stackHas$1$1(key) {
  return this.__data__.has(key);
}

/** Used as the size to enable large array optimizations. */

var LARGE_ARRAY_SIZE$1$1 = 200;
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

function stackSet$1$1(key, value) {
  var data = this.__data__;

  if (data instanceof ListCache$2$1) {
    var pairs = data.__data__;

    if (!Map$1$1$1 || pairs.length < LARGE_ARRAY_SIZE$1$1 - 1) {
      pairs.push([key, value]);
      this.size = ++data.size;
      return this;
    }

    data = this.__data__ = new MapCache$2$1(pairs);
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

function Stack$1$1(entries) {
  var data = this.__data__ = new ListCache$2$1(entries);
  this.size = data.size;
} // Add methods to `Stack`.


Stack$1$1.prototype.clear = stackClear$1$1;
Stack$1$1.prototype['delete'] = stackDelete$1$1;
Stack$1$1.prototype.get = stackGet$1$1;
Stack$1$1.prototype.has = stackHas$1$1;
Stack$1$1.prototype.set = stackSet$1$1;

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */

function baseAssign$1$1(object, source) {
  return object && copyObject$1$1(source, keys$1$1(source), object);
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

function baseAssignIn$1$1(object, source) {
  return object && copyObject$1$1(source, keysIn$1$1$1(source), object);
}

/** Detect free variable `exports`. */

var freeExports$2$1$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;
/** Detect free variable `module`. */

var freeModule$2$1$1 = freeExports$2$1$1 && typeof module == 'object' && module && !module.nodeType && module;
/** Detect the popular CommonJS extension `module.exports`. */

var moduleExports$2$1$1 = freeModule$2$1$1 && freeModule$2$1$1.exports === freeExports$2$1$1;
/** Built-in value references. */

var Buffer$1$1$1 = moduleExports$2$1$1 ? root$2$1.Buffer : undefined,
    allocUnsafe$1$1 = Buffer$1$1$1 ? Buffer$1$1$1.allocUnsafe : undefined;
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */

function cloneBuffer$1$1(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }

  var length = buffer.length,
      result = allocUnsafe$1$1 ? allocUnsafe$1$1(length) : new buffer.constructor(length);
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
function arrayFilter$1$1(array, predicate) {
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
function stubArray$1$1() {
  return [];
}

/** Used for built-in method references. */

var objectProto$c$1$1 = Object.prototype;
/** Built-in value references. */

var propertyIsEnumerable$1$1$1 = objectProto$c$1$1.propertyIsEnumerable;
/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols$2$1 = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbols$1$1 = !nativeGetSymbols$2$1 ? stubArray$1$1 : function (object) {
  if (object == null) {
    return [];
  }

  object = Object(object);
  return arrayFilter$1$1(nativeGetSymbols$2$1(object), function (symbol) {
    return propertyIsEnumerable$1$1$1.call(object, symbol);
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

function copySymbols$1$1(source, object) {
  return copyObject$1$1(source, getSymbols$1$1(source), object);
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var nativeGetSymbols$1$1$1 = Object.getOwnPropertySymbols;
/**
 * Creates an array of the own and inherited enumerable symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */

var getSymbolsIn$1$1 = !nativeGetSymbols$1$1$1 ? stubArray$1$1 : function (object) {
  var result = [];

  while (object) {
    arrayPush$1$1(result, getSymbols$1$1(object));
    object = getPrototype$1$1(object);
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

function copySymbolsIn$1$1(source, object) {
  return copyObject$1$1(source, getSymbolsIn$1$1(source), object);
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

function baseGetAllKeys$1$1(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray$2$1(object) ? result : arrayPush$1$1(result, symbolsFunc(object));
}

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeys$1$1(object) {
  return baseGetAllKeys$1$1(object, keys$1$1, getSymbols$1$1);
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */

function getAllKeysIn$1$1(object) {
  return baseGetAllKeys$1$1(object, keysIn$1$1$1, getSymbolsIn$1$1);
}

/* Built-in method references that are verified to be native. */

var DataView$1$1 = getNative$2$1(root$2$1, 'DataView');

/* Built-in method references that are verified to be native. */

var Promise$1$1$1 = getNative$2$1(root$2$1, 'Promise');

/* Built-in method references that are verified to be native. */

var Set$1$1 = getNative$2$1(root$2$1, 'Set');

/** `Object#toString` result references. */

var mapTag$1$1$1 = '[object Map]',
    objectTag$2$1$1 = '[object Object]',
    promiseTag$1$1 = '[object Promise]',
    setTag$1$1$1 = '[object Set]',
    weakMapTag$1$1$1 = '[object WeakMap]';
var dataViewTag$1$1$1 = '[object DataView]';
/** Used to detect maps, sets, and weakmaps. */

var dataViewCtorString$1$1 = toSource$2$1(DataView$1$1),
    mapCtorString$1$1 = toSource$2$1(Map$1$1$1),
    promiseCtorString$1$1 = toSource$2$1(Promise$1$1$1),
    setCtorString$1$1 = toSource$2$1(Set$1$1),
    weakMapCtorString$1$1 = toSource$2$1(WeakMap$1$1$1);
/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

var getTag$2$1 = baseGetTag$2$1; // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.

if (DataView$1$1 && getTag$2$1(new DataView$1$1(new ArrayBuffer(1))) != dataViewTag$1$1$1 || Map$1$1$1 && getTag$2$1(new Map$1$1$1()) != mapTag$1$1$1 || Promise$1$1$1 && getTag$2$1(Promise$1$1$1.resolve()) != promiseTag$1$1 || Set$1$1 && getTag$2$1(new Set$1$1()) != setTag$1$1$1 || WeakMap$1$1$1 && getTag$2$1(new WeakMap$1$1$1()) != weakMapTag$1$1$1) {
  getTag$2$1 = function (value) {
    var result = baseGetTag$2$1(value),
        Ctor = result == objectTag$2$1$1 ? value.constructor : undefined,
        ctorString = Ctor ? toSource$2$1(Ctor) : '';

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString$1$1:
          return dataViewTag$1$1$1;

        case mapCtorString$1$1:
          return mapTag$1$1$1;

        case promiseCtorString$1$1:
          return promiseTag$1$1;

        case setCtorString$1$1:
          return setTag$1$1$1;

        case weakMapCtorString$1$1:
          return weakMapTag$1$1$1;
      }
    }

    return result;
  };
}

var getTag$1$1$1 = getTag$2$1;

/** Used for built-in method references. */
var objectProto$d$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$a$1$1 = objectProto$d$1$1.hasOwnProperty;
/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */

function initCloneArray$1$1(array) {
  var length = array.length,
      result = new array.constructor(length); // Add properties assigned by `RegExp#exec`.

  if (length && typeof array[0] == 'string' && hasOwnProperty$a$1$1.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }

  return result;
}

/** Built-in value references. */

var Uint8Array$1$1 = root$2$1.Uint8Array;

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */

function cloneArrayBuffer$1$1(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array$1$1(result).set(new Uint8Array$1$1(arrayBuffer));
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

function cloneDataView$1$1(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1$1(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

/** Used to match `RegExp` flags from their coerced string values. */
var reFlags$1$1 = /\w*$/;
/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */

function cloneRegExp$1$1(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags$1$1.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

/** Used to convert symbols to primitives and strings. */

var symbolProto$1$1$1 = Symbol$2$1 ? Symbol$2$1.prototype : undefined,
    symbolValueOf$1$1 = symbolProto$1$1$1 ? symbolProto$1$1$1.valueOf : undefined;
/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */

function cloneSymbol$1$1(symbol) {
  return symbolValueOf$1$1 ? Object(symbolValueOf$1$1.call(symbol)) : {};
}

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */

function cloneTypedArray$1$1(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer$1$1(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

/** `Object#toString` result references. */

var boolTag$1$1$1 = '[object Boolean]',
    dateTag$1$1$1 = '[object Date]',
    mapTag$2$1$1 = '[object Map]',
    numberTag$1$1$1 = '[object Number]',
    regexpTag$1$1$1 = '[object RegExp]',
    setTag$2$1$1 = '[object Set]',
    stringTag$1$1$1 = '[object String]',
    symbolTag$1$1$1 = '[object Symbol]';
var arrayBufferTag$1$1$1 = '[object ArrayBuffer]',
    dataViewTag$2$1$1 = '[object DataView]',
    float32Tag$1$1$1 = '[object Float32Array]',
    float64Tag$1$1$1 = '[object Float64Array]',
    int8Tag$1$1$1 = '[object Int8Array]',
    int16Tag$1$1$1 = '[object Int16Array]',
    int32Tag$1$1$1 = '[object Int32Array]',
    uint8Tag$1$1$1 = '[object Uint8Array]',
    uint8ClampedTag$1$1$1 = '[object Uint8ClampedArray]',
    uint16Tag$1$1$1 = '[object Uint16Array]',
    uint32Tag$1$1$1 = '[object Uint32Array]';
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

function initCloneByTag$1$1(object, tag, isDeep) {
  var Ctor = object.constructor;

  switch (tag) {
    case arrayBufferTag$1$1$1:
      return cloneArrayBuffer$1$1(object);

    case boolTag$1$1$1:
    case dateTag$1$1$1:
      return new Ctor(+object);

    case dataViewTag$2$1$1:
      return cloneDataView$1$1(object, isDeep);

    case float32Tag$1$1$1:
    case float64Tag$1$1$1:
    case int8Tag$1$1$1:
    case int16Tag$1$1$1:
    case int32Tag$1$1$1:
    case uint8Tag$1$1$1:
    case uint8ClampedTag$1$1$1:
    case uint16Tag$1$1$1:
    case uint32Tag$1$1$1:
      return cloneTypedArray$1$1(object, isDeep);

    case mapTag$2$1$1:
      return new Ctor();

    case numberTag$1$1$1:
    case stringTag$1$1$1:
      return new Ctor(object);

    case regexpTag$1$1$1:
      return cloneRegExp$1$1(object);

    case setTag$2$1$1:
      return new Ctor();

    case symbolTag$1$1$1:
      return cloneSymbol$1$1(object);
  }
}

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */

function initCloneObject$1$1(object) {
  return typeof object.constructor == 'function' && !isPrototype$1$1(object) ? baseCreate$1$1(getPrototype$1$1(object)) : {};
}

/** `Object#toString` result references. */

var mapTag$3$1$1 = '[object Map]';
/**
 * The base implementation of `_.isMap` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
 */

function baseIsMap$1$1(value) {
  return isObjectLike$2$1(value) && getTag$1$1$1(value) == mapTag$3$1$1;
}

/* Node.js helper references. */

var nodeIsMap$1$1 = nodeUtil$1$1 && nodeUtil$1$1.isMap;
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

var isMap$1$1 = nodeIsMap$1$1 ? baseUnary$1$1(nodeIsMap$1$1) : baseIsMap$1$1;

/** `Object#toString` result references. */

var setTag$3$1$1 = '[object Set]';
/**
 * The base implementation of `_.isSet` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
 */

function baseIsSet$1$1(value) {
  return isObjectLike$2$1(value) && getTag$1$1$1(value) == setTag$3$1$1;
}

/* Node.js helper references. */

var nodeIsSet$1$1 = nodeUtil$1$1 && nodeUtil$1$1.isSet;
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

var isSet$1$1 = nodeIsSet$1$1 ? baseUnary$1$1(nodeIsSet$1$1) : baseIsSet$1$1;

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG$2$1 = 1,
    CLONE_FLAT_FLAG$2$1 = 2,
    CLONE_SYMBOLS_FLAG$2$1 = 4;
/** `Object#toString` result references. */

var argsTag$2$1$1 = '[object Arguments]',
    arrayTag$1$1$1 = '[object Array]',
    boolTag$2$1$1 = '[object Boolean]',
    dateTag$2$1$1 = '[object Date]',
    errorTag$2$1$1 = '[object Error]',
    funcTag$2$1$1 = '[object Function]',
    genTag$1$1$1 = '[object GeneratorFunction]',
    mapTag$4$1$1 = '[object Map]',
    numberTag$2$1$1 = '[object Number]',
    objectTag$3$1$1 = '[object Object]',
    regexpTag$2$1$1 = '[object RegExp]',
    setTag$4$1$1 = '[object Set]',
    stringTag$2$1$1 = '[object String]',
    symbolTag$2$1$1 = '[object Symbol]',
    weakMapTag$2$1$1 = '[object WeakMap]';
var arrayBufferTag$2$1$1 = '[object ArrayBuffer]',
    dataViewTag$3$1$1 = '[object DataView]',
    float32Tag$2$1$1 = '[object Float32Array]',
    float64Tag$2$1$1 = '[object Float64Array]',
    int8Tag$2$1$1 = '[object Int8Array]',
    int16Tag$2$1$1 = '[object Int16Array]',
    int32Tag$2$1$1 = '[object Int32Array]',
    uint8Tag$2$1$1 = '[object Uint8Array]',
    uint8ClampedTag$2$1$1 = '[object Uint8ClampedArray]',
    uint16Tag$2$1$1 = '[object Uint16Array]',
    uint32Tag$2$1$1 = '[object Uint32Array]';
/** Used to identify `toStringTag` values supported by `_.clone`. */

var cloneableTags$1$1 = {};
cloneableTags$1$1[argsTag$2$1$1] = cloneableTags$1$1[arrayTag$1$1$1] = cloneableTags$1$1[arrayBufferTag$2$1$1] = cloneableTags$1$1[dataViewTag$3$1$1] = cloneableTags$1$1[boolTag$2$1$1] = cloneableTags$1$1[dateTag$2$1$1] = cloneableTags$1$1[float32Tag$2$1$1] = cloneableTags$1$1[float64Tag$2$1$1] = cloneableTags$1$1[int8Tag$2$1$1] = cloneableTags$1$1[int16Tag$2$1$1] = cloneableTags$1$1[int32Tag$2$1$1] = cloneableTags$1$1[mapTag$4$1$1] = cloneableTags$1$1[numberTag$2$1$1] = cloneableTags$1$1[objectTag$3$1$1] = cloneableTags$1$1[regexpTag$2$1$1] = cloneableTags$1$1[setTag$4$1$1] = cloneableTags$1$1[stringTag$2$1$1] = cloneableTags$1$1[symbolTag$2$1$1] = cloneableTags$1$1[uint8Tag$2$1$1] = cloneableTags$1$1[uint8ClampedTag$2$1$1] = cloneableTags$1$1[uint16Tag$2$1$1] = cloneableTags$1$1[uint32Tag$2$1$1] = true;
cloneableTags$1$1[errorTag$2$1$1] = cloneableTags$1$1[funcTag$2$1$1] = cloneableTags$1$1[weakMapTag$2$1$1] = false;
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

function baseClone$1$1(value, bitmask, customizer, key, object, stack) {
  var result,
      isDeep = bitmask & CLONE_DEEP_FLAG$2$1,
      isFlat = bitmask & CLONE_FLAT_FLAG$2$1,
      isFull = bitmask & CLONE_SYMBOLS_FLAG$2$1;

  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }

  if (result !== undefined) {
    return result;
  }

  if (!isObject$2$1(value)) {
    return value;
  }

  var isArr = isArray$2$1(value);

  if (isArr) {
    result = initCloneArray$1$1(value);

    if (!isDeep) {
      return copyArray$1$1(value, result);
    }
  } else {
    var tag = getTag$1$1$1(value),
        isFunc = tag == funcTag$2$1$1 || tag == genTag$1$1$1;

    if (isBuffer$1$1(value)) {
      return cloneBuffer$1$1(value, isDeep);
    }

    if (tag == objectTag$3$1$1 || tag == argsTag$2$1$1 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject$1$1(value);

      if (!isDeep) {
        return isFlat ? copySymbolsIn$1$1(value, baseAssignIn$1$1(result, value)) : copySymbols$1$1(value, baseAssign$1$1(result, value));
      }
    } else {
      if (!cloneableTags$1$1[tag]) {
        return object ? value : {};
      }

      result = initCloneByTag$1$1(value, tag, isDeep);
    }
  } // Check for circular references and return its corresponding clone.


  stack || (stack = new Stack$1$1());
  var stacked = stack.get(value);

  if (stacked) {
    return stacked;
  }

  stack.set(value, result);

  if (isSet$1$1(value)) {
    value.forEach(function (subValue) {
      result.add(baseClone$1$1(subValue, bitmask, customizer, subValue, value, stack));
    });
  } else if (isMap$1$1(value)) {
    value.forEach(function (subValue, key) {
      result.set(key, baseClone$1$1(subValue, bitmask, customizer, key, value, stack));
    });
  }

  var keysFunc = isFull ? isFlat ? getAllKeysIn$1$1 : getAllKeys$1$1 : isFlat ? keysIn : keys$1$1;
  var props = isArr ? undefined : keysFunc(value);
  arrayEach$1$1(props || value, function (subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    } // Recursively populate clone (susceptible to call stack limits).


    assignValue$1$1(result, key, baseClone$1$1(subValue, bitmask, customizer, key, value, stack));
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
function last$2$1(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

/** Used to map characters to HTML entities. */

var htmlEscapes$1$1 = {
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

var escapeHtmlChar$1$1 = basePropertyOf$1$1(htmlEscapes$1$1);

/** Used to match HTML entities and HTML characters. */

var reUnescapedHtml$1$1 = /[&<>"']/g,
    reHasUnescapedHtml$1$1 = RegExp(reUnescapedHtml$1$1.source);
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

function escape$1$1(string) {
  string = toString$2$1(string);
  return string && reHasUnescapedHtml$1$1.test(string) ? string.replace(reUnescapedHtml$1$1, escapeHtmlChar$1$1) : string;
}

/** `Object#toString` result references. */

var stringTag$3$1$1 = '[object String]';
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

function isString$1$1(value) {
  return typeof value == 'string' || !isArray$2$1(value) && isObjectLike$2$1(value) && baseGetTag$2$1(value) == stringTag$3$1$1;
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

function baseValues$1$1(object, props) {
  return arrayMap$2$1(props, function (key) {
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

function parent$1$1(object, path) {
  return path.length < 2 ? object : baseGet$2$1(object, baseSlice$1$1(path, 0, -1));
}

/**
 * The base implementation of `_.unset`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The property path to unset.
 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
 */

function baseUnset$1$1(object, path) {
  path = castPath$2$1(path, object);
  object = parent$1$1(object, path);
  return object == null || delete object[toKey$2$1(last$2$1(path))];
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

function customOmitClone$1$1(value) {
  return isPlainObject$1$1(value) ? undefined : value;
}

/** Used to compose bitmasks for cloning. */

var CLONE_DEEP_FLAG$1$1$1 = 1,
    CLONE_FLAT_FLAG$1$1$1 = 2,
    CLONE_SYMBOLS_FLAG$1$1$1 = 4;
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

var omit$1$1 = flatRest$1$1(function (object, paths) {
  var result = {};

  if (object == null) {
    return result;
  }

  var isDeep = false;
  paths = arrayMap$2$1(paths, function (path) {
    path = castPath$2$1(path, object);
    isDeep || (isDeep = path.length > 1);
    return path;
  });
  copyObject$1$1(object, getAllKeysIn$1$1(object), result);

  if (isDeep) {
    result = baseClone$1$1(result, CLONE_DEEP_FLAG$1$1$1 | CLONE_FLAT_FLAG$1$1$1 | CLONE_SYMBOLS_FLAG$1$1$1, customOmitClone$1$1);
  }

  var length = paths.length;

  while (length--) {
    baseUnset$1$1(result, paths[length]);
  }

  return result;
});

/** Used for built-in method references. */

var objectProto$e$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$b$1$1 = objectProto$e$1$1.hasOwnProperty;
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

function customDefaultsAssignIn$1$1(objValue, srcValue, key, object) {
  if (objValue === undefined || eq$2$1(objValue, objectProto$e$1$1[key]) && !hasOwnProperty$b$1$1.call(object, key)) {
    return srcValue;
  }

  return objValue;
}

/** Used to escape characters for inclusion in compiled string literals. */
var stringEscapes$1$1 = {
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

function escapeStringChar$1$1(chr) {
  return '\\' + stringEscapes$1$1[chr];
}

/** Used to match template delimiters. */
var reInterpolate$1$1 = /<%=([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEscape$1$1 = /<%-([\s\S]+?)%>/g;

/** Used to match template delimiters. */
var reEvaluate$1$1 = /<%([\s\S]+?)%>/g;

/**
 * By default, the template delimiters used by lodash are like those in
 * embedded Ruby (ERB) as well as ES2015 template strings. Change the
 * following template settings to use alternative delimiters.
 *
 * @static
 * @memberOf _
 * @type {Object}
 */

var templateSettings$1$1 = {
  /**
   * Used to detect `data` property values to be HTML-escaped.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'escape': reEscape$1$1,

  /**
   * Used to detect code to be evaluated.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'evaluate': reEvaluate$1$1,

  /**
   * Used to detect `data` property values to inject.
   *
   * @memberOf _.templateSettings
   * @type {RegExp}
   */
  'interpolate': reInterpolate$1$1,

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
      'escape': escape$1$1
    }
  }
};

/** Used to match empty string literals in compiled template source. */

var reEmptyStringLeading$1$1 = /\b__p \+= '';/g,
    reEmptyStringMiddle$1$1 = /\b(__p \+=) '' \+/g,
    reEmptyStringTrailing$1$1 = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
/**
 * Used to match
 * [ES template delimiters](http://ecma-international.org/ecma-262/7.0/#sec-template-literal-lexical-components).
 */

var reEsTemplate$1$1 = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
/** Used to ensure capturing order of template delimiters. */

var reNoMatch$1$1 = /($^)/;
/** Used to match unescaped characters in compiled string literals. */

var reUnescapedString$1$1 = /['\n\r\u2028\u2029\\]/g;
/** Used for built-in method references. */

var objectProto$f$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$c$1$1 = objectProto$f$1$1.hasOwnProperty;
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

function template$1$1(string, options, guard) {
  // Based on John Resig's `tmpl` implementation
  // (http://ejohn.org/blog/javascript-micro-templating/)
  // and Laura Doktorova's doT.js (https://github.com/olado/doT).
  var settings = templateSettings$1$1.imports._.templateSettings || templateSettings$1$1;

  if (guard && isIterateeCall$1$1(string, options, guard)) {
    options = undefined;
  }

  string = toString$2$1(string);
  options = assignInWith$1$1({}, options, settings, customDefaultsAssignIn$1$1);
  var imports = assignInWith$1$1({}, options.imports, settings.imports, customDefaultsAssignIn$1$1),
      importsKeys = keys$1$1(imports),
      importsValues = baseValues$1$1(imports, importsKeys);
  var isEscaping,
      isEvaluating,
      index = 0,
      interpolate = options.interpolate || reNoMatch$1$1,
      source = "__p += '"; // Compile the regexp to match each delimiter.

  var reDelimiters = RegExp((options.escape || reNoMatch$1$1).source + '|' + interpolate.source + '|' + (interpolate === reInterpolate$1$1 ? reEsTemplate$1$1 : reNoMatch$1$1).source + '|' + (options.evaluate || reNoMatch$1$1).source + '|$', 'g'); // Use a sourceURL for easier debugging.
  // The sourceURL gets injected into the source that's eval-ed, so be careful
  // with lookup (in case of e.g. prototype pollution), and strip newlines if any.
  // A newline wouldn't be a valid sourceURL anyway, and it'd enable code injection.

  var sourceURL = hasOwnProperty$c$1$1.call(options, 'sourceURL') ? '//# sourceURL=' + (options.sourceURL + '').replace(/[\r\n]/g, ' ') + '\n' : '';
  string.replace(reDelimiters, function (match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
    interpolateValue || (interpolateValue = esTemplateValue); // Escape characters that can't be included in string literals.

    source += string.slice(index, offset).replace(reUnescapedString$1$1, escapeStringChar$1$1); // Replace delimiters with snippets.

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

  var variable = hasOwnProperty$c$1$1.call(options, 'variable') && options.variable;

  if (!variable) {
    source = 'with (obj) {\n' + source + '\n}\n';
  } // Cleanup code by stripping empty strings.


  source = (isEvaluating ? source.replace(reEmptyStringLeading$1$1, '') : source).replace(reEmptyStringMiddle$1$1, '$1').replace(reEmptyStringTrailing$1$1, '$1;'); // Frame code as the function body.

  source = 'function(' + (variable || 'obj') + ') {\n' + (variable ? '' : 'obj || (obj = {});\n') + "var __t, __p = ''" + (isEscaping ? ', __e = _.escape' : '') + (isEvaluating ? ', __j = Array.prototype.join;\n' + "function print() { __p += __j.call(arguments, '') }\n" : ';\n') + source + 'return __p\n}';
  var result = attempt$1$1(function () {
    return Function(importsKeys, sourceURL + 'return ' + source).apply(undefined, importsValues);
  }); // Provide the compiled function's source by its `toString` method or
  // the `source` property as a convenience for inlining compiled templates.

  result.source = source;

  if (isError$1$1(result)) {
    throw result;
  }

  return result;
}

/**
 * A collection of shims that provide minimal functionality of the ES6 collections.
 *
 * These implementations are not meant to be used outside of the ResizeObserver
 * modules as they cover only a limited range of use cases.
 */

/* eslint-disable require-jsdoc, valid-jsdoc */
var MapShim$1$1 = function () {
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


var isBrowser$1$1 = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document; // Returns global object of a current environment.

var global$1$1$1 = function () {
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


var requestAnimationFrame$1$1$1 = function () {
  if (typeof requestAnimationFrame === 'function') {
    // It's required to use a bounded function because IE sometimes throws
    // an "Invalid calling object" error if rAF is invoked without the global
    // object on the left hand side.
    return requestAnimationFrame.bind(global$1$1$1);
  }

  return function (callback) {
    return setTimeout(function () {
      return callback(Date.now());
    }, 1000 / 60);
  };
}(); // Defines minimum timeout before adding a trailing call.


var trailingTimeout$1$1 = 2;
/**
 * Creates a wrapper function which ensures that provided callback will be
 * invoked only once during the specified delay period.
 *
 * @param {Function} callback - Function to be invoked after the delay period.
 * @param {number} delay - Delay after which to invoke callback.
 * @returns {Function}
 */

function throttle$1$1(callback, delay) {
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
    requestAnimationFrame$1$1$1(resolvePending);
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
      if (timeStamp - lastCallTime < trailingTimeout$1$1) {
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


var REFRESH_DELAY$1$1 = 20; // A list of substrings of CSS properties used to find transition events that
// might affect dimensions of observed elements.

var transitionKeys$1$1 = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight']; // Check if MutationObserver is available.

var mutationObserverSupported$1$1 = typeof MutationObserver !== 'undefined';
/**
 * Singleton controller class which handles updates of ResizeObserver instances.
 */

var ResizeObserverController$1$1 =
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
    this.refresh = throttle$1$1(this.refresh.bind(this), REFRESH_DELAY$1$1);
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
    if (!isBrowser$1$1 || this.connected_) {
      return;
    } // Subscription to the "Transitionend" event is used as a workaround for
    // delayed transitions. This way it's possible to capture at least the
    // final state of an element.


    document.addEventListener('transitionend', this.onTransitionEnd_);
    window.addEventListener('resize', this.refresh);

    if (mutationObserverSupported$1$1) {
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
    if (!isBrowser$1$1 || !this.connected_) {
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

    var isReflowProperty = transitionKeys$1$1.some(function (key) {
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


var defineConfigurable$1$1 = function (target, props) {
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


var getWindowOf$1$1 = function (target) {
  // Assume that the element is an instance of Node, which means that it
  // has the "ownerDocument" property from which we can retrieve a
  // corresponding global object.
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView; // Return the local global object if it's not possible extract one from
  // provided element.

  return ownerGlobal || global$1$1$1;
}; // Placeholder of an empty content rectangle.


var emptyRect$1$1 = createRectInit$1$1(0, 0, 0, 0);
/**
 * Converts provided string to a number.
 *
 * @param {number|string} value
 * @returns {number}
 */

function toFloat$1$1(value) {
  return parseFloat(value) || 0;
}
/**
 * Extracts borders size from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @param {...string} positions - Borders positions (top, right, ...)
 * @returns {number}
 */


function getBordersSize$1$1(styles) {
  var positions = [];

  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }

  return positions.reduce(function (size, position) {
    var value = styles['border-' + position + '-width'];
    return size + toFloat$1$1(value);
  }, 0);
}
/**
 * Extracts paddings sizes from provided styles.
 *
 * @param {CSSStyleDeclaration} styles
 * @returns {Object} Paddings box.
 */


function getPaddings$1$1(styles) {
  var positions = ['top', 'right', 'bottom', 'left'];
  var paddings = {};

  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles['padding-' + position];
    paddings[position] = toFloat$1$1(value);
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


function getSVGContentRect$1$1(target) {
  var bbox = target.getBBox();
  return createRectInit$1$1(0, 0, bbox.width, bbox.height);
}
/**
 * Calculates content rectangle of provided HTMLElement.
 *
 * @param {HTMLElement} target - Element for which to calculate the content rectangle.
 * @returns {DOMRectInit}
 */


function getHTMLElementContentRect$1$1(target) {
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
    return emptyRect$1$1;
  }

  var styles = getWindowOf$1$1(target).getComputedStyle(target);
  var paddings = getPaddings$1$1(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom; // Computed styles of width & height are being used because they are the
  // only dimensions available to JS that contain non-rounded values. It could
  // be possible to utilize the getBoundingClientRect if only it's data wasn't
  // affected by CSS transformations let alone paddings, borders and scroll bars.

  var width = toFloat$1$1(styles.width),
      height = toFloat$1$1(styles.height); // Width & height include paddings and borders when the 'border-box' box
  // model is applied (except for IE).

  if (styles.boxSizing === 'border-box') {
    // Following conditions are required to handle Internet Explorer which
    // doesn't include paddings and borders to computed CSS dimensions.
    //
    // We can say that if CSS dimensions + paddings are equal to the "client"
    // properties then it's either IE, and thus we don't need to subtract
    // anything, or an element merely doesn't have paddings/borders styles.
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize$1$1(styles, 'left', 'right') + horizPad;
    }

    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize$1$1(styles, 'top', 'bottom') + vertPad;
    }
  } // Following steps can't be applied to the document's root element as its
  // client[Width/Height] properties represent viewport area of the window.
  // Besides, it's as well not necessary as the <html> itself neither has
  // rendered scroll bars nor it can be clipped.


  if (!isDocumentElement$1$1(target)) {
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

  return createRectInit$1$1(paddings.left, paddings.top, width, height);
}
/**
 * Checks whether provided element is an instance of the SVGGraphicsElement.
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


var isSVGGraphicsElement$1$1 = function () {
  // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
  // interface.
  if (typeof SVGGraphicsElement !== 'undefined') {
    return function (target) {
      return target instanceof getWindowOf$1$1(target).SVGGraphicsElement;
    };
  } // If it's so, then check that element is at least an instance of the
  // SVGElement and that it has the "getBBox" method.
  // eslint-disable-next-line no-extra-parens


  return function (target) {
    return target instanceof getWindowOf$1$1(target).SVGElement && typeof target.getBBox === 'function';
  };
}();
/**
 * Checks whether provided element is a document element (<html>).
 *
 * @param {Element} target - Element to be checked.
 * @returns {boolean}
 */


function isDocumentElement$1$1(target) {
  return target === getWindowOf$1$1(target).document.documentElement;
}
/**
 * Calculates an appropriate content rectangle for provided html or svg element.
 *
 * @param {Element} target - Element content rectangle of which needs to be calculated.
 * @returns {DOMRectInit}
 */


function getContentRect$1$1(target) {
  if (!isBrowser$1$1) {
    return emptyRect$1$1;
  }

  if (isSVGGraphicsElement$1$1(target)) {
    return getSVGContentRect$1$1(target);
  }

  return getHTMLElementContentRect$1$1(target);
}
/**
 * Creates rectangle with an interface of the DOMRectReadOnly.
 * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
 *
 * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
 * @returns {DOMRectReadOnly}
 */


function createReadOnlyRect$1$1(_a) {
  var x = _a.x,
      y = _a.y,
      width = _a.width,
      height = _a.height; // If DOMRectReadOnly is available use it as a prototype for the rectangle.

  var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype); // Rectangle's properties are not writable and non-enumerable.

  defineConfigurable$1$1(rect, {
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


function createRectInit$1$1(x, y, width, height) {
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


var ResizeObservation$1$1 =
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

    this.contentRect_ = createRectInit$1$1(0, 0, 0, 0);
    this.target = target;
  }
  /**
   * Updates content rectangle and tells whether it's width or height properties
   * have changed since the last broadcast.
   *
   * @returns {boolean}
   */


  ResizeObservation.prototype.isActive = function () {
    var rect = getContentRect$1$1(this.target);
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

var ResizeObserverEntry$1$1 =
/** @class */
function () {
  /**
   * Creates an instance of ResizeObserverEntry.
   *
   * @param {Element} target - Element that is being observed.
   * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
   */
  function ResizeObserverEntry(target, rectInit) {
    var contentRect = createReadOnlyRect$1$1(rectInit); // According to the specification following properties are not writable
    // and are also not enumerable in the native implementation.
    //
    // Property accessors are not being used as they'd require to define a
    // private WeakMap storage which may cause memory leaks in browsers that
    // don't support this type of collections.

    defineConfigurable$1$1(this, {
      target: target,
      contentRect: contentRect
    });
  }

  return ResizeObserverEntry;
}();

var ResizeObserverSPI$1$1 =
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

    this.observations_ = new MapShim$1$1();

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

    if (!(target instanceof getWindowOf$1$1(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }

    var observations = this.observations_; // Do nothing if element is already being observed.

    if (observations.has(target)) {
      return;
    }

    observations.set(target, new ResizeObservation$1$1(target));
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

    if (!(target instanceof getWindowOf$1$1(target).Element)) {
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
      return new ResizeObserverEntry$1$1(observation.target, observation.broadcastRect());
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


var observers$1$1 = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim$1$1();
/**
 * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
 * exposing only those methods and properties that are defined in the spec.
 */

var ResizeObserver$1$1 =
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

    var controller = ResizeObserverController$1$1.getInstance();
    var observer = new ResizeObserverSPI$1$1(callback, controller, this);
    observers$1$1.set(this, observer);
  }

  return ResizeObserver;
}(); // Expose public methods of ResizeObserver.


['observe', 'unobserve', 'disconnect'].forEach(function (method) {
  ResizeObserver$1$1.prototype[method] = function () {
    var _a;

    return (_a = observers$1$1.get(this))[method].apply(_a, arguments);
  };
});

var index$1$1 = function () {
  // Export existing implementation if available.
  if (typeof global$1$1$1.ResizeObserver !== 'undefined') {
    return global$1$1$1.ResizeObserver;
  }

  return ResizeObserver$1$1;
}();

class Animation$1$1 {
    constructor() {
        Animation$1$1.activateRequestAnimationFrame();
        this.registerFrameHandler();
    }
    static activateRequestAnimationFrame() {
        if (!Animation$1$1.animationFrame) {
            Animation$1$1.animationFrame = window
                .requestAnimationFrame(Animation$1$1.requestAnimationFrameHandler);
        }
    }
    static deactivateRequestAnimationFrame() {
        if (!Animation$1$1.handlerList.length) {
            window.cancelAnimationFrame(Animation$1$1.animationFrame);
        }
    }
    static requestAnimationFrameHandler() {
        Animation$1$1.handlerList.forEach((handler) => handler());
        Animation$1$1.animationFrame = window
            .requestAnimationFrame(Animation$1$1.requestAnimationFrameHandler);
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
            Animation$1$1.activateRequestAnimationFrame();
            Animation$1$1.handlerList.push(frameHandler);
        }
    }
    removeHandler() {
        const { handlerList } = Animation$1$1;
        const { frameHandler } = this;
        if (frameHandler && handlerList.includes(frameHandler)) {
            const index = handlerList.indexOf(frameHandler);
            handlerList.splice(index, 1);
        }
        Animation$1$1.deactivateRequestAnimationFrame();
    }
}
Animation$1$1.handlerList = [];

const CLASS_NAME_PATTERN$1$1 = /class="[^"]+"/ig;
const REF_PATTERN$1$1 = /ref="[^"]+"/ig;
const IF_OPEN_PATTERN$1$1 = /<If\scondition="\{[^"]+}">/gi;
const IF_CLOSE_PATTERN$1$1 = /<\/If>/gi;
const CHOOSE_OPEN_PATTERN$1$1 = /<Choose>/gi;
const CHOOSE_CLOSE_PATTERN$1$1 = /<\/Choose>/gi;
const CHOOSE_PATTERN$1$1 = /<Choose>(.(?!\/Choose>)|\n(?!\/Choose>)|\s(?!\/Choose>))+/gi;
const WHEN_PATTERN$1$1 = /<When\scondition="\{[^"]+}">(.(?!\/When>)|\n(?!\/When>)|\s(?!\/When>))+/gi;
const WHEN_OPEN_PATTERN$1$1 = /<When\scondition="\{[^"]+}">/gi;
const WHEN_CLOSE_PATTERN$1$1 = /<\/When>/gi;
const OTHERWISE_PATTERN$1$1 = /<Otherwise>(.(?!\/Otherwise>)|\n(?!\/Otherwise>)|\s(?!\/Otherwise>))+/gi;
const OTHERWISE_OPEN_PATTERN$1$1 = /<Otherwise>/gi;
const OTHERWISE_CLOSE_PATTERN$1$1 = /<\/Otherwise>/gi;

class TemplateEngine$1$1 extends Animation$1$1 {
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
        const classNameStringList = renderString.match(CLASS_NAME_PATTERN$1$1);
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
    static getTemplateExecutor(template$1$1$1) {
        let processedTemplate = TemplateEngine$1$1
            .getTemplateExecutorStringWithLodashConditions(template$1$1$1);
        processedTemplate = TemplateEngine$1$1
            .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
            .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
        return template$1$1(processedTemplate);
    }
    static getTemplateExecutorStringWithLodashConditions(template) {
        const conditionList = template.match(IF_OPEN_PATTERN$1$1);
        if (!conditionList)
            return template;
        return conditionList.reduce((acc, item) => {
            const condition = item.replace(/^<If\scondition="\{/i, '').replace(/}">$/, '');
            return acc.replace(item, `<% if (${condition}) { %>`);
        }, template).replace(IF_CLOSE_PATTERN$1$1, '<% } %>');
    }
    static getTemplateExecutorStringWithLodashSwitches(template) {
        if (!CHOOSE_OPEN_PATTERN$1$1.test(template))
            return template;
        const chooseList = template.match(CHOOSE_PATTERN$1$1) || [];
        return chooseList.reduce((acc, item) => {
            return this.getTemplateExecutorStringWithLodashWhen(acc, item.replace(/<Choose>[^<]*/i, ''));
        }, template).replace(CHOOSE_OPEN_PATTERN$1$1, '').replace(CHOOSE_CLOSE_PATTERN$1$1, '');
    }
    static getTemplateExecutorStringWithLodashWhen(template, data) {
        const whenList = data.match(WHEN_PATTERN$1$1) || [];
        const otherwiseList = data.match(OTHERWISE_PATTERN$1$1) || [];
        const processedString = whenList.reduce((acc, item, index) => {
            const openBlockList = item.match(WHEN_OPEN_PATTERN$1$1);
            if (!openBlockList)
                return acc;
            const openBlock = openBlockList[0];
            const condition = openBlock.replace(/^<When\scondition="\{/i, '').replace(/}">$/, '');
            const processedBlock = item.replace(openBlock, `<%${index ? ' else' : ''} if (${condition}) { %>`);
            return acc.replace(item, processedBlock);
        }, template).replace(WHEN_CLOSE_PATTERN$1$1, '<% } %>');
        return otherwiseList.length === 1
            ? otherwiseList.reduce((acc, item) => {
                const processedBlock = item
                    .replace(OTHERWISE_OPEN_PATTERN$1$1, whenList.length ? '<% else {  %>' : '');
                return acc.replace(item, processedBlock);
            }, processedString).replace(OTHERWISE_CLOSE_PATTERN$1$1, whenList.length ? '<% } %>' : '')
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
        this.templateExecutor = TemplateEngine$1$1.getTemplateExecutor(value);
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
        let renderString = templateExecutor(omit$1$1(params, ['css']));
        renderString = TemplateEngine$1$1.getRenderStringWithClassNames(renderString, params);
        return TemplateEngine$1$1.getRenderStringWithVariables(renderString, params);
    }
    saveRefs() {
        const { container } = this;
        const refs = this.template.match(REF_PATTERN$1$1);
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
        const proxyChildNodes = TemplateEngine$1$1.getProxyChildNodes(renderString);
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
        this.childNodes = TemplateEngine$1$1.getProxyChildNodes(renderString);
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
        this.childNodes = TemplateEngine$1$1.getProxyChildNodes(renderString);
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
            TemplateEngine$1$1
                .insertAfter(container, childNode, ref);
        }
    }
    appendChild(childNode) {
        const { container } = this;
        if (container)
            container.appendChild(childNode);
    }
}

const getKeyCode$1$1 = (e) => e ? e.which || e.keyCode : null;

const ENTER_CODE$1$1 = 13;
const LEFT_CODE$1$1 = 37;
const RIGHT_CODE$1$1 = 39;
const UP_CODE$1$1 = 38;
const DOWN_CODE$1$1 = 40;
const NON_BREAKING_SPACE$1$1 = '&nbsp;';

var css$2$1$1 = {"root":"root-term-️cab119304dc90a90f699151e7c15d7ee","visible":"visible-term-️cab119304dc90a90f699151e7c15d7ee","content":"content-term-️cab119304dc90a90f699151e7c15d7ee","helpContainer":"helpContainer-term-️cab119304dc90a90f699151e7c15d7ee","inputContainer":"inputContainer-term-️cab119304dc90a90f699151e7c15d7ee"};

var lineTemplate$1$1 = "<div ref=\"root\" class=\"root visible {className}\">\n  <div ref=\"content\" class=\"content\">\n    <div ref=\"helpContainer\" class=\"labelText helpContainer\">{nbs}</div>\n    <div ref=\"labelContainer\"></div>\n    <div ref=\"inputContainer\" class=\"inputContainer\"></div>\n  </div>\n</div>\n";

class BaseCaret$1$1 extends TemplateEngine$1$1 {
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

var SimpleCaretTemplate$1$1 = "<span ref=\"root\" class=\"root\">\n  <span ref=\"character\" class=\"character\"></span>\n</span>\n";

var css$3$1$1 = {"root":"root-term-️e70267db75c0341d98d4d4a58c7a4fe6","carriage-return-blink":"carriage-return-blink-term-️e70267db75c0341d98d4d4a58c7a4fe6","lock":"lock-term-️e70267db75c0341d98d4d4a58c7a4fe6","busy":"busy-term-️e70267db75c0341d98d4d4a58c7a4fe6","none":"none-term-️e70267db75c0341d98d4d4a58c7a4fe6","carriage-return-busy":"carriage-return-busy-term-️e70267db75c0341d98d4d4a58c7a4fe6","hidden":"hidden-term-️e70267db75c0341d98d4d4a58c7a4fe6"};

class SimpleCaret$1$1 extends BaseCaret$1$1 {
    constructor(container) {
        super(SimpleCaretTemplate$1$1, container);
        this.render({ css: css$3$1$1 });
    }
    updateLockStyles() {
        const root = this.getRef('root');
        const { lock, prevLock } = this;
        if (!root || lock === prevLock)
            return;
        return lock ? root.classList.add(css$3$1$1.lock) : root.classList.remove(css$3$1$1.lock);
    }
    updateBusyStyles() {
        const root = this.getRef('root');
        const { busy, prevBusy } = this;
        if (!root || busy === prevBusy)
            return;
        return busy ? root.classList.add(css$3$1$1.busy) : root.classList.remove(css$3$1$1.busy);
    }
    updateHiddenStyles() {
        const root = this.getRef('root');
        const { hidden, prevHidden } = this;
        if (!root || hidden === prevHidden)
            return;
        return hidden ? root.classList.add(css$3$1$1.hidden) : root.classList.remove(css$3$1$1.hidden);
    }
    setValue(value) {
        const character = this.getRef('character');
        if (character && this.value !== value) {
            this.value = value;
            character.innerHTML = value;
        }
    }
}

class CaretFactory$1$1 {
    constructor() { }
    static registerCaret(name, caret) {
        CaretFactory$1$1.caretMap[name] = caret;
    }
    static getInstance() {
        if (!CaretFactory$1$1.instance)
            CaretFactory$1$1.instance = new CaretFactory$1$1();
        return CaretFactory$1$1.instance;
    }
    create(name, container) {
        return CaretFactory$1$1.caretMap[name]
            ? new CaretFactory$1$1.caretMap[name](container) : null;
    }
}
CaretFactory$1$1.caretMap = {
    simple: SimpleCaret$1$1,
};

const LOCK_TIMEOUT$1$1 = 600;

var template$3$1$1 = "<div ref=\"root\" class=\"root\">\n  <div ref=\"input\" class=\"input\" contenteditable=\"true\"></div>\n  <div ref=\"hidden\" class=\"hidden\"></div>\n</div>\n";

var css$4$1$1 = {"root":"root-term-️f48df653df791725509e2a00ded23e06","input":"input-term-️f48df653df791725509e2a00ded23e06","hiddenCaret":"hiddenCaret-term-️f48df653df791725509e2a00ded23e06","hidden":"hidden-term-️f48df653df791725509e2a00ded23e06"};

var css$5$1$1 = {"secret":"secret-term-️d139f1b48647dd08a4d620b7f948a15f"};

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

var matchHtmlRegExp$1$1 = /["'&<>]/;
/**
 * Module exports.
 * @public
 */

var escapeHtml_1$1$1 = escapeHtml$1$1;
/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml$1$1(string) {
  var str = '' + string;
  var match = matchHtmlRegExp$1$1.exec(str);

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

const getStartIntersectionString$1$1 = (main, target) => {
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

const DATA_INDEX_ATTRIBUTE_NAME$1$1 = 'data-index';
const SECRET_CHARACTER$1$1 = '•';

class BaseInput$1$1 extends TemplateEngine$1$1 {
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
        return isString$1$1(value)
            ? secret ? BaseInput$1$1.convertSecret(value) : value
            : value.reduce((acc, item) => {
                const str = isString$1$1(item) ? item : item.str;
                const val = secret && (isString$1$1(item) || !item.lock)
                    ? BaseInput$1$1.convertSecret(str) : str;
                return `${acc}${val}`;
            }, '');
    }
    static getFragmentTemplate(str, params) {
        const { className = '', secret = false, index } = params;
        const composedClassName = [secret ? css$5$1$1.secret : '', className].join(' ');
        const processedString = BaseInput$1$1.getNormalizedTemplateString(secret
            ? BaseInput$1$1.convertSecret(str) : str);
        return `<span
      ${DATA_INDEX_ATTRIBUTE_NAME$1$1}="${index}"
      ref="fragment-${index}"
      class="${composedClassName}">${processedString}</span>`;
    }
    static getNormalizedTemplateString(str) {
        return escapeHtml_1$1$1(str).replace(/\s/g, NON_BREAKING_SPACE$1$1);
    }
    static getValueFragmentTemplate(valueFragment, index, params = {}) {
        const { secret } = params;
        if (isString$1$1(valueFragment)) {
            return BaseInput$1$1.getFragmentTemplate(valueFragment, { index, secret });
        }
        const { str, className = '', lock } = valueFragment;
        const isSecret = !lock && secret;
        return BaseInput$1$1.getFragmentTemplate(str, { className, index, secret: isSecret });
    }
    static getValueTemplate(value, params = {}) {
        if (isString$1$1(value))
            return BaseInput$1$1.getNormalizedTemplateString(value);
        return value.reduce((acc, item, index) => {
            return `${acc}${BaseInput$1$1.getValueFragmentTemplate(item, index, params)}`;
        }, '');
    }
    static getUpdatedValueField(value, prevValue) {
        if (isString$1$1(prevValue))
            return value;
        let checkValue = value;
        let stop = false;
        const updatedValueField = prevValue.reduce((acc, item) => {
            const isStringItem = isString$1$1(item);
            const itemStr = (isStringItem ? item : item.str);
            const { str, isFull } = getStartIntersectionString$1$1(itemStr, checkValue);
            if (str && !stop) {
                acc.push(isStringItem ? str : Object.assign(Object.assign({}, item), { str }));
                checkValue = checkValue.substring(str.length);
                stop = !isFull;
            }
            return acc;
        }, []);
        checkValue.split('').forEach(char => updatedValueField.push(char));
        return updatedValueField.filter(item => isString$1$1(item) ? item : item.str);
    }
    static getLockString(value) {
        if (isString$1$1(value))
            return '';
        let str = '';
        let lockStr = '';
        value.forEach((item) => {
            if (isString$1$1(item)) {
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
        return (new Array(str.length)).fill(SECRET_CHARACTER$1$1).join('');
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
        return BaseInput$1$1.getLockString(valueField);
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
        if (isString$1$1(valueField))
            return index ? '' : valueField;
        const item = valueField[index];
        if (!item)
            return '';
        return isString$1$1(item) ? item : item.str;
    }
    getSimpleValue(showSecret = true) {
        const { secretField } = this;
        return BaseInput$1$1.getValueString(this.valueField, { secret: secretField && !showSecret });
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
        const charactersCount = BaseInput$1$1.getValueString(valueField).length;
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
        if (isString$1$1(valueField))
            return null;
        const dataIndex = element.getAttribute(DATA_INDEX_ATTRIBUTE_NAME$1$1);
        const valueFieldItem = dataIndex ? valueField[Number(dataIndex)] : null;
        return !valueFieldItem || isString$1$1(valueFieldItem)
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
            characterContainer.innerHTML = NON_BREAKING_SPACE$1$1;
            root.appendChild(characterContainer);
            this.characterContainer = characterContainer;
        }
    }
}

const STRINGIFY_HTML_PATTERN$1$1 = /<[^>]+>/g;
const NON_BREAKING_SPACE_PATTERN$1$1 = /&nbsp;/g;

const TEXT_NODE_TYPE$1$1 = 3;
const CHANGE_EVENT_TYPE$1$1 = 'change';

class ContentEditableInput$1$1 extends BaseInput$1$1 {
    constructor(container) {
        super(template$3$1$1, container, css$4$1$1);
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
        return BaseInput$1$1.getValueTemplate(val, params);
    }
    static getLastTextNode(root) {
        const { lastChild } = root;
        if (!lastChild)
            return null;
        if (lastChild.nodeType === TEXT_NODE_TYPE$1$1)
            return lastChild;
        return ContentEditableInput$1$1.getLastTextNode(lastChild);
    }
    static checkChildNode(root, checkNode) {
        if (root === checkNode)
            return true;
        const { parentNode } = checkNode;
        return parentNode ? ContentEditableInput$1$1.checkChildNode(root, parentNode) : false;
    }
    static getHtmlStringifyValue(html) {
        return html.replace(NON_BREAKING_SPACE_PATTERN$1$1, ' ').replace(STRINGIFY_HTML_PATTERN$1$1, '');
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
            const value = node.nodeType === TEXT_NODE_TYPE$1$1
                ? node.nodeValue
                : ContentEditableInput$1$1.getHtmlStringifyValue(node.innerHTML);
            return acc + (value ? value.length : 0);
        }, 0);
        return root === parentNode
            ? baseOffset + offset
            : ContentEditableInput$1$1.getNodeOffset(root, parentNode, baseOffset + offset);
    }
    set hiddenCaret(isCaretHidden) {
        if (this.isCaretHidden === isCaretHidden)
            return;
        const root = this.getRef('input');
        if (isCaretHidden) {
            root.classList.add(css$4$1$1.hiddenCaret);
        }
        else {
            root.classList.remove(css$4$1$1.hiddenCaret);
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
        if (!ContentEditableInput$1$1.checkChildNode(root, selection.anchorNode))
            return -1;
        return ContentEditableInput$1$1.getNodeOffset(root, anchorNode, anchorNode.nodeType === TEXT_NODE_TYPE$1$1 ? selection.anchorOffset : 0);
    }
    set caretPosition(position) {
        if (position < 0)
            return;
        const root = this.getRef('input');
        let offset = 0;
        let relativeOffset = 0;
        const targetNode = Array.prototype.find.call(root.childNodes, (childNode) => {
            const length = ((childNode.nodeType === TEXT_NODE_TYPE$1$1
                ? childNode.nodeValue
                : ContentEditableInput$1$1.getHtmlStringifyValue(childNode.innerHTML)) || '')
                .length;
            relativeOffset = offset;
            offset += length;
            return position <= offset;
        });
        const selection = window.getSelection();
        if (!selection || !targetNode)
            return;
        const range = new Range();
        const targetChildNode = targetNode.nodeType === TEXT_NODE_TYPE$1$1
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
        const node = ContentEditableInput$1$1.getLastTextNode(root);
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
        if (type === CHANGE_EVENT_TYPE$1$1) {
            this.externalChangeListeners.push(listener);
        }
        else {
            super.addEventListener(type, listener, options);
        }
    }
    removeEventListener(type, listener, options) {
        if (type === CHANGE_EVENT_TYPE$1$1) {
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
        const data = root.innerHTML;
        const items = data.replace(/<\/span>[^<]*</g, '</span><').split('</span>').filter(identity$1$1);
        return items.reduce((acc, item) => {
            var _a;
            const index = (((_a = item.match(/data-index="[0-9]+"/)) === null || _a === void 0 ? void 0 : _a[0]) || '').replace(/[^0-9]/g, '');
            if (index) {
                const prevValue = this.getValueItemString(Number(index));
                const updatedValue = ContentEditableInput$1$1.getHtmlStringifyValue(item)
                    .replace(new RegExp(`${SECRET_CHARACTER$1$1}+`), prevValue);
                return `${acc}${updatedValue}`;
            }
            return `${acc}${ContentEditableInput$1$1.getHtmlStringifyValue(item)}`;
        }, '');
    }
    updateValueField() {
        if (this.preventLockUpdate())
            return;
        const { caretPosition, isDisabled } = this;
        let updatedCaretPosition = caretPosition;
        if (isDisabled) {
            updatedCaretPosition = Math.min(caretPosition, BaseInput$1$1.getValueString(this.valueField).length);
        }
        else {
            this.valueField = BaseInput$1$1.getUpdatedValueField(this.getInputValue(), this.valueField);
        }
        this.updateContent();
        this.caretPosition = updatedCaretPosition;
    }
    preventLockUpdate() {
        const { valueField } = this;
        if (isString$1$1(valueField))
            return false;
        const value = this.getInputValue();
        const lockStr = BaseInput$1$1.getLockString(valueField);
        const deleteUnlockPart = lockStr
            && lockStr.indexOf(value) === 0
            && lockStr.length > value.length;
        if (deleteUnlockPart) {
            const lastLockIndex = this.valueField
                .reduce((acc, item, index) => {
                return !isString$1$1(item) && item.lock ? index : acc;
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
            const str = ContentEditableInput$1$1.getStyledValueTemplate(this.valueField, {
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
                if (childNode.nodeType !== TEXT_NODE_TYPE$1$1) {
                    const { color } = window.getComputedStyle(childNode);
                    if (color)
                        input.childNodes[index].style.textShadow = `0 0 0 ${color}`;
                }
            });
        }
    }
}

var template$4$1$1 = "<div ref=\"root\">\n  <div ref=\"input\" class=\"root\">{value}</div>\n</div>\n";

var css$6$1$1 = {"root":"root-term-️457efebe90f812d594ffccb8790b07ab"};

class ViewableInput$1$1 extends BaseInput$1$1 {
    set value(val) {
        this.valueField = val;
        const root = this.getRef('input');
        if (root)
            root.innerHTML = BaseInput$1$1.getValueTemplate(this.valueField);
    }
    constructor(container) {
        super(template$4$1$1, container, css$6$1$1);
    }
    render() {
        super.render({ css: css$6$1$1, value: BaseInput$1$1.getValueTemplate(this.valueField) });
    }
    getRootElement() {
        return this.getRef('input');
    }
}

var css$7$1$1 = {"label":"label-term-️679afd4849096768cfa38bb85a2048b8","labelTextContainer":"labelTextContainer-term-️679afd4849096768cfa38bb85a2048b8","labelText":"labelText-term-️679afd4849096768cfa38bb85a2048b8"};

var template$5$1$1 = "<if condition=\"{label || delimiter}\">\n  <div class=\"label\">\n    <if condition=\"{label}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"label\">{label}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n    <if condition=\"{delimiter}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"delimiter\">{delimiter}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n  </div>\n</if>\n\n";

class Label$1$1 extends TemplateEngine$1$1 {
    constructor(container, params = {}) {
        super(template$5$1$1, container);
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
            css: css$7$1$1, label, delimiter, nbs: NON_BREAKING_SPACE$1$1,
        }, this.reRender ? { replace: this } : {});
        this.reRender = true;
    }
}

class Line$1$1 extends TemplateEngine$1$1 {
    constructor(container, params = {}) {
        super(lineTemplate$1$1, container);
        this.isVisible = true;
        this.heightField = 0;
        this.secretField = false;
        this.initialValue = '';
        this.className = '';
        this.editable = false;
        this.onSubmit = noop$2$1;
        this.onChange = noop$2$1;
        this.onUpdateCaretPosition = noop$2$1;
        this.caretPosition = -1;
        this.updateHeight = () => {
            const root = this.getRef('root');
            if (!root)
                return;
            this.heightField = root.offsetHeight;
        };
        this.keyDownHandler = (e) => {
            ({
                [ENTER_CODE$1$1]: this.submitHandler,
                [LEFT_CODE$1$1]: this.lockCaret,
                [RIGHT_CODE$1$1]: this.lockCaret,
                [UP_CODE$1$1]: this.lockCaret,
                [DOWN_CODE$1$1]: this.lockCaret,
            }[Number(getKeyCode$1$1(e))] || noop$2$1)(e);
        };
        this.submitHandler = (e) => {
            const { onSubmit, inputField, secret } = this;
            const value = (inputField === null || inputField === void 0 ? void 0 : inputField.value) || '';
            let formattedValue = '';
            if (isString$1$1(value)) {
                formattedValue = secret ? '' : value;
            }
            else if (isArray$2$1(value)) {
                formattedValue = secret ? value.filter(item => get$2$1(item, 'lock')) : value;
            }
            e.preventDefault();
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
            if (document.hasFocus() && caretPosition >= 0) {
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
            this.lockTimeout = setTimeout(() => caret.lock = false, LOCK_TIMEOUT$1$1);
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
        const valueString = BaseInput$1$1.getValueString(value);
        const labelLength = (delimiter ? delimiter.length + 1 : 0)
            + (label ? label.length + 1 : 0);
        const rowItemsCount = Math
            .floor((width - Line$1$1.itemHorizontalPadding - labelLength * itemWidth) / itemWidth);
        return Math.ceil((valueString.length || 1) / rowItemsCount) * itemHeight
            + 2 * Line$1$1.itemVerticalPadding;
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
            root.classList.add(css$2$1$1.visible);
        }
        else {
            root.classList.remove(css$2$1$1.visible);
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
            css: css$2$1$1, editable, className, nbs: NON_BREAKING_SPACE$1$1,
        }, reRender ? { replace: this } : {});
        this.inputField = editable
            ? new ContentEditableInput$1$1(this.getRef('inputContainer'))
            : new ViewableInput$1$1(this.getRef('inputContainer'));
        this.label = new Label$1$1(this.getRef('labelContainer'), params);
        this.inputField.value = this.initialValue;
        this.inputField.secret = secret;
    }
    setCaret(name = 'simple') {
        const { inputField, editable } = this;
        this.removeCaret();
        const caret = Line$1$1.cf.create(name, this.getRef('inputContainer'));
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
        const { onUpdateCaretPosition = noop$2$1, onChange = noop$2$1, onSubmit = noop$2$1, editable = true, className = '', value, secret = false, } = params;
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
            ? NON_BREAKING_SPACE$1$1 : value[caretPosition] || NON_BREAKING_SPACE$1$1;
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
Line$1$1.cf = CaretFactory$1$1.getInstance();
Line$1$1.itemVerticalPadding = 4;
Line$1$1.itemHorizontalPadding = 16;

function unwrapExports$1$1(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule$1$1(fn, module) {
  return module = {
    exports: {}
  }, fn(module, module.exports), module.exports;
}

var guid$1$1 = createCommonjsModule$1$1(function (module, exports) {
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
unwrapExports$1$1(guid$1$1);
var guid_1$1$1 = guid$1$1.Guid;
/** Detect free variable `global` from Node.js. */

var freeGlobal$1$1$1 = typeof global == 'object' && global && global.Object === Object && global;
/** Detect free variable `self`. */

var freeSelf$1$1$1 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$1$1$1 = freeGlobal$1$1$1 || freeSelf$1$1$1 || Function('return this')();
/** Built-in value references. */

var Symbol$1$1$1 = root$1$1$1.Symbol;
/** Used for built-in method references. */

var objectProto$g$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$d$1$1 = objectProto$g$1$1.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$2$1$1 = objectProto$g$1$1.toString;
/** Built-in value references. */

var symToStringTag$2$1$1 = Symbol$1$1$1 ? Symbol$1$1$1.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag$1$1$1(value) {
  var isOwn = hasOwnProperty$d$1$1.call(value, symToStringTag$2$1$1),
      tag = value[symToStringTag$2$1$1];

  try {
    value[symToStringTag$2$1$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$2$1$1.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$2$1$1] = tag;
    } else {
      delete value[symToStringTag$2$1$1];
    }
  }

  return result;
}
/** Used for built-in method references. */


var objectProto$1$1$1$1 = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$1$1$1$1 = objectProto$1$1$1$1.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */

function objectToString$1$1$1(value) {
  return nativeObjectToString$1$1$1$1.call(value);
}
/** `Object#toString` result references. */


var nullTag$1$1$1 = '[object Null]',
    undefinedTag$1$1$1 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$1$1$1$1 = Symbol$1$1$1 ? Symbol$1$1$1.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag$1$1$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$1$1$1 : nullTag$1$1$1;
  }

  return symToStringTag$1$1$1$1 && symToStringTag$1$1$1$1 in Object(value) ? getRawTag$1$1$1(value) : objectToString$1$1$1(value);
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


function isObjectLike$1$1$1(value) {
  return value != null && typeof value == 'object';
}
/** `Object#toString` result references. */


var symbolTag$3$1$1 = '[object Symbol]';
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

function isSymbol$1$1$1(value) {
  return typeof value == 'symbol' || isObjectLike$1$1$1(value) && baseGetTag$1$1$1(value) == symbolTag$3$1$1;
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


function arrayMap$1$1$1(array, iteratee) {
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


var isArray$1$1$1 = Array.isArray;
/** Used as references for various `Number` constants. */

var INFINITY$2$1$1 = 1 / 0;
/** Used to convert symbols to primitives and strings. */

var symbolProto$2$1$1 = Symbol$1$1$1 ? Symbol$1$1$1.prototype : undefined,
    symbolToString$1$1$1 = symbolProto$2$1$1 ? symbolProto$2$1$1.toString : undefined;
/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */

function baseToString$1$1$1(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }

  if (isArray$1$1$1(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap$1$1$1(value, baseToString$1$1$1) + '';
  }

  if (isSymbol$1$1$1(value)) {
    return symbolToString$1$1$1 ? symbolToString$1$1$1.call(value) : '';
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$2$1$1 ? '-0' : result;
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


function isObject$1$1$1(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}
/** `Object#toString` result references. */


var asyncTag$1$1$1 = '[object AsyncFunction]',
    funcTag$3$1$1 = '[object Function]',
    genTag$2$1$1 = '[object GeneratorFunction]',
    proxyTag$1$1$1 = '[object Proxy]';
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

function isFunction$1$1$1(value) {
  if (!isObject$1$1$1(value)) {
    return false;
  } // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.


  var tag = baseGetTag$1$1$1(value);
  return tag == funcTag$3$1$1 || tag == genTag$2$1$1 || tag == asyncTag$1$1$1 || tag == proxyTag$1$1$1;
}
/** Used to detect overreaching core-js shims. */


var coreJsData$1$1$1 = root$1$1$1['__core-js_shared__'];
/** Used to detect methods masquerading as native. */

var maskSrcKey$1$1$1 = function () {
  var uid = /[^.]+$/.exec(coreJsData$1$1$1 && coreJsData$1$1$1.keys && coreJsData$1$1$1.keys.IE_PROTO || '');
  return uid ? 'Symbol(src)_1.' + uid : '';
}();
/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */


function isMasked$1$1$1(func) {
  return !!maskSrcKey$1$1$1 && maskSrcKey$1$1$1 in func;
}
/** Used for built-in method references. */


var funcProto$3$1$1 = Function.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$3$1$1 = funcProto$3$1$1.toString;
/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to convert.
 * @returns {string} Returns the source code.
 */

function toSource$1$1$1(func) {
  if (func != null) {
    try {
      return funcToString$3$1$1.call(func);
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


var reRegExpChar$1$1$1 = /[\\^$.*+?()[\]{}|]/g;
/** Used to detect host constructors (Safari). */

var reIsHostCtor$1$1$1 = /^\[object .+?Constructor\]$/;
/** Used for built-in method references. */

var funcProto$1$1$1$1 = Function.prototype,
    objectProto$2$1$1$1 = Object.prototype;
/** Used to resolve the decompiled source of functions. */

var funcToString$1$1$1$1 = funcProto$1$1$1$1.toString;
/** Used to check objects for own properties. */

var hasOwnProperty$1$1$1$1 = objectProto$2$1$1$1.hasOwnProperty;
/** Used to detect if a method is native. */

var reIsNative$1$1$1 = RegExp('^' + funcToString$1$1$1$1.call(hasOwnProperty$1$1$1$1).replace(reRegExpChar$1$1$1, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */

function baseIsNative$1$1$1(value) {
  if (!isObject$1$1$1(value) || isMasked$1$1$1(value)) {
    return false;
  }

  var pattern = isFunction$1$1$1(value) ? reIsNative$1$1$1 : reIsHostCtor$1$1$1;
  return pattern.test(toSource$1$1$1(value));
}
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */


function getValue$1$1$1(object, key) {
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


function getNative$1$1$1(object, key) {
  var value = getValue$1$1$1(object, key);
  return baseIsNative$1$1$1(value) ? value : undefined;
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


function noop$1$1$1() {} // No operation performed.

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


function eq$1$1$1(value, other) {
  return value === other || value !== value && other !== other;
}
/** Used to match property names within property paths. */


var reIsDeepProp$1$1$1 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp$1$1$1 = /^\w*$/;
/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */

function isKey$1$1$1(value, object) {
  if (isArray$1$1$1(value)) {
    return false;
  }

  var type = typeof value;

  if (type == 'number' || type == 'symbol' || type == 'boolean' || value == null || isSymbol$1$1$1(value)) {
    return true;
  }

  return reIsPlainProp$1$1$1.test(value) || !reIsDeepProp$1$1$1.test(value) || object != null && value in Object(object);
}
/* Built-in method references that are verified to be native. */


var nativeCreate$1$1$1 = getNative$1$1$1(Object, 'create');
/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */

function hashClear$1$1$1() {
  this.__data__ = nativeCreate$1$1$1 ? nativeCreate$1$1$1(null) : {};
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


function hashDelete$1$1$1(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
/** Used to stand-in for `undefined` hash values. */


var HASH_UNDEFINED$2$1$1 = '__lodash_hash_undefined__';
/** Used for built-in method references. */

var objectProto$3$1$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$2$1$1$1 = objectProto$3$1$1$1.hasOwnProperty;
/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

function hashGet$1$1$1(key) {
  var data = this.__data__;

  if (nativeCreate$1$1$1) {
    var result = data[key];
    return result === HASH_UNDEFINED$2$1$1 ? undefined : result;
  }

  return hasOwnProperty$2$1$1$1.call(data, key) ? data[key] : undefined;
}
/** Used for built-in method references. */


var objectProto$4$1$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$3$1$1$1 = objectProto$4$1$1$1.hasOwnProperty;
/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

function hashHas$1$1$1(key) {
  var data = this.__data__;
  return nativeCreate$1$1$1 ? data[key] !== undefined : hasOwnProperty$3$1$1$1.call(data, key);
}
/** Used to stand-in for `undefined` hash values. */


var HASH_UNDEFINED$1$1$1$1 = '__lodash_hash_undefined__';
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

function hashSet$1$1$1(key, value) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate$1$1$1 && value === undefined ? HASH_UNDEFINED$1$1$1$1 : value;
  return this;
}
/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */


function Hash$1$1$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `Hash`.


Hash$1$1$1.prototype.clear = hashClear$1$1$1;
Hash$1$1$1.prototype['delete'] = hashDelete$1$1$1;
Hash$1$1$1.prototype.get = hashGet$1$1$1;
Hash$1$1$1.prototype.has = hashHas$1$1$1;
Hash$1$1$1.prototype.set = hashSet$1$1$1;
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

function listCacheClear$1$1$1() {
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


function assocIndexOf$1$1$1(array, key) {
  var length = array.length;

  while (length--) {
    if (eq$1$1$1(array[length][0], key)) {
      return length;
    }
  }

  return -1;
}
/** Used for built-in method references. */


var arrayProto$1$1$1 = Array.prototype;
/** Built-in value references. */

var splice$1$1$1 = arrayProto$1$1$1.splice;
/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

function listCacheDelete$1$1$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1$1$1(data, key);

  if (index < 0) {
    return false;
  }

  var lastIndex = data.length - 1;

  if (index == lastIndex) {
    data.pop();
  } else {
    splice$1$1$1.call(data, index, 1);
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


function listCacheGet$1$1$1(key) {
  var data = this.__data__,
      index = assocIndexOf$1$1$1(data, key);
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


function listCacheHas$1$1$1(key) {
  return assocIndexOf$1$1$1(this.__data__, key) > -1;
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


function listCacheSet$1$1$1(key, value) {
  var data = this.__data__,
      index = assocIndexOf$1$1$1(data, key);

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


function ListCache$1$1$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `ListCache`.


ListCache$1$1$1.prototype.clear = listCacheClear$1$1$1;
ListCache$1$1$1.prototype['delete'] = listCacheDelete$1$1$1;
ListCache$1$1$1.prototype.get = listCacheGet$1$1$1;
ListCache$1$1$1.prototype.has = listCacheHas$1$1$1;
ListCache$1$1$1.prototype.set = listCacheSet$1$1$1;
/* Built-in method references that are verified to be native. */

var Map$2$1$1 = getNative$1$1$1(root$1$1$1, 'Map');
/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */

function mapCacheClear$1$1$1() {
  this.size = 0;
  this.__data__ = {
    'hash': new Hash$1$1$1(),
    'map': new (Map$2$1$1 || ListCache$1$1$1)(),
    'string': new Hash$1$1$1()
  };
}
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */


function isKeyable$1$1$1(value) {
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


function getMapData$1$1$1(map, key) {
  var data = map.__data__;
  return isKeyable$1$1$1(key) ? data[typeof key == 'string' ? 'string' : 'hash'] : data.map;
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


function mapCacheDelete$1$1$1(key) {
  var result = getMapData$1$1$1(this, key)['delete'](key);
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


function mapCacheGet$1$1$1(key) {
  return getMapData$1$1$1(this, key).get(key);
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


function mapCacheHas$1$1$1(key) {
  return getMapData$1$1$1(this, key).has(key);
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


function mapCacheSet$1$1$1(key, value) {
  var data = getMapData$1$1$1(this, key),
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


function MapCache$1$1$1(entries) {
  var index = -1,
      length = entries == null ? 0 : entries.length;
  this.clear();

  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
} // Add methods to `MapCache`.


MapCache$1$1$1.prototype.clear = mapCacheClear$1$1$1;
MapCache$1$1$1.prototype['delete'] = mapCacheDelete$1$1$1;
MapCache$1$1$1.prototype.get = mapCacheGet$1$1$1;
MapCache$1$1$1.prototype.has = mapCacheHas$1$1$1;
MapCache$1$1$1.prototype.set = mapCacheSet$1$1$1;
/** Error message constants. */

var FUNC_ERROR_TEXT$1$1$1 = 'Expected a function';
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

function memoize$1$1$1(func, resolver) {
  if (typeof func != 'function' || resolver != null && typeof resolver != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT$1$1$1);
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

  memoized.cache = new (memoize$1$1$1.Cache || MapCache$1$1$1)();
  return memoized;
} // Expose `MapCache`.


memoize$1$1$1.Cache = MapCache$1$1$1;
/** Used as the maximum memoize cache size. */

var MAX_MEMOIZE_SIZE$1$1$1 = 500;
/**
 * A specialized version of `_.memoize` which clears the memoized function's
 * cache when it exceeds `MAX_MEMOIZE_SIZE`.
 *
 * @private
 * @param {Function} func The function to have its output memoized.
 * @returns {Function} Returns the new memoized function.
 */

function memoizeCapped$1$1$1(func) {
  var result = memoize$1$1$1(func, function (key) {
    if (cache.size === MAX_MEMOIZE_SIZE$1$1$1) {
      cache.clear();
    }

    return key;
  });
  var cache = result.cache;
  return result;
}
/** Used to match property names within property paths. */


var rePropName$1$1$1 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
/** Used to match backslashes in property paths. */

var reEscapeChar$1$1$1 = /\\(\\)?/g;
/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */

var stringToPath$1$1$1 = memoizeCapped$1$1$1(function (string) {
  var result = [];

  if (string.charCodeAt(0) === 46
  /* . */
  ) {
      result.push('');
    }

  string.replace(rePropName$1$1$1, function (match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar$1$1$1, '$1') : number || match);
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

function toString$1$1$1(value) {
  return value == null ? '' : baseToString$1$1$1(value);
}
/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */


function castPath$1$1$1(value, object) {
  if (isArray$1$1$1(value)) {
    return value;
  }

  return isKey$1$1$1(value, object) ? [value] : stringToPath$1$1$1(toString$1$1$1(value));
}
/** Used as references for various `Number` constants. */


var INFINITY$1$1$1$1 = 1 / 0;
/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */

function toKey$1$1$1(value) {
  if (typeof value == 'string' || isSymbol$1$1$1(value)) {
    return value;
  }

  var result = value + '';
  return result == '0' && 1 / value == -INFINITY$1$1$1$1 ? '-0' : result;
}
/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */


function baseGet$1$1$1(object, path) {
  path = castPath$1$1$1(path, object);
  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey$1$1$1(path[index++])];
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


function get$1$1$1(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet$1$1$1(object, path);
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


function last$1$1$1(array) {
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


function isUndefined$1$1$1(value) {
  return value === undefined;
}

var ID$1$1 = guid_1$1$1.create().toString();
var RELEASE_DELAY$1$1 = 150;
var EMITTER_FORCE_LAYER_TYPE$1$1 = "EMITTER_FORCE_LAYER_TYPE_" + ID$1$1;
var EMITTER_TOP_LAYER_TYPE$1$1 = "EMITTER_TOP_LAYER_TYPE_" + ID$1$1;
var isListenersSet$1$1 = false;
var layersMap$1$1 = [];
var listenersLayers$1$1 = [];
var listenersPredefinedLayers$1$1 = {};
var forceListeners$1$1 = [];

var onEvent$1$1 = function (e, type) {
  forceListeners$1$1.forEach(function (listener) {
    get$1$1$1(listener, type, noop$1$1$1)(e);
  });

  if (listenersLayers$1$1.length) {
    get$1$1$1(last$1$1$1(listenersLayers$1$1), type, noop$1$1$1)(e);
  } else {
    var layers = Object.keys(listenersPredefinedLayers$1$1).filter(function (key) {
      return listenersPredefinedLayers$1$1[Number(key)].length > 0;
    }).sort(function (a, b) {
      return Number(a) - Number(b);
    });
    (listenersPredefinedLayers$1$1[Number(last$1$1$1(layers))] || []).forEach(function (listener) {
      get$1$1$1(listener, type, noop$1$1$1)(e);
    });
  }
};

var clearTargetDownLists$1$1 = function (target) {
  target.forEach(function (item) {
    item.instance.clearDownList();
  });
};

var onPress$1$1 = function (e) {
  onEvent$1$1(e, 'onPress');
};

var onDown$1$1 = function (e) {
  onEvent$1$1(e, 'onDown');
};

var onUp$1$1 = function (e) {
  onEvent$1$1(e, 'onUp');
};

var onWindowBlur$1$1 = function () {
  clearTargetDownLists$1$1(listenersLayers$1$1);
  clearTargetDownLists$1$1(forceListeners$1$1);
  Object.keys(listenersPredefinedLayers$1$1).forEach(function (key) {
    return clearTargetDownLists$1$1(listenersPredefinedLayers$1$1[Number(key)]);
  });
};

var Emitter$1$1 =
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
      releaseDelay = RELEASE_DELAY$1$1;
    }

    this.id = guid_1$1$1.create().toString();
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

    this.subscribeType = subscribeType || EMITTER_TOP_LAYER_TYPE$1$1;
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

    if (isArray$1$1$1(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'string' && typeof firstParam[1] === 'number') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray$1$1$1(firstParam) && firstParam.length === 2 && typeof firstParam[0] === 'number' && typeof firstParam[1] === 'string') {
      return Emitter.setLayersMap(firstParam[0], firstParam[1]);
    }

    if (isArray$1$1$1(firstParam) && isUndefined$1$1$1(secondParam)) {
      var setCount_1 = 0;
      firstParam.forEach(function (layerMap) {
        setCount_1 += Number(Emitter.setLayerMap(layerMap));
      });
      return setCount_1;
    }

    if (!isArray$1$1$1(firstParam) && typeof firstParam === 'object' && !isUndefined$1$1$1(firstParam.name) && !isUndefined$1$1$1(firstParam.id)) {
      return Number(Emitter.setLayerMap(firstParam));
    }

    if (!isArray$1$1$1(firstParam) && typeof firstParam === 'object') {
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
    if (typeof data === 'object' && !isArray$1$1$1(data)) {
      return Emitter.setLayerMapFromObject(data);
    }

    if (isArray$1$1$1(data)) {
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
      layersMap$1$1.push({
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
    if (!isListenersSet$1$1) {
      window.addEventListener('keypress', onPress$1$1, true);
      window.addEventListener('keyup', onUp$1$1, true);
      window.addEventListener('keydown', onDown$1$1, true);
      window.addEventListener('blur', onWindowBlur$1$1, true);
      isListenersSet$1$1 = true;
    }
  };

  Emitter.getEventKeyCode = function (e) {
    return e.which || e.keyCode;
  };

  Emitter.checkInputTarget = function (e) {
    return ['INPUT', 'TEXTAREA'].includes(get$1$1$1(e, 'target.tagName'));
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
      if (!listenersPredefinedLayers$1$1[subscribeType]) {
        listenersPredefinedLayers$1$1[subscribeType] = [];
      }

      return listenersPredefinedLayers$1$1[subscribeType];
    }

    if (subscribeType === EMITTER_FORCE_LAYER_TYPE$1$1) {
      return forceListeners$1$1;
    }

    if (subscribeType === EMITTER_TOP_LAYER_TYPE$1$1) {
      return listenersLayers$1$1;
    }

    if (typeof subscribeType === 'string') {
      var layerId = get$1$1$1(layersMap$1$1.find(function (item) {
        return item.name === subscribeType;
      }), 'id');

      if (typeof layerId === 'number' && layerId >= 0) {
        return Emitter.getListenersTarget(layerId);
      }
    }

    return null;
  };

  Emitter.clearDownLists = function (subscribeType) {
    if (subscribeType === EMITTER_TOP_LAYER_TYPE$1$1) {
      Emitter.clearLayerDownLists();
      Emitter.clearPredefinedLayersDownLists();
    } else if (subscribeType === 'string' && subscribeType !== EMITTER_FORCE_LAYER_TYPE$1$1 || typeof subscribeType === 'number') {
      var layerId = typeof subscribeType === 'string' ? get$1$1$1(layersMap$1$1.find(function (item) {
        return item.name === subscribeType;
      }), 'id') : subscribeType;
      var biggestLayerId = Math.max.apply(null, Object.keys(listenersPredefinedLayers$1$1).map(function (key) {
        return Number(key);
      }));

      if (layerId && layerId >= biggestLayerId) {
        Emitter.clearPredefinedLayersDownLists([layerId]);
      }
    }
  };

  Emitter.clearLayerDownLists = function () {
    clearTargetDownLists$1$1(listenersLayers$1$1);
  };

  Emitter.clearPredefinedLayersDownLists = function (skip) {
    if (skip === void 0) {
      skip = [];
    }

    Object.keys(listenersPredefinedLayers$1$1).forEach(function (key) {
      var normalizedKey = Number(key);

      if (!skip.includes(normalizedKey)) {
        clearTargetDownLists$1$1(listenersPredefinedLayers$1$1[normalizedKey]);
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

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex$1$1 = [];

for (var i$1$1 = 0; i$1$1 < 256; ++i$1$1) {
  byteToHex$1$1[i$1$1] = (i$1$1 + 0x100).toString(16).substr(1);
}

const BASE_PLUGIN_NAME$1$1 = 'base';

class Plugin$1$1 {
    constructor() {
        this.name = BASE_PLUGIN_NAME$1$1;
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

/** Detect free variable `global` from Node.js. */
var freeGlobal$2$1$1 = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */

var freeSelf$2$1$1 = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */

var root$2$1$1 = freeGlobal$2$1$1 || freeSelf$2$1$1 || Function('return this')();

/** Built-in value references. */

var Symbol$2$1$1 = root$2$1$1.Symbol;

/** Used for built-in method references. */

var objectProto$h$1$1 = Object.prototype;
/** Used to check objects for own properties. */

var hasOwnProperty$e$1$1 = objectProto$h$1$1.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */

var nativeObjectToString$3$1$1 = objectProto$h$1$1.toString;
/** Built-in value references. */

var symToStringTag$3$1$1 = Symbol$2$1$1 ? Symbol$2$1$1.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */

function getRawTag$2$1$1(value) {
  var isOwn = hasOwnProperty$e$1$1.call(value, symToStringTag$3$1$1),
      tag = value[symToStringTag$3$1$1];

  try {
    value[symToStringTag$3$1$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$3$1$1.call(value);

  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$3$1$1] = tag;
    } else {
      delete value[symToStringTag$3$1$1];
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

function objectToString$2$1$1(value) {
  return nativeObjectToString$4.call(value);
}

/** `Object#toString` result references. */

var nullTag$2$1$1 = '[object Null]',
    undefinedTag$2$1$1 = '[object Undefined]';
/** Built-in value references. */

var symToStringTag$4 = Symbol$2$1$1 ? Symbol$2$1$1.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */

function baseGetTag$2$1$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag$2$1$1 : nullTag$2$1$1;
  }

  return symToStringTag$4 && symToStringTag$4 in Object(value) ? getRawTag$2$1$1(value) : objectToString$2$1$1(value);
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
function isObjectLike$2$1$1(value) {
  return value != null && typeof value == 'object';
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
var isArray$2$1$1 = Array.isArray;

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
function noop$2$1$1() {// No operation performed.
}

/** `Object#toString` result references. */

var stringTag$4$1$1 = '[object String]';
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

function isString$1$1$1(value) {
  return typeof value == 'string' || !isArray$2$1$1(value) && isObjectLike$2$1$1(value) && baseGetTag$2$1$1(value) == stringTag$4$1$1;
}

var template$1$1$1 = "<div ref=\"root\" class=\"root\"></div>\n";

var css = {"root":"root-context-menu-plugin-️74022d6f2c3e8e38c498d8c8405a8378"};

class ContextMenuView extends TemplateEngine$1$1 {
    constructor(container) {
        super(template$1$1$1, container);
        this.reRender = false;
    }
    render() {
        super.render({ css }, this.reRender ? { replace: this } : {});
        this.reRender = true;
    }
}

const PLUGIN_NAME = 'context-menu';
const END_OF_LINE_TYPE = 'end of line';
const POSITION_TARGET_TYPE = 'position';
const CLOSE_ACTION = 'context-menu-plugin-close';
const ESC_KEY_CODE = 27;

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
const getRelativePosition = (el, container) => {
    const scrollBarSize = getScrollbarSize(container);
    const elInfo = el.getBoundingClientRect();
    const containerInfo = container.getBoundingClientRect();
    const left = elInfo.left - containerInfo.left;
    const top = elInfo.top - containerInfo.top;
    const containerWidth = containerInfo.width - scrollBarSize;
    const containerHeight = containerInfo.height - scrollBarSize;
    return {
        left,
        top,
        bottom: containerHeight - top - elInfo.height,
        right: containerWidth - left - elInfo.width,
        width: elInfo.width,
        height: elInfo.height,
    };
};

const stopPropagation = (e) => e.stopPropagation();

class ContextMenu extends Plugin$1$1 {
    constructor() {
        super(...arguments);
        this.name = PLUGIN_NAME;
        this.isVisible = false;
        this.escHide = false;
        this.aroundClickHide = false;
        this.escHandler = () => {
            if (this.escHide)
                this.hide();
        };
        this.rootClickHandler = () => {
            if (this.aroundClickHide)
                this.hide();
        };
    }
    show(content, target, options = {}) {
        this.hide();
        const { position, escHide = false, aroundClickHide = false, onHide } = options;
        if (target === POSITION_TARGET_TYPE && !position)
            return;
        this.target = target;
        this.escHide = escHide;
        this.onHide = onHide;
        this.aroundClickHide = aroundClickHide;
        this.render(content);
        this.updatePosition();
    }
    hide() {
        const { contextMenuView, onHide } = this;
        if (contextMenuView) {
            const root = contextMenuView.getRef('root');
            if (root)
                root.removeEventListener('click', stopPropagation);
            contextMenuView.destroy();
            delete this.contextMenuView;
            if (onHide)
                onHide();
        }
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        const { root } = termInfo.elements;
        root === null || root === void 0 ? void 0 : root.addEventListener('click', this.rootClickHandler);
        keyboardShortcutsManager.addShortcut(CLOSE_ACTION, { code: ESC_KEY_CODE });
        keyboardShortcutsManager.addListener(CLOSE_ACTION, this.escHandler);
        this.updatePosition();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
        this.updatePosition();
    }
    destroy() {
        const { keyboardShortcutsManager, termInfo } = this;
        const root = termInfo === null || termInfo === void 0 ? void 0 : termInfo.elements.root;
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.removeListener(this.escHandler);
            keyboardShortcutsManager.removeShortcut(CLOSE_ACTION);
        }
        if (root)
            root.removeEventListener('click', this.rootClickHandler);
        super.destroy();
    }
    clear() {
        this.hide();
        super.clear();
    }
    render(content) {
        var _a, _b;
        const { termInfo, target } = this;
        const edit = target === END_OF_LINE_TYPE ? (_a = termInfo === null || termInfo === void 0 ? void 0 : termInfo.elements) === null || _a === void 0 ? void 0 : _a.edit : (_b = termInfo === null || termInfo === void 0 ? void 0 : termInfo.elements) === null || _b === void 0 ? void 0 : _b.root;
        if (!edit)
            return;
        const contextMenuView = new ContextMenuView(edit);
        contextMenuView.render();
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        root.addEventListener('click', stopPropagation);
        this.contextMenuView = contextMenuView;
        this.isVisible = false;
        return isString$1$1$1(content) ? root.innerHTML = content : root.appendChild(content);
    }
    updatePosition() {
        const { target, isVisible } = this;
        ({
            [END_OF_LINE_TYPE]: () => this.updateEndOfLinePosition(),
            [POSITION_TARGET_TYPE]: () => this.updateFixedPosition(),
        }[target || ''] || noop$2$1$1)();
        if (!isVisible)
            this.setVisible();
    }
    updateEndOfLinePosition() {
        const { termInfo, contextMenuView } = this;
        if (!termInfo || !contextMenuView)
            return;
        const { size: { height } } = termInfo.caret;
        const { endOffset: { left, top: offsetTop } } = termInfo.edit;
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        const top = offsetTop + height;
        root.style.left = `${left}px`;
        root.style.top = `${top}px`;
        this.normalizedPosition(left, top);
    }
    updateFixedPosition() {
        const { position, contextMenuView } = this;
        if (!position || !contextMenuView)
            return;
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        root.style.left = `${position.left}px`;
        root.style.top = `${position.top}px`;
        this.normalizedPosition(position.left, position.top);
    }
    setVisible() {
        const { contextMenuView } = this;
        if (!contextMenuView)
            return;
        const root = contextMenuView.getRef('root');
        if (!root)
            return;
        root.style.visibility = 'visible';
        this.isVisible = true;
    }
    normalizedPosition(left, top) {
        var _a, _b;
        const { contextMenuView, target, termInfo } = this;
        const root = (_b = (_a = this.termInfo) === null || _a === void 0 ? void 0 : _a.elements) === null || _b === void 0 ? void 0 : _b.root;
        if (!contextMenuView || !root)
            return;
        const contextMenuRoot = contextMenuView.getRef('root');
        if (!contextMenuRoot)
            return;
        const { right, bottom, } = getRelativePosition(contextMenuRoot, root);
        if (right < 0)
            contextMenuRoot.style.left = `${left + right}px`;
        if (bottom < 0) {
            const updatedTop = top - contextMenuRoot.offsetHeight
                - (target === END_OF_LINE_TYPE ? (termInfo === null || termInfo === void 0 ? void 0 : termInfo.caret.size.height) || 0 : 0);
            contextMenuRoot.style.top = `${updatedTop}px`;
        }
    }
}

var template$2 = "<ul ref=\"root\" class=\"root\"></ul>\n";

var css$1 = {"root":"root-dropdown-plugin-️da9551de836787a257b4d03547cdec29"};

var template$6 = "<li ref=\"root\" class=\"root {active}\">\n  <span class=\"matchText\">{match}</span><span class=\"text\">{suggestion}</span>\n</li>\n";

var css$8 = {"root":"root-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853","active":"active-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853","text":"text-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853","matchText":"matchText-dropdown-plugin-️6e873539f3fca9ba36b41f5a230d2853"};

class Item extends TemplateEngine$1 {
    constructor(container, params) {
        super(template$6, container);
        this.isActive = false;
        this.isRendered = false;
        this.clickHandler = () => {
            const { text, onClick } = this;
            if (onClick)
                onClick(text, this);
        };
        this.hoverHandler = () => {
            const { text, onHover } = this;
            if (onHover)
                onHover(text, this);
        };
        const { value, text, index, onHover, onClick } = params;
        this.text = text;
        this.index = index;
        this.match = value;
        this.onHover = onHover;
        this.onClick = onClick;
        this.suggestion = text.replace(value, '');
    }
    get active() {
        return this.isActive;
    }
    set active(val) {
        const root = this.getRef('root');
        if (val !== this.isActive && root) {
            if (val) {
                root.classList.add(css$8.active);
            }
            else {
                root.classList.remove(css$8.active);
            }
        }
        this.isActive = val;
    }
    render() {
        const { match, suggestion, isActive, isRendered } = this;
        this.removeListeners();
        super.render({ css: css$8, match, suggestion, active: isActive ? css$8.active : '' }, isRendered ? { replace: this } : {});
        this.addListeners();
        this.isRendered = true;
    }
    destroy() {
        this.removeListeners();
        super.destroy();
    }
    addListeners() {
        const root = this.getRef('root');
        if (root) {
            root.addEventListener('click', this.clickHandler);
            root.addEventListener('mousemove', this.hoverHandler);
        }
    }
    removeListeners() {
        const root = this.getRef('root');
        if (root) {
            root.removeEventListener('click', this.clickHandler);
            root.removeEventListener('mousemove', this.hoverHandler);
        }
    }
}

class List extends TemplateEngine$1 {
    constructor(container, onSelect) {
        super(template$2, container);
        this.reRender = false;
        this.listItems = [];
        this.itemsField = [];
        this.valueField = '';
        this.indexField = 0;
        this.onItemHover = (_, line) => {
            const { listItems } = this;
            listItems.forEach((item, index) => {
                if (item === line) {
                    this.indexField = index;
                    item.active = true;
                }
                else {
                    item.active = false;
                }
            });
        };
        this.onItemClick = (text, item) => {
            const { onSelect } = this;
            if (onSelect)
                onSelect(text, item.index);
        };
        this.onSelect = onSelect;
        this.render();
    }
    get items() {
        return this.itemsField;
    }
    set items(val) {
        this.itemsField = val;
        this.render();
    }
    get value() {
        return this.valueField;
    }
    set value(val) {
        if (this.valueField !== val) {
            this.valueField = val;
            this.render();
        }
    }
    get index() {
        return this.indexField;
    }
    set index(val) {
        const newIndex = Math.max(0, val);
        if (this.indexField !== newIndex) {
            this.indexField = newIndex;
            this.render();
        }
    }
    render() {
        super.render({ css: css$1 }, this.reRender ? { replace: this } : {});
        this.renderItems();
        this.reRender = true;
    }
    renderItems() {
        const root = this.getRef('root');
        const { itemsField, valueField, indexField } = this;
        const listItems = [];
        let isSetActive = false;
        if (root) {
            this.destroyItems();
            itemsField.forEach((item, index) => {
                if (!valueField || item.includes(valueField)) {
                    const isActive = indexField === index;
                    isSetActive = isSetActive || isActive;
                    const listItem = new Item(root, {
                        index,
                        value: valueField,
                        text: item,
                        onHover: this.onItemHover,
                        onClick: this.onItemClick,
                    });
                    listItem.render();
                    listItem.active = isActive;
                    listItems.push(listItem);
                }
            });
            this.listItems = listItems;
            if (!isSetActive) {
                this.indexField = 0;
                if (listItems[0])
                    listItems[0].active = true;
            }
        }
    }
    destroyItems() {
        this.listItems.forEach(listItem => listItem.destroy());
        this.listItems = [];
    }
}

const NEXT_ACTION = 'dropdown-plugin-next';
const DOWN_ACTION = 'dropdown-plugin-down';
const UP_ACTION = 'dropdown-plugin-up';
const SUBMIT_ACTION = 'dropdown-plugin-submit';

const TAB_KEY_CODE = 9;
const UP_KEY_CODE = 38;
const DOWN_KEY_CODE = 40;
const ENTER_KEY_CODE = 13;

const PLUGIN_NAME$1 = 'dropdown';

class Dropdown extends Plugin$1 {
    constructor() {
        super();
        this.name = PLUGIN_NAME$1;
        this.isActionsLock = false;
        this.itemsList = [];
        this.highlightField = '';
        this.isActive = false;
        this.onNext = (action, e) => {
            const { isActive, list, isActionsLock } = this;
            if (isActive && list && !isActionsLock) {
                e.stopPropagation();
                e.preventDefault();
                const nextIndex = list.index + 1;
                list.index = nextIndex >= list.items.length ? 0 : nextIndex;
            }
        };
        this.onDown = (action, e) => {
            const { isActive, list, isActionsLock } = this;
            if (isActive && list && !isActionsLock) {
                e.stopPropagation();
                e.preventDefault();
                list.index = Math.min(list.index + 1, list.items.length - 1);
            }
        };
        this.onUp = (action, e) => {
            const { isActive, list, isActionsLock } = this;
            if (isActive && list && !isActionsLock) {
                e.stopPropagation();
                e.preventDefault();
                list.index = Math.max(list.index - 1, 0);
            }
        };
        this.onSubmit = (action, e) => {
            const { onSelect, isActive, list } = this;
            if (isActive && list) {
                e.stopPropagation();
                e.preventDefault();
                if (onSelect)
                    onSelect(list.items[list.index], list.index);
            }
            this.clear();
        };
        this.selectHandler = (text, index) => {
            const { onSelect } = this;
            this.hide();
            if (onSelect)
                onSelect(text, index);
        };
        this.hideContextMenuHandler = () => {
            const { isActive } = this;
            if (isActive)
                this.clear();
        };
        this.container = document.createElement('div');
    }
    get items() {
        return this.itemsList;
    }
    set items(val) {
        const { itemsList, append, container } = this;
        if (itemsList.length !== val.length || itemsList.some((item, i) => item !== val[i])) {
            this.itemsList = val;
            this.renderList({ append, className: container.className });
        }
    }
    get highlight() {
        return this.highlightField;
    }
    set highlight(val) {
        const { append, container } = this;
        if (val !== this.highlightField) {
            this.highlightField = val;
            this.renderList({ append, className: container.className });
        }
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.registerShortcut();
        this.setContextMenuPlugin();
    }
    updateTermInfo(termInfo) {
        super.updateTermInfo(termInfo);
    }
    clear() {
        this.hideList();
        delete this.onSelect;
        delete this.onClose;
        super.clear();
    }
    destroy() {
        this.clear();
        this.unregisterShortcut();
        super.destroy();
    }
    show(items = [], params = {}) {
        if (items)
            this.itemsList = items;
        const { itemsList } = this;
        const { onSelect, onClose } = params;
        if (itemsList.length) {
            this.onSelect = onSelect;
            this.onClose = onClose;
            this.isActive = true;
            this.renderList(params);
        }
        else {
            this.clear();
            if (onClose)
                onClose();
        }
    }
    hide() {
        this.clear();
    }
    unregisterShortcut() {
        const { keyboardShortcutsManager } = this;
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.removeShortcut(NEXT_ACTION);
            keyboardShortcutsManager.removeShortcut(DOWN_ACTION);
            keyboardShortcutsManager.removeShortcut(UP_ACTION);
            keyboardShortcutsManager.removeShortcut(SUBMIT_ACTION);
        }
    }
    registerShortcut() {
        const { keyboardShortcutsManager } = this;
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.addShortcut(NEXT_ACTION, { code: TAB_KEY_CODE });
            keyboardShortcutsManager.addShortcut(DOWN_ACTION, { code: DOWN_KEY_CODE });
            keyboardShortcutsManager.addShortcut(UP_ACTION, { code: UP_KEY_CODE });
            keyboardShortcutsManager.addShortcut(SUBMIT_ACTION, { code: ENTER_KEY_CODE });
            keyboardShortcutsManager.addListener(NEXT_ACTION, this.onNext);
            keyboardShortcutsManager.addListener(DOWN_ACTION, this.onDown);
            keyboardShortcutsManager.addListener(UP_ACTION, this.onUp);
            keyboardShortcutsManager.addListener(SUBMIT_ACTION, this.onSubmit);
        }
    }
    setContextMenuPlugin() {
        const { termInfo } = this;
        if (!termInfo)
            return;
        const contextMenuPlugin = termInfo.pluginManager.getPlugin(ContextMenu);
        if (contextMenuPlugin) {
            this.contextMenuPlugin = contextMenuPlugin;
        }
        else {
            this.contextMenuPlugin = new ContextMenu();
            termInfo.pluginManager.register(this.contextMenuPlugin);
        }
    }
    renderList(params) {
        const { contextMenuPlugin, container, itemsList, keyboardShortcutsManager, unlockCallback, highlightField, } = this;
        const { className = '', append } = params;
        if (!contextMenuPlugin || !keyboardShortcutsManager)
            return;
        container.className = className;
        if (!this.list)
            this.list = new List(container, this.selectHandler);
        this.renderAppend(append);
        if (!unlockCallback) {
            this.unlockCallback = keyboardShortcutsManager.lock([
                NEXT_ACTION, DOWN_ACTION, UP_ACTION, SUBMIT_ACTION, CLOSE_ACTION,
            ]);
        }
        const list = this.list;
        list.items = itemsList;
        list.value = highlightField.trim();
        this.isActive = false;
        contextMenuPlugin.show(container, END_OF_LINE_TYPE, {
            escHide: true, aroundClickHide: true, onHide: this.hideContextMenuHandler,
        });
        this.isActive = true;
    }
    renderAppend(append) {
        const { container } = this;
        this.clearAppend();
        if (!append)
            return;
        if (typeof append === 'string') {
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = append.replace(/^[\n\t\s]+/, '');
            const appendNode = tempContainer.firstChild;
            if (!appendNode)
                return;
            container.appendChild(appendNode);
            this.append = appendNode;
        }
        else {
            container.appendChild(append);
            this.append = append;
        }
    }
    clearAppend() {
        const { container, append } = this;
        if (append)
            container.removeChild(append);
        delete this.append;
    }
    hideList() {
        const { list, unlockCallback, contextMenuPlugin, onClose } = this;
        this.clearAppend();
        this.isActive = false;
        if (unlockCallback) {
            unlockCallback();
            delete this.unlockCallback;
        }
        if (list) {
            list.destroy();
            delete this.list;
        }
        contextMenuPlugin === null || contextMenuPlugin === void 0 ? void 0 : contextMenuPlugin.hide();
        if (onClose)
            onClose();
    }
}

var css$9 = {"withIcon":"withIcon-autocomplete-plugin-️3606278efd34a3558ed3ac1666cdcb6e"};

const SHOW_ACTION = 'autocomplete-plugin-show';
const PLUGIN_NAME$2 = 'autocomplete-plugin';

class Autocomplete extends Plugin {
    constructor() {
        super(...arguments);
        this.name = PLUGIN_NAME$2;
        this.listsInfo = [];
        this.activeSuggestions = [];
        this.commandList = [];
        this.active = '';
        this.isSetShowHandler = false;
        this.onAutocomplete = (action, e, info) => {
            var _a;
            const { dropdownPlugin, listsInfo, active } = this;
            const infoUuid = info === null || info === void 0 ? void 0 : info.shortcut;
            if (!infoUuid || (active && active !== infoUuid))
                return;
            this.commandList = ((_a = listsInfo.find(item => item.uuid === infoUuid)) === null || _a === void 0 ? void 0 : _a.items) || [];
            e.stopPropagation();
            e.preventDefault();
            if (dropdownPlugin && this.setSuggestions()) {
                this.active = infoUuid;
                dropdownPlugin.isActionsLock = true;
                this.showSuggestions();
                setTimeout(() => dropdownPlugin.isActionsLock = false, 0);
            }
        };
        this.onSelect = (text) => {
            const { termInfo } = this;
            if (termInfo) {
                const { edit } = termInfo;
                edit.focus();
                edit.write(text.replace(edit.value, ''));
            }
            this.clear();
        };
        this.onClose = () => {
            this.activeSuggestions = [];
            this.active = '';
        };
    }
    addList(items, actionShortcut, icon) {
        const info = {
            icon, items, actionShortcut, isRegistered: false, uuid: v1(),
        };
        this.listsInfo.push(info);
        this.registerShortcut(info);
        return () => this.removeList(info.uuid);
    }
    removeList(uuidValue) {
        const { listsInfo, keyboardShortcutsManager } = this;
        const index = listsInfo.findIndex(item => item.uuid === uuidValue);
        if (index < 0)
            return;
        const listInfo = listsInfo[index];
        listsInfo.splice(index, 1);
        if (keyboardShortcutsManager) {
            keyboardShortcutsManager.removeShortcut(SHOW_ACTION, listInfo.actionShortcut);
        }
    }
    setTermInfo(termInfo, keyboardShortcutsManager) {
        super.setTermInfo(termInfo, keyboardShortcutsManager);
        this.registerShortcut();
        this.setDropdownPlugin();
    }
    updateTermInfo(termInfo) {
        const { termInfo: termInfoPrev, active } = this;
        const prevValue = termInfoPrev === null || termInfoPrev === void 0 ? void 0 : termInfoPrev.edit.value;
        const currentValue = termInfo.edit.value;
        super.updateTermInfo(termInfo);
        if (active && currentValue && prevValue !== currentValue) {
            this.setSuggestions();
            this.showSuggestions();
        }
        else if (active && !currentValue) {
            this.clear();
        }
    }
    clear() {
        this.hideSuggestionsList();
        this.active = '';
        super.clear();
    }
    destroy() {
        var _a;
        this.unregisterShortcut();
        (_a = this.dropdownPlugin) === null || _a === void 0 ? void 0 : _a.hide();
        super.destroy();
    }
    unregisterShortcut() {
        const { keyboardShortcutsManager } = this;
        if (keyboardShortcutsManager)
            keyboardShortcutsManager.removeShortcut(SHOW_ACTION);
    }
    registerShortcut(info) {
        const { keyboardShortcutsManager, listsInfo, isSetShowHandler } = this;
        if (!keyboardShortcutsManager || (info && info.isRegistered))
            return;
        if (info) {
            keyboardShortcutsManager.addShortcut(SHOW_ACTION, info.actionShortcut, info.uuid);
            info.isRegistered = true;
        }
        else {
            listsInfo.forEach(item => this.registerShortcut(item));
        }
        if (!isSetShowHandler) {
            keyboardShortcutsManager.addListener(SHOW_ACTION, this.onAutocomplete);
            this.isSetShowHandler = true;
        }
    }
    setDropdownPlugin() {
        const { termInfo } = this;
        if (!termInfo)
            return;
        const dropdownPlugin = termInfo.pluginManager.getPlugin(Dropdown);
        if (dropdownPlugin) {
            this.dropdownPlugin = dropdownPlugin;
        }
        else {
            this.dropdownPlugin = new Dropdown();
            termInfo.pluginManager.register(this.dropdownPlugin);
        }
    }
    setSuggestions() {
        const { termInfo, commandList } = this;
        if (!termInfo)
            return this.setNewSuggestions([]);
        const { caret: { position }, edit: { value } } = termInfo;
        return this.setNewSuggestions(position !== value.length
            ? []
            : commandList
                .filter(command => command.indexOf(value) === 0 && command !== value));
    }
    setNewSuggestions(newActiveSuggestions) {
        const { activeSuggestions } = this;
        this.activeSuggestions = newActiveSuggestions;
        return activeSuggestions.length !== newActiveSuggestions.length
            || newActiveSuggestions.some((item, i) => item !== activeSuggestions[i]);
    }
    showSuggestions() {
        const { activeSuggestions } = this;
        if (activeSuggestions.length) {
            this.renderSuggestionsList();
        }
        else {
            this.clear();
        }
    }
    renderSuggestionsList() {
        var _a;
        const { dropdownPlugin, activeSuggestions, termInfo, active, listsInfo } = this;
        const value = termInfo === null || termInfo === void 0 ? void 0 : termInfo.edit.value;
        if (!dropdownPlugin || !value)
            return;
        const icon = (_a = listsInfo.find(item => item.uuid === active)) === null || _a === void 0 ? void 0 : _a.icon;
        dropdownPlugin.show(activeSuggestions, {
            onSelect: this.onSelect,
            onClose: this.onClose,
            append: icon,
            className: icon ? css$9.withIcon : '',
        });
        dropdownPlugin.highlight = value.trim();
    }
    hideSuggestionsList() {
        const { dropdownPlugin } = this;
        if (dropdownPlugin)
            dropdownPlugin.hide();
        this.activeSuggestions = [];
    }
}

export { Autocomplete };
//# sourceMappingURL=index.es.js.map
