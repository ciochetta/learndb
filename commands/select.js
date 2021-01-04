const { getDatabase } = require("../database");
const { buildWhere } = require("../whereBuilder");

module.exports = {
	name: "SELECT",
	execute(params) {
		const { columns, table, where } = params;

		if (table === undefined) {
			return console.error("ERROR: table parameter can't be empty");
		}

		let database = getDatabase();

		if (database[table] === undefined) {
			return console.error(`ERROR: could not find table ${table}`);
		}

		keys = [];

		if (Array.isArray(columns)) {
			keys = columns;
		} else {
			if (columns !== "star") {
				keys.push(columns);
			}
		}

		tableData = database[table].data;

		if (where !== undefined && Array.isArray(where)) {
			where.forEach((whereObj) => {
				const whereFunction = buildWhere(whereObj);

				console.log(whereFunction);

				tableData = tableData.filter(whereFunction);
			});
		}

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

			return result;
		}
	},
};
