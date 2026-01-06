<script lang="ts" generics="Tmultiple extends boolean = false">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import Field from './Field.svelte';
	import { getFormInputsContext } from './context.svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import type { SvelteHTMLElements } from 'svelte/elements';

	type ValueTypeChoice<T extends boolean> = T extends true ? string[] : string;

	type DisplayFileType = {
		name: string;
		uploaded: boolean;
		deleted: boolean;
	};

	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<SvelteHTMLElements['select'], 'value'> & {
		multiple?: Tmultiple;
		value?: ValueTypeChoice<Tmultiple>;
		label?: string;
		field?: RemoteFormField<ValueTypeChoice<Tmultiple>>;
	};

	// ######################## PROPS ###################################################################################################
	let {
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as ValueTypeChoice<Tmultiple>),
		label,
		field,
		class: classes,
		...rest
	}: Props = $props();

	const componentId = $props.id();

	const context = getFormInputsContext();

	// ######################## VARIABLES ###############################################################################################
	let mainInputElement: HTMLSelectElement | undefined = $state();
	let plusInputElement: HTMLInputElement | undefined = $state();
	// let minusInputElement: HTMLSelectElement | undefined = $state();

	const mainInputAttributes = $derived(
		multiple
			? (field as RemoteFormField<ValueTypeChoice<true>> | undefined)?.as('select multiple')
			: (field as RemoteFormField<ValueTypeChoice<false>> | undefined)?.as('select')
	);

	const issues = $derived(field?.issues() ?? []);
	const mainName = $derived(mainInputAttributes?.name.replace('[]', ''));
	const plusName = $derived(multiple ? mainName + '_Plus[]' : mainName + '_Plus');
	const minusName = $derived(multiple ? mainName + '_Minus[]' : mainName + '_Minus');

	const required = $derived(context?.getValibotMetadata(mainName)?.slc_required === true ? true : false);

	let files = $state<FileList>();
	let uploadedFiles = $state(value); // Başlangıçtaki dosyaları tutar
	let deletedFileNames = $state<string[]>([]);
	let valueMap = $state<SvelteMap<string, DisplayFileType>>(new SvelteMap());

	const displayFiles = $derived([...valueMap.values()]);
	const length = $derived([...valueMap.values()].filter((f) => !f.deleted).length);

	// Yardımcı fonksiyon: uploadedFiles kontrolü (string veya array olmasına göre)
	const checkIsUploaded = (name: string) => {
		if (Array.isArray(uploadedFiles)) return uploadedFiles.includes(name);
		return uploadedFiles === name;
	};

	const getMapNotDeletedFiles = (): ValueTypeChoice<Tmultiple> => {
		const activeFiles = [...valueMap.values()].filter((f) => !f.deleted).map((f) => f.name);
		if (multiple) {
			return activeFiles as ValueTypeChoice<Tmultiple>;
		} else {
			return (activeFiles[0] ?? '') as ValueTypeChoice<Tmultiple>;
		}
	};

	const valueChange = (newValue: ValueTypeChoice<Tmultiple>) => {
		let val: ValueTypeChoice<Tmultiple>;

		if (multiple) {
			val = (newValue || []) as ValueTypeChoice<Tmultiple>;
		} else {
			val = (newValue || '') as ValueTypeChoice<Tmultiple>;
		}

		field?.set(val);
		context?.form.validate({ preflightOnly: true });
	};

	let dt = new DataTransfer();
	let first = true;

	const proxy = {
		get files() {
			if (first) {
				first = false;
				// Başlangıç değerlerini Map'e doldur
				const initialValues = Array.isArray(value) ? value : value ? [value] : [];
				initialValues.forEach((fileName) => {
					if (fileName) {
						valueMap.set(fileName, {
							name: fileName,
							uploaded: true, // İlk gelenler zaten upload edilmişlerdir
							deleted: false
						});
					}
				});
				valueChange(getMapNotDeletedFiles());
			}
			return files ?? null;
		},
		set files(v: FileList | null) {
			if (!multiple) {
				// Single modda her şeyi temizle (yeni dosya eskisinin yerini alır)
				dt = new DataTransfer();
				valueMap.clear();
				deletedFileNames = [];
			}

			if (v) {
				Array.from(v).forEach((file) => {
					if (!valueMap.has(file.name)) {
						dt.items.add(file);
						valueMap.set(file.name, {
							name: file.name,
							uploaded: false,
							deleted: false
						});
					}
				});
			}
			files = dt.files;
			value = getMapNotDeletedFiles();
			valueChange(value);
		}
	};

	function removeFileInputElement(nameToDelete: string) {
		valueMap.delete(nameToDelete);
		const newDt = new DataTransfer();
		Array.from(dt.files).forEach((file) => {
			if (file.name !== nameToDelete) newDt.items.add(file);
		});
		dt = newDt;
		files = dt.files;
		value = getMapNotDeletedFiles();
		valueChange(value);
	}

	function removeUploadedElement(nameToDelete: string) {
		const item = valueMap.get(nameToDelete);
		if (item) {
			valueMap.set(nameToDelete, { ...item, deleted: true });
			if (!deletedFileNames.includes(nameToDelete)) {
				deletedFileNames = [...deletedFileNames, nameToDelete];
			}
			value = getMapNotDeletedFiles();
			valueChange(value);
		}
	}

	function restoreUploadedElement(nameToRestore: string) {
		const item = valueMap.get(nameToRestore);
		if (item) {
			// Single modda restore yaparken diğer her şeyi silmek gerekir
			if (!multiple) {
				valueMap.forEach((val, key) => {
					if (key !== nameToRestore) valueMap.delete(key);
				});
				deletedFileNames = [];
			} else {
				deletedFileNames = deletedFileNames.filter((name) => name !== nameToRestore);
			}

			valueMap.set(nameToRestore, { ...item, deleted: false });
			value = getMapNotDeletedFiles();
			valueChange(value);
		}
	}
</script>

<Field {issues} {required} {label} id={mainName || `${componentId}_Plus`}>
	{#snippet input(inputClass)}
		<div class="p-3.5">
			<button
				id={`${componentId}_Plus`}
				type="button"
				onclick={() => plusInputElement?.click()}
				class="slc-input bg-surface-300 w-full cursor-pointer rounded border px-2 py-1"
			>
				<span>{multiple ? `Dosyaları Seç (${length})` : length > 0 ? 'Dosyayı Değiştir' : 'Dosya Seç'}</span>
			</button>
			<div class="mt-4 flex flex-col gap-2">
				{#each displayFiles as file (file.name)}
					<div class="border-surface-500 flex items-center gap-2 border-t p-2" class:opacity-50={file.deleted}>
						<span class="{'text-xs font-bold'} {file.uploaded ? 'text-error-500' : 'text-success-500'}"
							>{file.uploaded ? 'OLD' : 'NEW'}</span
						>
						<p class="flex-1 truncate">{file.name}</p>

						{#if file.deleted}
							<button type="button" class="text-blue-500" onclick={() => restoreUploadedElement(file.name)}>Geri Al</button>
						{:else}
							<button
								type="button"
								class="text-red-500"
								onclick={() => (file.uploaded ? removeUploadedElement(file.name) : removeFileInputElement(file.name))}
							>
								Kaldır
							</button>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		<!--Hidden Area-->

		<select {...mainInputAttributes} {...rest} bind:this={mainInputElement} class="sr-only" tabindex={-1} aria-hidden={true}>
			{#if multiple}
				{@const val = (value || []) as ValueTypeChoice<true>}
				{#each val as option}
					<option value={option} selected>{option}</option>
				{/each}
			{:else}
				{@const val = (value || '') as ValueTypeChoice<false>}
				<option value={val} selected>{val}</option>
			{/if}
		</select>

		<input
			{multiple}
			bind:files={proxy.files}
			bind:this={plusInputElement}
			type="file"
			name={plusName}
			accept="image/*"
			class="sr-only"
			tabindex={-1}
			aria-hidden={true}
		/>

		{#if multiple}
			<select multiple name={minusName} bind:value={deletedFileNames} class="sr-only" tabindex={-1} aria-hidden={true}>
				{#each deletedFileNames as option}
					<option value={option} selected>{option}</option>
				{/each}
			</select>
		{:else}
			<input type="hidden" name={minusName} bind:value={deletedFileNames[0]} class="sr-only" tabindex={-1} aria-hidden={true} />
		{/if}
	{/snippet}
</Field>

<!-- <div class="group bg-surface-200 focus-within:bg-surface-300 relative m-0.5 mt-6 block w-full rounded-md">
	<Popup {issues} />
	<label
		for={`${componentId}_Plus`}
		class="text-surface-500 group-focus-within:text-surface-950 flex w-full items-center gap-1 rounded-tl-md rounded-tr-md bg-transparent pt-2.5 pr-3.5 pb-0.5 pl-3.5 text-xs font-semibold select-none"
	>
		{label}
	</label>
	
</div> -->

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
