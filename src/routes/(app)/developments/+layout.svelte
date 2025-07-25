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
					title: 'Tree (SLC Draft)',
					href: `/developments/components/tree`,
					icon: 'file-symlink'
				},

				{
					title: 'Tooltip (SLC)',
					href: `/developments/components/tooltip`,
					icon: 'file-symlink'
				},
				{
					title: 'Toast (zagjs ui)',
					href: `/developments/components/toast`,
					icon: 'file-symlink'
				},
				{
					title: 'Drawer Panel (SLC)',
					href: `/developments/components/drawer`,
					icon: 'file-symlink'
				},
				{
					title: 'Select (zagjs ui)',
					href: `/developments/components/select`,
					icon: 'file-symlink'
				},

				{
					title: 'Select (SLC)',
					href: `/developments/components/select-slc`,
					icon: 'file-symlink'
				},
				{
					title: 'Toast (SLC)',
					href: `/developments/components/toast-slc`,
					icon: 'file-symlink'
				},
				{
					title: 'Form Validation with SLC',
					href: `/developments/components/form-slc`,
					icon: 'file-symlink'
				},
				{
					title: 'Confirmation (SLC)',
					href: `/developments/components/confirmation`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
