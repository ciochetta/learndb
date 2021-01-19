const { getTable, saveTable, setTable } = require("../database");
const { buildWhere } = require("../utils/whereBuilder");

module.exports = {
	name: "DELETE",
	execute(params) {
		const { table, where } = params;

		if (table === undefined) {
			return console.error("ERROR: table parameter can't be empty");
		}

		let tableRows = getTable(table);

		if (tableRows.err) {
			return tableRows.err;
		}

		let lengthBefore = tableRows.length.toString();

		if (where !== undefined && Array.isArray(where)) {
			where.forEach((whereObj) => {
				const whereFunction = buildWhere(whereObj);

				tableRows = tableRows.filter((e) => !whereFunction(e));
			});
		}

		setTable(table, tableRows);
		saveTable(table, tableRows);

		return `Successfully deleted ${
			Number(lengthBefore) - tableRows.length
		} elements`;
	},
};
