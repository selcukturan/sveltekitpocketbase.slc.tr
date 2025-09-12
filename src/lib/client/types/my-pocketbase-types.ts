import type {
	SysMenusResponse,
	SysMenuItemsResponse,
	AclRolesMenusViewResponse
} from './pocketbase-types';

/**
 * demo: Sadece demo amaçlı kullanıcı
 * user: Normal kullanıcı
 * superuser: Gelişmiş kullanıcı, bazı yönetimsel yetkilere sahip (data import vb.)
 * admin: Yönetici, geniş yetkilere sahip
 * superadmin: Üst düzey yönetici, neredeyse tüm yetkilere sahip (admin hesaplarının yönetimi dahil)
 * system: Sistem yöneticisi, en yüksek yetkilere sahip
 */
type AclRolesType =
	| ':demo:'
	| ':user:'
	| ':superuser:'
	| ':admin:'
	| ':superadmin:'
	| ':system:';

type Menu_available_permissions = [
	':list:',
	':view:',
	':create:',
	':update:',
	':delete:'
];
type Menu_valid_permissions = [
	':list:',
	':view:',
	':create:',
	':update:',
	':delete:'
];
type SysMenusExpand = {
	sys_menu_item: SysMenuItemsResponse<Menu_available_permissions, unknown>;
};

export type MenuNode = AclRolesMenusViewResponse<
	Menu_available_permissions,
	Menu_valid_permissions,
	SysMenusExpand
> & {
	sub: MenuNode[];
};
