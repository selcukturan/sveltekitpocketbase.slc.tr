<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	import { getGlobalStates } from '$lib/states/global.svelte';

	let { children }: ChildrenPropsType = $props();

	const globalStates = getGlobalStates();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Developments',
			child: [
				{
					title: 'Introduction',
					href: `/developments`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'Components',
			child: [
				{
					title: 'Introduction',
					href: `/developments/components`,
					icon: 'file-symlink'
				},
				{
					title: 'Tree',
					href: `/developments/components/tree`,
					icon: 'file-symlink'
				},

				{
					title: 'Tooltip',
					href: `/developments/components/tooltip`,
					icon: 'file-symlink'
				},
				{
					title: 'Toast',
					href: `/developments/components/toast`,
					icon: 'file-symlink'
				},
				{
					title: 'Button',
					href: `/developments/components/button`,
					icon: 'file-symlink'
				},
				{
					title: 'Select',
					href: `/developments/components/select`,
					icon: 'file-symlink'
				},

				{
					title: 'InputText',
					href: `/developments/components/input-text`,
					icon: 'file-symlink'
				},
				{
					title: 'InputNumber',
					href: `/developments/components/input-number`,
					icon: 'file-symlink'
				},
				{
					title: 'InputDateTime',
					href: `/developments/components/input-datetime`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
