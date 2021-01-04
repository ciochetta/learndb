const { commands } = require("./commandExecutor");

const parser = require("lql-parser");

function parseStatements(str) {
	let statements = parser.parseInput(str);

	return objStatementToCommand(statements);
}

function objStatementToCommand(statements) {
	if (!Array.isArray(statements)) {
		statements = [statements];
	}

	statements = statements.map((st) => {
		return {
			command: commands.find(
				(cm) => cm.name.toLowerCase() === st.type.toLowerCase()
			),
			params: st.params,
		};
	});

	return statements;
}

module.exports = {
	parseStatements,
	objStatementToCommand,
};
