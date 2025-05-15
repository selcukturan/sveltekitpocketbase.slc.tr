<script lang="ts">
	import { Toaster, createToaster, appToaster } from '$lib/components/zagjs/toast';

	const pageToaster = createToaster({
		overlap: true,
		pauseOnPageIdle: false,
		gap: 16
	});
</script>

<Toaster toaster={pageToaster} />
<p>################################ Page Toast #################################################################################</p>
<div class="grid w-full max-w-72 grid-cols-2 gap-2">
	<button
		style="background-color:#5499e8;color:#cee2f8;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.info({
				title: 'This is a PAGE toast!'
			});
		}}>Info</button
	>
	<button
		style="background-color:#32ad84;color:#c4eedc;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.success({
				title: 'This is a PAGE toast!'
			});
		}}>Success</button
	>
	<button
		style="background-color:#ff944d;color:#ffd4b8;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.warning({
				title: 'This is a PAGE toast!'
			});
		}}>Warning</button
	>
	<button
		style="background-color:#e34562;color:#f7cad2;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.error({
				title: 'This is a PAGE toast!'
			});
		}}>Error</button
	>
	<button
		onclick={() => {
			const promise = new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve('Success');
				}, 3000);
			});
			pageToaster.promise(promise, {
				loading: {
					title: 'Yükleniyor',
					description: 'Lütfen bekleyin...'
				},
				success: (data) => ({
					title: 'Başarılı',
					description: 'İşleminiz tamamlandı'
				}),
				error: (err) => ({
					title: 'Hata',
					description: 'Bir hata oluştu'
				})
			});
		}}
	>
		Promise
	</button>
	<button
		onclick={() =>
			pageToaster.create({
				type: 'loading',
				title: 'İşleminiz yapılıyor',
				description:
					'Loading lorem ipsum dolor sit amet, consectetur adipisicing elit. Loading lorem ipsum dolor sit amet, consectetur adipisicing elit. Loading lorem ipsum dolor sit amet, consectetur adipisicing elit. Loading lorem ipsum dolor sit amet, consectetur adipisicing elit. Loading lorem ipsum dolor sit amet, consectetur adipisicing elit. Loading lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				action: {
					label: 'İptal',
					onClick: () => {
						pageToaster.create({ type: 'success', title: 'Başarılı', description: 'İptal edildi.' });
					}
				}
			})}
	>
		Action
	</button>
</div>
<p>################################ App Toast #################################################################################</p>
<div class="grid w-full max-w-72 grid-cols-2 gap-2">
	<button
		style="background-color:#5499e8;color:#cee2f8;padding:5px;margin:5px;"
		onclick={() => {
			appToaster.info({
				title: 'This is a APP toast!'
			});
		}}>Info</button
	>
	<button
		style="background-color:#32ad84;color:#c4eedc;padding:5px;margin:5px;"
		onclick={() => {
			appToaster.success({
				title: 'This is a APP toast!'
			});
		}}>Success</button
	>
	<button
		style="background-color:#ff944d;color:#ffd4b8;padding:5px;margin:5px;"
		onclick={() => {
			appToaster.warning({
				title: 'This is a APP toast!'
			});
		}}>Warning</button
	>
	<button
		style="background-color:#e34562;color:#f7cad2;padding:5px;margin:5px;"
		onclick={() => {
			appToaster.error({
				title: 'This is a APP toast!'
			});
		}}>Error</button
	>
</div>
