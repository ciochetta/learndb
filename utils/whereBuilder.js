const buildWhere = function (whereObj) {
	const { key, value, operator } = whereObj;

	if (operator === "equal") {
		return (x) => x[key].toString() === value.toString();
	}

	if (operator === "bigger") {
		return (x) => {
			if (isNaN(x[key]) || isNaN(value)) {
				return x[key] > value;
			}

			return +x[key] > +value;
		};
	}

	if (operator === "smaller") {
		return (x) => {
			if (isNaN(x[key]) || isNaN(value)) {
				return x[key] < value;
			}

			return +x[key] < +value;
		};
	}

	if (operator === "biggerEqual") {
		return (x) => {
			if (isNaN(x[key]) || isNaN(value)) {
				return x[key] >= value;
			}

			return +x[key] >= +value;
		};
	}

	if (operator === "smallerEqual") {
		return (x) => {
			if (isNaN(x[key]) || isNaN(value)) {
				return x[key] <= value;
			}

			return +x[key] <= +value;
		};
	}

	if (operator === "like") {
		return (x) => x[key].toString().includes(value);
	}

	console.log(`ERR: operator ${operator} not found`);
};

module.exports = { buildWhere };
