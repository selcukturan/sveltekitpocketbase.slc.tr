import { getContext, setContext } from 'svelte';
import type { RemoteForm } from '@sveltejs/kit';
import type { SchemaProp } from '$lib/app/schemas/schema-prop';

type ValidateFunction = RemoteForm<any, any>['validate'];

class FormInputsContext {
	validate = $state<ValidateFunction>();
	schema = $state<SchemaProp>();

	constructor(validate?: ValidateFunction, schema?: SchemaProp) {
		this.validate = validate;
		this.schema = schema;
	}
}

const key = Symbol('SLC-FORM-INPUTS-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createFormInputsContext(validate?: ValidateFunction, schema?: SchemaProp) {
	return setContext(key, new FormInputsContext(validate, schema));
}
export function getFormInputsContext() {
	return getContext<ReturnType<typeof createFormInputsContext>>(key);
}
// ################################## END Export Table Context ################################################################################################################################
