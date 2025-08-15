import { type Snippet } from 'svelte';
import type { SvelteHTMLElements } from 'svelte/elements';

type PageSidebarChildType = {
	title: string;
	href: string;
	icon: string;
	root?: boolean;
};

export type PageSidebarDataType = {
	title: string;
	child: PageSidebarChildType[];
};

export type ChildrenPropsType = SvelteHTMLElements['main'] & {
	children: Snippet;
};

export type PageLayoutPropsType = {
	pageSidebardata: PageSidebarDataType[];
	children: ChildrenPropsType['children'];
};

export type PageSidebarPropsType = SvelteHTMLElements['aside'] & {
	pageSidebardata: PageSidebarDataType[];
};
