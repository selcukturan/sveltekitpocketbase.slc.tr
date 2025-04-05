<script lang="ts">
	import type { PageSidebarDataType, ChildrenPropsType } from '$lib/components/base/page-layout/types';
	import { PageLayout } from '$lib/components/base/page-layout/view';
	import { getGlobalStates } from '$lib/states/global.svelte';

	let { children }: ChildrenPropsType = $props();

	const globalStates = getGlobalStates();

	let pageSidebardata: PageSidebarDataType[] = [
		{
			title: 'Home',
			child: [
				{
					title: 'users',
					href: `/settings`,
					icon: 'users',
					root: true
				}
			]
		},
		{
			title: 'CRUD',
			child: [
				{
					title: 'Create,Read,Update,Delete',
					href: `/settings/crud`,
					icon: 'file-symlink',
					root: true
				}
			]
		},
		{
			title: 'Superforms',
			child: [
				{
					title: 'posts Basic Form',
					href: `/settings/superform-basic`,
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
