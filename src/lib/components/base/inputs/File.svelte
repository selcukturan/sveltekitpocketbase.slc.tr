<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import Popup from './Popup.svelte';
	import { getFormInputsContext } from './context.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type DisplayFileType = {
		name: string;
		uploaded: boolean;
		deleted: boolean;
	};
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<SvelteHTMLElements['select'], 'value'> & {
		value?: string[];
		label?: string;
		field?: RemoteFormField<string[]>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable([]), label, field, class: classes, ...rest }: Props = $props();
	const context = getFormInputsContext();
	// ######################## VARIABLES ###############################################################################################

	let mainInputElement: HTMLSelectElement | undefined = $state();
	let plusInputElement: HTMLInputElement | undefined = $state();
	let minusInputElement: HTMLSelectElement | undefined = $state();

	const mainInputAttributes = $derived(field?.as('select multiple'));

	const issues = $derived(field?.issues() ?? []);
	const mainName = $derived(mainInputAttributes?.name);
	const plusName = $derived(mainName?.replace('[]', '_Plus[]'));
	const minusName = $derived(mainName?.replace('[]', '_Minus[]'));

	let files = $state<FileList>();
	let uploadedFiles = value;
	let deletedFileNames = $state<string[]>([]);
	let valueMap = $state<SvelteMap<string, DisplayFileType>>(new SvelteMap());

	const displayFiles = $derived([...valueMap.values()]);
	const length = $derived([...valueMap.values()].filter((f) => !f.deleted).length);

	const getMapNotDeletedFiles = () => [...valueMap.values()].filter((f) => !f.deleted).map((f) => f.name);

	// ## BEGIN value logic ###############################################################################
	const valueChange = (value: string[]) => {
		field?.set(value);
		context?.form.validate({ preflightOnly: true });
	};
	let dt = new DataTransfer(); // Fiziksel dosyaları biriktirmek için
	let first = true;
	const proxy = {
		get files() {
			const currentValue = files;
			if (first) {
				first = false;
				// sync Map and Field
				value.forEach((value) => {
					valueMap.set(value, {
						name: value,
						uploaded: uploadedFiles.includes(value),
						deleted: deletedFileNames.includes(value)
					});
				});
				valueChange(getMapNotDeletedFiles());
			}
			return currentValue;
		},
		set files(v) {
			const currentValue = v;
			// Yeni seçilen her dosyayı DataTransfer'e ve Map'e ekle
			if (currentValue) {
				Array.from(currentValue).forEach((file) => {
					// Eğer aynı isimde dosya zaten varsa ekleme (opsiyonel)
					if (!valueMap.has(file.name)) {
						dt.items.add(file);
						valueMap.set(file.name, {
							name: file.name,
							uploaded: uploadedFiles.includes(file.name),
							deleted: deletedFileNames.includes(file.name)
						});
					}
				});
			}
			files = dt.files;

			// sync Value and Field
			value = getMapNotDeletedFiles();
			valueChange(value);
		}
	};

	// ## END value logic ###############################################################################

	function removeFileInputElement(nameToDelete: string) {
		valueMap.delete(nameToDelete);

		const newDt = new DataTransfer();
		Array.from(dt.files).forEach((file) => {
			if (file.name !== nameToDelete) newDt.items.add(file);
		});

		files = newDt.files;
		dt = newDt;

		// sync Value and Field
		value = getMapNotDeletedFiles();
		valueChange(value);
	}

	function removeUploadedElement(nameToDelete: string) {
		if (valueMap.has(nameToDelete)) {
			const deletedObject = valueMap.get(nameToDelete);
			if (!deletedObject) return;

			valueMap.set(nameToDelete, { ...deletedObject, deleted: true });
			deletedFileNames.push(nameToDelete);

			value = getMapNotDeletedFiles();
			valueChange(value);
		}
	}

	function restoreUploadedElement(nameToRestore: string) {
		if (valueMap.has(nameToRestore)) {
			const restoredObject = valueMap.get(nameToRestore);
			if (!restoredObject) return;

			valueMap.set(nameToRestore, { ...restoredObject, deleted: false });
			deletedFileNames = deletedFileNames.filter((name) => name !== nameToRestore);

			value = getMapNotDeletedFiles();
			valueChange(value);
		}
	}
</script>

<div style:position="relative">
	<label>
		<h2>{label}</h2>
		<button
			type="button"
			onclick={() => plusInputElement?.click()}
			class="slc-input bg-secondary-400 cursor-pointer rounded border px-2 py-1"
		>
			<span>Dosya Seç ({length})</span>
		</button>
		<!-- ################################ BEGIN HIDDEN AREA #################################################################################### -->
		<!-- class="sr-only" tabindex={-1} aria-hidden={true}  -->
		<select {...mainInputAttributes} {...rest} bind:this={mainInputElement} class="sr-only" tabindex={-1} aria-hidden={true}>
			{#each value as option, i (i)}
				<option value={option}>{option}</option>
			{/each}
		</select>

		<input
			multiple
			bind:files={proxy.files}
			bind:this={plusInputElement}
			type="file"
			name={plusName}
			accept=".png, .jpg, .jpeg, .gif, .webp, .svg, image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
			class="sr-only"
			tabindex={-1}
			aria-hidden={true}
		/>

		<select
			name={minusName}
			bind:this={minusInputElement}
			bind:value={deletedFileNames}
			multiple
			class="sr-only"
			tabindex={-1}
			aria-hidden={true}
		>
			{#each deletedFileNames as option, i (i)}
				<option value={option} selected>{option}</option>
			{/each}
		</select>
		<!-- ################################# END HIDDEN AREA ###################################################################################### -->
	</label>
	<Popup {issues} />
</div>

<div class="flex flex-col gap-2">
	{#each displayFiles as file, i (i)}
		<div class="flex gap-2">
			{#if file.uploaded}
				<p>(OLD)</p>
			{:else}
				<p>(NEW)</p>
			{/if}
			<p class="flex-1">{file.name}</p>
			{#if file.deleted}
				<button type="button" onclick={() => restoreUploadedElement(file.name)}>Restore</button>
			{:else if file.uploaded}
				<button type="button" onclick={() => removeUploadedElement(file.name)}>Remove</button>
			{:else}
				<button type="button" onclick={() => removeFileInputElement(file.name)}>Remove</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.sr-only {
		/* Görünmezliği sağla (Modern yöntem) */
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px; /* Yer kaplamaması için (Tavsiye edilen eski yöntemden kalma) */
		overflow: hidden;
		clip-path: inset(50%); /* Yeni, standartlaştırılmış kırpma yöntemi */

		/* Kesinlikle görünmezliği garanti et */
		opacity: 0;

		/* Etkileşimi tamamen kes */
		pointer-events: none; /* Üzerine tıklanmasını kesinlikle engeller */

		/* Ekstra temizlik */
		white-space: nowrap;
		border: 0;
	}
</style>
