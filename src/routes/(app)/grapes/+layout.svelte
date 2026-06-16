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
					icon: 'file-symlink',
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
					icon: 'file-symlink'
				},
				{
					title: 'Simple CRUD',
					href: `/grapes/crud/simple`,
					icon: 'file-symlink'
				},
				{
					title: 'Create, Read, Update, Delete',
					href: `/grapes/crud/create-read-update-delete`,
					icon: 'file-symlink'
				}
			]
		}
	];
</script>

<PageLayout {pageSidebardata}>
	{@render children()}
</PageLayout>
