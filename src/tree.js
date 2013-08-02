var utils = require('./utils');

function Tree (leaf, children, optionalOptions) {
  this.leaf     = leaf;
  this.children = children;
  this.options  = optionalOptions || { };
  this.maxWidth = this.options.maxWidth || 3;
}

Tree.prototype._arrayOfEnvelopes = function (child) {
  if (Array.isArray(child)) {
    var array = [ ];

    for (var i = 0; i < child.length; i++) {
      array = array.concat(this._arrayOfEnvelopes(child[i]));
    }

    return array;
  } else {
    return utils.envelope(child.leaf);
  }
};

Tree.prototype.envelope = function () {
  return utils.envelopeFromEnvelopes(this._arrayOfEnvelopes(this.children));
};

module.exports = exports = Tree;