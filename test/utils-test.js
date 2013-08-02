var vows   = require('vows'),
    assert = require('assert'),
    utils  = require('../src/utils');

vows.describe('Utils').addBatch({
  'When an envelope is computed': {
    topic: function () {
      var polygon = {
        "type": "Polygon",
        "coordinates": [
          [
            [ 1, 1 ],
            [ 1, 5 ],
            [ 5, 5 ],
            [ 5, 1 ],
            [ 1, 1 ]
          ]
        ]
      };

      return utils.envelope(polygon);
    },
    'it should be correct': function (topic) {
      assert.equal(topic.x, 1);
      assert.equal(topic.y, 1);
      assert.equal(topic.w, 4);
      assert.equal(topic.h, 4);
    },
    'it should be considered within an envelope of the same dimensions': function (topic) {
      var envelope = utils.envelope({
        "type": "Polygon",
        "coordinates": [
          [
            [ 1, 1 ],
            [ 1, 5 ],
            [ 5, 5 ],
            [ 5, 1 ],
            [ 1, 1 ]
          ]
        ]
      });

      assert.isTrue(utils.envelopeWithinEnvelope(topic, envelope));
    },
    'it should be considered within an envelope that consumes it': function (topic) {
      var envelope = utils.envelope({
        "type": "Polygon",
        "coordinates": [
          [
            [ 0, 0 ],
            [ 0, 6 ],
            [ 6, 6 ],
            [ 6, 0 ],
            [ 0, 0 ]
          ]
        ]
      });

      assert.isTrue(utils.envelopeWithinEnvelope(topic, envelope));
    },
    'it should not be considered within an envelope that is smaller than it': function (topic) {
      var envelope = utils.envelope({
        "type": "Polygon",
        "coordinates": [
          [
            [ 2, 2 ],
            [ 2, 4 ],
            [ 4, 4 ],
            [ 4, 2 ],
            [ 2, 2 ]
          ]
        ]
      });

      assert.isFalse(utils.envelopeWithinEnvelope(topic, envelope));
    },
    'a new envelope should be correctly calculated when it is combined with another': function (topic) {
      var envelope = utils.envelope({
        "type": "Polygon",
        "coordinates": [
          [
            [ 6, 6 ],
            [ 6, 10 ],
            [ 10, 10 ],
            [ 10, 6 ],
            [ 6, 10 ]
          ]
        ]
      });

      var calculated = utils.envelopeFromEnvelopes([ topic, envelope ]);

      assert.equal(calculated.w, 9);
      assert.equal(calculated.h, 9);
      assert.equal(calculated.x, 1);
      assert.equal(calculated.y, 1);
    }
  },
  'When an array of envelopes is presented': {
    topic: function () {
      var envelopes = [
        { x: 20, y: 20, w: 20, h: 20 },
        { x: 1, y: 1, w: 4, h: 4 },
        { x: 10, y: 10, w: 5, h: 5 }
      ];

      return envelopes;
    },
    'it should correctly calculate the expanded envelope': function (topic) {
      var envelope = utils.envelopeFromEnvelopes(topic);
      assert.equal(envelope.w, 39);
      assert.equal(envelope.h, 39);
      assert.equal(envelope.x, 1);
      assert.equal(envelope.y, 1);
    }
  }
}).export(module);