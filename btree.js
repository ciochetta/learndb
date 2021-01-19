BTreeNode = function (value, add) {
	return {
		value,
		left: null,
		right: null,
		parent: null,
		add: add,
	};
};

BTree = function (rootNode) {
	return {
		root: rootNode,

		insert: function (newNode) {
			this._insert(newNode, this.root);
		},
		_insert: function (newNode, currentNode) {
			if (currentNode === null) {
				return (this.root = newNode);
			}
			if (newNode.value > currentNode.value) {
				if (currentNode.right !== null) {
					this._insert(newNode, currentNode.right);
				} else {
					currentNode.right = newNode;
					newNode.parent = currentNode;
					this.rebalance(currentNode.parent);
				}
			} else if (newNode.value < currentNode.value) {
				if (currentNode.left != null) {
					this._insert(newNode, currentNode.left);
				} else {
					currentNode.left = newNode;
					newNode.parent = currentNode;
					this.rebalance(currentNode.parent);
				}
			} else if (newNode.value == currentNode.value) {
				if (currentNode.count === undefined) {
					currentNode.count = 2;
				} else {
					currentNode.count++;
				}
			}
		},
		find: function (value) {
			return this._find(value, this.root);
		},
		_find: function (value, currentNode) {
			if (currentNode === undefined || currentNode === null) {
				return undefined;
			} else if (currentNode.value === value) {
				return currentNode;
			} else if (value < currentNode.value) {
				return this._find(value, currentNode.left);
			} else if (value > currentNode.value) {
				return this._find(value, currentNode.right);
			}
		},
		search: function (comparingFunction, blockingFunction) {
			return this._search(comparingFunction, blockingFunction, this.root, []);
		},
		_search: function (
			comparingFunction,
			blockingFunction,
			currentNode,
			result
		) {
			if (currentNode.left !== null && currentNode.left !== undefined) {
				if (!blockingFunction(currentNode.value, currentNode.left.value)) {
					result = [
						...result,
						...this._search(
							comparingFunction,
							blockingFunction,
							currentNode.left,
							[]
						),
					];
				}
			}

			if (comparingFunction(currentNode.value)) {
				if (currentNode.count === undefined) {
					result = [...result, currentNode.value];
				} else {
					insertArray = [];

					for (let i = 0; i < currentNode.count; i++) {
						insertArray = [...insertArray, currentNode.value];
					}

					result = [...result, ...insertArray];
				}
			}

			if (currentNode.right !== null && currentNode.right !== undefined) {
				if (!blockingFunction(currentNode.value, currentNode.right.value)) {
					result = [
						...result,
						...this._search(
							comparingFunction,
							blockingFunction,
							currentNode.right,
							[]
						),
					];
				}
			}

			return result;
		},
		delete: function (value) {
			let node = typeof value === "number" ? this.find(value) : value;

			if (node === undefined || node === null) {
				return {
					err: `Could not find a node with value ${value}`,
				};
			}

			this._delete(node);
		},
		_delete: function (node) {
			if (node.count !== undefined) {
				node.count -= 1;

				if (node.count === 1) {
					node.count = undefined;
				}

				return;
			}

			let parent = node.parent;

			if (parent === null) {
				this.root = null;
			}

			// case 1: node is a leaf
			if (node.left === null && node.right === null) {
				this._deleteLeaf(node);
			} // case 2: node with one child
			else if (
				(node.left !== null && node.right === null) ||
				(node.left === null && node.right !== null)
			) {
				this._deleteNodeWithOneChild(node);
			} // case 3: node has two children
			else {
				var replacementNode = this.max(node.left);
				this.swap(node, replacementNode);
				this._delete(node);
			}
		},
		_deleteLeaf: function (node) {
			let parent = node.parent;

			if (parent === null) {
				return;
			}

			if (parent.right === node) {
				parent.right = null;
			} else {
				parent.left = null;
			}

			this.rebalance(parent);
		},
		_deleteNodeWithOneChild(node) {
			let child = node.left || node.right;
			let parent = node.parent;

			if (parent !== null) {
				if (parent.right === node) {
					parent.right = child;
				} else {
					parent.left = child;
				}
				child.parent = parent;
				this.rebalance(parent);
			} else {
				child.parent = null;
				this.root = child;
			}
		},
		rebalance: function (node) {
			if (node === undefined || node === null) {
				return;
			}

			const height_left = this.height(node.left);
			const height_right = this.height(node.right);

			const diff = height_left - height_right;

			if (diff === 2) {
				var child = node.left;

				if (this.height(child.right) > this.height(child.left)) {
					this.rotateLeft(child);
					node.left = child.parent;
				}

				this.rotateRight(node);
			} else if (diff === -2) {
				var child = node.right;

				if (this.height(child.left) > this.height(child.right)) {
					this.rotateRight(child);
					node.right = child.parent;
				}

				this.rotateLeft(node);
			}

			this.rebalance(node.parent);
		},
		height: function (node) {
			if (node === undefined || node === null) {
				return 0;
			}

			return 1 + Math.max(this.height(node.left), this.height(node.right));
		},
		rotateLeft: function (node) {
			let parent = node.parent;
			let child = node.right;
			let child_left_child = child.left;

			child.parent = parent;
			if (parent) {
				if (parent.right === node) {
					parent.right = child;
				} else if (parent.left === node) {
					parent.left = child;
				}
			}
			child.left = node;

			node.parent = child;
			node.right = child_left_child;
			if (child_left_child) {
				child_left_child.parent = node;
			}

			if (!parent) {
				this.root = child;
			}
		},
		rotateRight: function (node) {
			let parent = node.parent;
			let child = node.left;
			let child_right_child = child.right;

			child.parent = parent;
			if (parent) {
				if (parent.right === node) {
					parent.right = child;
				} else if (parent.left === node) {
					parent.left = child;
				}
			}
			child.right = node;

			node.parent = child;
			node.left = child_right_child;
			if (child_right_child) {
				child_right_child.parent = node;
			}

			if (!parent) {
				this.root = child;
			}
		},
		swap: function (node1, node2) {
			var node1parent = node1.parent;
			var node1left = node1.left;
			var node1right = node1.right;

			var node2parent = node2.parent;
			var node2left = node2.left;
			var node2right = node2.right;

			// connect nodes surrounding node1 and node2 to new nodes
			if (node1parent) {
				if (node1parent.right === node1) {
					node1parent.right = node2;
				} else {
					node1parent.left = node2;
				}
			}
			if (node1left) {
				node1left.parent = node2;
			}
			if (node1right) {
				node1right.parent = node2;
			}

			if (node2parent) {
				if (node2parent.right === node2) {
					node2parent.right = node1;
				} else {
					node2parent.left = node1;
				}
			}
			if (node2left) {
				node2left.parent = node1;
			}
			if (node2right) {
				node2right.parent = node1;
			}

			// now connect node1 and node2 to their correct surroundings
			node2.parent = node1parent !== node2 ? node1parent : node1;
			node2.right = node1right !== node2 ? node1right : node1;
			node2.left = node1left !== node2 ? node1left : node1;

			node1.parent = node2parent !== node1 ? node2parent : node2;
			node1.right = node2right !== node1 ? node2right : node2;
			node1.left = node2left !== node1 ? node2left : node2;

			if (node1.parent === null) {
				this.root = node1;
			} else if (node2.parent === null) {
				this.root = node2;
			}
		},
		max(currentNode) {
			return this._max(currentNode || this.root);
		},
		_max: function (currentNode) {
			return currentNode.right ? this._max(currentNode.right) : currentNode;
		},
		toIndexJson: function () {
			return this._toIndexJson(this.root);
		},
		_toIndexJson: function (currentNode) {
			return {
				value: currentNode.value,
				count: currentNode.count,
				add: currentNode.add || null,
				right:
					currentNode.right !== null
						? this._toIndexJson(currentNode.right)
						: null,
				left:
					currentNode.left !== null
						? this._toIndexJson(currentNode.left)
						: null,
			};
		},
	};
};

const IndexJsonToBTree = function (indexJson) {
	return BTree(_IndexJsonToBTree(indexJson, null));
};

const _IndexJsonToBTree = function (currentNodeJson, parent) {
	if (currentNodeJson === null) {
		return null;
	}

	let node = BTreeNode(currentNodeJson.value, currentNodeJson.add);

	node.parent = parent;
	node.count = currentNodeJson.count;

	if (currentNodeJson.left !== null) {
		node.left = _IndexJsonToBTree(currentNodeJson.left, node);
	}

	if (currentNodeJson.right !== null) {
		node.right = _IndexJsonToBTree(currentNodeJson.right, node);
	}

	return node;
};

const DatabaseFileToIndexBTree = function (dbFile, valueKey, addKey) {
	let bTree = BTree(null);

	dbFile.forEach((row) => {
		if (addKey !== undefined) {
			bTree.insert(BTreeNode(row[valueKey], row[addKey]));
		} else {
			bTree.insert(BTreeNode(row[valueKey], null));
		}
	});

	return bTree;
};

module.exports = {
	BTree,
	BTreeNode,
	IndexJsonToBTree,
	DatabaseFileToIndexBTree,
};
