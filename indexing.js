const {
	getTable,
	getDatabaseName,
	getTableMetadata,
	setTableMetadata,
} = require("./database");

const { DatabaseFileToIndexBTree, IndexJsonToBTree } = require("./btree");

const fs = require("fs");

indexes = {};

const getIndex = function (tableName, indexName) {
	if (indexes[`${tableName}_${indexName}`] !== undefined) {
		return indexes[`${tableName}_${indexName}`];
	}

	indexPath = `./${getDatabaseName()}_${tableName}_${indexName}.ldbi`;

	if (fs.existsSync(indexPath)) {
		const rawIndex = fs.readFileSync(indexPath);

		const indexJson = JSON.parse(rawIndex);

		indexes[`${tableName}_${indexName}`] = IndexJsonToBTree(indexJson);

		return IndexJsonToBTree(indexJson);
	} else {
		return {
			err: `ERROR: could not find an index with name ${indexName}`,
		};
	}
};

const createIndex = function (indexOptions) {
	let { columns, table, name } = indexOptions;

	let rows = getTable(table);

	let btreeIndex;

	if (columns.length > 1) {
		btreeIndex = DatabaseFileToIndexBTree(rows, columns[0], columns[1]);
	} else {
		btreeIndex = DatabaseFileToIndexBTree(rows, columns[0], null);
	}

	saveIndex(btreeIndex, table, name);

	let tableMetadata = getTableMetadata(table);

	tableMetadata.indexes = [
		...tableMetadata.indexes,
		{ name: name, columns: columns },
	];

	setTableMetadata(table, tableMetadata);

	return 0;
};

const saveIndex = function (btreeIndex, table, name) {
	const serializedBtree = btreeIndex.toIndexJson();

	const indexPath = `./${getDatabaseName()}_${table}_${name}.ldbi`;

	fs.writeFileSync(indexPath, JSON.stringify(serializedBtree));
};

module.exports = { createIndex, getIndex, saveIndex };
