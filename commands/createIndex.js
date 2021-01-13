//let { getDatabase, setDatabase, saveDatabase } = require("../database");
let { createIndex } = require("../indexing");

module.exports = {
	name: "CREATE INDEX",
	execute(params) {
		if (params.columns === undefined || params.columns.length === 0) {
			return "ERROR: columns can't be empty.";
		}

		if (params.table === undefined) {
			return "ERROR: table can't be empty.";
		}

		if (params.name === undefined) {
			return "ERROR: name can't be empty";
		}

		let result = createIndex(params);

		if (result.err) {
			return result.err;
		}

		return `Index ${params.name} created sucessfully`;
	},
};
