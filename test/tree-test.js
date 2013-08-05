var vows   = require('vows'),
    assert = require('assert'),
    Tree   = require('../src/Tree');

vows.describe('Tree').addBatch({
  'When a Tree is created': {
    topic: function () {
      var tree = new Tree();

      tree.add({
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

      tree.add({
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
  'When a Tree is created and a leaf and 2 children are added': {
    topic: function () {
      var tree = new Tree();

      var child1 = {
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

      var child2 = {
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
      };

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

      tree.add(leaf);
      tree.add(child1);
      tree.add(child2);

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
      assert.equal(topic.children[0].depth(), 1);
      assert.equal(topic.children[1].depth(), 1);
    }
  },
  'When a tree is created': {
    'and a child added to it': {
      topic: function () {
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

        var tree = new Tree();
        tree.leaf = leaf;

        return tree;
      },
      'it should have a depth of 2': function (topic) {
        assert.equal(topic.depth(), 1);
      },
      'and an additional child is added as geojson': {
        topic: function (topic) {
          var child = {
            "type": "polygon",
            "coordinates": [
              [
                [ 1, 1 ],
                [ 1, 2 ],
                [ 2, 2 ],
                [ 2, 1 ],
                [ 1, 1 ]
              ]
            ]
          };

          topic.add(child);

          return topic;
        },
        'the leaf should be set to null': function (topic) {
          assert.isNull(topic.leaf);
        },
        'the depth should be two': function (topic) {
          assert.equal(topic.depth(), 2);
        },
        'the number of children should be two': function (topic) {
          assert.equal(topic.children.length, 2);
        },
        'the instanceof each child should be Tree': function (topic) {
          assert.isTrue(topic.children[0] instanceof Tree);
          assert.isTrue(topic.children[1] instanceof Tree);
        }
      }
    }
  },
  'When another tree is created with a leaf': {
    'and maximum children are added to it': {
      topic: function () {
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

        var tree = new Tree();
        tree.leaf = leaf;

        var child1 = {
          "type": "Polygon",
          "coordinates": [
            [
              [ 1, 1 ],
              [ 1, 2 ],
              [ 2, 2 ],
              [ 2, 1 ],
              [ 1, 1 ]
            ]
          ]
        };

        var child2 = {
          "type": "Polygon",
          "coordinates": [
            [
              [ 100, 100 ],
              [ 100, 200 ],
              [ 200, 200 ],
              [ 200, 100 ],
              [ 100, 100 ]
            ]
          ]
        };

        tree.add(child1);
        tree.add(child2);

        return tree;
      },
      'and another child is added': {
        topic: function (topic) {
          var child = {
            "type": "Polygon",
            "coordinates": [
              [
                [ 105, 105 ],
                [ 105, 120 ],
                [ 120, 120 ],
                [ 120, 105 ],
                [ 105, 105 ]
              ]
            ]
          };

          topic.add(child);

          return topic;
        },
        'the child is added to the correct node': function (topic) {
          assert.isNull(topic.leaf);
          assert.equal(topic.children.length, 3);
          assert.equal(topic.children[0].envelope().x, 105);
          assert.equal(topic.children[1].envelope().x, 1);
        }
      }
    }
  }
}).export(module);