const { getTable, setTable, saveTable } = require("../database");
const { buildWhere } = require("../utils/whereBuilder");

let updatedValues = 0;

const executeUpdate = function (params) {
	const { table, where, set } = params;

	try {
		updatedValues = 0;

		update(table, where, set);

		return `Successfully updated ${updatedValues} elements`;
	} catch (error) {
		return error;
	}
};

const update = function (table, where, set) {
	const tableRows = getTable(table);

	const whereFunctions = createWhereFunctions(where);

	const updatedTableRows = getUpdatedRows(tableRows, whereFunctions, set);

	updateDatabase(table, updatedTableRows);
};

const updateDatabase = function (table, updatedTableRows) {
	setTable(table, updatedTableRows);
	saveTable(table, updatedTableRows);
};

const getUpdatedRows = function (tableRows, whereFunctions, set) {
	tableRows = tableRows.map((dbObj) => {
		for (let index = 0; index < whereFunctions.length; index++) {
			const whereFunction = whereFunctions[index];

			if (!whereFunction(dbObj)) {
				return dbObj;
			}
		}

		for (let index = 0; index < set.length; index++) {
			dbObj[set[index].key] = set[index].value;
		}

		updatedValues++;

		return dbObj;
	});

	return tableRows;
};

const createWhereFunctions = function () {
	if (!Array.isArray(where)) {
		where = [where];
	}

	return where.map((w) => buildWhere(w));
};

module.exports = {
	name: "UPDATE",
	execute: executeUpdate,
};
