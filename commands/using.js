let { loadDatabase, saveDatabase } = require("../database");

const fs = require("fs");

module.exports = {
	name: "USING",
	params: ["databaseName"],
	execute(params, keys) {
		const { databaseName } = params;

		if (databaseName === undefined) {
			return console.error("ERROR: database name can't be empty");
		}

		const databasePath = `./${databaseName}.ldb`;

		if (fs.existsSync(databasePath)) {
			const rawDatabase = fs.readFileSync(databasePath);

			const databaseJSON = JSON.parse(rawDatabase);
			console.log(databaseJSON);

			loadDatabase(databaseJSON);
		} else {
			let newDatabase = { name: databaseName };
			loadDatabase(newDatabase);
			saveDatabase(newDatabase);
		}
	},
};
