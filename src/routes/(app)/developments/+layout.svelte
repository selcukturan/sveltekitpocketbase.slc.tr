<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

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
					title: 'Icons',
					href: `/developments/components`,
					icon: 'file-symlink'
				},
				{
					title: 'X',
					href: `/developments/components/form`,
					icon: 'file-symlink'
				},
				{
					title: 'X',
					href: `/developments/components/form-slc`,
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
					title: 'Confirmation',
					href: `/developments/components/confirmation`,
					icon: 'file-symlink'
				},
				{
					title: 'Drawer Panel',
					href: `/developments/components/drawer`,
					icon: 'file-symlink'
				},

				{
					title: 'X',
					href: `/developments/components/select`,
					icon: 'file-symlink'
				},

				{
					title: 'X',
					href: `/developments/components/remote-functions`,
					icon: 'file-symlink'
				},
				{
					title: 'Pagination',
					href: `/developments/components/link-routing`,
					icon: 'file-symlink'
				},
				{
					title: 'Toggler',
					href: `/developments/components/empty`,
					icon: 'file-symlink'
				},
				{
					title: 'Tree (Draft)',
					href: `/developments/components/tree`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
