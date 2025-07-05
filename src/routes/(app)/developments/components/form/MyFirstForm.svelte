<script lang="ts">
	// superform
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';

	// changeable schema
	import { myFirstFormSchema } from './schema';

	// inputs
	import Form from '$lib/components/base/form';
	import Message from '$lib/components/base/form/Message.svelte';
	import Debug from '$lib/components/base/form/Debug.svelte';

	// props
	let { data }: { data: SuperValidated<Infer<typeof myFirstFormSchema>> } = $props();

	// client api
	const frm = superForm(data, {
		dataType: 'json',
		validators: valibot(myFirstFormSchema),
		validationMethod: 'auto',
		customValidity: false,
		autoFocusOnError: 'detect',
		resetForm: false,
		delayMs: 500,
		timeoutMs: 2000,
		taintedMessage: () => {
			return new Promise((resolve) => {
				alert(`confirm - Do you want to leave? - Changes you made may not be saved. resolve:${resolve}`);
			});
		}
	});
</script>

<Form {frm}>
	<Form.iText field="text_optional" {frm} />
	<Form.iText field="text_required" {frm} />
	<Form.iDate field="date_optional" {frm} />
	<Form.iDatetime field="datetime_optional" {frm} />
	<Form.iSubmit {frm} />
	<Message {frm} />
</Form>

<Debug {frm} label="My First Form Data" />
