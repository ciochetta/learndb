const select = require("./commands/select");
const insert = require("./commands/insert");
const createTable = require("./commands/createTable");
const using = require("./commands/using");
const deleteCommand = require("./commands/delete");
const update = require("./commands/update");
const bulkInsert = require("./commands/bulkInsert");

const commands = [
	select,
	insert,
	createTable,
	using,
	deleteCommand,
	update,
	bulkInsert,
];

module.exports = { commands };
