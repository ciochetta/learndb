const buildIndexComparingFunction = function (whereObj) {
	const { value, operator } = whereObj;

	if (operator === "equal") {
		return (x) => x.toString() === value.toString();
	}

	if (operator === "bigger") {
		return (x) => {
			if (isNaN(x) || isNaN(value)) {
				return x > value;
			}

			return +x > +value;
		};
	}

	if (operator === "smaller") {
		return (x) => {
			if (isNaN(x) || isNaN(value)) {
				return x < value;
			}

			return +x < +value;
		};
	}

	if (operator === "biggerEqual") {
		return (x) => {
			if (isNaN(x) || isNaN(value)) {
				return x >= value;
			}

			return +x >= +value;
		};
	}

	if (operator === "smallerEqual") {
		return (x) => {
			if (isNaN(x) || isNaN(value)) {
				return x <= value;
			}

			return +x <= +value;
		};
	}

	if (operator === "like") {
		return (x) => x.toString().includes(value);
	}

	console.log(`ERR: operator ${operator} not found`);
};

const buildIndexBlockingFunction = function (whereObj) {
	const { value, operator } = whereObj;

	if (operator === "equal") {
		return (current, next) => {
			if (current.toString() === value.toString()) {
				return !(current.toString() === next.toString());
			}

			const compare = function (current, value, next) {
				if (current > value) {
					return next > current;
				}

				return next < current;
			};

			if (isNaN(current) || isNaN(value) || isNaN(next)) {
				return compare(current, value, next);
			}

			return compare(+current, +value, +next);
		};
	}

	if (operator === "bigger" || operator === "biggerEqual") {
		return (current, next) => {
			if (isNaN(current) || isNaN(value) || isNaN(next)) {
				return current > next && value >= current;
			}

			return +current > +next && +value >= +current;
		};
	}

	if (operator === "smaller" || operator === "smallerEqual") {
		return (current, next) => {
			if (isNaN(current) || isNaN(value) || isNaN(next)) {
				return current < next && value <= current;
			}

			return +current < +next && +value <= +current;
		};
	}

	if (operator === "like") {
		return (x) => false;
	}

	console.log(`ERR: operator ${operator} not found`);
};

module.exports = { buildIndexComparingFunction, buildIndexBlockingFunction };
