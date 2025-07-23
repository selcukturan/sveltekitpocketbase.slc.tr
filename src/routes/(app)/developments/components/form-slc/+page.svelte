<script lang="ts">
	import { Page, Head } from '$lib/components/templates';

	import { myFirstFormSchema } from './schema';
	import Form from '$lib/components/base/form';

	const formInitialData = {
		text_optional: '1'
	};
</script>

<Head>
	<title>SLC - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Page Header Datetime</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<Form schema={myFirstFormSchema} defaultValues={formInitialData}>
				<Form.iTextbox name="text_optional" />
			</Form>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Datetime</p>
	</Page.Footer>
</Page>
