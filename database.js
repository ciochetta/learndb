const fs = require("fs");

let database = {};

const loadDatabase = function (_database) {
	database = _database;
};

const getDatabase = function () {
	return database;
};

const saveDatabase = function (_database) {
	if (_database.name === undefined) {
		return console.error("ERROR: database is not initialized");
	}

	const databasePath = `./${_database.name}.ldb`;

	fs.writeFileSync(databasePath, JSON.stringify(_database));
};

module.exports = { getDatabase, loadDatabase, saveDatabase };
