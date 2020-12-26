let { getDatabase, loadDatabase, saveDatabase } = require("../database");

module.exports = {
	name: "CREATE",
	params: ["table"],
	execute(params, keys) {
		const { table } = params;
		let database = getDatabase();

		if (Array.isArray(keys[0])) {
			console.log(keys);
			keys = keys[0];
		}

		if (keys === undefined || keys.length === 0) {
			return console.error("ERROR: table columns can't be empty.");
		}

		if (table === "name") {
			return console.error(
				"ERROR: you can't create a table with name 'name', its a reserved word."
			);
		}

		keys = keys.map((key) => {
			if (typeof key === "string") {
				return {
					name: key,
					nullable: false,
				};
			}

			return key;
		});

		database[table] = {
			keys: keys,
			data: [],
		};

		loadDatabase(database);
		saveDatabase(database);
	},
};
