let { getDatabase, loadDatabase, saveDatabase } = require("../database");

module.exports = {
	name: "INSERT",
	params: ["table"],
	execute(params, obj) {
		const { table } = params;

		let database = getDatabase();

		if (database[table] === undefined) {
			return console.error(`ERROR: Table ${table} not found`);
		}

		let insertObj = {};

		for (let i = 0; i < database[table].keys.length; i++) {
			const key = database[table].keys[i];

			if (!key.nullable && (obj[i] === undefined || obj[i] === null)) {
				return console.error(`ERROR: ${key} can not be empty`);
			}

			insertObj[key.name] = obj[i];
		}

		database[table].data.push(insertObj);

		loadDatabase(database);
		saveDatabase(database);
	},
};
