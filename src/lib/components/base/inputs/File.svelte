<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { watch } from 'runed';
	import Popup from './Popup.svelte';
	import { getFormInputsContext } from './context.svelte';
	import { SvelteMap } from 'svelte/reactivity';

	type DisplayFileType = {
		name: string;
		uploaded: boolean;
		deleted: boolean;
	};
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: string[];
		label?: string;
		oninput?: (params: { event: Event; value: string[] }) => void;
		onchange?: (params: { event: Event; value: string[] }) => void;
		field: RemoteFormField<string[]>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable([]), label, oninput, onchange, field, class: classes, ...attributes }: Props = $props();
	const context = getFormInputsContext();
	// ######################## VARIABLES ###############################################################################################
	let isOnInput = false;
	// let inputValue = $state([] as string[]);
	let inputElement: HTMLSelectElement | undefined = $state();
	let fileInputElement: HTMLInputElement | undefined = $state();
	const issues = $derived(field?.issues() ?? []);
	const inputAttributes = $derived(field.as('select multiple'));

	const name = $derived(inputAttributes.name);
	const namePlus = $derived(name.replace('[]', '_Plus[]'));
	const nameMinus = $derived(name.replace('[]', '_Minus[]'));

	let uploadedFiles: string[] = value;
	let files = $state<FileList>();
	let deletedFileNames = $state<string[]>([]);
	let valueMap = $state<SvelteMap<string, DisplayFileType>>(new SvelteMap());
	$inspect(valueMap);

	const displayFiles = $derived.by(() => {
		let returnedValue: DisplayFileType[] = [];
		valueMap.forEach((value) => {
			returnedValue.push(value);
		});
		return returnedValue;
	});

	// ## BEGIN value logic ###############################################################################
	const onInput = (event: Event) => {
		const target = event.target;
		if (!(target instanceof HTMLInputElement)) return;

		const inputFiles = target.files;
		if (!inputFiles) return;

		const currValue = Array.from(inputFiles).map((file) => file.name);
		currValue.forEach((value) => {
			valueMap.set(value, {
				name: value,
				uploaded: uploadedFiles.includes(value),
				deleted: deletedFileNames.includes(value)
			});
		});

		isOnInput = true;
		value = [...valueMap.keys()];
		field.set([...valueMap.keys()]);
		oninput?.({ event, value });

		/* const newValue = values;
		if (newValue !== value) {
			isOnInput = true;
			value = [...value, ...newValue];
			field.set([...value, ...newValue]);
			oninput?.({ event, value });
		} */
		context.validate?.({ preflightOnly: true });
	};
	watch(
		() => value,
		(currValue) => {
			if (isOnInput) {
				isOnInput = false;
				return;
			} else {
				currValue.forEach((value) => {
					valueMap.set(value, {
						name: value,
						uploaded: uploadedFiles.includes(value),
						deleted: deletedFileNames.includes(value)
					});
				});
				field.set([...valueMap.keys()]);
			}
		}
	);
	// ## END value logic ###############################################################################

	// ## BEGIN input change ############################################################################
	/* const onChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const value = field?.value() ?? [];
		onchange?.({ event, value });
	}; */
	// ## END input change ##############################################################################

	function removeFileInputElement(nameToDelete: string) {
		if (!fileInputElement) return;

		const inputFiles = fileInputElement.files;

		if (!inputFiles) return;

		const dataTransfer = new DataTransfer();

		for (let i = 0; i < inputFiles.length; i++) {
			const file = inputFiles[i];
			const fileName = file.name;
			if (fileName !== nameToDelete) {
				dataTransfer.items.add(file);
			} else {
				valueMap.delete(fileName);
				value = [...valueMap.keys()];
			}
		}

		files = dataTransfer.files;
	}

	function removeUploadedElement(nameToDelete: string) {
		if (valueMap.has(nameToDelete)) {
			const deletedObject = valueMap.get(nameToDelete);
			if (!deletedObject) return;
			valueMap.set(nameToDelete, { ...deletedObject, deleted: true });
			deletedFileNames.push(nameToDelete);
		}
	}

	function restoreUploadedElement(nameToRestore: string) {
		if (valueMap.has(nameToRestore)) {
			const restoredObject = valueMap.get(nameToRestore);
			if (!restoredObject) return;
			valueMap.set(nameToRestore, { ...restoredObject, deleted: false });
			deletedFileNames = deletedFileNames.filter((name) => name !== nameToRestore);
		}
	}
</script>

<!-- value={inputValue} -->
<div style:position="relative">
	<label>
		<h2>{label}</h2>
		<!-- class="sr-only" tabindex={-1} aria-hidden={true}  -->
		<select {...inputAttributes} bind:this={inputElement}>
			{#each value as option, i (i)}
				<option value={option}>{option}</option>
			{/each}
		</select>

		<input type="file" name={namePlus} oninput={onInput} bind:this={fileInputElement} multiple bind:files />

		<select name={nameMinus} multiple>
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
