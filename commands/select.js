let { getDatabase } = require("../database");

module.exports = {
	name: "SELECT",
	params: ["structure", "table"],
	execute(params, obj) {
		const { structure, table } = params;

		if (table === undefined) {
			return console.error("ERROR: table parameter can't be empty");
		}

		let database = getDatabase();

		if (database[table] === undefined) {
			return console.error(`ERROR: could not find table ${table}`);
		}

		keys = [];

		if (Array.isArray(structure)) {
			keys = structure;
		} else {
			if (structure !== "*") {
				keys.push(structure);
			}
		}

		tableData = database[table].data;

		if (keys.length === 0) {
			return console.table(tableData);
		} else {
			const result = tableData.map((data) => {
				row = {};

				for (let i = 0; i < keys.length; i++) {
					const key = keys[i];
					row[key] = data[key];
				}

				return row;
			});

			return console.table(result);
		}
	},
};
