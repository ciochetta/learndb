const executeCommand = function (statements) {
	if (statements.length === 1) {
		return statements[0].command.execute(statements[0].params);
	}

	let results = [];

	for (let i = 0; i < statements.length; i++) {
		const { command, params } = statements[i];

		let result = command.execute(params);

		results.push(result);
	}

	return results;
};

module.exports = { executeCommand };
