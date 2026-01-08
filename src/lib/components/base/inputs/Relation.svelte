<script lang="ts" generics="Tmultiple extends boolean = false">
	// ######################## IMPORTS #################################################################################################
	import { getFormInputsContext } from './context.svelte';
	import Field from './Field.svelte';
	import type { RelationInputPropsType, ValueType } from './relation-picker/types';

	import { relationPicker } from './relation-picker';

	let {
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as ValueType<Tmultiple>),
		field,
		message, // PickerConfig'den geliyor
		yes, // PickerConfig'den geliyor
		class: classes,
		id,
		name,
		label,
		...rest
	}: RelationInputPropsType<Tmultiple> = $props();

	const componentId = $props.id();

	const context = getFormInputsContext();

	let selectInput: HTMLSelectElement | undefined = $state();
	let pickerAnswer = $state('init');
	// svelte-ignore state_referenced_locally
	let pickerValue = $state<ValueType<Tmultiple>>((multiple ? ['init'] : 'init') as ValueType<Tmultiple>);

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

	const issues = $derived(field?.issues() ?? []);
	const mainName = $derived(fieldAttributes.name || name);
	const required = $derived(context?.getValibotMetadata(mainName?.replace('[]', ''))?.slc_required === true ? true : false);
	const labelFor = $derived(mainName || id || componentId + '-relation-picker-button');

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
</script>

<Field {issues} {required} {label} id={labelFor}>
	{#snippet input(inputClass)}
		<main>
			<div class="flex flex-col gap-4">
				<button
					id={labelFor}
					type="button"
					onclick={async () => {
						pickerAnswer = 'waiting';
						pickerValue = 'waiting' as ValueType<Tmultiple>;
						const { confirm, value: selected } = await relationPicker({ multiple });
						if (confirm) {
							pickerAnswer = 'true';
							pickerValue = selected;

							value = selected;
							valueChanged(value);
						} else {
							pickerAnswer = 'false';
							pickerValue = 'false' as ValueType<Tmultiple>;
						}
					}}
					class="{classes} {inputClass} bg-secondary-400!"
				>
					Relation Picker
				</button>

				<p>pickerAnswer:{pickerAnswer}</p>
				<p>pickerValue:{pickerValue}</p>
			</div>

			{#if multiple}
				<select
					multiple
					bind:this={selectInput}
					bind:value={proxy.value}
					name={mainName}
					id={mainName || id}
					class="bg-error-500 w-full"
					{...rest}
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
					class="bg-error-500 w-full"
					{...rest}
				>
					<option {value} selected>{value}</option>
				</select>
			{/if}
		</main>
	{/snippet}
</Field>

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
