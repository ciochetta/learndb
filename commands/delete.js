const { getTable, saveTable, setTable } = require("../database");
const { buildWhere } = require("../utils/whereBuilder");

let deletedRows = 0;

const executeDelete = function (params) {
	const { table, where } = params;

	try {
		fDelete(table, where);

		return `Successfully deleted ${deletedRows} elements`;
	} catch (error) {}
};

const fDelete = function (table, where) {
	const tableRows = getTable(table);

	const updatedTableRows = getTableRowsAfterDeletion(tableRows, where);

	saveUpdatedTablesToDisk(table, updatedTableRows);
};

const saveUpdatedTablesToDisk = function (table, updatedTableRows) {
	setTable(table, updatedTableRows);
	saveTable(table, updatedTableRows);
};

const getTableRowsAfterDeletion = function (tableRows, where) {
	let lengthBefore = tableRows.length.toString();

	if (where !== undefined && Array.isArray(where)) {
		where.forEach((whereObj) => {
			const whereFunction = buildWhere(whereObj);

			tableRows = tableRows.filter((e) => !whereFunction(e));
		});
	}

	deletedRows = Number(lengthBefore) - tableRows.length;

	return tableRows;
};

module.exports = {
	name: "DELETE",
	execute: executeDelete,
};
