<script lang="ts">
	import { Head, Page } from '$lib/components/templates';
	const rolePermFull = {
		companys: {
			bagcilik: {
				years: [2020, 2021, 2022, 2023, 2024, 2025],
				storage: ['storage1', 'storage2', 'storage3']
			},
			pazarlama: {
				years: [2020, 2021, 2022, 2023, 2024, 2025],
				storage: ['storage1', 'storage2', 'storage3']
			}
		},
		menus: {
			'/': {
				label: 'Home',
				permissions: ['create', 'read', 'update', 'delete']
			},
			'/developments': {
				label: 'Developments',
				permissions: ['create', 'read', 'update', 'delete', 'share']
			}
		}
	};
	const rolePermUser = {
		companys: {
			bagcilik: {
				years: [2024, 2025],
				storage: ['storage1']
			},
			pazarlama: {
				years: [2024]
			}
		},
		menus: {
			'/': {
				label: 'Home',
				permissions: ['read']
			},
			'/developments': {
				label: 'Developments',
				permissions: ['create', 'read', 'update', 'delete']
			}
		}
	};
</script>

<Head>
	<title>form-tanstack Root - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>form-tanstack Header</Page.Header>
	<Page.Main>form-tanstack Root</Page.Main>
	<Page.Footer>form-tanstack Footer</Page.Footer>
</Page>
