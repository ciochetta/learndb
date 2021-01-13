const parser = require("./parser");
const { executeCommand } = require("./executor");

function evalString(cmd, context, filename, callback) {
	cmd = cmd.replace("\n", "");

	if (cmd == "") {
		return callback(null, undefined);
	}

	let eachStatement = parser.parseStatements(cmd);

	console.time("command time");
	const commandResult = executeCommand(eachStatement);
	console.timeEnd("command time");

	console.log(commandResult);

	callback(null, "Done.");
}

function evalObject(cmdObject) {
	let eachStatement = parser.objStatementToCommand(cmdObject);

	const commandResult = executeCommand(eachStatement);

	return commandResult;
}

module.exports = { evalString, evalObject };
