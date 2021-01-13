let {
	getTable,
	getTableMetadata,
	setTable,
	saveTable,
} = require("../database");

module.exports = {
	name: "INSERT",
	execute(params) {
		const { document, table } = params;

		let tableMetadata = getTableMetadata(table);

		if (tableMetadata === undefined) {
			return `ERROR: could not find table with name ${table}`;
		}

		let tableRows = getTable(table);

		if (tableRows.err) {
			return tableRows.err;
		}

		let insertObj = {};

		let keys = tableMetadata.keys;

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

		tableRows = [...tableRows, insertObj];

		setTable(table, tableRows);
		saveTable(table, tableRows);

		return "Object inserted with success";
	},
};
