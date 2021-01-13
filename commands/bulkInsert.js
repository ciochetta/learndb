let {
	getTable,
	getTableMetadata,
	setTable,
	saveTable,
} = require("../database");

module.exports = {
	name: "BULK INSERT",
	execute(params) {
		const { documents, table } = params;

		let tableMetadata = getTableMetadata(table);

		let tableRows = getTable(table);

		if (tableRows.err) {
			return tableRows.err;
		}

		insertDocuments = [];
		const keys = tableMetadata.keys;

		documents.forEach((document) => {
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

			insertDocuments.push(insertObj);
		});

		tableRows = [...tableRows, ...insertDocuments];

		setTable(table, tableRows);
		saveTable(table, tableRows);

		return "Objects inserted with success";
	},
};
