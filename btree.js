BTreeNode = function (value) {
	return {
		value,
		left: null,
		right: null,
		parent: null,
	};
};

BTree = function (rootNode) {
	return {
		root: rootNode,
		insert: function (newNode) {
			this._insert(newNode, this.root);
		},
		_insert: function (newNode, currentNode) {
			if (newNode.value > currentNode.value) {
				if (currentNode.right !== null) {
					this._insert(newNode, currentNode.right);
				} else {
					currentNode.right = newNode;
					//newNode.parent = currentNode;
				}
			} else if (newNode.value < currentNode.value) {
				if (currentNode.left != null) {
					this._insert(newNode, currentNode.left);
				} else {
					currentNode.left = newNode;
					//newNode.parent = currentNode;
				}
			}
		},
		find: function (value, currentNode) {
			if (currentNode === undefined || currentNode === null) {
				return undefined;
			} else if (currentNode.value === value) {
				return currentNode;
			} else if (value < currentNode.value) {
				return this.find(value, currentNode.left);
			} else if (value > currentNode.value) {
				return this.find(value, currentNode.right);
			}
		},
	};
};

module.exports = { BTree, BTreeNode };
