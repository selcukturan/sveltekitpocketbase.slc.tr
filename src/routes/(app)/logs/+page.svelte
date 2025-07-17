<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import type { PageProps } from './$types';
	const props: PageProps = $props();
</script>

<Head>
	<title>DASHBOARD - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<!-- <Page.Header>
		<p>Form Page Header</p>
	</Page.Header> -->
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-full w-full flex-col overflow-hidden">
				<h6>LOGS PAGE PROPS</h6>
				<p>######## USER ########</p>
				<pre>{JSON.stringify(props.data.user, null, 2)}</pre>
				<p>######## acl_roles_perms_menu ########</p>
				<pre>{JSON.stringify(props.data.acl_roles_perms_menu, null, 2)}</pre>
				######## envTest ########
				<pre>{JSON.stringify(props.data.envTest, null, 2)}</pre>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<!-- <Page.Footer>Footer</Page.Footer> -->
</Page>
