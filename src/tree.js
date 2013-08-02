var utils = require('./utils');

function Tree (leaf, children, optionalOptions) {
  this.leaf     = leaf;
  this.children = children;
  this.options  = optionalOptions || { };
  this.maxWidth = this.options.maxWidth || 3;
}

Tree.prototype._arrayOfEnvelopes = function (child) {
  var array = [ ];

  if (child.leaf) {
    array.push(utils.envelope(child.leaf));
  }

  if (Array.isArray(child)) {
    for (var i = 0; i < child.length; i++) {
      array = array.concat(this._arrayOfEnvelopes(child[i]));
    }
  } else {
    if (child.children && child.children.length) {
      array = array.concat(this._arrayOfEnvelopes(child.children));
    }
  }
  return array;
};

Tree.prototype.envelope = function () {
  return utils.envelopeFromEnvelopes(this._arrayOfEnvelopes(this));
};

Tree.prototype.depth = function () {
  return utils.array_depth(this.children) + 1;
};

Tree.prototype.add = function (leaf) {
  // if geojson, create a real leaf
  if (leaf instanceof Tree === false) {
    leaf = new Tree(leaf, null, this.options);
  }

  // if we already have a leaf, it's time to start creating children
  if (this.leaf) {
    var child = new Tree(this.leaf, null, this.options);
    this.leaf = null;

    this.children = [ child, leaf ];
  } else {
    // otherwise add the child
    if (this.children.length < this.maxWidth) {
      // if we aren't at the maximum, add this child
      this.children.push(leaf);
    } else {
      // otherwise we need to figure out where to put it
      var which,
          envelope = leaf.envelope();
      for (var i = 0; i < this.children.length; i++) {
        if (utils.envelopeWithinEnvelope(envelope, this.children[i].envelope())) {
          // a child already has an envelope to add to
          this.children[i].add(leaf);
          return;
        }
      }
    }
  }
};



module.exports = exports = Tree;