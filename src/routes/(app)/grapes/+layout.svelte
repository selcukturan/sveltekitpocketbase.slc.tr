<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	/* import { getConfigContext } from '$lib/client/config.svelte'; */

	let { children }: ChildrenPropsType = $props();

	/* const config = getConfigContext(); */

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Grapes',
			child: [
				{
					title: 'Introduction',
					href: `/grapes`,
					icon: 'ri-file-line',
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
					icon: 'ri-file-line'
				},
				{
					title: 'Create, Read, Update, Delete',
					href: `/grapes/crud/create-read-update-delete`,
					icon: 'ri-file-line'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
