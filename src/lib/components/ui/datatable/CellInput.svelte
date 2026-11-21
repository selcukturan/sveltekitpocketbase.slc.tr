<script lang="ts" module>
	import type { Attachment } from 'svelte/attachments';
	import { on } from 'svelte/events';
	import type { Row, Column, Align } from './types.js';
	import { getTableContext } from './context.svelte.js';
</script>

<script lang="ts" generics="TData extends Row">
	// Hücre düzenleyicisi (DataCell, düzenlenen hücrede bunu çizer). Durum context.editor'da (bkz. editing.svelte.ts).
	// align: kolonun hizası (sayı/tarih sağda): düzenlerken metin yerinden oynamasın
	// id: hücrenin id'si (hata mesajının bağlanacağı çapa adı ve aria-describedby için)
	let { id, options, align = 'left' }: { id: string; options?: Column<TData>['options']; align?: Align } = $props();

	const context = getTableContext<TData>();
	const editor = context.editor;
	const editing = $derived(editor.editing);
	const kind = $derived(editing?.kind);

	const anchor = $derived(`--${id}`);
	const errorId = $derived(`${id}-error`);
	const error = $derived(editing?.error);

	// Hata mesajı popover'da (üst katman): tablonun overflow'u kesmez; CSS anchor positioning ile hücrenin altında durur
	const errorPopover: Attachment<HTMLElement> = (node) => {
		node.showPopover();
		return () => node.hidePopover();
	};

	// Tuşlar doğrudan elemana bağlanır (Svelte'in onkeydown'u kökte toplanır; grid'in dinleyicisi önce yakalardı).
	// Enter/Shift+Enter alt/üst, Tab/Shift+Tab yan hücreye kaydeder; ↑ ↓ (metin/sayı) kaydedip taşır; Esc iptal.
	// Dışarı tıklama (blur) yerinde kaydeder ama odağı geri çekmez (kullanıcı başka bir alana geçiyor olabilir).
	const control: Attachment<HTMLInputElement | HTMLSelectElement> = (node) => {
		node.focus({ preventScroll: true });
		if (node instanceof HTMLInputElement && node.type === 'text') {
			if (editing?.selectAll) node.select();
			else node.setSelectionRange(node.value.length, node.value.length);
		}

		const offKey = on(node, 'keydown', (e: KeyboardEvent) => {
			e.stopPropagation(); // grid'in gezinme/seçim tuşları çalışmasın
			const commit = (dr: number, dc: number) => {
				e.preventDefault();
				editor.commit({ dr, dc });
			};
			switch (e.key) {
				case 'Enter':
					return commit(e.shiftKey ? -1 : 1, 0);
				case 'Tab':
					return commit(0, e.shiftKey ? -1 : 1);
				case 'Escape':
					e.preventDefault();
					return editor.cancel();
				case 'ArrowUp':
				case 'ArrowDown':
					if (kind === 'text' || kind === 'number') commit(e.key === 'ArrowUp' ? -1 : 1, 0); // tarihte oklar parçayı değiştirir
			}
		});
		const offBlur = on(node, 'blur', () => {
			if (editor.editing) editor.commit(undefined, false);
		});
		return () => {
			offKey();
			offBlur();
		};
	};
</script>

{#if editing}
	{#if kind === 'select'}
		<select
			class="slc-table-editor"
			style:text-align={align}
			style:anchor-name={anchor}
			aria-invalid={error !== undefined}
			aria-describedby={error !== undefined ? errorId : undefined}
			value={editing.draft}
			onchange={(e) => editor.setDraft(e.currentTarget.value)}
			{@attach control}
		>
			<option value="">—</option>
			{#each options ?? [] as option (typeof option === 'string' ? option : option.value)}
				{@const value = typeof option === 'string' ? option : option.value}
				<option {value}>{typeof option === 'string' ? option : option.label}</option>
			{/each}
		</select>
	{:else}
		<!-- sayı için type=text + inputmode: type=number'da ↑ ↓ değeri değiştirirdi -->
		<input
			class="slc-table-editor"
			style:text-align={align}
			style:anchor-name={anchor}
			aria-invalid={error !== undefined}
			aria-describedby={error !== undefined ? errorId : undefined}
			type={kind === 'date' ? 'date' : kind === 'datetime' ? 'datetime-local' : 'text'}
			inputmode={kind === 'number' ? 'decimal' : undefined}
			value={editing.draft}
			oninput={(e) => editor.setDraft(e.currentTarget.value)}
			{@attach control}
		/>
	{/if}
	{#if error !== undefined}
		<div id={errorId} class="slc-table-editor-error" popover="manual" role="alert" style:position-anchor={anchor} {@attach errorPopover}>
			{error}
		</div>
	{/if}
{/if}

<style>
	.slc-table-editor {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0 10px;
		border: 2px solid var(--_dt-accent);
		border-radius: 0;
		outline: none;
		background-color: var(--_dt-bg);
		color: var(--_dt-text);
		font: inherit;
		text-align: inherit;
		box-sizing: border-box;
		user-select: text;
	}
	.slc-table-editor[aria-invalid='true'] {
		border-color: var(--color-error-500);
	}
	.slc-table-editor-error {
		position-area: block-end span-inline-end;
		margin: 2px 0 0;
		padding: 0.25rem 0.5rem;
		border: 1px solid var(--color-error-400);
		border-radius: 0.375rem;
		background-color: var(--color-error-50);
		color: var(--color-error-700);
		font-size: 0.8125rem;
		box-shadow: 0 4px 12px -4px color-mix(in srgb, black 25%, transparent);
	}
</style>
