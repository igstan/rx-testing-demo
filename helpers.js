(function (global) {
  var root = global.Rx;

  // Comparer that checks for equals method before defaulting to standard strict equality
  function defaultComparer(x, y) {
    return (y.equals) ? y.equals(x) : x === y;
  }

  function createMessage(expected, actual) {
    console.debug('Expected:', expected);
    console.debug('Actual:', actual);
    return 'Expected: [' + JSON.stringify(expected) + ']\r\nActual: [' + JSON.stringify(actual) + ']';
  }

  root.CollectionAssert = {
    // Assertion for collections of notification messages
    assertEqual: function (expected, actual, comparer, message) {
      comparer || (comparer = defaultComparer);
      var isOk = true;

      if (expected.length !== actual.length) {
        ok(false, 'Not equal length. Expected: ' + expected.length + ' Actual: ' + actual.length);
        console.debug('Expected:', expected);
        console.debug('Actual:', actual);;
        return;
      }

      for (var i = 0, len = expected.length; i < len; i++) {
        isOk = comparer(expected[i], actual[i]);

        if (!isOk) {
          message = createMessage(expected[i], actual[i]);
          break;
        }
      }

      ok(isOk, message);
    }
  };
})(this);
