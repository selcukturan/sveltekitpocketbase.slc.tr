<script lang="ts">
	import { getGlobalStates } from '$lib/states/global.svelte';
	const globalStates = getGlobalStates();
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-2.5">
		<h6>Dev Root Header</h6>
	</div>
	<div class="relative flex-1 overflow-y-auto overflow-x-hidden p-1">
		<div class="p-4">
			<div class="p-4">
				mobile: {globalStates.isMobileBreakpoint}
			</div>
			<div class="p-4">
				<button type="button" onclick={() => localStorage.removeItem('slc:splitpane')}>Clear localStorage</button>
			</div>
			<div class="p-4">
				<span class="slc-screen-test xl:bg-purple-500 2xl:bg-pink-500 h-3 w-3 bg-red-500 sm:bg-amber-500 md:bg-green-500 lg:bg-blue-500"></span>
				<span>{@html `< ====== >`}</span>
				<span class="h-3 w-3 bg-red-500">xs</span>
				<span class="h-3 w-3 bg-amber-500">sm</span>
				<span class="h-3 w-3 bg-green-500">md</span>
				<span class="h-3 w-3 bg-blue-500">lg</span>
				<span class="h-3 w-3 bg-purple-500">xl</span>
				<span class="h-3 w-3 bg-pink-500">2xl</span>
			</div>

			<span class="p-4 text-surface-950">surface</span>
			<span class="p-4 text-surface-950" style="background-color:#ffbf00">Amber {@html `<---->`} ffbf00</span>
			<span class="p-4 text-surface-950" style="background-color:#ffc600">PANTONE 7548 C {@html `<---->`} ffc600</span>
			<div class="m-4 flex flex-row border border-surface-950 text-sm">
				<div class="whitespace-nowrap bg-surface-50 p-4 text-surface-950">50</div>
				<div class="whitespace-nowrap bg-surface-100 p-4 text-surface-900">100</div>
				<div class="whitespace-nowrap bg-surface-200 p-4 text-surface-900">200</div>
				<div class="whitespace-nowrap bg-surface-300 p-4 text-surface-900">300</div>
				<div class="whitespace-nowrap bg-surface-400 p-4 text-surface-900">400</div>
				<div class="whitespace-nowrap bg-surface-500 p-4 text-surface-950">500</div>
				<div class="whitespace-nowrap bg-surface-600 p-4 text-surface-100">600</div>
				<div class="whitespace-nowrap bg-surface-700 p-4 text-surface-100">700</div>
				<div class="whitespace-nowrap bg-surface-800 p-4 text-surface-100">800</div>
				<div class="whitespace-nowrap bg-surface-900 p-4 text-surface-100">900</div>
				<div class="whitespace-nowrap bg-surface-950 p-4 text-surface-50">950</div>
			</div>

			<span class="p-4 text-primary-950">primary</span>
			<span class="p-4 text-primary-950" style="background-color:#c50">Burnt Orange {@html `<---->`} c50</span>
			<span class="p-4 text-primary-950" style="background-color:#d45d00">PANTONE 717 C {@html `<---->`} d45d00</span>
			<div class="m-4 flex flex-row border border-primary-950 text-sm">
				<div class="whitespace-nowrap bg-primary-50 p-4 text-primary-950">50</div>
				<div class="whitespace-nowrap bg-primary-100 p-4 text-primary-900">100</div>
				<div class="whitespace-nowrap bg-primary-200 p-4 text-primary-800">200</div>
				<div class="whitespace-nowrap bg-primary-300 p-4 text-primary-800">300</div>
				<div class="whitespace-nowrap bg-primary-400 p-4 text-primary-800">400</div>
				<div class="whitespace-nowrap bg-primary-500 p-4 text-primary-950">500</div>
				<div class="whitespace-nowrap bg-primary-600 p-4 text-primary-200">600</div>
				<div class="whitespace-nowrap bg-primary-700 p-4 text-primary-200">700</div>
				<div class="whitespace-nowrap bg-primary-800 p-4 text-primary-200">800</div>
				<div class="whitespace-nowrap bg-primary-900 p-4 text-primary-100">900</div>
				<div class="whitespace-nowrap bg-primary-950 p-4 text-primary-50">950</div>
			</div>

			<span class="p-4 text-secondary-950">secondary</span>
			<span class="p-4 text-secondary-950" style="background-color:#4b5320">Thatch Green {@html `<---->`} 4b5320</span>
			<span class="p-4 text-secondary-950" style="background-color:#546223">PANTONE 371 C {@html `<---->`} 546223</span>
			<div class="m-4 flex flex-row border border-secondary-950 text-sm">
				<div class="whitespace-nowrap bg-secondary-50 p-4 text-secondary-950">50</div>
				<div class="whitespace-nowrap bg-secondary-100 p-4 text-secondary-900">100</div>
				<div class="whitespace-nowrap bg-secondary-200 p-4 text-secondary-800">200</div>
				<div class="whitespace-nowrap bg-secondary-300 p-4 text-secondary-800">300</div>
				<div class="whitespace-nowrap bg-secondary-400 p-4 text-secondary-800">400</div>
				<div class="whitespace-nowrap bg-secondary-500 p-4 text-secondary-950">500</div>
				<div class="whitespace-nowrap bg-secondary-600 p-4 text-secondary-200">600</div>
				<div class="whitespace-nowrap bg-secondary-700 p-4 text-secondary-200">700</div>
				<div class="whitespace-nowrap bg-secondary-800 p-4 text-secondary-200">800</div>
				<div class="whitespace-nowrap bg-secondary-900 p-4 text-secondary-100">900</div>
				<div class="whitespace-nowrap bg-secondary-950 p-4 text-secondary-50">950</div>
			</div>

			<span class="p-4 text-tertiary-950">tertiary</span>
			<span class="p-4 text-tertiary-950" style="background-color:#556b2f">Costa Del Sol {@html `<---->`} 556b2f</span>
			<span class="p-4 text-tertiary-950" style="background-color:#6d712e">PANTONE 5757 C {@html `<---->`} 6d712e</span>
			<div class="m-4 flex flex-row border border-tertiary-950 text-sm">
				<div class="whitespace-nowrap bg-tertiary-50 p-4 text-tertiary-950">50</div>
				<div class="whitespace-nowrap bg-tertiary-100 p-4 text-tertiary-900">100</div>
				<div class="whitespace-nowrap bg-tertiary-200 p-4 text-tertiary-800">200</div>
				<div class="whitespace-nowrap bg-tertiary-300 p-4 text-tertiary-800">300</div>
				<div class="whitespace-nowrap bg-tertiary-400 p-4 text-tertiary-800">400</div>
				<div class="whitespace-nowrap bg-tertiary-500 p-4 text-tertiary-950">500</div>
				<div class="whitespace-nowrap bg-tertiary-600 p-4 text-tertiary-200">600</div>
				<div class="whitespace-nowrap bg-tertiary-700 p-4 text-tertiary-200">700</div>
				<div class="whitespace-nowrap bg-tertiary-800 p-4 text-tertiary-200">800</div>
				<div class="whitespace-nowrap bg-tertiary-900 p-4 text-tertiary-100">900</div>
				<div class="whitespace-nowrap bg-tertiary-950 p-4 text-tertiary-50">950</div>
			</div>

			<span class="p-4 text-quaternary-950">quaternary</span>
			<span class="p-4 text-quaternary-50" style="background-color:#004225">Costa Del Sol {@html `<---->`} 004225</span>
			<span class="p-4 text-quaternary-50" style="background-color:#004e42">PANTONE 5757 C {@html `<---->`} 004e42</span>
			<div class="m-4 flex flex-row border border-quaternary-950 text-sm">
				<div class="whitespace-nowrap bg-quaternary-50 p-4 text-quaternary-950">50</div>
				<div class="whitespace-nowrap bg-quaternary-100 p-4 text-quaternary-900">100</div>
				<div class="whitespace-nowrap bg-quaternary-200 p-4 text-quaternary-800">200</div>
				<div class="whitespace-nowrap bg-quaternary-300 p-4 text-quaternary-800">300</div>
				<div class="whitespace-nowrap bg-quaternary-400 p-4 text-quaternary-800">400</div>
				<div class="whitespace-nowrap bg-quaternary-500 p-4 text-quaternary-950">500</div>
				<div class="whitespace-nowrap bg-quaternary-600 p-4 text-quaternary-200">600</div>
				<div class="whitespace-nowrap bg-quaternary-700 p-4 text-quaternary-200">700</div>
				<div class="whitespace-nowrap bg-quaternary-800 p-4 text-quaternary-200">800</div>
				<div class="whitespace-nowrap bg-quaternary-900 p-4 text-quaternary-100">900</div>
				<div class="whitespace-nowrap bg-quaternary-950 p-4 text-quaternary-50">950</div>
			</div>
		</div>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>Dev Root Footer</h6>
	</div>
</div>
