<script lang="ts">
	import type { PageProps } from './$types';
	import { formSchema } from './schema';

	import Form from '$lib/components/base/form';

	let { data, form }: PageProps = $props();
</script>

<Form schema={formSchema} defaultValues={data.formInitialData}>
	<Form.iTextbox name="text_optional" />
	<Form.iDatetime name="datetime_optional" />
	<button type="submit">Submit</button>
	<div>{data.formInitialData.datetime_optional}</div>
</Form>
