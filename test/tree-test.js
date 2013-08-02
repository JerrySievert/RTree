var vows   = require('vows'),
    assert = require('assert'),
    Tree   = require('../src/Tree');

vows.describe('Tree').addBatch({
  'When a Tree is created': {
    topic: function () {
      var child1 = new Tree({
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

      var child2 = new Tree({
        "type": "Polygon",
        "coordinates": [
          [
            [ 10, 10 ],
            [ 10, 15 ],
            [ 15, 15 ],
            [ 15, 10 ],
            [ 10, 10 ]
          ]
        ]
      });

      var tree = new Tree(null, [ child1, child2 ]);

      return tree;
    },
    'the correct envelope is calculated': function (topic) {
      var envelope = topic.envelope();

      assert.equal(envelope.x, 1);
      assert.equal(envelope.y, 1);
      assert.equal(envelope.w, 14);
      assert.equal(envelope.h, 14);
    }
  },
  'When a Tree is created that also has a leaf': {
    topic: function () {
      var child1 = new Tree({
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

      var child2 = new Tree({
        "type": "Polygon",
        "coordinates": [
          [
            [ 10, 10 ],
            [ 10, 15 ],
            [ 15, 15 ],
            [ 15, 10 ],
            [ 10, 10 ]
          ]
        ]
      });

      var leaf = {
        "type": "Polygon",
        "coordinates": [
          [
            [ 20, 20 ],
            [ 20, 40 ],
            [ 40, 40 ],
            [ 40, 20 ],
            [ 20, 20 ]
          ]
        ]
      };

      var tree = new Tree(leaf, [ child1, child2 ]);

      return tree;
    },
    'the correct envelope is calculated': function (topic) {
      var envelope = topic.envelope();

      assert.equal(envelope.x, 1);
      assert.equal(envelope.y, 1);
      assert.equal(envelope.w, 39);
      assert.equal(envelope.h, 39);
    },
    'the correct depth is calculated': function (topic) {
      assert.equal(topic.depth(), 2);
    },
    'the correct depth of each child is calculated': function (topic) {
      assert.equal(topic.children[0].depth, 1);
      assert.equal(topic.children[1].depth, 1);
    }
  }
}).export(module);