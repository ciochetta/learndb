let { getDatabase, loadDatabase, saveDatabase } = require("../database");

module.exports = {
	name: "INSERT",
	execute(params) {
		const { document, table } = params;

		let database = getDatabase();

		if (database[table] === undefined) {
			return `ERROR: Table ${table} not found`;
		}

		let insertObj = {};

		for (let i = 0; i < database[table].keys.length; i++) {
			const key = database[table].keys[i];

			if (
				!key.nullable &&
				(document[i] === undefined || document[i] === null) &&
				(document[key.name] === undefined || document[key.name] === null)
			) {
				return `ERROR: ${key.name} can not be empty`;
			}

			insertObj[key.name] = document[i] || document[key.name];
		}

		database[table].data.push(insertObj);

		loadDatabase(database);
		saveDatabase(database);

		return "Object inserted with success";
	},
};
