<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	/* import { getConfigStates } from '$lib/client/config.svelte'; */

	let { children }: ChildrenPropsType = $props();

	/* const config = getConfigStates(); */

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Data Table',
			child: [
				{
					title: 'Introduction',
					href: `/data-table`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'Demos',
			child: [
				{
					title: 'Introduction',
					href: `/data-table/demos`,
					icon: 'file-symlink'
				},
				{
					title: 'Common Features',
					href: `/data-table/demos/common-features`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
