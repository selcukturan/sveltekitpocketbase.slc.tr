<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { getUser } from '$lib/remotes/guarded.remote';

	let user = await getUser();
</script>

<Head>
	<title>Dashboard - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<button onclick={() => getUser().refresh()}> Check getUser() {user?.email}</button>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-full w-full flex-col gap-1 overflow-hidden">
				<a
					href="https://github.com/selcukturan/sveltekitpocketbase.slc.tr"
					class="bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
					target="_blank"
					rel="noopener noreferrer"
				>
					Go to project github page
				</a>
				<pre>{JSON.stringify(user, null, 2)}</pre>
				<a
					href="/data-table#filter=eJyrVipRslJKV9JRygfSampARrKSVXQ1WDgPyEsD0iWZJTmpUCV1QLoMSBen5ijVxtYCAPqwEJk&recordId=test"
					class=" bg-primary-200 text-primary-800 hover:bg-primary-300 active:bg-primary-400 rounded-md p-3 text-center"
				>
					Go DataTable with filter and recordId in hash
				</a>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<!-- <Page.Footer>Footer</Page.Footer> -->
</Page>
