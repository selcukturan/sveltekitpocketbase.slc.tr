<script lang="ts" generics="Tmultiple extends boolean = false, TData extends Record<string, unknown> = Record<string, unknown>">
	import { focustrap, portal } from '$lib/attachments';
	import { tick } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import { getFormInputsContext } from './context.svelte';
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { ListResult } from 'pocketbase';
	import Field from './Field.svelte';
	import { Collections } from '$lib/types/pocketbase-types';
	import { getRelationList } from '$lib/remotes/relations.remote';

	type ValueType<T extends boolean> = T extends true ? string[] : string;

	type ResolveData<T extends boolean> = {
		confirm: boolean;
	};

	type Props = Omit<SvelteHTMLElements['select'], 'id' | 'value' | 'multiple' | 'name'> & {
		collection: Exclude<`${Collections}`, `_${string}`>;
		id?: string;
		name?: string;
		label?: string;
		message?: string;
		yes?: string;
		no?: string;
		animationDuration?: number;
		multiple?: Tmultiple;
		value?: ValueType<Tmultiple>;
		field?: RemoteFormField<ValueType<Tmultiple>>;
		defaultSearch?: string;
		lazy?: boolean;
	};

	let {
		collection,
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as ValueType<Tmultiple>),
		field,
		message = 'Onaylıyor musunuz?',
		yes = 'Evet',
		no = 'Hayır',
		class: classes,
		id,
		name,
		label,
		animationDuration = 150, // Animasyon süresini, JS ve CSS'te senkronize tut.
		defaultSearch = '',
		lazy = false,

		...rest
	}: Props = $props();

	const componentId = $props.id();
	const context = getFormInputsContext();

	let remoteData: ListResult<TData> | undefined = $state();
	let internalRemoteData = $derived(remoteData); // initial data

	let pickerAnswer = $state('init');
	// svelte-ignore state_referenced_locally
	let pickerSearchString = $state(defaultSearch);
	let pickerSelected = $state(value);

	let selectInput: HTMLSelectElement | undefined = $state();

	let dialog: HTMLDialogElement | null = $state(null);
	let isOpen = $state(false);
	let resolvePromise: ((data: ResolveData<Tmultiple>) => void) | null = null;
	let isClosing = $state(false); // Kapanma animasyonu durumunu tutmak için bir state

	const fieldAttributes = $derived(
		field
			? {
					...field.as(multiple ? 'select multiple' : ('select' as any)),
					value: undefined
				}
			: {
					type: multiple ? 'select multiple' : 'select',
					name: undefined as string | undefined
				}
	);

	/* const fieldAttributes = $derived(
		multiple
			? (field as RemoteFormField<ValueType<true>> | undefined)?.as('select multiple')
			: (field as RemoteFormField<ValueType<false>> | undefined)?.as('select')
	); */
	const issues = $derived(field?.issues() ?? []);
	const mainName = $derived(fieldAttributes?.name || name);
	const required = $derived(context?.getValibotMetadata(mainName?.replace('[]', ''))?.slc_required === true ? true : false);
	const labelFor = $derived(mainName || id || componentId + '-relation-picker-button');

	let closedby = $state<'any' | 'none' | 'closerequest' | null | undefined>('any');

	const show = (): Promise<ResolveData<Tmultiple>> => {
		return new Promise<ResolveData<Tmultiple>>((resolve) => {
			resolvePromise = resolve;
			isOpen = true;
			tick().then(() => {
				dialog?.showModal();
			});
		});
	};

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	const hide = async (log: string, confirm: boolean) => {
		if (isClosing) return; // Kapatma işlemi zaten başladıysa tekrar çalıştırma.
		isClosing = true; // Artık kapatma işlemi başlayabilir. Kapatma işlemi CSS `.closing` animasyonu başlar.
		await sleep(animationDuration); // CSS animasyonu için bekleniyor. Kod burada duraklar.
		// Bekleme bittikten sonra bu kodlar çalışır. Kapatma işlemi CSS `.closing` animasyonu biter.
		isClosing = false;
		dialog?.close();
		isOpen = false;
		resolvePromise?.({ confirm });
		resolvePromise = null;
	};

	const dialogAttach: Attachment = (element) => {
		if (!(element instanceof HTMLDialogElement)) {
			throw new Error('Dialog element is not an HTMLDialogElement');
		}

		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				e.preventDefault();
				hide('confirm - handleKeydown - Esc key pressed', false);
			}
		};

		const handleCancel = (e: Event) => {
			e.preventDefault();
			if (e.target === dialog) {
				hide('handleCancel - Backdrop click', false);
			}
		};

		element.addEventListener('cancel', handleCancel);
		element.addEventListener('keydown', handleKeydown);
		return () => {
			element.removeEventListener('cancel', handleCancel);
			element.removeEventListener('keydown', handleKeydown);
		};
	};

	const valueChanged = (value: ValueType<Tmultiple>) => {
		field?.set(value);
		context?.form.validate({ preflightOnly: true });
	};

	let first = true;
	const proxy = {
		get value() {
			const currentValue = value;
			if (first) {
				first = false;
				// pickerSelected = currentValue; // initial value, daha sonraki değerler bind:group ile güncellenir.
				if (!lazy) {
					getRelationList({ search: pickerSearchString, collection }).then((data) => {
						remoteData = data as any;
					});
				}
				valueChanged(currentValue);
			}
			return currentValue;
		},
		set value(v) {
			const currentValue = v;
			value = currentValue;
			valueChanged(currentValue);
		}
	};

	function handleToggle(item: any, isChecked: boolean) {
		if (multiple && Array.isArray(pickerSelected)) {
			if (isChecked) {
				pickerSelected = [...pickerSelected, item.id] as ValueType<Tmultiple>;
			} else {
				pickerSelected = pickerSelected.filter((id) => id !== item.id) as ValueType<Tmultiple>;
			}
		} else {
			if (isChecked) {
				pickerSelected = item.id as ValueType<Tmultiple>;
			}
		}
	}
</script>

<!-- <svelte:boundary> -->
<Field {issues} {required} {label} id={labelFor}>
	{#snippet input(inputClass)}
		<!-- Begin Trigger -->
		<button
			type="button"
			id={labelFor}
			onclick={async () => {
				pickerAnswer = 'waiting';
				pickerSelected = value;
				pickerSearchString = defaultSearch;

				getRelationList({ search: pickerSearchString, collection }).then((data) => {
					remoteData = data as any;
				});

				const { confirm } = await show();

				if (confirm) {
					pickerAnswer = 'true';
					proxy.value = pickerSelected;
				} else {
					pickerAnswer = 'false';
				}
			}}
			class="slc-input bg-secondary-400!"
		>
			Relation Picker ({pickerAnswer})
		</button>
		<!-- End Trigger -->

		<!-- Begin value List -->
		{#if multiple}
			{#each value as val}
				<p>{val} - ({internalRemoteData?.items.find((item) => item.id === val)?.caption})</p>
			{/each}
		{:else}
			<p>{value} - ({internalRemoteData?.items.find((item) => item.id === value)?.caption})</p>
		{/if}
		<!-- End value List -->
	{/snippet}
</Field>

<!-- Begin Select -->
{#if multiple}
	<select
		multiple
		bind:this={selectInput}
		bind:value={proxy.value}
		name={mainName}
		id={mainName || id}
		class="sr-only"
		tabindex={-1}
		aria-hidden={true}
	>
		{#each value as option, i (i)}
			<option value={option} selected>{option}</option>
		{/each}
	</select>
{:else}
	<select
		bind:this={selectInput}
		bind:value={proxy.value}
		name={mainName}
		id={mainName || id}
		class="sr-only"
		tabindex={-1}
		aria-hidden={true}
	>
		<option {value} selected>{value}</option>
	</select>
{/if}
<!-- End Select -->

{#if isOpen}
	<!-- Begin Dialog -->
	<dialog
		style="--confirm-animation-duration: {animationDuration / 1000}s"
		{closedby}
		{@attach dialogAttach}
		class="bg-surface-300 m-auto w-11/12 max-w-lg rounded-lg p-0 shadow-lg"
		bind:this={dialog}
		class:closing={isClosing}
		{@attach focustrap}
		{@attach portal}
	>
		<div class="dialog-content">
			<p>{message}</p>
			<input
				type="text"
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						const target = e.target as HTMLInputElement;
						pickerSearchString = target.value;
						getRelationList({ search: pickerSearchString, collection }).then((data) => {
							remoteData = data as any;
						});
					}
				}}
			/>

			{#each internalRemoteData?.items ?? [] as item}
				{#if typeof item.id === 'string'}
					<label>
						{#if Array.isArray(pickerSelected)}
							<input
								type="checkbox"
								name={componentId}
								checked={pickerSelected.includes(item.id)}
								onchange={(e) => handleToggle(item, e.currentTarget.checked)}
							/>
						{:else}
							<input
								type="radio"
								name={componentId}
								checked={pickerSelected.includes(item.id)}
								onchange={(e) => handleToggle(item, e.currentTarget.checked)}
							/>
						{/if}
						{item.title}
					</label>
				{/if}
			{/each}

			<button onclick={() => hide('no button clicked', false)}>{no}</button>
			<button onclick={() => hide('yes button clicked', true)}>{yes}</button>
		</div>
	</dialog>
	<!-- End Dialog -->
{/if}

<!-- Begin Pending -->
<!-- {#snippet pending()}
		<p class="slc-boundary-relation-picker-pending">Loading...</p>
	{/snippet} -->
<!-- End Pending -->
<!-- </svelte:boundary> -->

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

	dialog {
		/* Başlangıçta dialog görünmez ve animasyona hazır */
		opacity: 0;
	}

	dialog::backdrop {
		background-color: var(--color-surface-300);
		/* Başlangıçta backdrop görünmez ve animasyona hazır */
		opacity: 0;
	}

	/* Animate In */
	dialog[open] {
		animation: dialog-enter-from-bottom var(--confirm-animation-duration) ease-out forwards;
	}
	dialog[open]::backdrop {
		animation: backdrop-fade-in var(--confirm-animation-duration) ease-out forwards;
	}

	/* Starting style for entry animation */
	@starting-style {
		dialog[open] {
			/* Başlangıçta dialog görünmez ve animasyona hazır */
			opacity: 0;
		}

		dialog[open]::backdrop {
			/* Başlangıçta backdrop görünmez ve animasyona hazır */
			opacity: 0;
		}
	}

	dialog[open].closing {
		animation: dialog-exit-to-bottom var(--confirm-animation-duration) ease-out forwards;
	}

	dialog[open].closing::backdrop {
		animation: backdrop-fade-out var(--confirm-animation-duration) ease-out forwards;
	}

	@keyframes dialog-enter-from-bottom {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes dialog-exit-to-bottom {
		from {
			opacity: 1;
			transform: translateY(0);
		}
		to {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	@keyframes backdrop-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 0.5;
		}
	}

	@keyframes backdrop-fade-out {
		from {
			opacity: 0.5;
		}
		to {
			opacity: 0;
		}
	}

	.dialog-content {
		padding: 1.5rem; /* 24px */
	}
</style>
