/*!
 * Chai - addProperty utility
 * Copyright(c) 2012 Jake Luer <jake@alogicalparadox.com>
 * MIT Licensed
 */

/**
 * ### addProperty (ctx, name, getter)
 *
 * Adds a property to the prototype of an object.
 *
 *     utils.addProperty(chai.Assertion.prototype, 'foo', function () {
 *       var obj = utils.flag(this, 'object');
 *       new chai.Assertion(obj).to.be.instanceof(Foo);
 *     });
 *
 * Can also be accessed directly from `chai.Assertion`.
 *
 *     chai.Assertion.addProperty('foo', fn);
 *
 * Then can be used as any other assertion.
 *
 *     expect(myFoo).to.be.foo;
 *
 * @param {Object} ctx object to which the property is added
 * @param {String} name of property to add
 * @param {Function} getter function to be used for name
 * @name addProperty
 * @api public
 */

module.exports = function (ctx, name, getter) {
  Object.defineProperty(ctx, name,
    { get: function () {
        var newResult, result = getter.call(this);

        result = result === undefined ? this : result;

        if (result !== Object(result) || name === 'to' || name === 'have' || name === 'not') {
            return result;
        }

        newResult = function () {
            return result;
        };

        Object.getOwnPropertyNames(result).forEach(function (key) {
            var functionProtoPD = Object.getOwnPropertyDescriptor(Function.prototype, key);

            // Avoid trying to overwrite things that we can't, like `length` and `arguments`.
            if (functionProtoPD && !functionProtoPD.configurable) return;
            if (key === 'arguments') return; // @see chaijs/chai/issues/69

            Object.defineProperty(newResult, key, Object.getOwnPropertyDescriptor(result, key));
        });

        newResult.__proto__ = Object.getPrototypeOf(result);

        return newResult;
      }
    , configurable: true
  });
};
