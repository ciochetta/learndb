let { getDatabase, setDatabase, saveDatabase } = require("../database");

module.exports = {
	name: "CREATE INDEX",
	execute(params) {
		let { columns, table, name } = params;
		let database = getDatabase();

		if (Array.isArray(columns[0])) {
			columns = columns[0];
		}

		if (columns === undefined || columns.length === 0) {
			return "ERROR: columns can't be empty.";
		}

		if (table === undefined) {
			return "ERROR: table can't be empty.";
		}

		database[table] = {
			keys: columns,
			data: [],
		};

		setDatabase(database);
		saveDatabase(database);

		return `Table ${table} created`;
	},
};
