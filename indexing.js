const { getTable } = require("./database");
const { BTree } = require("./btree");

const createIndex = function (tableName) {
	const rows = getTable(tableName);

	rows.forEach((row) => {
		let node = BTree(row);

		console.log(node);
	});

	let result = [];
};

module.exports = { createIndex };
