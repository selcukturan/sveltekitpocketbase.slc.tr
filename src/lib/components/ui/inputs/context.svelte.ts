import { getContext, setContext } from 'svelte';
import * as v from 'valibot';
import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';

class FormInputsContext<
	TInput extends RemoteFormInput | void,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
> {
	form: RemoteForm<TInput, TOutput>;
	schema: TSchema;
	initialValidate: boolean;

	constructor(form: RemoteForm<TInput, TOutput>, schema: TSchema, initialValidate: boolean) {
		this.form = $state(form);
		this.schema = $state(schema);
		this.initialValidate = initialValidate;

		/* setTimeout(() => {
			this.form.validate({ preflightOnly: true, includeUntouched: true });
		}, 1000); */
	}

	getValibotMetadata(key?: string) {
		if (!key) return {};
		const schemaEntry = this.schema?.entries?.[key];
		const metadata = schemaEntry ? v.getMetadata(schemaEntry) : undefined;
		return metadata;
	}
}

const key = Symbol('SLC-FORM-INPUTS-CONTEXT');
// ################################## BEGIN Export Table Context ##############################################################################################################################
export function createFormInputsContext<
	TInput extends RemoteFormInput | void,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>(form: RemoteForm<TInput, TOutput>, schema: TSchema, initialValidate: boolean) {
	return setContext(key, new FormInputsContext<TInput, TOutput, TSchema>(form, schema, initialValidate));
}
export function getFormInputsContext<
	TInput extends RemoteFormInput | void,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>() {
	const instance = getContext<ReturnType<typeof createFormInputsContext<TInput, TOutput, TSchema>>>(key);
	if (!instance) {
		return undefined;
	}
	return instance;
}
// ################################## END Export Table Context ################################################################################################################################
