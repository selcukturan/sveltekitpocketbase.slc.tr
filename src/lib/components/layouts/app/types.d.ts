import type { Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
import type { IconKey } from '$lib/components/icons';
export type SidebarDataType = {
	title: string;
	href: string;
	icon: IconKey;
};

export type ChildrenPropsType = { children: Snippet };

export type AppLayoutPropsType = SvelteHTMLElements['section'] & {
	children: ChildrenPropsType['children'];
};

export type PropsAppSidebarType = SvelteHTMLElements['section'] & {
	sidebarData: SidebarDataType[];
};
