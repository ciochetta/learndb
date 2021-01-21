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
		throw "ERROR: database is not initialized";
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
		throw `ERROR: could not find a table with name ${tableName}`;
	}
};

const saveTable = function (tableName, tableData) {
	if (tableName === undefined || tableName === undefined) {
		throw "ERROR: table name cannot be undefined";
	}

	if (tableData === undefined || tableData === undefined) {
		throw "ERROR: table name cannot be undefined";
	}

	if (database.name === undefined) {
		throw "ERROR: database is not initialized";
	}

	const tablePath = `./${database.name}_${tableName}.ldbt`;

	fs.writeFileSync(tablePath, JSON.stringify(tableData));
};

const getTableMetadata = function (tableName) {
	let metadata = database.tables.find(
		(table) => table.name.toLowerCase() === tableName.toLowerCase()
	);

	if (metadata === undefined) {
		throw `ERROR: could not find table with name ${tableName}`;
	}

	return metadata;
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
