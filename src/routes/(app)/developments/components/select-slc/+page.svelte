<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { Select } from '$lib/components/base/select';

	import { SelectPopover } from '$lib/components/base/select';
</script>

<Head>
	<title>SLC Select - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Page Header Text</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<Select />

			<SelectPopover
				data={[
					{ label: '20', value: '20' },
					{ label: '21', value: '21' }
				]}
			/>
			<SelectPopover
				data={[
					{ label: '24', value: '24' },
					{ label: '25', value: '25' }
				]}
			/>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Text</p>
	</Page.Footer>
</Page>
