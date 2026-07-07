<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Settings',
			child: [
				{
					title: 'Introduction',
					href: `/app/settings`,
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
					href: `/app/settings/system`,
					icon: 'file-symlink',
					root: true
				},
				{
					title: 'Application',
					href: `/app/settings/system/application`,
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
