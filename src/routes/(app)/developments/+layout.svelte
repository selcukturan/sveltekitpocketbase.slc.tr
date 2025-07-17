<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	/* import { getConfigContext } from '$lib/client/config.svelte'; */

	let { children }: ChildrenPropsType = $props();

	/* const config = getConfigContext(); */

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
					title: 'Form Validation with Superforms',
					href: `/developments/components/form`,
					icon: 'file-symlink'
				},
				{
					title: 'Form Validation with Tanstack',
					href: `/developments/components/form-tanstack`,
					icon: 'file-symlink'
				},
				{
					title: 'Tree (Draft)',
					href: `/developments/components/tree`,
					icon: 'file-symlink'
				},

				{
					title: 'Tooltip',
					href: `/developments/components/tooltip`,
					icon: 'file-symlink'
				},
				{
					title: 'Toast (zagjs ui)',
					href: `/developments/components/toast`,
					icon: 'file-symlink'
				},
				{
					title: 'Drawer Panel',
					href: `/developments/components/drawer`,
					icon: 'file-symlink'
				},
				{
					title: 'Select (zagjs ui)',
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
