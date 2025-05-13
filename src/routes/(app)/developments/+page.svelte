<script lang="ts">
	import { getGlobalContext } from '$lib/client/app/global.svelte';
	const global = getGlobalContext();
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-2.5">
		<h6>Dev Root Header</h6>
	</div>
	<div class="relative flex-1 overflow-x-hidden overflow-y-auto p-1">
		<div class="p-4">
			<div class="p-4">
				mobile: {global.isMobileBreakpoint}
			</div>
			<div class="p-4">
				<button type="button" onclick={() => localStorage.removeItem('slc:splitpane')}>Clear localStorage</button>
			</div>
			<div class="p-4">
				<span class="slc-screen-test h-3 w-3 bg-red-500 sm:bg-amber-500 md:bg-green-500 lg:bg-blue-500 xl:bg-purple-500 2xl:bg-pink-500"></span>
				<span>{@html `< ====== >`}</span>
				<span class="h-3 w-3 bg-red-500">xs</span>
				<span class="h-3 w-3 bg-amber-500">sm</span>
				<span class="h-3 w-3 bg-green-500">md</span>
				<span class="h-3 w-3 bg-blue-500">lg</span>
				<span class="h-3 w-3 bg-purple-500">xl</span>
				<span class="h-3 w-3 bg-pink-500">2xl</span>
			</div>

			<span class="text-surface-950 p-4">surface</span>
			<span class="text-surface-950 p-4" style="background-color:#ffbf00">Amber {@html `<---->`} ffbf00</span>
			<span class="text-surface-950 p-4" style="background-color:#ffc600">PANTONE 7548 C {@html `<---->`} ffc600</span>
			<div class="border-surface-950 m-4 flex flex-row border text-sm">
				<div class="bg-surface-50 text-surface-950 p-4 whitespace-nowrap">50</div>
				<div class="bg-surface-100 text-surface-900 p-4 whitespace-nowrap">100</div>
				<div class="bg-surface-200 text-surface-900 p-4 whitespace-nowrap">200</div>
				<div class="bg-surface-300 text-surface-900 p-4 whitespace-nowrap">300</div>
				<div class="bg-surface-400 text-surface-900 p-4 whitespace-nowrap">400</div>
				<div class="bg-surface-500 text-surface-950 p-4 whitespace-nowrap">500</div>
				<div class="bg-surface-600 text-surface-100 p-4 whitespace-nowrap">600</div>
				<div class="bg-surface-700 text-surface-100 p-4 whitespace-nowrap">700</div>
				<div class="bg-surface-800 text-surface-100 p-4 whitespace-nowrap">800</div>
				<div class="bg-surface-900 text-surface-100 p-4 whitespace-nowrap">900</div>
				<div class="bg-surface-950 text-surface-50 p-4 whitespace-nowrap">950</div>
			</div>

			<span class="text-primary-950 p-4">primary</span>
			<span class="text-primary-950 p-4" style="background-color:#c50">Burnt Orange {@html `<---->`} c50</span>
			<span class="text-primary-950 p-4" style="background-color:#d45d00">PANTONE 717 C {@html `<---->`} d45d00</span>
			<div class="border-primary-950 m-4 flex flex-row border text-sm">
				<div class="bg-primary-50 text-primary-950 p-4 whitespace-nowrap">50</div>
				<div class="bg-primary-100 text-primary-900 p-4 whitespace-nowrap">100</div>
				<div class="bg-primary-200 text-primary-800 p-4 whitespace-nowrap">200</div>
				<div class="bg-primary-300 text-primary-800 p-4 whitespace-nowrap">300</div>
				<div class="bg-primary-400 text-primary-800 p-4 whitespace-nowrap">400</div>
				<div class="bg-primary-500 text-primary-950 p-4 whitespace-nowrap">500</div>
				<div class="bg-primary-600 text-primary-200 p-4 whitespace-nowrap">600</div>
				<div class="bg-primary-700 text-primary-200 p-4 whitespace-nowrap">700</div>
				<div class="bg-primary-800 text-primary-200 p-4 whitespace-nowrap">800</div>
				<div class="bg-primary-900 text-primary-100 p-4 whitespace-nowrap">900</div>
				<div class="bg-primary-950 text-primary-50 p-4 whitespace-nowrap">950</div>
			</div>

			<span class="text-secondary-950 p-4">secondary</span>
			<span class="text-secondary-950 p-4" style="background-color:#4b5320">Thatch Green {@html `<---->`} 4b5320</span>
			<span class="text-secondary-950 p-4" style="background-color:#546223">PANTONE 371 C {@html `<---->`} 546223</span>
			<div class="border-secondary-950 m-4 flex flex-row border text-sm">
				<div class="bg-secondary-50 text-secondary-950 p-4 whitespace-nowrap">50</div>
				<div class="bg-secondary-100 text-secondary-900 p-4 whitespace-nowrap">100</div>
				<div class="bg-secondary-200 text-secondary-800 p-4 whitespace-nowrap">200</div>
				<div class="bg-secondary-300 text-secondary-800 p-4 whitespace-nowrap">300</div>
				<div class="bg-secondary-400 text-secondary-800 p-4 whitespace-nowrap">400</div>
				<div class="bg-secondary-500 text-secondary-950 p-4 whitespace-nowrap">500</div>
				<div class="bg-secondary-600 text-secondary-200 p-4 whitespace-nowrap">600</div>
				<div class="bg-secondary-700 text-secondary-200 p-4 whitespace-nowrap">700</div>
				<div class="bg-secondary-800 text-secondary-200 p-4 whitespace-nowrap">800</div>
				<div class="bg-secondary-900 text-secondary-100 p-4 whitespace-nowrap">900</div>
				<div class="bg-secondary-950 text-secondary-50 p-4 whitespace-nowrap">950</div>
			</div>

			<span class="text-tertiary-950 p-4">tertiary</span>
			<span class="text-tertiary-950 p-4" style="background-color:#556b2f">Costa Del Sol {@html `<---->`} 556b2f</span>
			<span class="text-tertiary-950 p-4" style="background-color:#6d712e">PANTONE 5757 C {@html `<---->`} 6d712e</span>
			<div class="border-tertiary-950 m-4 flex flex-row border text-sm">
				<div class="bg-tertiary-50 text-tertiary-950 p-4 whitespace-nowrap">50</div>
				<div class="bg-tertiary-100 text-tertiary-900 p-4 whitespace-nowrap">100</div>
				<div class="bg-tertiary-200 text-tertiary-800 p-4 whitespace-nowrap">200</div>
				<div class="bg-tertiary-300 text-tertiary-800 p-4 whitespace-nowrap">300</div>
				<div class="bg-tertiary-400 text-tertiary-800 p-4 whitespace-nowrap">400</div>
				<div class="bg-tertiary-500 text-tertiary-950 p-4 whitespace-nowrap">500</div>
				<div class="bg-tertiary-600 text-tertiary-200 p-4 whitespace-nowrap">600</div>
				<div class="bg-tertiary-700 text-tertiary-200 p-4 whitespace-nowrap">700</div>
				<div class="bg-tertiary-800 text-tertiary-200 p-4 whitespace-nowrap">800</div>
				<div class="bg-tertiary-900 text-tertiary-100 p-4 whitespace-nowrap">900</div>
				<div class="bg-tertiary-950 text-tertiary-50 p-4 whitespace-nowrap">950</div>
			</div>

			<span class="text-quaternary-950 p-4">quaternary</span>
			<span class="text-quaternary-50 p-4" style="background-color:#004225">Costa Del Sol {@html `<---->`} 004225</span>
			<span class="text-quaternary-50 p-4" style="background-color:#004e42">PANTONE 5757 C {@html `<---->`} 004e42</span>
			<div class="border-quaternary-950 m-4 flex flex-row border text-sm">
				<div class="bg-quaternary-50 text-quaternary-950 p-4 whitespace-nowrap">50</div>
				<div class="bg-quaternary-100 text-quaternary-900 p-4 whitespace-nowrap">100</div>
				<div class="bg-quaternary-200 text-quaternary-800 p-4 whitespace-nowrap">200</div>
				<div class="bg-quaternary-300 text-quaternary-800 p-4 whitespace-nowrap">300</div>
				<div class="bg-quaternary-400 text-quaternary-800 p-4 whitespace-nowrap">400</div>
				<div class="bg-quaternary-500 text-quaternary-950 p-4 whitespace-nowrap">500</div>
				<div class="bg-quaternary-600 text-quaternary-200 p-4 whitespace-nowrap">600</div>
				<div class="bg-quaternary-700 text-quaternary-200 p-4 whitespace-nowrap">700</div>
				<div class="bg-quaternary-800 text-quaternary-200 p-4 whitespace-nowrap">800</div>
				<div class="bg-quaternary-900 text-quaternary-100 p-4 whitespace-nowrap">900</div>
				<div class="bg-quaternary-950 text-quaternary-50 p-4 whitespace-nowrap">950</div>
			</div>
		</div>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>Dev Root Footer</h6>
	</div>
</div>
