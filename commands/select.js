const { getTable } = require("../database");
const { buildWhere } = require("../whereBuilder");

module.exports = {
	name: "SELECT",
	execute(params) {
		const { columns, table, where } = params;

		if (table === undefined) {
			return "ERROR: table parameter can't be empty";
		}

		const tableRows = getTable(table);

		if (tableRows.err) {
			return tableRows.err;
		}

		keys = [];

		if (Array.isArray(columns)) {
			keys = columns;
		} else {
			if (columns !== "star") {
				keys.push(columns);
			}
		}

		if (keys.length === 0) {
			return tableRows;
		}

		let whereFiltered = [...tableRows];

		if (where !== undefined && Array.isArray(where)) {
			where.forEach((whereObj) => {
				const whereFunction = buildWhere(whereObj);

				whereFiltered = whereFiltered.filter(whereFunction);
			});
		}

		const result = whereFiltered.map((data) => {
			row = {};

			for (let i = 0; i < keys.length; i++) {
				const key = keys[i];
				row[key] = data[key];
			}

			return row;
		});

		return result;
	},
};
