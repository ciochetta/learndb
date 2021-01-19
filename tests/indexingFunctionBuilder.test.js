const {
	buildIndexComparingFunction,
	buildIndexBlockingFunction,
} = require("../utils/indexingFunctionsBuilder");

test("build a blocking function for equal comparison", () => {
	const blockingFunction = buildIndexBlockingFunction({
		value: 5,
		operator: "equal",
	});

	//next.next here would be 5 so 4 should be evaluated
	expect(blockingFunction(6, 4)).toBe(false);

	// next.next would always be bigger, so this should return true
	expect(blockingFunction(12, 14)).toBe(true);

	// next.next could be 5, so this should return false
	expect(blockingFunction(2, 6)).toBe(false);
});

test("build one more blocking function for equal comparison", () => {
	const blockingFunction = buildIndexBlockingFunction({
		value: 17,
		operator: "equal",
	});

	//next.next here would always be smaller than 17, so this should return true
	expect(blockingFunction(6, 4)).toBe(true);

	// next.next could be 17, so this should return false
	expect(blockingFunction(12, 14)).toBe(false);

	// next.next could be 17, so this should return false
	expect(blockingFunction(2, 6)).toBe(false);
});

test("build another blocking function for equal comparison", () => {
	const blockingFunction = buildIndexBlockingFunction({
		value: 13,
		operator: "equal",
	});

	//next.next here would always be smaller than 13, so this should return true
	expect(blockingFunction(6, 4)).toBe(true);

	// next.next could be 13, so this should return false
	expect(blockingFunction(12, 14)).toBe(false);

	// next.next could be 13, so this should return false
	expect(blockingFunction(2, 6)).toBe(false);
});

test("build one last blocking function for equal comparison", () => {
	const blockingFunction = buildIndexBlockingFunction({
		value: 65,
		operator: "equal",
	});

	//next.next could be 65, so false
	expect(blockingFunction(65, 65)).toBe(false);

	// next.next could not be 65, so true
	expect(blockingFunction(65, 64)).toBe(true);

	// next.next could be 65, so false
	expect(blockingFunction(63, 65)).toBe(false);
});

test("build one a function for bigger comparison", () => {
	const blockingFunction = buildIndexBlockingFunction({
		value: 10,
		operator: "bigger",
	});

	//next.next could be > 10, so false
	expect(blockingFunction(10, 12)).toBe(false);

	// next.next could be > 10, so false
	expect(blockingFunction(9, 10)).toBe(false);

	// next.next could be > 10, so false
	expect(blockingFunction(14, 13)).toBe(false);

	// next.next could be > 10, so false
	expect(blockingFunction(17, 9)).toBe(false);

	// next.next could be > 10, so false
	expect(blockingFunction(75, 93)).toBe(false);

	// next.next couldn't be > 10, so true
	expect(blockingFunction(4, 2)).toBe(true);

	// next.next could be > 10, so false
	expect(blockingFunction(2, 4)).toBe(false);

	// next.next couldn't be > 10, so true
	expect(blockingFunction(9, 7)).toBe(true);

	// next.next could be > 10, so false
	expect(blockingFunction(12, 10)).toBe(false);

	//next.next could not be > 10, so true
	expect(blockingFunction(10, 8)).toBe(true);
});

test("build one a function for bigger comparison", () => {
	const blockingFunction = buildIndexBlockingFunction({
		value: 10,
		operator: "smaller",
	});

	//next.next could not be < 10, so true
	expect(blockingFunction(10, 12)).toBe(true);

	//next.next could be < 10, so false
	expect(blockingFunction(9, 12)).toBe(false);

	//next.next could be < 10, so false
	expect(blockingFunction(9, 10)).toBe(false);

	//next.next could be < 10, so false
	expect(blockingFunction(12, 11)).toBe(false);

	//next.next could be < 10, so false
	expect(blockingFunction(15, 8)).toBe(false);

	//next.next could be < 10, so false
	expect(blockingFunction(9, 8)).toBe(false);

	//next.next could not be < 10, so true
	expect(blockingFunction(11, 12)).toBe(true);
});
