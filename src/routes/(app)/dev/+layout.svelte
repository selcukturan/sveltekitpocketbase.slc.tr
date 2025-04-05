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
					href: `/dev`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'Components',
			child: [
				{
					title: 'Components Root',
					href: `/dev/components`,
					icon: 'file-symlink'
				},
				{
					title: 'Virtual (ikili)',
					href: `/dev/components/virtual`,
					icon: 'file-symlink'
				},
				{
					title: 'Virtual (döngü)',
					href: `/dev/components/virtual-dongu`,
					icon: 'file-symlink'
				},
				{
					title: 'Tabular',
					href: `/dev/components/tabular`,
					icon: 'file-symlink'
				},
				{
					title: 'Tanstack',
					href: `/dev/components/tanstack`,
					icon: 'file-symlink'
				},
				{
					title: 'Tooltip',
					href: `/dev/components/tooltip`,
					icon: 'file-symlink'
				},
				{
					title: 'Toast',
					href: `/dev/components/toast`,
					icon: 'file-symlink'
				},
				{
					title: 'Button',
					href: `/dev/components/button`,
					icon: 'file-symlink'
				},
				{
					title: 'Toggler',
					href: `/dev/components/toggler`,
					icon: 'file-symlink'
				},
				{
					title: 'Select',
					href: `/dev/components/select`,
					icon: 'file-symlink'
				},
				{
					title: 'Data Table',
					href: `/dev/components/data-table`,
					icon: 'file-symlink'
				},
				{
					title: 'Test Data Table',
					href: `/dev/components/table-test`,
					icon: 'file-symlink'
				},
				{
					title: 'InputText',
					href: `/dev/components/input-text`,
					icon: 'file-symlink'
				},
				{
					title: 'InputNumber',
					href: `/dev/components/input-number`,
					icon: 'file-symlink'
				},
				{
					title: 'InputDateTime',
					href: `/dev/components/input-datetime`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
