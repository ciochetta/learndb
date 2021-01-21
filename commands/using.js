let { setDatabase, saveDatabase } = require("../database");

const fs = require("fs");

const executeUsing = function (params) {
	const databaseName = params;
	try {
		return using(databaseName);
	} catch (error) {
		return error;
	}
};

const using = function (databaseName) {
	const databasePath = `./${databaseName}.ldb`;

	if (fs.existsSync(databasePath)) {
		loadDatabaseFromDisk(databasePath);

		return `Database ${databaseName} loaded.`;
	} else {
		createNewDatabase(databaseName);

		return `new database, with name ${databaseName}, created.`;
	}
};

const loadDatabaseFromDisk = function (databasePath) {
	const rawDatabase = fs.readFileSync(databasePath);

	const databaseJSON = JSON.parse(rawDatabase);

	setDatabase(databaseJSON);
};

const createNewDatabase = function (databaseName) {
	let newDatabase = { name: databaseName, tables: [] };
	setDatabase(newDatabase);
	saveDatabase(newDatabase);
};

module.exports = {
	name: "USING",
	execute: executeUsing,
};
