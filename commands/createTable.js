let {
	getDatabase,
	setDatabase,
	saveDatabase,
	saveTable,
	setTable,
} = require("../database");

module.exports = {
	name: "CREATE TABLE",
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

		database.tables = [
			...database.tables,
			{
				name: table,
				keys: columns,
				indexes: [],
			},
		];

		setTable(table, []);
		saveTable(table, []);
		setDatabase(database);
		saveDatabase(database);

		return `Table ${table} created`;
	},
};
