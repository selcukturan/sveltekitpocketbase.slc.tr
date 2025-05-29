import { getContext, setContext } from 'svelte';
import { type BaseSchema, type BaseIssue } from 'valibot';
import { createForm as createTanstackForm, FormApi } from '@tanstack/svelte-form';

class Form<TInput = unknown, TOutput = TInput, TIssue extends BaseIssue<unknown> = BaseIssue<unknown>> {
	// ################################## BEGIN Constructor #########################################################################################################################

	#test = $state(1);
	get test() {
		return this.#test;
	}

	private readonly schema: BaseSchema<TInput, TOutput, TIssue>;
	public readonly tanstackForm;

	constructor(schema: BaseSchema<TInput, TOutput, TIssue>, defaultValues: TInput) {
		this.schema = schema;

		this.tanstackForm = createTanstackForm(() => ({
			defaultValues,
			validators: {
				onChange: this.schema
			}
		}));
	}
	// ################################## END Constructor ##########################################################################################################################
}

// ################################## BEGIN Export Table Context ##############################################################################################################################

const FORM_CONTEXT_KEY = Symbol('svelte-form-context-key'); // Benzersiz bir key kullanmak daha iyidir

/**
 * Creates a new Form instance with the given schema and sets it in the Svelte context.
 * @param schema The Valibot schema for the form.
 * @returns The created Form instance.
 */
export function createForm<TInput, TOutput, TIssue extends BaseIssue<unknown>>(
	schema: BaseSchema<TInput, TOutput, TIssue>,
	defaultValues: TInput
): Form<TInput, TOutput, TIssue> {
	const formInstance = new Form<TInput, TOutput, TIssue>(schema, defaultValues);
	setContext(FORM_CONTEXT_KEY, formInstance);
	return formInstance;
}

/**
 * Retrieves the Form instance from the Svelte context.
 * You need to provide the generic types that were used when creating the form.
 * @returns The Form instance from context.
 * @throws Error if the form context is not found.
 */
export function getForm<
	TInput = unknown, // Varsayılanlar eklenebilir ama çağırırken belirtmek daha güvenli
	TOutput = TInput,
	TIssue extends BaseIssue<unknown> = BaseIssue<unknown>
>(): Form<TInput, TOutput, TIssue> {
	const formInstance = getContext<Form<TInput, TOutput, TIssue>>(FORM_CONTEXT_KEY);
	if (!formInstance) {
		throw new Error('Form context not found. Make sure you have called createForm in an ancestor component.');
	}
	return formInstance;
}
// ################################## END Export Table Context ################################################################################################################################
