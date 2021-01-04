const { getDatabase, loadDatabase, saveDatabase } = require("../database");
const { buildWhere } = require("../whereBuilder");

module.exports = {
	name: "DELETE",
	execute(params) {
		const { table, where } = params;

		if (table === undefined) {
			return console.error("ERROR: table parameter can't be empty");
		}

		let database = getDatabase();

		if (database[table] === undefined) {
			return console.error(`ERROR: could not find table ${table}`);
		}

		tableData = database[table].data;

		let lengthBefore = database[table].data.length.toString();

		if (where !== undefined && Array.isArray(where)) {
			where.forEach((whereObj) => {
				const whereFunction = buildWhere(whereObj);

				tableData = tableData.filter((e) => !whereFunction(e));
			});
		}

		database[table].data = tableData;

		loadDatabase(database);
		saveDatabase(database);

		return `Successfully deleted ${
			Number(lengthBefore) - tableData.length
		} elements`;
	},
};
