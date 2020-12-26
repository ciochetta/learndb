const parser = require("./parser");

function eval(cmd, context, filename, callback) {
	cmd = cmd.replace("\n", "");

	let eachStatement = parser.parseStatements(cmd);

	for (let i = 0; i < eachStatement.length; i++) {
		eachStatement[i] = parser.stringToCommand(eachStatement[i]);
	}

	executeCommand(eachStatement);

	callback(null, "Done.");
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
