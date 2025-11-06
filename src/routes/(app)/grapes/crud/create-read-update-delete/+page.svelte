<script lang="ts">
	import { getDefaultsFromSchema } from '$lib/utils/filter-string-helper';
	import { Page, Head } from '$lib/components/templates';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import { setParams, hashParam } from '$lib/utils/hash-url-helper';
	import { getOne } from './page.remote';
	import { oneParamsSchema } from './types';

	import { Drawer } from '$lib/components/base/drawer';
	import { confirm } from '$lib/components/base/confirm';

	import PageDataTable from './PageDataTable.svelte';
	import { Boundary } from '$lib/components/base/boundary';
	import { watch, watchOnce } from 'runed';

	const oneParamsDefaults = getDefaultsFromSchema(oneParamsSchema);

	const pageUrlHash = $derived(page.url.hash);
	let drawer = null as Drawer | null;
	let drawerCommand = $state({ cmd: '', id: '' });

	const drawerOpenTrigger = (cmd: string, id: string) => {
		setParams({ cmd, id });
	};
	const drawerClose = () => {
		if (!drawer) return;
		drawer.close();
	};

	// drawerOpen
	watch(
		() => pageUrlHash,
		(newHash) => {
			console.log(1);
			const cmd = hashParam('cmd', newHash) || '';
			const id = hashParam('id', newHash) || '';
			drawerCommand = { cmd, id };
			if (!drawer) return;
			if (cmd !== 'create' && cmd !== 'update' && cmd !== 'view') return;
			drawer.open();
			/* drawerCommand = { cmd, id };
			setParams({ ...drawerCommand }); */
			/* drawer.open(); */
			// drawerOpen(cmd, id);
		}
	);
</script>

<Head>
	<title>create-read-update-delete - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Table>
			<Boundary>
				<PageDataTable />
			</Boundary>
		</Page.Main.Table>
	</Page.Main>
	<Page.Footer>
		<div>
			<button
				onclick={() => {
					/* drawerOpen('view', `rjqbi24vn3f3k59`);
					const cmd = hashParam('cmd', pageUrlHash) || '';
					const id = hashParam('id', pageUrlHash) || ''; */
					/* drawerCommand = { cmd: 'view', id: 'rjqbi24vn3f3k59' };
					setParams({ ...drawerCommand }); */
					drawerOpenTrigger('view', `rjqbi24vn3f3k59`);
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				View
			</button>
			<button
				onclick={() => {
					drawerOpenTrigger('create', `sp7wfdu7zg85vue`);
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Create
			</button>
			<button
				onclick={() => {
					drawerOpenTrigger('update', `ydmi70g2ghqx2nb`);
				}}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Update
			</button>
			<button
				onclick={() => setParams({ cmd: 'delete', id: `${Math.round(Math.random() * 1000)}` })}
				class="bg-warning-300 p-3 disabled:opacity-50"
			>
				Delete
			</button>
		</div>
	</Page.Footer>
	<Page.Drawer>
		<Drawer
			bind:this={drawer}
			onBeforeClose={async () => {
				const shouldClose = await confirm({
					message: 'Bu paneli kapatmak istediğinize emin misiniz?',
					yes: 'Evet',
					no: 'Hayır'
				});

				if (shouldClose) {
					/* drawerCommand = { cmd: '', id: '' }; */
					drawerOpenTrigger('', '');
				}
				return shouldClose;
			}}
		>
			<p>This is a drawer for creating a new record.</p>
			<p>Current CMD: {drawerCommand.cmd}</p>
			<p>Current ID: {drawerCommand.id}</p>
			<button onclick={() => drawerClose()} class="bg-error-300 p-3">Close Drawer</button>
			<p>Drawer Content</p>
			<Boundary>
				{#if drawerCommand.cmd !== ''}
					<pre>
						{JSON.stringify(await getOne({ ...oneParamsDefaults, id: drawerCommand.id }), null, 2)}
					</pre>
				{/if}
			</Boundary>
		</Drawer>
	</Page.Drawer>
</Page>
