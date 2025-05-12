<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	import { getGlobalStates } from '$lib/client/global.svelte';

	let { children }: ChildrenPropsType = $props();

	const globalStates = getGlobalStates();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Grapes',
			child: [
				{
					title: 'Introduction',
					href: `/grapes`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'CRUD',
			child: [
				{
					title: 'Introduction',
					href: `/grapes/crud`,
					icon: 'file-symlink'
				},
				{
					title: 'Create, Read, Update, Delete',
					href: `/grapes/crud/create-read-update-delete`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
