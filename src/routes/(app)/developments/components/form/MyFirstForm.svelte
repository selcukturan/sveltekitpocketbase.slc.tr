<script lang="ts">
	// superform
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';

	// changeable schema
	import { myFirstFormSchema } from './schema';

	// inputs
	import Form from '$lib/components/inputs/Form.svelte';
	import TextInput from '$lib/components/inputs/TextInput.svelte';
	import Submit from '$lib/components/inputs/Submit.svelte';
	import Message from '$lib/components/inputs/Message.svelte';
	import Debug from '$lib/components/inputs/Debug.svelte';

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
	<TextInput field="text_optional" {frm} />
	<TextInput field="text_optional_default" {frm} />
	<TextInput field="text_required" {frm} />
	<Submit {frm} />
	<Message {frm} />
</Form>

<Debug {frm} label="My First Form Data" />
