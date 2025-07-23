import { getContext, setContext } from 'svelte';
import * as v from 'valibot';
import type { GenericValibotObject, PartialSchemaError } from './types';

type InputDataType = {
	inputValue: string;
	initialValue: string;
	value: string;
};

class Forms<Schema extends GenericValibotObject> {
	// ################################## BEGIN Constructor #########################################################################################################################

	inputs = $state<Record<string, InputDataType>>({});
	data = $state<v.InferInput<Schema>>({});
	// values = $state<v.InferOutput<Schema>>({});
	// errors?: [v.InferIssue<Schema>, ...v.InferIssue<Schema>[]] = $state([]);
	defaultValues?: Partial<v.InferInput<Schema>> = $state({});
	parseResult: v.SafeParseResult<Schema> | undefined = $state(undefined);

	errorsByName: { [key: string]: string | undefined } = $derived.by(() => this.convertIssuesToErrorMap(this.parseResult?.issues ?? []));

	public readonly schema: Schema;

	constructor(schema: Schema, defaultValues?: Partial<v.InferInput<Schema>>) {
		this.schema = schema;
		this.defaultValues = defaultValues;
	}

	safeParse = () => {
		const result = v.safeParse(this.schema, this.data);
		this.parseResult = result;
		return result;
	};

	convertIssuesToErrorMap = <Schema extends GenericValibotObject>(issues: v.GenericIssue[]): PartialSchemaError<Schema> => {
		const errors: PartialSchemaError<Schema> = {};

		for (const issue of issues ?? []) {
			if (!issue.path) continue;
			const key = issue.path[0]?.key as keyof v.InferInput<Schema>;
			if (!key) continue;
			errors[key] = issue.message;
		}
		return errors;
	};

	onblur = (inputNode?: HTMLInputElement) => {
		if (!(inputNode instanceof HTMLInputElement)) return;
		this.safeParse();
	};

	oninput = (inputNode: HTMLInputElement, inputName: string, inputValue: unknown) => {
		if (!(inputNode instanceof HTMLInputElement)) return;
		if (typeof inputValue !== 'string') return;

		this.inputs = {
			...this.inputs,
			[inputName]: {
				value: `xxx${inputValue}xxx`,
				initialValue: 'text',
				inputValue: inputValue
			}
		};

		this.data = {
			...this.data,
			[inputName]: inputValue
		};

		// this.safeParse();
	};

	// ################################## END Constructor ##########################################################################################################################
}

// ################################## BEGIN Export Table Context ##############################################################################################################################

const FORM_CONTEXT_KEY = Symbol('SLC_FORM_CTX'); // Benzersiz bir key kullanmak daha iyidir

export function createForm<Schema extends GenericValibotObject>(schema: Schema, defaultValues?: Partial<v.InferInput<Schema>>) {
	const formInstance = new Forms<Schema>(schema, defaultValues);
	setContext(FORM_CONTEXT_KEY, formInstance);
	return formInstance;
}

export function getForm<Schema extends GenericValibotObject>() {
	const formInstance = getContext<Forms<Schema>>(FORM_CONTEXT_KEY);
	if (!formInstance) {
		throw new Error('Form context not found. Make sure you have called createForm in an ancestor component.');
	}
	return formInstance;
}
// ################################## END Export Table Context ################################################################################################################################
