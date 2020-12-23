let { getDatabase } = require("../database");

module.exports = {
	name: "SELECT",
	params: ["table"],
	execute(params, obj) {
		const { table } = params;

		let database = getDatabase();

		if (table !== undefined) {
			return console.log(database[table].data);
		}

		console.log(database);
	},
};
