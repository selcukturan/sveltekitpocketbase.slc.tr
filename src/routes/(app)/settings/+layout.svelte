<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	/* import { getConfigContext } from '$lib/client/config.svelte'; */

	let { children }: ChildrenPropsType = $props();

	/* const config = getConfigContext(); */

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Settings',
			child: [
				{
					title: 'Introduction',
					href: `/settings`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'System',
			child: [
				{
					title: 'Introduction',
					href: `/settings/system`,
					icon: 'file-symlink',
					root: true
				},
				{
					title: 'application',
					href: `/settings/system/application`,
					icon: 'file-symlink',
					root: true
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
