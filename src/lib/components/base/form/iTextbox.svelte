<script lang="ts">
	import { untrack } from 'svelte';
	import { getForm } from './forms.svelte';
	import type { Attachment } from 'svelte/attachments';

	let { name, class: classes }: { name: string; class?: string } = $props();

	let ctx = getForm();

	const inputAttach = (inputName: string): Attachment => {
		return (inputNode) => {
			if (!(inputNode instanceof HTMLInputElement)) return;

			const onblur = (e: Event) => {
				const target = e.target;
				if (!(target instanceof HTMLInputElement)) return;
				ctx.onblur(target);
			};

			const oninput = (e: Event) => {
				const target = e.target;
				if (!(target instanceof HTMLInputElement)) return;
				ctx.oninput(target, inputName, target.value);
			};

			inputNode.addEventListener('blur', onblur);
			inputNode.addEventListener('input', oninput);

			return () => {
				inputNode.removeEventListener('blur', onblur);
				inputNode.removeEventListener('input', oninput);
			};
		};
	};

	$effect(() => {
		// Initialize the input in the context
		untrack(() => {
			ctx.inputs = {
				...ctx.inputs,
				[name]: {
					value: 'value',
					initialValue: 'initialValue',
					inputValue: 'inputValue'
				}
			};

			ctx.data = {
				...ctx.data,
				[name]: 'value'
			};
		});

		// destroy
		return () => {
			// Remove the input from the context
			const entries = Object.entries(ctx.inputs);
			const filteredEntries = entries.filter(([key]) => key !== name);
			const newInputs = Object.fromEntries(filteredEntries);
			ctx.inputs = newInputs;

			// Remove the value from the context
			const newData = { ...ctx.data };
			delete newData[name];
			ctx.data = newData;
		};
	});
</script>

<div style:display="contents">
	<label for={name}>{name}</label>
	<input id={name} {name} value={ctx.inputs[name] ? ctx.inputs[name].inputValue : ''} {@attach inputAttach(name)} class={classes} />
	Error: {ctx.errorsByName[name]}
</div>
