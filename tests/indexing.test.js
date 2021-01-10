const { BTree, BTreeNode } = require("../btree");

test("create index", () => {
	let root = BTreeNode(5);

	console.log(root);

	let tree = BTree(root);

	tree.insert(BTreeNode(6));
	tree.insert(BTreeNode(9));
	tree.insert(BTreeNode(2));
	tree.insert(BTreeNode(15));
	tree.insert(BTreeNode(30));

	console.log(JSON.stringify(tree.root, null, 3));

	expect(root.value).toBe(5);
});
