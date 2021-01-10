let { setDatabase, saveDatabase } = require("../database");

const fs = require("fs");

module.exports = {
	name: "USING",
	execute(params) {
		const databasePath = `./${params}.ldb`;

		if (fs.existsSync(databasePath)) {
			const rawDatabase = fs.readFileSync(databasePath);

			const databaseJSON = JSON.parse(rawDatabase);

			setDatabase(databaseJSON);

			return `Database ${params} loaded.`;
		} else {
			let newDatabase = { name: params, tables: [] };
			setDatabase(newDatabase);
			saveDatabase(newDatabase);
			return `new database ${params} created.`;
		}
	},
};
