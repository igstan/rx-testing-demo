;(function (global) {
  var Rx            = global.Rx;
  var TestScheduler = Rx.TestScheduler;
  var assertEqual   = Rx.CollectionAssert.assertEqual;
  var onNext        = Rx.ReactiveTest.onNext;
  var onError       = Rx.ReactiveTest.onError;
  var onCompleted   = Rx.ReactiveTest.onCompleted;
  var subscribe     = Rx.ReactiveTest.subscribe;

  QUnit.module('Data Point Aggregation', {
    setup: function () {
      this.scheduler = new TestScheduler();
    }
  });

  test('filter stream of data points based on selected tags', function () {
    // Model the user selecting new tags in the UI. A new tag is selected
    // each 100 time units.
    var selectedTags = this.scheduler.createHotObservable(
      onNext(210, ['tag-001']),
      onNext(310, ['tag-001', 'tag-002']),
      onNext(410, ['tag-001', 'tag-002', 'tag-003']),
      onCompleted(420)
    );

    var dataPoints = this.scheduler.createHotObservable(
      onNext(200, { name: 'tag-001' }),
      onNext(210, { name: 'tag-002' }),
      onNext(220, { name: 'tag-003' }),
      onNext(230, { name: 'tag-001' }),
      onNext(240, { name: 'tag-002' }),
      onNext(250, { name: 'tag-003' }),

      onNext(310, { name: 'tag-001' }),
      onNext(320, { name: 'tag-002' }),
      onNext(330, { name: 'tag-003' }),
      onNext(340, { name: 'tag-001' }),
      onNext(350, { name: 'tag-002' }),
      onNext(360, { name: 'tag-003' }),

      onNext(410, { name: 'tag-001' }),
      onNext(420, { name: 'tag-002' }),
      onNext(430, { name: 'tag-003' }),
      onNext(440, { name: 'tag-001' }),
      onNext(450, { name: 'tag-002' }),
      onNext(460, { name: 'tag-003' }),
      onCompleted(470)
    );

    var results = this.scheduler.startWithCreate(function () {
      return selectedTags
        .map(function (tags) {
          return dataPoints.filter(function (d) {
            return tags.indexOf(d.name) > -1;
          });
        })
        .switchLatest()
        .map(function (d) {
          return d.name;
        });
    });

    var expectedMessages = [
      onNext(230, 'tag-001'),
      onNext(310, 'tag-001'),
      onNext(320, 'tag-002'),
      onNext(340, 'tag-001'),
      onNext(350, 'tag-002'),
      onNext(410, 'tag-001'),
      onNext(420, 'tag-002'),
      onNext(430, 'tag-003'),
      onNext(440, 'tag-001'),
      onNext(450, 'tag-002'),
      onNext(460, 'tag-003'),
      onCompleted(470)
    ];

    assertEqual(expectedMessages, results.messages);
  });

})(this);
