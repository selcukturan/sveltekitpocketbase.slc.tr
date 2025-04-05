<script lang="ts">
	import type { ColumnDef } from '$lib/components/base/data-table-tanstack/tanstack';
	import { BasicDataTable } from '$lib/components/base/data-table-tanstack/provider';
	import { Head, Page, Header, Main, Footer } from '$lib/components/base/templates';

	type Person = {
		firstName: string;
		lastName: string;
		email: string;
		age: number;
		visits: number;
		status: string;
		progress: number;
	};

	function generatePersons(count: number): Person[] {
		const firstNames = ['tanner', 'tandy', 'joe'];
		const lastNames = ['linsley', 'miller', 'dirte'];
		const statuses = ['In Relationship', 'Single', 'Complicated'];

		const persons: Person[] = [];
		for (let i = 0; i < count; i++) {
			const person: Person = {
				firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
				lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
				email: '',
				age: Math.floor(Math.random() * 60) + 18,
				visits: Math.floor(Math.random() * 100),
				status: statuses[Math.floor(Math.random() * statuses.length)],
				progress: Math.floor(Math.random() * 100)
			};
			persons.push(person);
		}
		return persons;
	}
	const data: Person[] = $state(generatePersons(100));

	const columns: ColumnDef<Person>[] = $state([
		{
			accessorKey: 'firstName',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			accessorFn: (row) => row.lastName,
			id: 'lastName',
			cell: (info) => info.getValue(),
			header: () => 'Last Name',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'email',
			header: () => 'Email',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'age',
			header: () => 'Age',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'visits',
			header: () => 'Visits',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'status',
			header: 'Status',
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'progress',
			header: 'Profile Progress',
			footer: (info) => info.column.id
		}
	]);
</script>

<Head>
	<title>TanStack Table - SLC Web Applications</title>
	<meta name="description" content="TanStack Table - SLC Web Applications" />
</Head>
<Page>
	<Header class="flex gap-10 border-b bg-surface-50">
		<h1>Page Header</h1>
	</Header>
	<Main>
		<BasicDataTable {data} {columns} />
	</Main>
	<Footer class="flex gap-10 border-t bg-surface-50">
		<p>Footer</p>
	</Footer>
</Page>
