/*!
  Copyright (c) 2017 Jed Watson.
  Licensed under the MIT License (MIT), see
  https://github.com/jason90929/observer
*/
/* global define */

(function () {
  'use strict';

  var Observer = function () {
    this.events = {};
  };

  Observer.prototype.subscribe = function(type, callback) {
    if (!this.events.hasOwnProperty(type)) {
      this.events[type] = callback;
    }
    return this;
  };

  Observer.prototype.unsubscribe = function(type) {
    delete this.events[type];
    return this;
  };

  Observer.prototype.emit = function(type) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.events.hasOwnProperty(type)) {
      const event = this.events[type];
      event.apply(null, args);
      return true;
    }
    return false;
  };

  if (typeof module !== 'undefined' && module.exports) {
    Observer.default = Observer;
    module.exports = Observer;
  } else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
    // register as 'Observer', consistent with npm package name
    define('Observer', [], function () {
      return Observer;
    });
  } else {
    window.Observer = Observer;
  }
}());
