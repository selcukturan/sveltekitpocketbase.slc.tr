import type { Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import type { AppMenuNode } from '#lib/app/menu/menu.js';

export type ChildrenPropsType = { children: Snippet };

export type AppLayoutPropsType = SvelteHTMLElements['div'] & {
	children: ChildrenPropsType['children'];
};

export type PropsAppSidebarType = SvelteHTMLElements['section'] & {
	modules: AppMenuNode[]; // menü kökleri
	activeId: string | undefined; // aktif modül
};
