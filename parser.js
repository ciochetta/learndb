const commands = [
	{
		name: "SELECT",
		params: ["table"],
		execute(params, obj) {
			let { table } = params;

			if (table !== undefined) {
				return console.log(database[table].data);
			}

			console.log(database);
		},
	},
	{
		name: "INSERT",
		params: ["table"],
		execute(params, obj) {
			let { table } = params;

			if (database[table] === undefined) {
				return console.error(`ERROR: Table ${table} not found`);
			}

			let insertObj = {};

			for (let i = 0; i < database[table].keys.length; i++) {
				const key = database[table].keys[i];

				if (obj[i] === undefined) {
					return console.error(`ERROR: ${key} can not be empty`);
				}

				insertObj[key] = obj[i];
			}

			database[table].data.push(insertObj);
		},
	},
	{
		name: "CREATE",
		params: ["table"],
		execute(params, keys) {
			let { table } = params;

			if (keys === undefined || keys.length === 0) {
				return console.error("ERROR: table columns can't be empty");
			}

			database[table] = {
				keys: keys,
				data: [],
			};
		},
	},
];

let database = {};

function eval(cmd, context, filename, callback) {
	cmd = cmd.replace("\n", "");
	let eachStatement = cmd.split(" ");

	for (let i = 0; i < eachStatement.length; i++) {
		eachStatement[i] = parseCommand(eachStatement[i]);
	}

	executeCommand(eachStatement);
}

function parseCommand(cmd) {
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
