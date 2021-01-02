const repl = require("repl");
const { evalString, evalObject } = require("./evaluator");

if (process.argv[2] === "repl") {
	repl.start({
		prompt: "LuisDB $ ",
		eval: evalString,
	});
}

module.exports = { evalObject };
