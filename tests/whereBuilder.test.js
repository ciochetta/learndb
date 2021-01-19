const { buildWhere } = require("../utils/whereBuilder");

test("can where builder build a equal function", () => {
	const testObj = {
		key: "name",
		value: "luis",
		operator: "equal",
	};

	whereFunction = buildWhere(testObj);

	testArray = [
		{ name: "notquiteluis" },
		{ name: "luis" },
		{ name: "alsonotluis" },
	];

	result = testArray.filter(whereFunction);

	expect(result.length).toBe(1);
	expect(result[0].name).toBe("luis");
});

test("can where builder build a bigger function", () => {
	const testObj = {
		key: "age",
		value: "7",
		operator: "bigger",
	};

	whereFunction = buildWhere(testObj);

	testArray = [{ age: 4 }, { age: 12 }, { age: 20 }];

	result = testArray.filter(whereFunction);

	expect(result.length).toBe(2);
	expect(result[0].age).toBe(12);
	expect(result[1].age).toBe(20);
});
