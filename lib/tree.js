// TREES

function Tree(val, left, right) {
  return function(destructureNode, _) {
    return destructureNode(val, left, right);
  }
}

function Empty(_, destructureEmpty) {
  return destructureEmpty();
}

function search(toFind, tree) {
  return tree(function(val, left, right) {
    if (toFind === val) {
      return true;
    } else if (toFind < val) {
      return search(toFind, left);
    } else {
      return search(toFind, right);
    }
  }, function() {
    return false;
  });
}

function min(tree) {
  return tree(function(val, left, right) {
    return left(function(_val, _left, _right) {
      return min(left);
    }, function() {
      return tree;
    });
  }, function() {
    throw new Error('No min node in empty tree');
  });
}

function max(tree) {
  return tree(function(val, left, right) {
    return right(function(_val, _left, _right) {
      return max(right);
    }, function() {
      return tree;
    });
  }, function() {
    throw new Error('No max node in empty tree');
  });
}

function insert(toInsert, tree) {
  return tree(function(val, left, right) {
    if (toInsert <= val) {
      return Tree(val, insert(toInsert, left), right);
    } else {
      return Tree(val, left, insert(toInsert, right));
    }
  }, function() {
    return Tree(toInsert, Empty, Empty);
  });
}

function removeMax(tree) {
  return tree(function(val, left, right) {
    return right(function(_val, _left, _right) {
      return Tree(val, left, removeMax(right));
    }, function() {
      return left;
    });
  }, function() {
    return Empty;
  });
}

function removeMin(tree) {
  return tree(function(val, left, right) {
    return left(function(_val, _left, _right) {
      return Tree(val, removeMin(left), right);
    }, function() {
      return right;
    });
  }, function() {
    return Empty;
  });
}

function replaceRemoved(tree, left, right) {
  return tree(function(val, _left, _right) {
    return Tree(val, left, removeMin(right));
  }, function() {
    return left;
  });
}

function remove(toRemove, tree) {
  return tree(function(val, left, right) {
    if (toRemove === val) {
      return replaceRemoved(min(right), left, right);
    } else if (toRemove < val) {
      return Tree(val, remove(toRemove, left), right);
    } else {
      return Tree(val, left, remove(toRemove, right));
    }
  }, function() {
    return tree;
  });
}

function toObject(tree) {
  return tree(function(val, left, right) {
    return {
      key : val,
      left : toObject(left),
      right : toObject(right)
    };
  }, function() {
    return 'Empty';
  });
}

const tree = Tree(8, Empty, Empty);
console.log('tree: ', toObject(tree));
const tree2 = insert(12, insert(1, insert(7, insert(3, insert(10, tree)))));
console.log('tree2: ', toObject(tree2));
console.log('find 3: ' + search(3, tree2));
console.log('find 11: ' + search(11, tree2));
console.log('min: ', toObject(min(tree2)));
console.log('max: ', toObject(max(tree2)));
console.log('remove 3: ', toObject(remove(3, tree2)));
console.log('removeMin: ', toObject(removeMin(tree2)));