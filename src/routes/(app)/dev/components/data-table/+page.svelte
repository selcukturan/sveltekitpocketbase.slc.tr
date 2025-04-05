<script lang="ts">
	import type { SettingsType } from '$lib/components/base/data-table/types';
	import { DataTable } from '$lib/components/base/data-table/view';
	import { Head, Page, Header, Main, Footer } from '$lib/components/base/templates';

	type DataType = {
		EmployeeID: number;
		FirstName: string;
		LastName: string;
		ReportsTo: number;
		Country: string;
		Title: string;
		HireDate: string;
		BirthDate: string;
		City: string;
		Address: string;
	};
	let data: DataType[] = $state([
		{
			EmployeeID: 1,
			FirstName: 'Selçuk',
			LastName: 'TURAN',
			ReportsTo: 2,
			Country: 'USA',
			Title: 'Sales Representative',
			HireDate: '1992-05-01 00:00:00',
			BirthDate: '1948-12-08 00:00:00',
			City: 'Seattle',
			Address: '507 - 20th Ave. E.Apt. 2A'
		},
		{
			EmployeeID: 2,
			FirstName: 'Andrew',
			LastName: 'Fuller',
			ReportsTo: 1,
			Country: 'USA',
			Title: 'Vice President, Sales',
			HireDate: '1992-08-14 00:00:00',
			BirthDate: '1952-02-19 00:00:00',
			City: 'Tacoma',
			Address: '908 W. Capital Way'
		},
		{
			EmployeeID: 3,
			FirstName: 'Janet',
			LastName: 'Leverling',
			ReportsTo: 2,
			Country: 'USA',
			Title: 'Sales Representative',
			HireDate: '1992-04-01 00:00:00',
			BirthDate: '1963-08-30 00:00:00',
			City: 'Kirkland',
			Address: '722 Moss Bay Blvd.'
		},
		{
			EmployeeID: 4,
			FirstName: 'Margaret',
			LastName: 'Peacock',
			ReportsTo: 2,
			Country: 'USA',
			Title: 'Sales Representative',
			HireDate: '1993-05-03 00:00:00',
			BirthDate: '1937-09-19 00:00:00',
			City: 'Redmond',
			Address: '4110 Old Redmond Rd.'
		},
		{
			EmployeeID: 5,
			FirstName: 'Steven',
			LastName: 'Buchanan',
			ReportsTo: 2,
			Country: 'UK',
			Title: 'Sales Manager',
			HireDate: '1993-10-17 00:00:00',
			BirthDate: '1955-03-04 00:00:00',
			City: 'London',
			Address: '14 Garrett Hill'
		},
		{
			EmployeeID: 6,
			FirstName: 'Michael',
			LastName: 'Suyama',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1993-10-17 00:00:00',
			BirthDate: '1963-07-02 00:00:00',
			City: 'London',
			Address: 'Coventry House Miner Rd.'
		},
		{
			EmployeeID: 7,
			FirstName: 'Robert',
			LastName: 'King',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-01-02 00:00:00',
			BirthDate: '1960-05-29 00:00:00',
			City: 'London',
			Address: 'Edgeham Hollow Winchester Way'
		},
		{
			EmployeeID: 8,
			FirstName: 'Laura',
			LastName: 'Callahan',
			ReportsTo: 2,
			Country: 'USA',
			Title: 'Inside Sales Coordinator',
			HireDate: '1994-03-05 00:00:00',
			BirthDate: '1958-01-09 00:00:00',
			City: 'Seattle',
			Address: '4726 - 11th Ave. N.E.'
		},
		{
			EmployeeID: 9,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		},
		{
			EmployeeID: 10,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		},
		{
			EmployeeID: 11,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		},
		{
			EmployeeID: 12,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		},
		{
			EmployeeID: 13,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		},
		{
			EmployeeID: 14,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		}
	]);

	let settings: SettingsType = $state({
		columns: [
			{ label: 'First Name', field: 'FirstName', type: 'string', resizeable: true, align: 'left', width: '100px' },
			{
				label: 'Last Name',
				field: 'LastName',
				type: 'string',
				resizeable: true,
				editable: true,
				hidden: false,
				align: 'left',
				width: 'minmax(100px,1.25fr)'
			},
			{
				label: 'Title',
				field: 'Title',
				type: 'string',
				resizeable: true,
				editable: true,
				align: 'center',
				alignHeader: 'left',
				width: 'minmax(100px,1.25fr)'
			},
			{ label: 'EmployeeID', field: 'EmployeeID', type: 'number', resizeable: true, editable: true, align: 'right', width: 'minmax(100px,1.25fr)' },
			{ label: 'ReportsTo', field: 'ReportsTo', type: 'number', resizeable: true, editable: true, align: 'center', width: 'minmax(100px,1.25fr)' },
			{ label: 'Hire Date', field: 'HireDate', type: 'string', resizeable: true, align: 'center', width: 'minmax(150px,1.25fr)' },
			{ label: 'Address', field: 'Address', type: 'string', resizeable: true, align: 'center', width: 'minmax(150px,1.25fr)' },
			{ label: 'City', field: 'City', type: 'string', resizeable: true, align: 'center', width: 'minmax(150px,1.25fr)' },
			{ label: 'Country', field: 'Country', type: 'string', resizeable: true, hidden: true, align: 'center', width: '50px' }
		],
		footers: [
			{
				EmployeeID: 'avg(4)',
				FirstName: 'cnt()',
				ReportsTo: 'sum(2)',
				Address: 'str(bu bir mesaj.ğüşiöç)'
			}
		]
	});

	const hanleDataChange = () => {
		/* columns[0].width = '100px'; */
		data[0].FirstName = 'Selçuk2';
		data[0].LastName = 'TURAN2';
		data[0].ReportsTo = 2;
		data[0].Country = 'USA2';
		data[0].Title = 'Sales Representative2';
		data[0].HireDate = '1992-05-01 00:00:00';
		data[0].BirthDate = '1948-12-08 00:00:00';
		data[0].City = 'Seattle2';
		data[0].Address = '507 - 20th Ave. E.Apt. 2A2';
	};

	const hanleDataDelete = () => {
		data.splice(0, 1);
	};

	const hanleDataAdd = () => {
		data.push({
			EmployeeID: 15,
			FirstName: 'Anne',
			LastName: 'Dodsworth',
			ReportsTo: 5,
			Country: 'UK',
			Title: 'Sales Representative',
			HireDate: '1994-11-15 00:00:00',
			BirthDate: '1966-01-27 00:00:00',
			City: 'London',
			Address: '7 Houndstooth Rd.'
		});
	};

	const hanleDataFilter = () => {
		data = data.filter((item) => {
			// Öncelikle, EmployeeID'nin null veya undefined olmadığını kontrol edin
			// ve bir sayı olduğundan emin olun.
			const employeeID = item.EmployeeID;
			return employeeID != null && typeof employeeID === 'number' && employeeID > 10;
		});
	};

	const handleDataClearFilter = () => {
		data = [
			{
				EmployeeID: 1,
				FirstName: 'Selçuk',
				LastName: 'TURAN',
				ReportsTo: 2,
				Country: 'USA',
				Title: 'Sales Representative',
				HireDate: '1992-05-01 00:00:00',
				BirthDate: '1948-12-08 00:00:00',
				City: 'Seattle',
				Address: '507 - 20th Ave. E.Apt. 2A'
			},
			{
				EmployeeID: 2,
				FirstName: 'Andrew',
				LastName: 'Fuller',
				ReportsTo: 2,
				Country: 'USA',
				Title: 'Vice President, Sales',
				HireDate: '1992-08-14 00:00:00',
				BirthDate: '1952-02-19 00:00:00',
				City: 'Tacoma',
				Address: '908 W. Capital Way'
			},
			{
				EmployeeID: 3,
				FirstName: 'Janet',
				LastName: 'Leverling',
				ReportsTo: 2,
				Country: 'USA',
				Title: 'Sales Representative',
				HireDate: '1992-04-01 00:00:00',
				BirthDate: '1963-08-30 00:00:00',
				City: 'Kirkland',
				Address: '722 Moss Bay Blvd.'
			},
			{
				EmployeeID: 4,
				FirstName: 'Margaret',
				LastName: 'Peacock',
				ReportsTo: 2,
				Country: 'USA',
				Title: 'Sales Representative',
				HireDate: '1993-05-03 00:00:00',
				BirthDate: '1937-09-19 00:00:00',
				City: 'Redmond',
				Address: '4110 Old Redmond Rd.'
			},
			{
				EmployeeID: 5,
				FirstName: 'Steven',
				LastName: 'Buchanan',
				ReportsTo: 2,
				Country: 'UK',
				Title: 'Sales Manager',
				HireDate: '1993-10-17 00:00:00',
				BirthDate: '1955-03-04 00:00:00',
				City: 'London',
				Address: '14 Garrett Hill'
			},
			{
				EmployeeID: 6,
				FirstName: 'Michael',
				LastName: 'Suyama',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1993-10-17 00:00:00',
				BirthDate: '1963-07-02 00:00:00',
				City: 'London',
				Address: 'Coventry House Miner Rd.'
			},
			{
				EmployeeID: 7,
				FirstName: 'Robert',
				LastName: 'King',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-01-02 00:00:00',
				BirthDate: '1960-05-29 00:00:00',
				City: 'London',
				Address: 'Edgeham Hollow Winchester Way'
			},
			{
				EmployeeID: 8,
				FirstName: 'Laura',
				LastName: 'Callahan',
				ReportsTo: 2,
				Country: 'USA',
				Title: 'Inside Sales Coordinator',
				HireDate: '1994-03-05 00:00:00',
				BirthDate: '1958-01-09 00:00:00',
				City: 'Seattle',
				Address: '4726 - 11th Ave. N.E.'
			},
			{
				EmployeeID: 9,
				FirstName: 'Anne',
				LastName: 'Dodsworth',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-11-15 00:00:00',
				BirthDate: '1966-01-27 00:00:00',
				City: 'London',
				Address: '7 Houndstooth Rd.'
			},
			{
				EmployeeID: 10,
				FirstName: 'Anne',
				LastName: 'Dodsworth',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-11-15 00:00:00',
				BirthDate: '1966-01-27 00:00:00',
				City: 'London',
				Address: '7 Houndstooth Rd.'
			},
			{
				EmployeeID: 11,
				FirstName: 'Anne',
				LastName: 'Dodsworth',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-11-15 00:00:00',
				BirthDate: '1966-01-27 00:00:00',
				City: 'London',
				Address: '7 Houndstooth Rd.'
			},
			{
				EmployeeID: 12,
				FirstName: 'Anne',
				LastName: 'Dodsworth',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-11-15 00:00:00',
				BirthDate: '1966-01-27 00:00:00',
				City: 'London',
				Address: '7 Houndstooth Rd.'
			},
			{
				EmployeeID: 13,
				FirstName: 'Anne',
				LastName: 'Dodsworth',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-11-15 00:00:00',
				BirthDate: '1966-01-27 00:00:00',
				City: 'London',
				Address: '7 Houndstooth Rd.'
			},
			{
				EmployeeID: 14,
				FirstName: 'Anne',
				LastName: 'Dodsworth',
				ReportsTo: 5,
				Country: 'UK',
				Title: 'Sales Representative',
				HireDate: '1994-11-15 00:00:00',
				BirthDate: '1966-01-27 00:00:00',
				City: 'London',
				Address: '7 Houndstooth Rd.'
			}
		];
	};

	const setLastNameVisible = () => {
		if (settings.columns) settings.columns[1].hidden = !settings.columns[1].hidden;
	};
</script>

<Head>
	<title>BAMK0 - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Header class="flex gap-10 border-b bg-surface-50">
		<button onclick={hanleDataChange}>Data Change</button>
		<button onclick={hanleDataDelete}>Data Delete</button>
		<button onclick={hanleDataAdd}>Data Add</button>
		<button onclick={hanleDataFilter}>Data Filter</button>
		<button onclick={handleDataClearFilter}>Data Clear Filter</button>
		<button onclick={setLastNameVisible}>setLastNameVisible</button>
	</Header>
	<Main>
		<DataTable {data} {settings} />
	</Main>
	<Footer>Footer</Footer>
</Page>
