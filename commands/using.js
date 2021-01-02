let { loadDatabase, saveDatabase } = require("../database");

const fs = require("fs");

module.exports = {
	name: "USING",
	params: ["databaseName"],
	execute(params) {
		const databasePath = `./${params}.ldb`;

		if (fs.existsSync(databasePath)) {
			const rawDatabase = fs.readFileSync(databasePath);

			const databaseJSON = JSON.parse(rawDatabase);

			loadDatabase(databaseJSON);

			return `Database ${params} loaded.`;
		} else {
			let newDatabase = { name: params };
			loadDatabase(newDatabase);
			saveDatabase(newDatabase);
			return `new database ${params} created.`;
		}
	},
};
