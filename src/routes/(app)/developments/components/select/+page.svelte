<script lang="ts">
	import { Select } from '$lib/components/ui/inputs';
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-1">
		<h6>Toggler</h6>
	</div>
	<div class="relative flex-1 overflow-y-auto overflow-x-hidden p-1 pt-52">
		<div class="flex flex-row gap-1">
			<Select
				data={[
					{ label: '20', value: '20' },
					{ label: '21', value: '21' }
				]}
			/>
			<Select
				data={[
					{ label: '24', value: '24' },
					{ label: '25', value: '25' }
				]}
			/>
		</div>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>footer</h6>
	</div>
</div>
