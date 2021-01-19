const { getTable, getTableMetadata } = require("../database");
const { getIndex } = require("../indexing");
const { buildWhere } = require("../utils/whereBuilder");
const {
	buildIndexComparingFunction,
	buildIndexBlockingFunction,
} = require("../utils/indexingFunctionsBuilder");

const fullTableSearch = function (table, keys, where) {
	const tableRows = getTable(table);

	if (tableRows.err) {
		return tableRows.err;
	}

	if (keys.length === 0 && where.length === 0) {
		return tableRows;
	}

	let whereFiltered = [...tableRows];

	if (where !== undefined && Array.isArray(where)) {
		where.forEach((whereObj) => {
			const whereFunction = buildWhere(whereObj);

			whereFiltered = whereFiltered.filter(whereFunction);
		});
	}

	if (keys.length === 0) {
		return whereFiltered;
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
	if (params.table === undefined) {
		return { err: "ERROR: table parameter can't be empty" };
	}

	if (params.columns === undefined) {
		return { err: "ERROR: columns parameter can't be empty" };
	}

	if (params.where === undefined) {
		params.where = [];
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

const indexSearch = function (table, where, index, keys) {
	const indexBtree = getIndex(table, index.name);

	let comparingFunction = buildIndexComparingFunction(where[0]);
	let blockingFunction = buildIndexBlockingFunction(where[0]);

	let values = indexBtree.search(comparingFunction, blockingFunction);

	return values;
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

		if (keys.length === 0 || where.length > 1) {
			return fullTableSearch(table, keys, where);
		}

		let index = getAppropriateIndex(table, keys, where);

		if (index !== undefined) {
			return indexSearch(table, where, index, keys);
		}

		return fullTableSearch(table, keys, where);
	},
};
