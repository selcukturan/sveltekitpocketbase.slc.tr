<script lang="ts" generics="Tmultiple extends boolean = false">
	import { SvelteMap } from 'svelte/reactivity';
	import { slide } from 'svelte/transition';
	import { on } from 'svelte/events';
	import { inputClasses } from './common.js';
	import type { FilePropsType, FileDisplayType, FileFileTypeChoice, FileValueTypeChoice } from './type.js';

	let {
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as FileValueTypeChoice<Tmultiple>),
		accept = '*',
		maxSize = Infinity,
		maxCount = Infinity,
		id,
		name,
		class: classes = '',
		selectedFiles = $bindable([] as File[]),
		status = 'default',
		size = 'md',
		inform = false,
		disabled = false,
		readonly = false,
		onValueChange,
		onFilesChange
	}: FilePropsType<Tmultiple> = $props();

	let inputElement: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);
	let errorText = $state<string | null>(null);

	const valueMap = new SvelteMap<string, FileDisplayType>();

	// valueMap'i bileşen oluşturulurken doldur; böylece liste ilk render'da dolu gelir.
	const initValueMap = () => {
		// 1. Initial values from value prop (uploaded files)
		const initialValues = Array.isArray(value) ? value : value ? [value] : [];
		initialValues.forEach((fileName) => {
			if (fileName) {
				valueMap.set(fileName, {
					name: fileName,
					uploaded: true,
					deleted: false
				});
			}
		});

		// 2. Initial selected files from selectedFiles prop (unuploaded local files)
		if (Array.isArray(selectedFiles)) {
			selectedFiles.forEach((file) => {
				if (file && file.name) {
					valueMap.set(file.name, {
						name: file.name,
						uploaded: false,
						deleted: false,
						size: file.size,
						fileObj: file
					});
				}
			});
		}
	};
	initValueMap();

	const displayFiles = $derived([...valueMap.values()]);
	const isEmpty = $derived(displayFiles.length === 0);

	const deletedFileNames = $derived.by(() => {
		const deleted = [...valueMap.values()].filter((f) => f.uploaded && f.deleted).map((f) => f.name);
		if (multiple) {
			return deleted as FileValueTypeChoice<Tmultiple>;
		} else {
			return (deleted[0] ?? '') as FileValueTypeChoice<Tmultiple>;
		}
	});

	const getMapNotDeletedFiles = (): FileValueTypeChoice<Tmultiple> => {
		const activeFiles = [...valueMap.values()].filter((f) => !f.deleted).map((f) => f.name);
		if (multiple) {
			return activeFiles as FileValueTypeChoice<Tmultiple>;
		} else {
			return (activeFiles[0] ?? '') as FileValueTypeChoice<Tmultiple>;
		}
	};

	const getSelectedFiles = (filesArray: File[]): FileFileTypeChoice<Tmultiple> => {
		if (multiple) {
			return filesArray as FileFileTypeChoice<Tmultiple>;
		} else {
			return filesArray[0] as FileFileTypeChoice<Tmultiple>;
		}
	};

	// Bayt formatlayıcı (Örn: 1048576 -> "1.00 MB")
	function formatBytes(bytes: number, decimals = 2) {
		if (bytes === 0 || bytes === Infinity) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	// Dosyaları doğrulayıp ekleyen ana fonksiyon
	const handleFilesAdded = (fileList: FileList | File[] | null) => {
		if (!fileList) return;
		errorText = null;

		const filesArray = Array.from(fileList);

		// 1. Accept format doğrulaması
		const acceptedFiles = filesArray.filter((file) => {
			if (!accept || accept === '*' || accept === '*/*') return true;

			const mimeType = file.type.toLowerCase();
			const extension = '.' + file.name.split('.').pop()?.toLowerCase();
			const acceptList = accept.split(',').map((s) => s.trim().toLowerCase());

			return acceptList.some((rule) => {
				if (rule.startsWith('.')) {
					return extension === rule;
				} else if (rule.endsWith('/*')) {
					const baseType = rule.replace('/*', '');
					return mimeType.startsWith(baseType);
				} else {
					return mimeType === rule;
				}
			});
		});

		if (acceptedFiles.length < filesArray.length) {
			errorText = 'Bazı dosyalar kabul edilmeyen formatta olduğu için eklenmedi.';
		}

		if (acceptedFiles.length === 0) {
			triggerErrorClear();
			return;
		}

		// 2. Boyut (maxSize) doğrulaması
		const sizeOkFiles = acceptedFiles.filter((file) => {
			if (file.size > maxSize) {
				errorText = `"${file.name}" boyutu çok büyük. Maksimum limit: ${formatBytes(maxSize)}`;
				return false;
			}
			return true;
		});

		if (sizeOkFiles.length === 0) {
			triggerErrorClear();
			return;
		}

		// 3. Adet (maxCount) doğrulaması ve ekleme
		if (!multiple) {
			// Tekli seçim
			valueMap.clear();
			const file = sizeOkFiles[0];
			valueMap.set(file.name, {
				name: file.name,
				uploaded: false,
				deleted: false,
				size: file.size,
				fileObj: file
			});
		} else {
			// Çoklu seçim
			const currentActiveCount = [...valueMap.values()].filter((f) => !f.deleted).length;
			const allowedToAdd = maxCount - currentActiveCount;

			if (allowedToAdd <= 0) {
				errorText = `Maksimum dosya limitine ulaşıldı (${maxCount} adet).`;
				triggerErrorClear();
				return;
			}

			const filesToAdd = sizeOkFiles.slice(0, allowedToAdd);
			if (sizeOkFiles.length > allowedToAdd) {
				errorText = `En fazla ${maxCount} dosya ekleyebilirsiniz. Sınırı aşan dosyalar eklenmedi.`;
			}

			filesToAdd.forEach((file) => {
				if (!valueMap.has(file.name)) {
					valueMap.set(file.name, {
						name: file.name,
						uploaded: false,
						deleted: false,
						size: file.size,
						fileObj: file
					});
				}
			});
		}

		syncChanges();
		triggerErrorClear();
	};

	// Değişiklikleri senkronize et
	const syncChanges = () => {
		const beforeValue = lastValue;
		value = getMapNotDeletedFiles();
		lastValue = value;

		const beforeSelected = lastSelectedFiles;
		selectedFiles = [...valueMap.values()].filter((f) => !f.uploaded && !f.deleted && f.fileObj).map((f) => f.fileObj!) as File[];
		lastSelectedFiles = selectedFiles;

		onValueChange?.({
			value: $state.snapshot(value) as FileValueTypeChoice<Tmultiple>,
			beforeValue: $state.snapshot(beforeValue) as FileValueTypeChoice<Tmultiple>,
			initial: false,
			selectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
			beforeSelectedFiles: getSelectedFiles($state.snapshot(beforeSelected)),
			deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
		});
		onFilesChange?.($state.snapshot(selectedFiles));
	};

	// Hata mesajını temizleme zamanlayıcısı
	const triggerErrorClear = () => {
		if (errorText) {
			setTimeout(() => {
				errorText = null;
			}, 4000);
		}
	};

	// Dosya kaldırma
	function removeFile(nameToDelete: string) {
		const item = valueMap.get(nameToDelete);
		if (!item) return;

		if (item.uploaded) {
			valueMap.set(nameToDelete, { ...item, deleted: true });
		} else {
			valueMap.delete(nameToDelete);
		}

		syncChanges();
	}

	// Dosyayı geri alma
	function restoreFile(nameToRestore: string) {
		const item = valueMap.get(nameToRestore);
		if (!item) return;

		if (multiple) {
			const currentActiveCount = [...valueMap.values()].filter((f) => !f.deleted).length;
			if (currentActiveCount >= maxCount) {
				errorText = `Maksimum dosya limitini (${maxCount} adet) aşacağı için geri alınamadı.`;
				triggerErrorClear();
				return;
			}
		} else {
			valueMap.forEach((val, key) => {
				if (key !== nameToRestore) valueMap.delete(key);
			});
		}

		valueMap.set(nameToRestore, { ...item, deleted: false });
		syncChanges();
	}

	// Tekli modda dosya seçiliyse veya çoklu modda limit dolduysa buton soluk görünür
	const isFull = $derived.by(() => {
		const activeCount = displayFiles.filter((f) => !f.deleted).length;
		return multiple ? activeCount >= maxCount : activeCount >= 1;
	});

	// Sürükle-bırak olayları (tüm kart bırakma alanıdır)
	const dropzoneEvents = (node: HTMLElement) => {
		const destroyDragOver = on(node, 'dragover', (e: DragEvent) => {
			e.preventDefault();
			if (disabled || readonly) return;
			isDragging = true;
		});

		const destroyDragLeave = on(node, 'dragleave', (e: DragEvent) => {
			if (disabled || readonly) return;
			// Alt elemanlar arasında gezinirken titremeyi önle
			if (e.relatedTarget instanceof Node && node.contains(e.relatedTarget)) return;
			isDragging = false;
		});

		const destroyDrop = on(node, 'drop', (e: DragEvent) => {
			e.preventDefault();
			if (disabled || readonly) return;
			isDragging = false;
			if (e.dataTransfer?.files) {
				handleFilesAdded(e.dataTransfer.files);
			}
		});

		return () => {
			destroyDragOver();
			destroyDragLeave();
			destroyDrop();
		};
	};

	// ############################### BEGIN PROXY ###############################
	let first = true;
	let lastValue = value; // Son tetiklenen değeri takip eden değişken
	let lastSelectedFiles = selectedFiles; // Son tetiklenen dosyaları takip eden değişken
	const proxy = {
		get files() {
			const currentVal = value;
			const mapActive = getMapNotDeletedFiles();
			const areEqual =
				Array.isArray(currentVal) && Array.isArray(mapActive)
					? currentVal.length === mapActive.length && currentVal.every((v, i) => v === mapActive[i])
					: currentVal === mapActive;

			if (first) {
				first = false;

				// valueMap initValueMap() ile zaten dolduruldu; burada yalnızca ilk değer senkronize edilir
				const initialNotDeleted = getMapNotDeletedFiles();
				// Sync the initial value prop to include any preloaded selectedFiles
				value = initialNotDeleted;
				lastValue = initialNotDeleted;
				lastSelectedFiles = selectedFiles;

				onValueChange?.({
					value: $state.snapshot(initialNotDeleted) as FileValueTypeChoice<Tmultiple>,
					beforeValue: $state.snapshot(initialNotDeleted) as FileValueTypeChoice<Tmultiple>,
					initial: true,
					selectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
					beforeSelectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
					deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
				});
				onFilesChange?.($state.snapshot(selectedFiles));
			} else if (!areEqual) {
				// Dışarıdan value değişimi
				const tempBefore = lastValue;
				const beforeSelected = lastSelectedFiles;
				valueMap.clear();
				const valuesToSet = Array.isArray(currentVal) ? currentVal : currentVal ? [currentVal] : [];
				valuesToSet.forEach((fileName) => {
					if (fileName) {
						valueMap.set(fileName, {
							name: fileName,
							uploaded: true,
							deleted: false
						});
					}
				});
				selectedFiles = [];
				lastValue = currentVal;
				lastSelectedFiles = [];
				onValueChange?.({
					value: $state.snapshot(currentVal) as FileValueTypeChoice<Tmultiple>,
					beforeValue: $state.snapshot(tempBefore) as FileValueTypeChoice<Tmultiple>,
					initial: false,
					selectedFiles: getSelectedFiles([]),
					beforeSelectedFiles: getSelectedFiles($state.snapshot(beforeSelected)),
					deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
				});
				onFilesChange?.([]);
			} else {
				// Value dışarıdan değişmediyse selectedFiles değişmiş mi kontrol et
				const localFiles = [...valueMap.values()].filter((f) => !f.uploaded && !f.deleted && f.fileObj).map((f) => f.fileObj!);
				const filesAreEqual = selectedFiles.length === localFiles.length && selectedFiles.every((file, index) => file === localFiles[index]);

				if (!filesAreEqual) {
					// Dışarıdan selectedFiles değişimi
					// Yüklenen dosyaları tut, yüklenmemiş diğer dosyaları kaldır
					valueMap.forEach((val, key) => {
						if (!val.uploaded) {
							valueMap.delete(key);
						}
					});

					// selectedFiles'tan tüm dosyaları ekle
					selectedFiles.forEach((file) => {
						valueMap.set(file.name, {
							name: file.name,
							uploaded: false,
							deleted: false,
							size: file.size,
							fileObj: file
						});
					});

					const tempBefore = lastValue;
					const beforeSelected = lastSelectedFiles;
					value = getMapNotDeletedFiles();
					lastValue = value;
					lastSelectedFiles = selectedFiles;

					onValueChange?.({
						value: $state.snapshot(value) as FileValueTypeChoice<Tmultiple>,
						beforeValue: $state.snapshot(tempBefore) as FileValueTypeChoice<Tmultiple>,
						initial: false,
						selectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
						beforeSelectedFiles: getSelectedFiles($state.snapshot(beforeSelected)),
						deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
					});
					onFilesChange?.($state.snapshot(selectedFiles));
				}
			}

			// selectedFiles'tan bir FileList oluştur
			const dt = new DataTransfer();
			selectedFiles.forEach((file) => dt.items.add(file));
			return dt.files;
		},
		set files(v: FileList | null) {
			if (v) {
				handleFilesAdded(v);
			}
		}
	};
	// ############################### END PROXY ###############################

	// ######### BEGIN: preventDefaultClick handlers ###########
	const preventDefaultClick = (node: HTMLElement) => {
		return on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
		});
	};
	// ######### END: preventDefaultClick handlers #############

	const defaultClasses = $derived(!inform ? inputClasses.base + ' ' + inputClasses.variants[status] + ' ' + inputClasses.sizes[size] : '');
</script>

{#snippet listItem(file: FileDisplayType)}
	<!-- list-item -->
	<div
		transition:slide={{ duration: 150 }}
		class="hover:bg-surface-300/50 border-surface-300 relative flex min-h-8 w-full items-center gap-2.5 border-t px-3 py-1.5 wrap-break-word outline-none first:border-t-0"
	>
		<!-- content -->
		<div class="flex w-full max-w-full min-w-0 items-center gap-2 select-text" class:opacity-50={file.deleted}>
			<svg class="text-surface-500 h-4 w-4 shrink-0" stroke="currentColor" fill="none" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
				/>
			</svg>
			{#if !file.uploaded}
				<span class="bg-success-200 border-success-400 text-success-800 shrink-0 rounded-sm border px-1 py-px text-xs font-medium">Yeni</span>
			{/if}
			<!-- label -->
			<span class="truncate text-sm" class:line-through={file.deleted}>{file.name}</span>
			{#if file.size !== undefined}
				<span class="text-surface-500 shrink-0 text-xs">{formatBytes(file.size)}</span>
			{/if}
		</div>
		<!-- action -->
		<div class="inline-flex shrink-0 items-center gap-2.5">
			{#if !disabled && !readonly}
				{#if file.deleted}
					<button
						type="button"
						onclick={() => restoreFile(file.name)}
						class="slc-input text-warning-700 hover:bg-warning-400/50 focus:bg-warning-500/50 inline-flex cursor-pointer items-center gap-1 rounded-md p-1 text-xs font-bold outline-none"
						aria-label="{file.name} geri al"
					>
						<svg class="h-4 w-4" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
						</svg>
						Geri al
					</button>
				{:else}
					<button
						type="button"
						onclick={() => removeFile(file.name)}
						class="slc-input hover:bg-surface-400/50 focus:bg-surface-500/50 cursor-pointer rounded-full p-1 outline-none"
						aria-label="{file.name} kaldır"
					>
						<svg class="h-4 w-4" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				{/if}
			{/if}
		</div>
	</div>
{/snippet}

<output
	class="mt-1 flex flex-col gap-0 rounded-sm transition-colors {defaultClasses} {isDragging
		? 'outline-primary-500 bg-primary-100/30 outline-2 outline-dashed'
		: ''} {classes}"
	{@attach dropzoneEvents}
>
	<div class="border-surface-300 max-h-48 overflow-y-auto" class:border-t={inform ? true : isEmpty ? false : true} {@attach preventDefaultClick}>
		{#each displayFiles as file (file.name)}
			{@render listItem(file)}
		{/each}
	</div>

	<!-- Hata Bildirimi -->
	{#if errorText}
		<div
			transition:slide={{ duration: 200 }}
			class="bg-error-50 text-error-700 border-error-100 mx-1 mt-1 flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs font-semibold"
		>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4 w-4 shrink-0">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
			</svg>
			<span>{errorText}</span>
		</div>
	{/if}

	<div class="border-surface-300 group/btn px-1 pt-1" class:border-t={!isEmpty}>
		<button
			{id}
			type="button"
			{disabled}
			onclick={() => !readonly && inputElement?.click()}
			class="slc-input group-hover/btn:bg-surface-400/50 focus:bg-surface-500/50 inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-md p-1 text-start text-sm font-bold outline-none disabled:cursor-not-allowed disabled:opacity-50"
			class:opacity-50={isFull || readonly}
			tabindex={disabled || readonly ? -1 : 0}
		>
			<svg class="h-4 w-4" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
			</svg>
			<span>{!multiple && isFull ? 'Dosyayı değiştir veya sürükleyip bırak' : 'Dosya yükle veya sürükleyip bırak'}</span>
		</button>
	</div>

	<!-- Açıklayıcı Alt Bilgiler -->
	{#if (accept && accept !== '*') || maxSize !== Infinity || (multiple && maxCount !== Infinity)}
		<span class="text-surface-500 flex flex-wrap justify-center gap-x-2 gap-y-0.5 px-3 pt-0.5 text-xs">
			{#if accept && accept !== '*'}
				<span>Format: <code class="font-semibold">{accept}</code></span>
			{/if}
			{#if maxSize !== Infinity}
				<span>Maks. boyut: <span class="font-semibold">{formatBytes(maxSize)}</span></span>
			{/if}
			{#if multiple && maxCount !== Infinity}
				<span>En fazla: <span class="font-semibold">{maxCount} adet</span></span>
			{/if}
		</span>
	{/if}

	<!-- Gizli Dosya Seçme Elemanı -->
	<input type="file" {multiple} {accept} {name} bind:files={proxy.files} bind:this={inputElement} class="sr-only" tabindex={-1} aria-hidden={true} />
</output>
