<script lang="ts">
	import { getForm } from './forms.svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import type { AnyFieldApi } from '@tanstack/svelte-form';

	type Props = Omit<HTMLInputAttributes, 'value'> & {
		value?: string | null;
		ref?: HTMLInputElement | null;
		name: string;
		class?: string;
	};

	let { value = $bindable(null), name, class: classes, ref = $bindable(null), ...attributes }: Props = $props();

	const ctx = getForm();
	console.log('iTextbox', ctx.test);

	function inputValue(tanstackValue: string | null): string {
		// Beklenen giriş formatı: "YYYY-MM-DD HH:mm:ss.sssZ"
		// Örnek: "1985-10-26 21:18:00.000Z"

		if (typeof tanstackValue !== 'string' || tanstackValue.length < 16) {
			// Temel bir format kontrolü
			console.error("Geçersiz giriş string formatı. Beklenen: 'YYYY-MM-DD HH:mm:ss.sssZ'");
			return ''; // veya bir hata fırlatabilirsiniz
		}

		// YYYY-MM-DD kısmını al (ilk 10 karakter)
		const datePart = tanstackValue.substring(0, 10); // "1985-10-26"

		// HH:mm kısmını al (boşluktan sonraki 5 karakter, yani 11. karakterden 16. karaktere kadar)
		const timePart = tanstackValue.substring(11, 16); // "21:18"

		// Parçaları 'T' ile birleştir
		return `${datePart}T${timePart}`; // "1985-10-26T21:18"
	}

	function tanstackValue(inputValue: string): string {
		// Beklenen giriş formatı: "YYYY-MM-DDTHH:mm"
		// Örnek: "1985-10-26T21:18"

		if (typeof inputValue !== 'string' || inputValue.length !== 16) {
			// Temel bir format ve uzunluk kontrolü
			console.error("Geçersiz giriş string formatı veya uzunluğu. Beklenen: 'YYYY-MM-DDTHH:mm'");
			return ''; // veya bir hata fırlatabilirsiniz
		}

		// 'T' karakterinin doğru yerde olup olmadığını kontrol et (opsiyonel ama iyi bir pratik)
		if (inputValue.charAt(10) !== 'T') {
			console.error("Geçersiz giriş string formatı. 'T' ayıracı bekleniyor.");
			return '';
		}

		// 'T'yi boşluk ile değiştir
		// const dateTimeWithSpace = inputValue.replace('T', ' '); // "1985-10-26 21:18"

		// Saniye, milisaniye ve 'Z' belirtecini ekle
		// Eğer her zaman sıfır saniye ve milisaniye istiyorsanız:
		return `${inputValue}:00.000Z`; // "1985-10-26T21:18:00.000Z"
	}

	const inputAttach = (tanstackField: AnyFieldApi): Attachment<HTMLInputElement> => {
		return (inputNode) => {
			// initial/default input value
			const getFieldDefaultValue = ctx.getFieldDefaultValue(tanstackField.name);
			const fieldDefaultValue = typeof getFieldDefaultValue === 'string' ? getFieldDefaultValue : null;
			value = inputValue(value ?? fieldDefaultValue);

			const onblur = (e: Event) => {
				tanstackField.handleBlur;
			};

			const oninput = (e: Event) => {
				console.log('before-tanstack-oninput');

				tanstackField.handleChange(tanstackValue((e.target as HTMLInputElement).value));

				if (typeof tanstackField.state.value === 'string') {
					value = inputValue(tanstackField.state.value);
				}
				console.log('xxxxx ------>:', tanstackField.state.value, (e.target as HTMLInputElement).value);
			};

			inputNode.addEventListener('blur', onblur);
			inputNode.addEventListener('input', oninput);

			return () => {
				inputNode.removeEventListener('blur', onblur);
				inputNode.removeEventListener('input', oninput);
			};
		};
	};

	const setInputValueIfChanged = (newValue: string) => {
		if (ref && ref.value !== newValue) {
			ref.value = newValue;
		}
	};

	$effect(() => {
		setInputValueIfChanged(value ?? '');
	});
</script>

<!-- value={field.state.value} -->
<ctx.tanstackForm.Field {name}>
	{#snippet children(field)}
		<div style:display="contents">
			<label for={field.name}>{field.name}</label>
			<input type="datetime-local" id={field.name} name={field.name} class={classes} bind:this={ref} {...attributes} {@attach inputAttach(field)} />
			{#if field.state.meta.isTouched}
				{#each field.state.meta.errors as error}
					<em>{JSON.stringify(error)}</em>
				{/each}
				{field.state.meta.isValidating ? 'Validating...' : ''}
			{/if}
		</div>
	{/snippet}
</ctx.tanstackForm.Field>
