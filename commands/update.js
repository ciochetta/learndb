const { getDatabase, loadDatabase, saveDatabase } = require("../database");
const { buildWhere } = require("../whereBuilder");

module.exports = {
	name: "UPDATE",
	execute(params) {
		const { table, where, set } = params;

		if (table === undefined) {
			return "ERROR: table parameter can't be empty";
		}

		let database = getDatabase();

		if (database[table] === undefined) {
			return `ERROR: could not find table ${table}`;
		}

		tableData = database[table].data;

		if (where === undefined) {
			return `ERROR: the where parameter is not optional`;
		}

		if (!Array.isArray(where)) {
			where = [where];
		}

		let whereFunctions = where.map((w) => buildWhere(w));

		let updated = 0;

		tableData = tableData.map((dbObj) => {
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

		database[table].data = tableData;

		loadDatabase(database);
		saveDatabase(database);

		return `Successfully updated ${updated} elements`;
	},
};
