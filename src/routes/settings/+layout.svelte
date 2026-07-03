<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Settings',
			child: [
				{
					title: 'Introduction',
					href: `/settings`,
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
					href: `/settings/system`,
					icon: 'file-symlink',
					root: true
				},
				{
					title: 'Application',
					href: `/settings/system/application`,
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
