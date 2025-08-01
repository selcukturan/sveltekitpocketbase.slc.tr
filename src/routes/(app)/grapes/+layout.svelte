<script lang="ts">
	import { PageLayout, type PageSidebarDataType, type ChildrenPropsType } from '$lib/components/layouts/page';

	let { children }: ChildrenPropsType = $props();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Grapes',
			child: [
				{
					title: 'Introduction',
					href: `/grapes`,
					icon: 'ri-file-line',
					root: true
				}
			]
		},
		{
			title: 'CRUD',
			child: [
				{
					title: 'Introduction',
					href: `/grapes/crud`,
					icon: 'ri-file-line'
				},
				{
					title: 'Create, Read, Update, Delete',
					href: `/grapes/crud/create-read-update-delete`,
					icon: 'ri-file-line'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
