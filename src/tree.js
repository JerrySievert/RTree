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

module.exports = exports = Tree;