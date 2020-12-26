const { commands } = require("./commandExecutor");

function parseStatements(str) {
	let i = 0;

	let statements = [];

	let currentStatement = "";

	let parsingString = false;

	let objectParsingLayer = 0;

	let arrayParsingLayer = 0;

	while (i <= str.length) {
		let currChar = str[i];

		if (currChar === "}") {
			currentStatement = `${currentStatement}${currChar}`;
			objectParsingLayer--;
			if (objectParsingLayer === 0) {
				statements.push(JSON.parse(currentStatement));
				currentStatement = "";
			}

			i++;
			continue;
		}

		if (currChar === "{") {
			currentStatement = `${currentStatement}${currChar}`;
			objectParsingLayer++;
			i++;
			continue;
		}

		if (objectParsingLayer > 0) {
			currentStatement = `${currentStatement}${currChar}`;
			i++;
			continue;
		}

		if (currChar === "]") {
			currentStatement = `${currentStatement}${currChar}`;
			arrayParsingLayer--;
			if (arrayParsingLayer === 0) {
				statements.push(JSON.parse(currentStatement));
				currentStatement = "";
			}

			i++;
			continue;
		}

		if (currChar === "[") {
			currentStatement = `${currentStatement}${currChar}`;
			arrayParsingLayer++;
			i++;
			continue;
		}

		if (arrayParsingLayer > 0) {
			currentStatement = `${currentStatement}${currChar}`;
			i++;
			continue;
		}

		if (parsingString && currChar === `"`) {
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

		if (currChar === " " && !parsingString && currentStatement != "") {
			statements.push(currentStatement);
			currentStatement = "";
			i++;
			continue;
		}

		if (currChar === " " && !parsingString) {
			i++;
			continue;
		}

		if (i === str.length && currentStatement !== "") {
			statements.push(currentStatement);
			currentStatement = "";
			i++;
			continue;
		}

		currentStatement = `${currentStatement}${currChar}`;
		i++;
	}

	return statements;
}

function stringToCommand(cmd) {
	if (typeof cmd === "object") {
		return cmd;
	}

	const thisCommand = commands.find(
		(cm) => cm.name.toLowerCase() === cmd.toLowerCase()
	);

	if (thisCommand === undefined) {
		return cmd;
	}

	return thisCommand;
}

module.exports = {
	parseStatements,
	stringToCommand,
};
