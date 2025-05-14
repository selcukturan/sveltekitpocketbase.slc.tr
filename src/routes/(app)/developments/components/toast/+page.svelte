<script lang="ts">
	import { Toaster, createToaster, appToaster } from '$lib/components/zagjs/toast';

	const pageToaster = createToaster();
</script>

<Toaster toaster={pageToaster} />
<p>################################ Page Toast #################################################################################</p>
<div class="grid w-full max-w-72 grid-cols-2 gap-2">
	<button
		class="btn preset-filled"
		onclick={() => {
			pageToaster.info({
				title: 'This is a PAGE toast!'
			});
		}}>Info</button
	>
	<button
		class="btn preset-filled-success-500"
		onclick={() => {
			pageToaster.success({
				title: 'This is a PAGE toast!'
			});
		}}>Success</button
	>
	<button
		class="btn preset-filled-warning-500"
		onclick={() => {
			pageToaster.warning({
				title: 'This is a PAGE toast!'
			});
		}}>Warning</button
	>
	<button
		class="btn preset-filled-error-500"
		onclick={() => {
			pageToaster.error({
				title: 'This is a PAGE toast!'
			});
		}}>Error</button
	>
</div>
<p>################################ App Toast #################################################################################</p>
<div class="grid w-full max-w-72 grid-cols-2 gap-2">
	<button
		class="btn preset-filled"
		onclick={() => {
			appToaster.info({
				title: 'This is a APP toast!'
			});
		}}>Info</button
	>
	<button
		class="btn preset-filled-success-500"
		onclick={() => {
			appToaster.success({
				title: 'This is a APP toast!'
			});
		}}>Success</button
	>
	<button
		class="btn preset-filled-warning-500"
		onclick={() => {
			appToaster.warning({
				title: 'This is a APP toast!'
			});
		}}>Warning</button
	>
	<button
		class="btn preset-filled-error-500"
		onclick={() => {
			appToaster.error({
				title: 'This is a APP toast!'
			});
		}}>Error</button
	>
</div>
