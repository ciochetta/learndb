const { commands } = require("./commandExecutor");

function eval(cmd, context, filename, callback) {
	cmd = cmd.replace("\n", "");

	let eachStatement = parseStatements(cmd);

	for (let i = 0; i < eachStatement.length; i++) {
		eachStatement[i] = stringToCommand(eachStatement[i]);
	}

	executeCommand(eachStatement);

	callback(null, "Done.");
}

function parseStatements(str) {
	console.log(str);
	let i = 0;

	let statements = [];

	let currentStatement = "";

	let parsingString = false;

	while (i <= str.length) {
		let currChar = str[i];

		if (
			((currChar === " " && !parsingString) || i === str.length) &&
			currentStatement !== ""
		) {
			statements.push(currentStatement);
			currentStatement = "";
		} else {
			if (currChar === `"` && parsingString) {
				parsingString = false;
				statements.push(currentStatement);
				currentStatement = "";
				i++;
				continue;
			}

			if (currChar === `"` && !parsingString) {
				parsingString = true;
				i++;
				continue;
			}

			currentStatement = `${currentStatement}${currChar}`;
		}

		i++;
	}

	return statements;
}

function stringToCommand(cmd) {
	const thisCommand = commands.find(
		(cm) => cm.name.toLowerCase() === cmd.toLowerCase()
	);

	if (thisCommand === undefined) {
		return cmd;
	}

	return thisCommand;
}

function executeCommand(statements) {
	for (let i = 0; i < statements.length; i++) {
		const statement = statements[i];

		if (statement.name !== undefined) {
			let params = {};

			for (let j = 0; j < statement.params.length; j++) {
				i++;
				params[statement.params[j]] = statements[i];
			}

			let obj = [];

			while (i < statements.length) {
				i++;

				if (statements[i] !== undefined) {
					obj.push(statements[i]);
				}
			}

			statement.execute(params, obj);
		}
	}
}

module.exports = eval;
