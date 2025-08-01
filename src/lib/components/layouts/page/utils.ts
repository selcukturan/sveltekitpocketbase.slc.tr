export const testUtilsFunction1 = (str: string, int: number) => {
	return `test1-${testUtilsFunction2(str, int)}`;
};

const testUtilsFunction2 = (str: string, int: number) => {
	return `test2-${str}-${int}`;
};
