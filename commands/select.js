const { getTable, getTableMetadata } = require("../database");
const { buildWhere } = require("../whereBuilder");

const fullTableSearch = function (table, keys, where) {
	const tableRows = getTable(table);

	if (tableRows.err) {
		return tableRows.err;
	}

	if (keys.length === 0) {
		return tableRows;
	}

	let whereFiltered = [...tableRows];

	if (where !== undefined && Array.isArray(where)) {
		where.forEach((whereObj) => {
			const whereFunction = buildWhere(whereObj);

			whereFiltered = whereFiltered.filter(whereFunction);
		});
	}

	const result = whereFiltered.map((data) => {
		row = {};

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			row[key] = data[key];
		}

		return row;
	});

	return result;
};

const buildKeysArray = function (columns) {
	if (columns === "star") {
		return [];
	}

	if (Array.isArray(columns)) {
		return columns;
	} else {
		return [columns];
	}
};

const validateSelectParams = function (params) {
	if (table === undefined) {
		return { err: "ERROR: table parameter can't be empty" };
	}

	if (columns === undefined) {
		return { err: "ERROR: columns parameter can't be empty" };
	}

	if (where === undefined) {
		where = [];
	}

	return params;
};

const getAppropriateIndex = function (table, keys, where) {
	let metadata = getTableMetadata(table);

	for (let j = 0; j < metadata.indexes.length; j++) {
		const index = metadata.indexes[j];

		if (index.columns.length < keys.length) {
			continue;
		}

		let useIndex = true;

		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];

			if (
				index.columns.find((column) => column.toLowerCase() === key) ===
				undefined
			) {
				useIndex = false;

				continue;
			}
		}

		for (let i = 0; i < where.length; i++) {
			const whereObj = where[i];

			const key = whereObj.key;

			if (
				index.columns.find((column) => column.toLowerCase() === key) ===
				undefined
			) {
				useIndex = false;

				continue;
			}
		}

		if (useIndex) {
			return index;
		}
	}

	return undefined;
};

const indexSearch = function (table, where, index) {
	console.log(table);
	console.log(where);
	console.log(index);

	return 0;
};

module.exports = {
	name: "SELECT",
	execute(params) {
		params = validateSelectParams(params);

		if (params.err) {
			return params.err;
		}

		let { columns, table, where } = params;

		let keys = buildKeysArray(columns);

		if (keys.length === 0) {
			return fullTableSearch(table, keys, where);
		}

		let index = getAppropriateIndex(table, keys, where);

		if (index !== undefined) {
			return indexSearch(table, where, index);
		}

		return fullTableSearch(table, keys, where);
	},
};
