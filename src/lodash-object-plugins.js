/**
 * Created by Omry_Nachman on 12/23/14.
 */
"use strict";

var added = {
  /**
   * @lent _
   * @param {Object} object and object to traverse
   * @param {Function} callback will be called for each node with (value, keysAsArray)
   * @param {Array} [keys=[]] added prefix keys
   */
  traverse: function traverse(object, callback, keys) {
    traverse.STOP = "STOP";
    traverse.SKIP_CHILDREN = "SKIP_CHILDREN";
    keys = keys || [];
    var finished = callback(object, keys);

    switch (finished) {
      case traverse.STOP:
        return traverse.STOP;
      case traverse.SKIP_CHILDREN:
        return;
    }

    _.forEach(object, function (val, key) {
      if (finished !== traverse.STOP) {
        var withCurrentKey = _.flatten([keys, key]);
        if (_.isString(val)) {
          callback(val, withCurrentKey);
        } else {
          finished = traverse(val, callback, withCurrentKey);
        }
      }
    });

    return finished;
  },
  /**
   * @lent _
   * @param {Object} object an object to
   * @param {Array|String} keys if a string is provided, it will be converted using split('.')
   * @param {*} value
   * @param {Boolean} [noOverride=false]
   */
  setValue: function setValue(object, keys, value, noOverride) {
    if (!_.isArray(keys)) {
      keys = keys.split('.');
    }
    var lastKey = _.last(keys);
    _(keys).first(keys.length - 1).forEach(function (key, index) {
      if (!_.isObject(object[key])) {
        if (noOverride && key in object) {
          throw new Error('Override error: {object}.' + _.first(keys, index + 1).join('.') + ' = ' + value);
        }
        object[key] = {};
      }
      object = object[key];
    });
    object[lastKey] = value;
  },
  /**
   * @lent _
   * @param{Object} object to traverse
   * @param {Array|String} keys if a string is provided, it will be converted using split('.')
   * @returns {*}
   */
  getValue: function getValue(object, keys, defaultValue) {
    if (_.isObject(object)) {
      if (!_.isArray(keys)) {
        keys = _.compact(keys.split('.'));
      }
      _.every(keys, function (key) {
        if (key in object) {
          object = object[key];
          return true;
        } else {
          object = defaultValue;
        }
      });
    }

    return object === undefined ? defaultValue : object;
  },

  /**
   *
   * @param {Object} object
   * @param {Object} defaults
   * @returns {Object} A deep union of object and defaults where fields of objects are preferred
   */
  defaultsDeep: function defaultsDeep(object, defaults) {
    var res = _.cloneDeep(defaults);
    object = object || {};
    added.traverse(object, function (val, keys) {
      if (!_.isPlainObject(val)) {
        _.setValue(res, keys, val);
      }
    });
    return res;
  }
};

var _ = require('_');
_.mixin(added);

module.exports = _;
