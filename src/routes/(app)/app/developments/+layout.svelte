<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Developments',
			child: [
				{
					title: 'Introduction',
					href: `/app/developments`,
					icon: 'file_symlink',
					root: true
				}
			]
		},
		{
			title: 'Components',
			child: [
				{
					title: 'Icons',
					href: `/app/developments/components`,
					icon: 'file_symlink'
				},
				{
					title: 'Notifications',
					href: `/app/developments/components/notifications`,
					icon: 'file_symlink'
				},
				{
					title: 'X',
					href: `/app/developments/components/form-slc`,
					icon: 'file_symlink'
				},

				{
					title: 'Tooltip',
					href: `/app/developments/components/tooltip`,
					icon: 'file_symlink'
				},
				{
					title: 'Toast',
					href: `/app/developments/components/toast`,
					icon: 'file_symlink'
				},
				{
					title: 'Confirmation',
					href: `/app/developments/components/confirmation`,
					icon: 'file_symlink'
				},
				{
					title: 'Drawer Panel',
					href: `/app/developments/components/drawer`,
					icon: 'file_symlink'
				},

				{
					title: 'Inputs',
					href: `/app/developments/components/select`,
					icon: 'file_symlink'
				},

				{
					title: 'X',
					href: `/app/developments/components/remote-functions`,
					icon: 'file_symlink'
				},
				{
					title: 'Pagination',
					href: `/app/developments/components/link-routing`,
					icon: 'file_symlink'
				},
				{
					title: 'Toggler',
					href: `/app/developments/components/empty`,
					icon: 'file_symlink'
				},
				{
					title: 'Tree (Draft)',
					href: `/app/developments/components/tree`,
					icon: 'file_symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
