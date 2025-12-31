import { getContext, setContext } from 'svelte';
import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';

class FormInputsContext<
	TInput extends RemoteFormInput | void,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
> {
	form: RemoteForm<TInput, TOutput>;
	schema: TSchema;

	constructor(form: RemoteForm<TInput, TOutput>, schema: TSchema) {
		this.form = $state(form);
		this.schema = $state(schema);
	}
}

const key = Symbol('SLC-FORM-INPUTS-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createFormInputsContext<
	TInput extends RemoteFormInput | void,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>(form: RemoteForm<TInput, TOutput>, schema: TSchema) {
	return setContext(key, new FormInputsContext<TInput, TOutput, TSchema>(form, schema));
}
export function getFormInputsContext<
	TInput extends RemoteFormInput | void,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>() {
	return getContext<ReturnType<typeof createFormInputsContext<TInput, TOutput, TSchema>>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
