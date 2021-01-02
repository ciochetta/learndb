let { getDatabase, loadDatabase, saveDatabase } = require("../database");

module.exports = {
	name: "CREATE",
	params: ["columns", "table"],
	execute(params) {
		let { columns, table } = params;
		let database = getDatabase();

		if (Array.isArray(columns[0])) {
			columns = columns[0];
		}

		if (columns === undefined || columns.length === 0) {
			return "ERROR: table columns can't be empty.";
		}

		if (table === "name") {
			return "ERROR: you can't create a table with name 'name', its a reserved word.";
		}

		columns = columns.map((key) => {
			if (typeof key === "string") {
				return {
					name: key,
					nullable: false,
				};
			}

			return key;
		});

		database[table] = {
			keys: columns,
			data: [],
		};

		loadDatabase(database);
		saveDatabase(database);

		return `Table ${table} created`;
	},
};
