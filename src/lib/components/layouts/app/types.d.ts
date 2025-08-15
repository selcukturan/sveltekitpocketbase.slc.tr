import { type Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';
export type SidebarDataType = {
	title: string;
	href: string;
	icon: string;
};

export type ChildrenPropsType = { children: Snippet };

export type AppLayoutPropsType = SvelteHTMLElements['section'] & {
	sidebarData: SidebarDataType[];
	children: ChildrenPropsType['children'];
};

export type PropsAppSidebarType = SvelteHTMLElements['section'] & {
	sidebarData: SidebarDataType[];
};
