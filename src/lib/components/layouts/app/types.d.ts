export type SidebarDataType = {
	title: string;
	href: string;
	icon: string;
};

export type ChildrenPropsType = { children: Snippet };

export type AppLayoutPropsType = {
	sidebarData: SidebarDataType[];
	children: ChildrenPropsType['children'];
};

export type PropsAppSidebarType = {
	sidebarData: SidebarDataType[];
};
