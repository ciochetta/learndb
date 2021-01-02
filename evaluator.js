const parser = require("./parser");
const { executeCommand } = require("./executor");

function evalString(cmd, context, filename, callback) {
	cmd = cmd.replace("\n", "");

	let eachStatement = parser.parseStatements(cmd);

	const commandResult = executeCommand(eachStatement);

	console.log(commandResult);

	callback(null, "Done.");
}

function evalObject(cmdObject) {
	let eachStatement = parser.objStatementToCommand(cmdObject);

	const commandResult = executeCommand(eachStatement);

	return commandResult;
}

module.exports = { evalString, evalObject };
