import { getContext, setContext } from 'svelte';
import type { RemoteForm } from '@sveltejs/kit';
import type { ErrorMessage, ObjectEntries, ObjectIssue, ObjectSchema } from 'valibot';

class FormInputsContext<
	T1 extends Record<string, any>,
	T2 extends Record<string, any>,
	Schema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
> {
	form: RemoteForm<T1, T2>;
	schema: Schema;

	constructor(form: RemoteForm<T1, T2>, schema: Schema) {
		this.form = $state(form);
		this.schema = $state(schema);
	}
}

const key = Symbol('SLC-FORM-INPUTS-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createFormInputsContext<
	T1 extends Record<string, any>,
	T2 extends Record<string, any>,
	Schema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>(form: RemoteForm<T1, T2>, schema: Schema) {
	return setContext(key, new FormInputsContext<T1, T2, Schema>(form, schema));
}
export function getFormInputsContext<
	T1 extends Record<string, any>,
	T2 extends Record<string, any>,
	Schema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>() {
	return getContext<ReturnType<typeof createFormInputsContext<T1, T2, Schema>>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
