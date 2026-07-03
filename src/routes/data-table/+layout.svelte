<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Data Table',
			child: [
				{
					title: 'Introduction',
					href: `/data-table`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'Demos',
			child: [
				{
					title: 'Introduction',
					href: `/data-table/demos`,
					icon: 'file-symlink'
				},
				{
					title: 'Common Features',
					href: `/data-table/demos/common-features`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children?.()}
</PageLayout>
