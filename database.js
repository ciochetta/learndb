const fs = require("fs");

let database = {};
let tables = {};

const setDatabase = function (_database) {
	database = _database;
};

const getDatabase = function () {
	return database;
};

const getDatabaseName = function () {
	return database.name;
};

const saveDatabase = function (_database) {
	if (_database.name === undefined) {
		return console.error("ERROR: database is not initialized");
	}

	const databasePath = `./${_database.name}.ldb`;

	fs.writeFileSync(databasePath, JSON.stringify(_database));
};

const setTable = function (tableName, tableData) {
	tables[tableName] = tableData;
};

const getTable = function (tableName) {
	if (tables[tableName] !== undefined) {
		return tables[tableName];
	}

	const tablePath = `./${database.name}_${tableName}.ldbt`;

	if (fs.existsSync(tablePath)) {
		const rawTable = fs.readFileSync(tablePath);

		const tableJson = JSON.parse(rawTable);

		setTable(tableName, tableJson);

		return tableJson;
	} else {
		return {
			err: `ERROR: could not find a table with name ${tableName}`,
		};
	}
};

const saveTable = function (tableName, tableData) {
	const tablePath = `./${database.name}_${tableName}.ldbt`;

	fs.writeFileSync(tablePath, JSON.stringify(tableData));
};

const getTableMetadata = function (tableName) {
	return database.tables.find(
		(table) => table.name.toLowerCase() === tableName.toLowerCase()
	);
};

const setTableMetadata = function (tableName, tableMetadata) {
	database.tables = database.tables.filter(
		(table) => table.name.toLowerCase() !== tableName.toLowerCase()
	);

	database.tables = [...database.tables, tableMetadata];

	setDatabase(database);
	saveDatabase(database);
};

module.exports = {
	getDatabase,
	setDatabase,
	saveDatabase,
	getDatabaseName,
	saveTable,
	getTable,
	setTable,
	getTableMetadata,
	setTableMetadata,
};
