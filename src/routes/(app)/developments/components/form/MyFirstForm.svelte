<script lang="ts">
	// superform
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';

	// changeable schema
	import { myFirstFormSchema } from './schema';

	// inputs
	import Form from '$lib/components/base/form';

	// props
	let { data }: { data: SuperValidated<Infer<typeof myFirstFormSchema>> } = $props();

	// client api
	const frm = superForm(data, {
		dataType: 'json',
		validators: valibot(myFirstFormSchema),
		validationMethod: 'onblur',
		customValidity: true,
		autoFocusOnError: 'detect',
		resetForm: false,
		delayMs: 0,
		timeoutMs: 2000,
		taintedMessage: () => {
			return new Promise((resolve) => {
				alert(`confirm - Do you want to leave? - Changes you made may not be saved. resolve:${resolve}`);
			});
		}
	});
</script>

<Form {frm}>
	<Form.iText {frm} field="text_optional" />
	<Form.iText {frm} field="text_required" />
	<Form.iDate {frm} field="date_optional" />
	<Form.iDate {frm} field="date_required" />
	<Form.iDateTime {frm} field="datetime_optional" />
	<Form.iDateTime {frm} field="datetime_required" />
	<Form.iNumberInteger {frm} field="integer_number_optional" />
	<Form.iNumberInteger {frm} field="integer_number_required" />
	<Form.iNumberDecimal {frm} field="decimal_number_optional" />
	<Form.iNumberDecimal {frm} field="decimal_number_required" />
	<Form.iSubmit {frm} />
</Form>

<Form.Message {frm} />
<Form.Debug {frm} label="My First Form Data" />
