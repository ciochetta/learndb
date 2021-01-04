const select = require("./commands/select");
const insert = require("./commands/insert");
const create = require("./commands/create");
const using = require("./commands/using");
const deleteCommand = require("./commands/delete");

const commands = [select, insert, create, using, deleteCommand];

module.exports = { commands };
