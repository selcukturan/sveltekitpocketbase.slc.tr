<script lang="ts">
	import CommonHelper from '$lib/utils/common';
	import DataTable1 from '$lib/components/base/data-table-test/DataTable1.svelte';
	import DataTable2 from '$lib/components/base/data-table-test/DataTable2.svelte';

	let src1: string = $state('src-1');
	let tbl1: string = $state('tbl-1');

	let src2: string = $state('src-2');
	let tbl2: string = $state('tbl-2');

	let src3: string = $state('src-3');
	let tbl3: string = $state('tbl-3');
</script>

<DataTable1 src={src1} tbl={tbl1} />

<DataTable2 src={src2} tbl={tbl2} />

<DataTable1 src={src3} tbl={tbl3} />

<button
	onclick={() => {
		src1 = 'src-11 ' + CommonHelper.randomString(2);
		tbl1 = 'tbl-11 ' + CommonHelper.randomString(2);
	}}
>
	Button 11
</button>

<button
	onclick={() => {
		src2 = 'src-22 ' + CommonHelper.randomString(2);
		tbl2 = 'tbl-22 ' + CommonHelper.randomString(2);
	}}
>
	Button 22
</button>

<button
	onclick={() => {
		src3 = 'src-33 ' + CommonHelper.randomString(2);
		tbl3 = 'tbl-33 ' + CommonHelper.randomString(2);
	}}
>
	Button 33
</button>
