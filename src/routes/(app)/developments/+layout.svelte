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
					icon: 'ri-file-line',
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
					icon: 'ri-file-line'
				},
				{
					title: 'Form Validation with Superforms',
					href: `/developments/components/form`,
					icon: 'ri-file-line'
				},
				{
					title: 'Form Validation with Tanstack',
					href: `/developments/components/form-tanstack`,
					icon: 'ri-file-line'
				},
				{
					title: 'Tree (SLC Draft)',
					href: `/developments/components/tree`,
					icon: 'ri-file-line'
				},

				{
					title: 'Tooltip (SLC)',
					href: `/developments/components/tooltip`,
					icon: 'ri-file-line'
				},
				{
					title: 'Toast (zagjs ui)',
					href: `/developments/components/toast`,
					icon: 'ri-file-line'
				},
				{
					title: 'Drawer Panel (SLC)',
					href: `/developments/components/drawer`,
					icon: 'ri-file-line'
				},
				{
					title: 'Select (zagjs ui)',
					href: `/developments/components/select`,
					icon: 'ri-file-line'
				},

				{
					title: 'Select (SLC)',
					href: `/developments/components/select-slc`,
					icon: 'ri-file-line'
				},
				{
					title: 'Toast (SLC)',
					href: `/developments/components/toast-slc`,
					icon: 'ri-file-line'
				},
				{
					title: 'Form Validation with SLC',
					href: `/developments/components/form-slc`,
					icon: 'ri-file-line'
				},
				{
					title: 'Confirmation (SLC)',
					href: `/developments/components/confirmation`,
					icon: 'ri-file-line'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
