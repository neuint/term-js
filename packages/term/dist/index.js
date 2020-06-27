'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var lodashEs = require('lodash-es');
var keyLayersJs = require('key-layers-js');
var uuid = require('uuid');

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

var css = {"term":"term-term-️0e2edb9a914aa6e9f9eafd6a264c9040","header":"header-term-️0e2edb9a914aa6e9f9eafd6a264c9040","hidden":"hidden-term-️0e2edb9a914aa6e9f9eafd6a264c9040","headerTextContainer":"headerTextContainer-term-️0e2edb9a914aa6e9f9eafd6a264c9040","headerText":"headerText-term-️0e2edb9a914aa6e9f9eafd6a264c9040","content":"content-term-️0e2edb9a914aa6e9f9eafd6a264c9040","linesContainer":"linesContainer-term-️0e2edb9a914aa6e9f9eafd6a264c9040","line":"line-term-️0e2edb9a914aa6e9f9eafd6a264c9040","editLine":"editLine-term-️0e2edb9a914aa6e9f9eafd6a264c9040"};

var template = "<div ref=\"root\" class=\"term\">\n  <div ref=\"header\" class=\"header {hidden}\">\n    <div ref=\"headerTextContainer\" class=\"headerTextContainer\">\n      <span ref=\"headerText\" class=\"headerText\">{header}</span>\n    </div>\n  </div>\n  <div ref=\"content\" class=\"content\">\n    <div ref=\"linesContainer\" class=\"linesContainer\"></div>\n  </div>\n</div>\n";

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
    static getTemplateExecutor(template) {
        let processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashConditions(template);
        processedTemplate = TemplateEngine
            .getTemplateExecutorStringWithLodashSwitches(processedTemplate)
            .replace(/\s*%>[\s\n]*<%\s*/g, ' ');
        return lodashEs.template(processedTemplate);
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
        let renderString = templateExecutor(lodashEs.omit(params, ['css']));
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

var template$1 = "<div ref=\"root\" class=\"root className\">\n  <div ref=\"virtualizedList\" class=\"virtualizedList\">\n    <div ref=\"itemsContainer\" class=\"itemsContainer\"></div>\n  </div>\n  <div ref=\"generalList\" class=\"generalList\"></div>\n</div>\n";

var css$1 = {"root":"root-term-️cb1d06823d821bc83bbb35855a5f1808","virtualizedList":"virtualizedList-term-️cb1d06823d821bc83bbb35855a5f1808","itemsContainer":"itemsContainer-term-️cb1d06823d821bc83bbb35855a5f1808"};

class VirtualizedList extends TemplateEngine {
    constructor(container, params) {
        super(template$1, container);
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
                    offset = lodashEs.isUndefined(offset) ? itemOffsetStart : offset;
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
            css: Object.assign(Object.assign({}, css$1), { className: params.className || '' }),
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
        if (!lodashEs.isUndefined(this.scrollTimeout))
            clearTimeout(this.scrollTimeout);
        const root = this.getRef('root');
        if (!root)
            return;
        this.scrollTimeout = setTimeout(() => {
            root.scrollTop = root.scrollHeight - root.offsetHeight;
        }, 0);
    }
    destroy() {
        if (!lodashEs.isUndefined(this.scrollTimeout))
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
        if (lodashEs.isUndefined(beforeIndex)) {
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
            const lastItem = lodashEs.last(viewportItems);
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

var template$2 = "<div ref=\"root\" class=\"root\">\n  <div ref=\"input\" class=\"input\" contenteditable=\"true\"></div>\n  <div ref=\"hidden\" class=\"hidden\"></div>\n</div>\n";

var css$4 = {"root":"root-term-️f48df653df791725509e2a00ded23e06","input":"input-term-️f48df653df791725509e2a00ded23e06","hiddenCaret":"hiddenCaret-term-️f48df653df791725509e2a00ded23e06","hidden":"hidden-term-️f48df653df791725509e2a00ded23e06"};

var css$5 = {"secret":"secret-term-️d139f1b48647dd08a4d620b7f948a15f"};

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
        return lodashEs.isString(value)
            ? secret ? BaseInput.convertSecret(value) : value
            : value.reduce((acc, item) => {
                const str = lodashEs.isString(item) ? item : item.str;
                const val = secret && (lodashEs.isString(item) || !item.lock)
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
        return escapeString(str).replace(/\s/g, NON_BREAKING_SPACE);
    }
    static getValueFragmentTemplate(valueFragment, index, params = {}) {
        const { secret } = params;
        if (lodashEs.isString(valueFragment)) {
            return BaseInput.getFragmentTemplate(valueFragment, { index, secret });
        }
        const { str, className = '', lock } = valueFragment;
        const isSecret = !lock && secret;
        return BaseInput.getFragmentTemplate(str, { className, index, secret: isSecret });
    }
    static getValueTemplate(value, params = {}) {
        if (lodashEs.isString(value))
            return BaseInput.getNormalizedTemplateString(value);
        return value.reduce((acc, item, index) => {
            return `${acc}${BaseInput.getValueFragmentTemplate(item, index, params)}`;
        }, '');
    }
    static getUpdatedValueField(value, prevValue) {
        if (lodashEs.isString(prevValue))
            return value;
        let checkValue = value;
        let stop = false;
        const updatedValueField = prevValue.reduce((acc, item) => {
            const isStringItem = lodashEs.isString(item);
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
        return updatedValueField.filter(item => lodashEs.isString(item) ? item : item.str);
    }
    static getLockString(value) {
        if (lodashEs.isString(value))
            return '';
        let str = '';
        let lockStr = '';
        value.forEach((item) => {
            if (lodashEs.isString(item)) {
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
        if (lodashEs.isString(valueField))
            return index ? '' : valueField;
        const item = valueField[index];
        if (!item)
            return '';
        return lodashEs.isString(item) ? item : item.str;
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
        if (lodashEs.isString(valueField))
            return null;
        const dataIndex = element.getAttribute(DATA_INDEX_ATTRIBUTE_NAME);
        const valueFieldItem = dataIndex ? valueField[Number(dataIndex)] : null;
        return !valueFieldItem || lodashEs.isString(valueFieldItem)
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
        super(template$2, container, css$4);
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
        const data = lodashEs.unescape(root.innerHTML);
        const items = data.replace(/<\/span>[^<]*</g, '</span><').split('</span>').filter(lodashEs.identity);
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
        if (lodashEs.isString(valueField))
            return false;
        const value = this.getInputValue();
        const lockStr = BaseInput.getLockString(valueField);
        const deleteUnlockPart = lockStr
            && lockStr.indexOf(value) === 0
            && lockStr.length > value.length;
        if (deleteUnlockPart) {
            const lastLockIndex = this.valueField
                .reduce((acc, item, index) => {
                return !lodashEs.isString(item) && item.lock ? index : acc;
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

var template$3 = "<div ref=\"root\">\n  <div ref=\"input\" class=\"root\">{value}</div>\n</div>\n";

var css$6 = {"root":"root-term-️457efebe90f812d594ffccb8790b07ab"};

class ViewableInput extends BaseInput {
    set value(val) {
        this.valueField = val;
        const root = this.getRef('input');
        if (root)
            root.innerHTML = BaseInput.getValueTemplate(this.valueField);
    }
    constructor(container) {
        super(template$3, container, css$6);
    }
    render() {
        super.render({ css: css$6, value: BaseInput.getValueTemplate(this.valueField) });
    }
    getRootElement() {
        return this.getRef('input');
    }
}

var css$7 = {"label":"label-term-️679afd4849096768cfa38bb85a2048b8","labelTextContainer":"labelTextContainer-term-️679afd4849096768cfa38bb85a2048b8","labelText":"labelText-term-️679afd4849096768cfa38bb85a2048b8"};

var template$4 = "<if condition=\"{label || delimiter}\">\n  <div class=\"label\">\n    <if condition=\"{label}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"label\">{label}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n    <if condition=\"{delimiter}\">\n      <div class=\"labelTextContainer\">\n        <span class=\"labelText\" ref=\"delimiter\">{delimiter}</span>\n      </div>\n      <div>\n        <span class=\"labelText\">{nbs}</span>\n      </div>\n    </if>\n  </div>\n</if>\n\n";

class Label extends TemplateEngine {
    constructor(container, params = {}) {
        super(template$4, container);
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
        this.onSubmit = lodashEs.noop;
        this.onChange = lodashEs.noop;
        this.onUpdateCaretPosition = lodashEs.noop;
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
            }[Number(getKeyCode(e))] || lodashEs.noop)(e);
        };
        this.submitHandler = (e) => {
            const { onSubmit, inputField, secret } = this;
            const value = (inputField === null || inputField === void 0 ? void 0 : inputField.value) || '';
            let formattedValue = '';
            if (lodashEs.isString(value)) {
                formattedValue = secret ? '' : value;
            }
            else if (lodashEs.isArray(value)) {
                formattedValue = secret ? value.filter(item => lodashEs.get(item, 'lock')) : value;
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
        const { onUpdateCaretPosition = lodashEs.noop, onChange = lodashEs.noop, onSubmit = lodashEs.noop, editable = true, className = '', value, secret = false, } = params;
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

const checkArraysEqual = (first, second) => first.length === second.length && first.every(item => second.includes(item));

class KeyboardShortcutsManager {
    constructor(params = {}, unlockKey) {
        this.layerField = 1;
        this.shortcutsMapField = {};
        this.listeners = {};
        this.isLock = false;
        this.lockWhiteList = [];
        this.actionHandler = params.onAction;
        this.unlockKey = unlockKey || uuid.v1();
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
        if (lodashEs.isNumber(shortcut)) {
            normalizedShortcut.codes = [shortcut];
        }
        else if (lodashEs.isArray(shortcut) && lodashEs.isNumber(shortcut[0])) {
            normalizedShortcut.codes = shortcut;
        }
        else {
            normalizedShortcut.codes = lodashEs.isArray(shortcut.code)
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
            this.emitter = new keyLayersJs.Emitter(this.layerField);
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
        return lodashEs.isString(descriptor)
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
        super(template, container);
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
            if (!lodashEs.isUndefined(label)) {
                currentParams.label = label;
                isUpdated = true;
            }
            if (!lodashEs.isUndefined(delimiter)) {
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
                const str = lodashEs.isString(data) ? data : data.str;
                const millisecondCharactersCount = str.length / duration;
                let milliseconds = 0;
                const updatingValue = lodashEs.isString(data) ? { str: data } : Object.assign(Object.assign({}, data), { str: '' });
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
                ref, append, delimiter, label, editable: false, value: lines[index], className: css.line,
            }) : null;
        };
        this.heightGetter = (index) => {
            const { heightCache, itemSize, lines, params: { delimiter, label, size, scrollbarSize }, } = this;
            if (lodashEs.isUndefined(heightCache[index])) {
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
            const { width, height } = lodashEs.get(entries, '[0].contentRect');
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
            if (historyValue && lodashEs.last(list) !== historyValue && !(editLine === null || editLine === void 0 ? void 0 : editLine.secret))
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
            header === null || header === void 0 ? void 0 : header.classList.remove(css.hidden);
        }
        else {
            header === null || header === void 0 ? void 0 : header.classList.add(css.hidden);
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
            const value = lodashEs.isUndefined(original) ? editLine.value : original;
            editLine.value = lodashEs.isArray(value) ? [...value, data] : [value, data];
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
        this.render({ css, header, hidden: header ? '' : css.hidden });
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
            className: [css.line, css.editLine].join(' '),
            value: lodashEs.isArray(editLineParams) || lodashEs.isString(editLineParams)
                ? editLineParams : editLineParams.value,
            editable: true,
            onSubmit: this.submitHandler,
            onChange: this.changeHandler,
            onUpdateCaretPosition: this.updateCaretPositionHandler,
            secret: lodashEs.get(editLineParams, 'secret') || false,
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
                if (lodashEs.isObject(params) && !lodashEs.isArray(params)) {
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

exports.KeyboardShortcutsManager = KeyboardShortcutsManager;
exports.Plugin = Plugin;
exports.TemplateEngine = TemplateEngine;
exports.Term = Term;
//# sourceMappingURL=index.js.map
