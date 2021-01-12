const {
	BTree,
	BTreeNode,
	IndexJsonToBTree,
	DatabaseFileToIndexBTree,
} = require("../btree");
const fs = require("fs");

test("create tree", () => {
	let root = BTreeNode(5);

	let tree = BTree(root);

	tree.insert(BTreeNode(6));

	expect(root.value).toBe(5);
});

test("create tree and delete one node", () => {
	let root = BTreeNode(5);

	let tree = BTree(root);

	tree.insert(BTreeNode(3));
	tree.insert(BTreeNode(6));
	tree.insert(BTreeNode(8));
	tree.insert(BTreeNode(9));
	tree.insert(BTreeNode(12));
	tree.insert(BTreeNode(13));
	tree.insert(BTreeNode(19));
	tree.insert(BTreeNode(45));

	expect(tree.root.value).toBe(8);

	tree.delete(8);

	expect(tree.root.value).toBe(6);

	tree.delete(6);

	expect(tree.root.value).toBe(12);
	expect(tree.root.left.value).toBe(5);
	expect(tree.root.right.value).toBe(19);

	let indexJson = tree.toIndexJson();
});

test("create tree from JSON", async () => {
	const raw = fs.readFileSync("./tests/test_students.json");

	const db = JSON.parse(raw);

	expect(db.length).toBe(1000);

	let fromDbBTree = DatabaseFileToIndexBTree(db, "id");

	let n510 = fromDbBTree.find(510);

	expect(n510.value).toBe(510);
});
