import type { SvelteHTMLElements } from 'svelte/elements';
import { getContext, setContext, type Snippet } from 'svelte';
import { untrack } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import * as v from 'valibot';
import type { RemoteForm, RemoteFormInput } from '@sveltejs/kit';
import type { ObjectSchema, ObjectEntries, ErrorMessage, ObjectIssue } from 'valibot';

type SnippetArgs = { isChanged?: boolean };

export type MainProps<TInput extends RemoteFormInput, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>> = Omit<
	SvelteHTMLElements['form'],
	'class'
> & {
	form: RemoteForm<TInput, TOutput>;
	schema: TSchema;
	inputs?: Snippet<[args?: SnippetArgs]>;
	children?: Snippet<[args?: SnippetArgs]>;
	buttons?: Snippet<[args?: SnippetArgs]>;
	formClass?: SvelteHTMLElements['form']['class'];
	OnIsChange?: (isChanged: boolean) => void;
};

class FormInputsContext<TInput extends RemoteFormInput, TOutput, TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>> {
	// ############### BEGIN PROPS ###############
	props!: MainProps<TInput, TOutput, TSchema>;

	readonly formAttributes = $derived.by(() => {
		const { form, schema, inputs, children, buttons, formClass, OnIsChange, ...attributes } = this.props;
		return attributes;
	});

	constructor(initialProps: MainProps<TInput, TOutput, TSchema>) {
		this.props = initialProps;
	}
	// ############### END PROPS ###############

	// ############### BEGIN STATES ###############
	readonly schemaFields = $derived(this.props.schema?.entries ? Object.keys(this.props.schema.entries) : []);
	readonly schemaFieldsCount = $derived(this.schemaFields.length);

	readonly initialData = new SvelteMap<string, unknown>();
	readonly currentData = new SvelteMap<string, unknown>();

	// Formda değişiklik olup olmadığının kontrolü
	readonly isChanged = $derived.by(() => {
		// schemaFieldsCount ile sayıları eşitlenene kadar false olmalı
		if (this.currentData.size < this.schemaFieldsCount) {
			return false;
		}

		// Her bir alanın mevcut değerini ilk değeriyle karşılaştır
		for (const [key, val] of this.currentData) {
			const initialVal = this.initialData.get(key);

			// Eğer değer bir dizi (Array) ise (örneğin çoklu seçim) elemanlarını karşılaştır
			if (Array.isArray(val) && Array.isArray(initialVal)) {
				if (val.length !== initialVal.length || val.some((v, i) => v !== initialVal[i])) {
					return true;
				}
			} else if (val !== initialVal) {
				return true;
			}
		}

		return false;
	});

	readonly watchIsChanged = () => {
		void this.isChanged;
		return untrack(() => this.props.OnIsChange?.(this.isChanged));
	};
	// ############### END STATES ###############

	getValibotMetadata(key?: unknown) {
		if (typeof key !== 'string' || !key) return;

		const schemaEntry = this.props.schema?.entries?.[key];
		if (!schemaEntry) return;

		const metadata = v.getMetadata(schemaEntry);
		return metadata;
	}
}

// ################################## BEGIN Export Form Context ##############################################
const key = Symbol('SLC-FORM-INPUTS-CONTEXT');

export function createFormInputsContext<
	TInput extends RemoteFormInput,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>(props: MainProps<TInput, TOutput, TSchema>) {
	const instance = new FormInputsContext<TInput, TOutput, TSchema>(props);
	setContext(key, instance);
	return instance;
}

export function getFormInputsContext<
	TInput extends RemoteFormInput,
	TOutput,
	TSchema extends ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
>() {
	const instance = getContext<FormInputsContext<TInput, TOutput, TSchema>>(key);
	if (!instance) {
		throw new Error('FormInputsContext not found');
	}
	return instance;
}
// ################################## END Export Form Context ##############################################
