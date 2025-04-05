<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	import { getGlobalStates } from '$lib/states/global.svelte';

	let { children }: ChildrenPropsType = $props();

	const globalStates = getGlobalStates();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Home',
			child: [
				{
					title: 'Development',
					href: `/dlc`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'MDL Aktarım',
			child: [
				{
					title: 'mdl-upload-files',
					href: `/dlc/mdl-upload-files`,
					icon: 'file-symlink'
				},
				{
					title: 'mdl-write-files',
					href: `/dlc/mdl-write-files`,
					icon: 'file-symlink'
				},
				{
					title: 'mdl-download-files',
					href: `/dlc/mdl-download-files`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
