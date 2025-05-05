<script lang="ts">
	import * as fileUpload from '@zag-js/file-upload';
	import { normalizeProps, useMachine } from '@zag-js/svelte';
	import { Icon } from '$lib/components/icons';
	import utils from '$lib/utils';

	let { name = undefined }: { name?: string } = $props();

	const id = `fileupload_${utils.randomString(8).toLowerCase()}`;
	name = name ?? `fileupload_${utils.randomString(8).toLowerCase()}`;
	const [snapshot, send] = useMachine(fileUpload.machine({ id, name, maxFiles: 25 }));

	const api = $derived(fileUpload.connect(snapshot, send, normalizeProps));
</script>

<div {...api.getRootProps()}>
	<div {...api.getDropzoneProps()}>
		<input {...api.getHiddenInputProps()} />
		<span>Dosya(ları)nızı buraya sürükleyin</span>
		<button {...api.getTriggerProps()}>Dosya(ları) seçin</button>
	</div>

	<ul {...api.getItemGroupProps()}>
		{#each api.acceptedFiles as file}
			<li {...api.getItemProps({ file })}>
				<div {...api.getItemNameProps({ file })}>{file.name}</div>
				<button {...api.getItemDeleteTriggerProps({ file })}>
					<Icon name={`close`} />
				</button>
			</li>
		{/each}
	</ul>
</div>

<style lang="postcss">
	/* Styling guide */
	[data-scope='file-upload'][data-part='root'] {
		@apply flex w-4/5 flex-col items-center gap-0.5;
	}

	[data-scope='file-upload'][data-part='dropzone'] {
		@apply flex flex-col items-center justify-center gap-0.5 border-2 border-dashed p-8;
		/* styles for root element*/
	}

	[data-scope='file-upload'][data-part='trigger'] {
		@apply bg-primary-500 inline-flex items-center justify-center gap-0.5 rounded-md px-4 py-2;
	}
	[data-scope='file-upload'][data-part='item'] {
		@apply border-border flex items-center gap-0.5 border px-4 py-2;
	}

	[data-part='label'] {
		/* styles for the input's label */
	}

	/* Dragging State */
	[data-part='root'][data-dragging] {
		/* styles for when the user is dragging a file over the file upload */
	}

	[data-scope='file-upload'][data-part='dropzone'][data-dragging] {
		@apply bg-primary-200;
		/* styles for when the user is dragging a file over the file upload */
	}

	/* Disabled State */
	[data-part='root'][data-disabled] {
		/* styles for when the file upload is disabled */
	}

	[data-part='dropzone'][data-disabled] {
		/* styles for when the file upload is disabled */
	}

	[data-part='trigger'][data-disabled] {
		/* styles for when the file upload is disabled */
	}

	[data-part='label'][data-disabled] {
		/* styles for when the file upload is disabled */
	}
</style>
