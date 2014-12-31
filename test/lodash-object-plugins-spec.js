/**
 * Created by Omry_Nachman on 12/23/14.
 */
"use strict";
var _ = require('../src/lodash-object-plugins');

describe("lodash-object-plugins", function () {
  describe("_.traverse", function () {
    it("should call all the nodes of an object", function () {
      var object = {
        a: {
          b: {v: 1, g: 'hello'},
          f: [1, 2, 3]
        },
        b: {}
      };
      var cb = jasmine.createSpy('cb');
      _.traverse(object, cb);
      expect(cb).toHaveBeenCalledWith(object, []);
      expect(cb).toHaveBeenCalledWith(object.a, ['a']);
      expect(cb).toHaveBeenCalledWith(object.a.b, ['a', 'b']);
      expect(cb).toHaveBeenCalledWith(object.a.b.v, ['a', 'b', 'v']);
      expect(cb).toHaveBeenCalledWith(object.a.b.g, ['a', 'b', 'g']);
      expect(cb).toHaveBeenCalledWith(object.a.f, ['a', 'f']);
      expect(cb).toHaveBeenCalledWith(object.a.f[0], ['a', 'f', 0]);
      expect(cb).toHaveBeenCalledWith(object.b, ['b']);
    });
  });

  describe("_.setValue", function () {
    describe("default behavior", function () {
      it("should set the value in the path given by keys as a string", function () {
        var object = {};
        _.setValue(object, 'a.b.c', 'value');
        expect(object).toEqual({a: {b: {c: 'value'}}});
      });

      it("should set the value in the path given by keys as an array", function () {
        var object = {};
        _.setValue(object, ['a', 'b', 'c'], 'value');
        expect(object).toEqual({a: {b: {c: 'value'}}});
      });

      it("should override values that get in the way", function () {
        var object = {a: 4};
        _.setValue(object, 'a.b.c', 'value');
        expect(object).toEqual({a: {b: {c: 'value'}}});
      });
    });
    describe("with noOverride", function () {
      it("should NOT override values that get in the way", function () {
        var object = {a: 4};
        expect(_.setValue.bind(_, object, 'a.b.c', 'value', true)).toThrow(new Error('Override error: {object}.a = value'));
        expect(object).toEqual({a: 4});
      });
    });
  });

  describe("_.getValue", function () {
    it("should return the value at a given path", function () {
      var object = {
        a: {
          b: {v: 1, g: 'hello'},
          f: [1, 2, 3]
        },
        b: {}
      };
      expect(_.getValue(object, 'a.f.1')).toBe(2);
      expect(_.getValue(object, '')).toEqual(object);
      expect(_.getValue(object, 'a.b.g')).toEqual('hello');
      expect(_.getValue(object, 'a.some.wrong.path')).not.toBeDefined();
    });
  });

  describe("_.defaultsDeep", function () {
    it("should return a union object", function () {
      expect(_.defaultsDeep({a: {b: {c: 1}}}, {a: {b: {d: 2}}})).toEqual({
        a: {
          b: {
            c: 1, d: 2
          }
        }
      });
    });
    it('should prefer object over default', function(){
      expect(_.defaultsDeep({a: {b: {c: 1}}}, {a: {b: {c: 2}}})).toEqual({
        a: {
          b: {
            c: 1
          }
        }
      });
    });
  });
});