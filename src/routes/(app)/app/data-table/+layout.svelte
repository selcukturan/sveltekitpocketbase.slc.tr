<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Data Table',
			child: [
				{
					title: 'Introduction',
					href: `/app/data-table`,
					icon: 'file_symlink',
					root: true
				}
			]
		},
		{
			title: 'Demos',
			child: [
				{
					title: 'Introduction',
					href: `/app/data-table/demos`,
					icon: 'file_symlink'
				},
				{
					title: 'Common Features',
					href: `/app/data-table/demos/common-features`,
					icon: 'file_symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children?.()}
</PageLayout>
