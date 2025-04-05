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

export type ChildrenPropsType = { children: Snippet };

export type PageLayoutPropsType = {
	pageSidebardata: PageSidebarDataType[];
	children: ChildrenPropsType['children'];
};

export type PageSidebarPropsType = {
	pageSidebardata: PageSidebarDataType[];
};
