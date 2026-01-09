export type { ListResult } from 'pocketbase';

export type ValueType<T extends boolean> = T extends true ? string[] : string;

export type ResolveData<T extends boolean> = {
	confirm: boolean;
};
