const { getTable, setTable, saveTable } = require("../database");
const { buildWhere } = require("../utils/whereBuilder");

module.exports = {
	name: "UPDATE",
	execute(params) {
		const { table, where, set } = params;

		if (table === undefined) {
			return "ERROR: table parameter can't be empty";
		}

		let tableRows = getTable(table);

		if (tableRows.err) {
			return tableRows.err;
		}

		if (where === undefined) {
			return `ERROR: the where parameter is not optional`;
		}

		if (!Array.isArray(where)) {
			where = [where];
		}

		let whereFunctions = where.map((w) => buildWhere(w));

		let updated = 0;

		tableRows = tableRows.map((dbObj) => {
			for (let index = 0; index < whereFunctions.length; index++) {
				const whereFunction = whereFunctions[index];

				if (!whereFunction(dbObj)) {
					return dbObj;
				}
			}

			for (let index = 0; index < set.length; index++) {
				dbObj[set[index].key] = set[index].value;
			}

			updated++;

			return dbObj;
		});

		setTable(table, tableRows);
		saveTable(table, tableRows);

		return `Successfully updated ${updated} elements`;
	},
};
