<script lang="ts">
	import { Toaster, createToaster, appToaster } from '$lib/components/zagjs/toast';

	const pageToaster = createToaster({ overlap: true });
</script>

<Toaster toaster={pageToaster} />
<p>################################ Page Toast #################################################################################</p>
<div class="grid w-full max-w-72 grid-cols-2 gap-2">
	<button
		style="background-color:#5499e8;color:#cee2f8;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.info({
				title: 'Bilgi',
				description:
					'Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				action: {
					label: 'Detay',
					onClick: () => {
						pageToaster.success({ title: 'Başarılı', description: 'İşlem yapıldı.' });
					}
				}
			});
		}}
	>
		Info
	</button>
	<button
		style="background-color:#32ad84;color:#c4eedc;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.success({
				type: 'success',
				title: 'Başarılı',
				description: 'Success lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				action: {
					label: 'Detay',
					onClick: () => {
						pageToaster.success({ title: 'Başarılı', description: 'İşlem yapıldı.' });
					}
				}
			});
		}}
	>
		Success
	</button>
	<button
		style="background-color:#ff944d;color:#ffd4b8;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.warning({
				title: 'Uyarı',
				description: 'Warning lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				action: {
					label: 'Detay',
					onClick: () => {
						pageToaster.success({ title: 'Başarılı', description: 'İşlem yapıldı.' });
					}
				}
			});
		}}
	>
		Warning
	</button>
	<button
		style="background-color:#e34562;color:#f7cad2;padding:5px;margin:5px;"
		onclick={() => {
			pageToaster.error({
				title: 'Hata',
				description: 'Error lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				action: {
					label: 'Detay',
					onClick: () => {
						pageToaster.success({ type: 'success', title: 'Başarılı', description: 'İşlem yapıldı.' });
					}
				}
			});
		}}
	>
		Error
	</button>

	<button
		onclick={() =>
			pageToaster.create({
				type: 'info',
				title: 'Silmek istediğinize emin misiniz?',
				description: 'Loading lorem ipsum dolor sit amet, consectetur adipisicing elit.',
				closable: false,
				action: {
					label: 'İptal',
					onClick: () => {
						pageToaster.warning({ title: 'İptal', description: 'İptal edildi.' });
					}
				}
			})}
	>
		Action
	</button>

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
