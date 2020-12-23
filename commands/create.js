let { getDatabase, loadDatabase, saveDatabase } = require("../database");

module.exports = {
	name: "CREATE",
	params: ["table"],
	execute(params, keys) {
		const { table } = params;

		let database = getDatabase();

		if (keys === undefined || keys.length === 0) {
			return console.error("ERROR: table columns can't be empty.");
		}

		if (table === "name") {
			return console.error(
				"ERROR: you can't create a table with name 'name', its a reserved word."
			);
		}

		database[table] = {
			keys: keys,
			data: [],
		};

		loadDatabase(database);
		saveDatabase(database);
	},
};
