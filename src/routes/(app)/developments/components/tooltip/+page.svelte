<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { getGlobalContext } from '$lib/client/app/global.svelte';
	import tooltip from '$lib/client/actions/tooltip';

	const global = getGlobalContext();
</script>

<Head>
	<title>Tooltip - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Tooltip Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-96 w-96 flex-col items-center justify-center">
				<span use:tooltip={{ text: 'This is a SLC tooltip.', position: global.isMobileBreakpoint ? 'bottom' : 'right' }}>Hover Me</span>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Tooltip Page Footer</p>
	</Page.Footer>
</Page>
