const mcqOptions = (options) => String(options || '').split(',');

const mtfOptions = (options) => {
	const [left = '', right = ''] = String(options || '').split('|');
	return [left.split(','), right.split(',')];
};

export { mcqOptions, mtfOptions };
