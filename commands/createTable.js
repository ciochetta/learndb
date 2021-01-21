let {
	getDatabase,
	setDatabase,
	saveDatabase,
	saveTable,
	setTable,
} = require("../database");

const executeCreateTable = function (params) {
	let { columns, table } = params;

	try {
		createTable(columns, table);

		return `Table ${table} created`;
	} catch (error) {
		return error;
	}
};

const createTable = function (columns, table) {
	const database = getDatabase();

	if (table === "name") {
		throw "ERROR: you can't create a table with name 'name', its a reserved word.";
	}

	const columnsArray = createColumnsArray(columns);

	saveTableToDisk(table);

	saveDatabaseToDisk(database, table, columnsArray);
};

const saveDatabaseToDisk = function (database, table, columns) {
	database.tables = [
		...database.tables,
		{
			name: table,
			keys: columns,
			indexes: [],
		},
	];

	setDatabase(database);
	saveDatabase(database);
};

const saveTableToDisk = function (table) {
	setTable(table, []);
	saveTable(table, []);
};

const createColumnsArray = function (columns) {
	if (Array.isArray(columns[0])) {
		columns = columns[0];
	}

	columns.map((key) => {
		if (typeof key === "string") {
			return {
				name: key,
				nullable: false,
			};
		}

		return key;
	});

	return columns;
};

module.exports = {
	name: "CREATE TABLE",
	execute: executeCreateTable,
};
