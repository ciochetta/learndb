const {
	getTable,
	getDatabaseName,
	getTableMetadata,
	setTableMetadata,
} = require("./database");

const { DatabaseFileToIndexBTree } = require("./btree");

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

		indexes[`${tableName}_${indexName}`] = indexJson;

		return indexJson;
	} else {
		return {
			err: `ERROR: could not find an index with name ${indexName}`,
		};
	}
};

const createIndex = function (indexOptions) {
	let { columns, table, name } = indexOptions;

	let rows = getTable(table);

	let btreeindex;

	if (columns.length > 1) {
		btreeindex = DatabaseFileToIndexBTree(rows, columns[0], columns[1]);
	} else {
		btreeindex = DatabaseFileToIndexBTree(rows, columns[0], null);
	}

	serializedBtree = btreeindex.toIndexJson();

	indexPath = `./${getDatabaseName()}_${table}_${name}.ldbi`;

	fs.writeFileSync(indexPath, JSON.stringify(serializedBtree));

	let tableMetadata = getTableMetadata(table);

	tableMetadata.indexes = [
		...tableMetadata.indexes,
		{ name: name, columns: columns },
	];

	setTableMetadata(table, tableMetadata);

	return 0;
};

module.exports = { createIndex, getIndex };
