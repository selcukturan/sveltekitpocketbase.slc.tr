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
					icon: 'ri-file-line',
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
					icon: 'ri-file-line',
					root: true
				},
				{
					title: 'application',
					href: `/settings/system/application`,
					icon: 'ri-file-line',
					root: true
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
