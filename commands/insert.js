let {
	getTable,
	getTableMetadata,
	setTable,
	saveTable,
} = require("../database");

let { getIndex, saveIndex } = require("../indexing");

let { BTreeNode } = require("../btree");

const createInsertObject = function (keys, document) {
	let insertObj = {};
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];

		if (
			!key.nullable &&
			(document[i] === undefined || document[i] === null) &&
			(document[key.name] === undefined || document[key.name] === null)
		) {
			return `ERROR: ${key.name} can not be empty`;
		}

		insertObj[key.name] = document[i] || document[key.name];
	}

	return insertObj;
};

const insertObjectOnTable = function (insertObj, tableName) {
	let tableRows = getTable(tableName);

	if (tableRows.err) {
		return tableRows.err;
	}

	tableRows = [...tableRows, insertObj];

	setTable(tableName, tableRows);
	saveTable(tableName, tableRows);

	return 0;
};

const updateTableIndexes = function (insertObj, tableMetadata) {
	tableMetadata.indexes.forEach((indexMetadata) => {
		const indexObj = getIndex(tableMetadata.name, indexMetadata.name);

		if (indexObj.err) {
			return indexObj;
		}

		const { columns } = indexMetadata;

		let value = insertObj[columns[0]];
		let add = columns.length > 1 ? insertObj[columns[1]] : null;

		indexObj.insert(BTreeNode(value, add));

		saveIndex(indexObj, tableMetadata.name, indexMetadata.name);
	});

	return 0;
};

module.exports = {
	name: "INSERT",
	execute(params) {
		const { document, table } = params;

		let tableMetadata = getTableMetadata(table);

		if (tableMetadata === undefined) {
			return `ERROR: could not find table with name ${table}`;
		}

		let insertObj = createInsertObject(tableMetadata.keys, document);

		let insertAction = insertObjectOnTable(insertObj, tableMetadata.name);

		if (insertAction.err) {
			return insertAction.err;
		}

		let updateIndexAction = updateTableIndexes(insertObj, tableMetadata);

		if (updateIndexAction.err) {
			return updateIndexAction.err;
		}

		return "Object inserted with success";
	},
};
