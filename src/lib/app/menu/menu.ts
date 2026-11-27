import { t } from '#lib/app/localization/index.js';
import type { IconKey } from '#lib/components/icons/index.js';
import { buildAccessMenu, type Access, type AclResource } from '#lib/app/acl/access.js';
import type { MenuNode } from './tree.js';

// Uygulama menüsü veritabanından gelir (acl_resources; getMyAccess → buildAccessMenu): kullanıcı yalnızca erişebildiği
// sayfaları ve altında böyle bir sayfa olan başlıkları görür. Kökler modüllerdir (soldaki ikon rayı), altındaki ağaç
// modülün menüsüdür. Düğüm id'si kaynak anahtarıdır (grapes.crud.simple), title kaynağın label'ı.
export type AppMenuNode = MenuNode<string, IconKey>;

/** Kullanıcının menüsü (ikon adları veritabanından gelir; tanımsız ikon boş görünür). */
export const buildAppMenu = (resources: readonly AclResource[], access: Access) => buildAccessMenu(resources, access) as AppMenuNode[];

/** Menü başlığı: çeviri dosyasında 'menu.' + anahtar varsa o, yoksa kaynağın label'ı (yeni eklenen kaynaklar). */
export const menuTitle = (node: Pick<AppMenuNode, 'id' | 'title'>) => t(`menu.${node.id}`, undefined, node.title);
