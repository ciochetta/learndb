const repl = require("repl");
const eval = require("./parser");

repl.start({
	prompt: "LuisDB $ ",
	eval: eval,
});
