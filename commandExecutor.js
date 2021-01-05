const select = require("./commands/select");
const insert = require("./commands/insert");
const create = require("./commands/create");
const using = require("./commands/using");
const deleteCommand = require("./commands/delete");
const update = require("./commands/update");

const commands = [select, insert, create, using, deleteCommand, update];

module.exports = { commands };
