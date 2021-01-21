let {
	getTable,
	getTableMetadata,
	setTable,
	saveTable,
} = require("../database");

const executeBulkInsert = function (params) {
	const { documents, table } = params;

	try {
		bulkInsert(documents, table);
		return "Objects inserted with success";
	} catch (error) {
		return error;
	}
};

const bulkInsert = function (documents, table) {
	const tableMetadata = getTableMetadata(table);

	const tableRows = getTable(table);

	const insertDocuments = createInsertDocuments(tableMetadata.keys, documents);

	newTableRows = [...tableRows, ...insertDocuments];

	saveTableToDisk(table, newTableRows);
};

const saveTableToDisk = function (table, tableRows) {
	setTable(table, newTableRows);
	saveTable(table, newTableRows);
};

const createInsertDocuments = function (keys, documents) {
	insertDocuments = [];

	documents.forEach((document) => {
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

		insertDocuments.push(insertObj);
	});

	return insertDocuments;
};

module.exports = {
	name: "BULK INSERT",
	execute: executeBulkInsert,
};
