<script lang="ts">
	import {
		PageLayout,
		type PageSidebarDataType,
		type ChildrenPropsType
	} from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

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
					title: 'Form Validation with SLC',
					href: `/developments/components/form-slc`,
					icon: 'ri-file-line'
				},

				{
					title: 'Tooltip',
					href: `/developments/components/tooltip`,
					icon: 'ri-file-line'
				},
				{
					title: 'Toast',
					href: `/developments/components/toast`,
					icon: 'ri-file-line'
				},
				{
					title: 'Confirmation',
					href: `/developments/components/confirmation`,
					icon: 'ri-file-line'
				},
				{
					title: 'Drawer Panel',
					href: `/developments/components/drawer`,
					icon: 'ri-file-line'
				},

				{
					title: 'Select',
					href: `/developments/components/select`,
					icon: 'ri-file-line'
				},

				{
					title: 'Remote [query]',
					href: `/developments/components/remote-query`,
					icon: 'ri-file-line'
				},
				{
					title: 'Remote [form]',
					href: `/developments/components/remote-form`,
					icon: 'ri-file-line'
				},
				{
					title: 'Remote [command]',
					href: `/developments/components/remote-command`,
					icon: 'ri-file-line'
				},
				{
					title: 'Tree (Draft)',
					href: `/developments/components/tree`,
					icon: 'ri-file-line'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
