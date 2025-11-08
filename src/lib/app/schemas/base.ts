import * as v from 'valibot';

export const id = v.string();
export const string = v.string();
export const number = v.number();
export const boolean = v.boolean();

export const operators = v.picklist([
	'=',
	'!=',
	'>',
	'>=',
	'<',
	'<=',
	'~',
	'!~',
	'?=',
	'?!=',
	'?>',
	'?>=',
	'?<',
	'?<=',
	'?~',
	'?!~'
]);

export const allCurrentValue = v.union([string, number, boolean]);
export type AllCurrentValue = v.InferOutput<typeof allCurrentValue>;
