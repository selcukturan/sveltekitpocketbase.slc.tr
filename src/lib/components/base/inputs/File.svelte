<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import { watch } from 'runed';
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
	type Props = Omit<SvelteHTMLElements['select'], 'value' | 'onchange'> & {
		value?: string[];
		label?: string;
		onchange?: (params: { event: Event; value: string[] }) => void;
		field: RemoteFormField<string[]>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable([]), label, onchange, field, class: classes, ...rest }: Props = $props();
	const context = getFormInputsContext();
	// ######################## VARIABLES ###############################################################################################
	let isOnInput = false;
	let mainInputElement: HTMLSelectElement | undefined = $state();
	let plusInputElement: HTMLInputElement | undefined = $state();
	let minusInputElement: HTMLSelectElement | undefined = $state();

	const mainInputAttributes = $derived(field.as('select multiple'));

	const issues = $derived(field.issues() ?? []);
	const mainName = $derived(mainInputAttributes.name);
	const plusName = $derived(mainName.replace('[]', '_Plus[]'));
	const minusName = $derived(mainName.replace('[]', '_Minus[]'));

	let files = $state<FileList>();
	let uploadedFiles = value;
	let deletedFileNames = $state<string[]>([]);
	let valueMap = $state<SvelteMap<string, DisplayFileType>>(new SvelteMap());

	const displayFiles = $derived([...valueMap.values()]);
	const length = $derived([...valueMap.values()].filter((f) => !f.deleted).length);

	const getMapNotDeletedFiles = () => [...valueMap.values()].filter((f) => !f.deleted).map((f) => f.name);

	// ## BEGIN value logic ###############################################################################
	let dt = new DataTransfer(); // Fiziksel dosyaları biriktirmek için
	const plusInputOnChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		if (!target.files) return;

		// Yeni seçilen her dosyayı DataTransfer'e ve Map'e ekle
		Array.from(target.files).forEach((file) => {
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

		files = dt.files;

		// sync Value and Field
		isOnInput = true;
		value = getMapNotDeletedFiles();

		field.set(value);
		context.validate?.({ preflightOnly: true });
	};
	watch(
		() => value,
		(currValue) => {
			if (isOnInput) {
				isOnInput = false;
				return;
			}

			// sync Map and Field
			currValue.forEach((value) => {
				valueMap.set(value, {
					name: value,
					uploaded: uploadedFiles.includes(value),
					deleted: deletedFileNames.includes(value)
				});
			});
			field.set(getMapNotDeletedFiles());
		}
	);
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
		isOnInput = true;
		value = getMapNotDeletedFiles();

		field.set(value);
		context.validate?.({ preflightOnly: true });
	}

	function removeUploadedElement(nameToDelete: string) {
		if (valueMap.has(nameToDelete)) {
			const deletedObject = valueMap.get(nameToDelete);
			if (!deletedObject) return;

			valueMap.set(nameToDelete, { ...deletedObject, deleted: true });
			deletedFileNames.push(nameToDelete);

			value = getMapNotDeletedFiles();
			context.validate?.({ preflightOnly: true });
		}
	}

	function restoreUploadedElement(nameToRestore: string) {
		if (valueMap.has(nameToRestore)) {
			const restoredObject = valueMap.get(nameToRestore);
			if (!restoredObject) return;

			valueMap.set(nameToRestore, { ...restoredObject, deleted: false });
			deletedFileNames = deletedFileNames.filter((name) => name !== nameToRestore);

			value = getMapNotDeletedFiles();
			context.validate?.({ preflightOnly: true });
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
		<!-- class="sr-only" tabindex={-1} aria-hidden={true}  -->
		<select class="sr-only" tabindex={-1} aria-hidden={true} {...mainInputAttributes} {...rest} bind:this={mainInputElement}>
			{#each value as option, i (i)}
				<option value={option}>{option}</option>
			{/each}
		</select>

		<input
			multiple
			bind:files
			bind:this={plusInputElement}
			type="file"
			name={plusName}
			accept=".png, .jpg, .jpeg, .gif, .webp, .svg, image/png, image/jpeg, image/gif, image/webp, image/svg+xml"
			onchange={plusInputOnChange}
			class="sr-only"
			tabindex={-1}
			aria-hidden={true}
		/>

		<select
			class="sr-only"
			tabindex={-1}
			aria-hidden={true}
			name={minusName}
			bind:this={minusInputElement}
			bind:value={deletedFileNames}
			multiple
		>
			{#each deletedFileNames as option, i (i)}
				<option value={option} selected>{option}</option>
			{/each}
		</select>
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
