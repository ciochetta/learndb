let {
	getTable,
	getTableMetadata,
	setTable,
	saveTable,
} = require("../database");

let { getIndex, saveIndex } = require("../indexing");

let { BTreeNode } = require("../btree");

const executeInsertion = function (params) {
	const { document, table } = params;

	try {
		insert(document, table);

		return "Object inserted with success";
	} catch (error) {
		return error;
	}
};

const insert = function (document, table) {
	let tableMetadata = getTableMetadata(table);

	let insertObj = createInsertObject(tableMetadata.keys, document);

	insertObjectOnTable(insertObj, tableMetadata.name);

	updateTableIndexes(insertObj, tableMetadata);
};

const createInsertObject = function (keys, document) {
	let insertObj = {};
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (
			!key.nullable &&
			(document[i] === undefined || document[i] === null) &&
			(document[key.name] === undefined || document[key.name] === null)
		) {
			throw `ERROR: ${key.name} can not be empty`;
		}

		insertObj[key.name] = document[i] || document[key.name];
	}

	return insertObj;
};

const insertObjectOnTable = function (insertObj, tableName) {
	let tableRows = getTable(tableName);

	tableRows = [...tableRows, insertObj];

	setTable(tableName, tableRows);
	saveTable(tableName, tableRows);
};

const updateTableIndexes = function (insertObj, tableMetadata) {
	tableMetadata.indexes.forEach((indexMetadata) => {
		const indexObj = getIndex(tableMetadata.name, indexMetadata.name);

		const { columns } = indexMetadata;

		let value = insertObj[columns[0]];
		let add = columns.length > 1 ? insertObj[columns[1]] : null;

		indexObj.insert(BTreeNode(value, add));

		saveIndex(indexObj, tableMetadata.name, indexMetadata.name);
	});
};

module.exports = {
	name: "INSERT",
	execute: executeInsertion,
};
