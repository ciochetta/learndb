parser = require("../parser");

test("Parse basic command", () => {
	const testCommand = "using TestDB";

	const result = parser.parseStatements(testCommand);

	expect(result.length).toBe(2);
	expect(result[0]).toBe("using");
	expect(result[1]).toBe("TestDB");
});

test("Parse command with a string", () => {
	const testCommand = `insert users "Luis Felipe" admin123`;

	const result = parser.parseStatements(testCommand);

	expect(result.length).toBe(4);
	expect(result[0]).toBe("insert");
	expect(result[1]).toBe("users");
	expect(result[2]).toBe("Luis Felipe");
	expect(result[3]).toBe("admin123");
});

test("Parse command with an object", () => {
	const testCommand = `create users { "keys": [ "name", "password" ] }`;

	const result = parser.parseStatements(testCommand);

	expect(result.length).toBe(3);
	expect(result[0]).toBe("create");
	expect(result[1]).toBe("users");

	const testObject = result[2];

	expect(testObject.keys.length === 2);
	expect(testObject.keys[0] === "name");
	expect(testObject.keys[1] === "password");
});

test("Parse command with nested objects", () => {
	const initialObject = {
		keys: [
			{ name: "name", nullable: false },
			{ name: "password", nullable: false },
		],
	};

	const testCommand = `create users ${JSON.stringify(initialObject)}`;

	const result = parser.parseStatements(testCommand);

	expect(result.length).toBe(3);
	expect(result[0]).toBe("create");
	expect(result[1]).toBe("users");

	const testObject = result[2];

	expect(testObject.keys.length).toBe(2);
	expect(testObject.keys[0].name).toBe("name");
	expect(testObject.keys[0].nullable).toBe(false);
	expect(testObject.keys[1].name).toBe("password");
	expect(testObject.keys[1].nullable).toBe(false);
});

test("Parse command with an array", () => {
	const testCommand = `create users [ "name", "password" ] `;

	const result = parser.parseStatements(testCommand);

	expect(result.length).toBe(3);
	expect(result[0]).toBe("create");
	expect(result[1]).toBe("users");

	const testArray = result[2];

	expect(testArray.keys.length === 2);
	expect(testArray.keys[0] === "name");
	expect(testArray.keys[1] === "password");
});
