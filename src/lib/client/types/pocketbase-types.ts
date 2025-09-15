/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	AclAppRegionsView = "acl_app_regions_view",
	AclCompanysView = "acl_companys_view",
	AclRoles = "acl_roles",
	AclRolesAppRegions = "acl_roles_app_regions",
	AclRolesCompanys = "acl_roles_companys",
	AclRolesMenus = "acl_roles_menus",
	AclRolesMenusView = "acl_roles_menus_view",
	AppRegions = "app_regions",
	SysCompanys = "sys_companys",
	SysLogs = "sys_logs",
	SysMenuItems = "sys_menu_items",
	SysMenus = "sys_menus",
	SysSettings = "sys_settings",
	SysUsers = "sys_users",
	TestForm = "test_form",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type AclAppRegionsViewRecord = {
	district: string
	district_id?: RecordIdString
	id: string
	location: string
	location_id?: RecordIdString
	province: string
	province_id?: RecordIdString
	region: string
	region_id?: RecordIdString
	village: string
	village_id?: RecordIdString
}

export enum AclCompanysViewTypeOptions {
	"company" = "company",
	"storage" = "storage",
	"year" = "year",
}
export type AclCompanysViewRecord<Teffective_parent_id = unknown> = {
	caption: string
	effective_parent_id?: null | Teffective_parent_id
	id: string
	parent_id?: RecordIdString
	sorder: number
	title: string
	type?: AclCompanysViewTypeOptions
	value: number
}

export enum AclRolesTypeOptions {
	"demo" = "demo",
	"user" = "user",
	"superuser" = "superuser",
	"admin" = "admin",
	"superadmin" = "superadmin",
	"system" = "system",
}

export enum AclRolesStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesRecord = {
	caption: string
	created?: IsoDateString
	id: string
	status: AclRolesStatusOptions
	title: string
	type: AclRolesTypeOptions
	updated?: IsoDateString
}

export enum AclRolesAppRegionsStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesAppRegionsRecord<Tvalid_permissions = unknown> = {
	created?: IsoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesAppRegionsStatusOptions
	updated?: IsoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesCompanysStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesCompanysRecord<Tvalid_permissions = unknown> = {
	created?: IsoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesCompanysStatusOptions
	updated?: IsoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesMenusStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesMenusRecord<Tvalid_permissions = unknown> = {
	created?: IsoDateString
	id: string
	menu: RecordIdString
	role: RecordIdString
	status: AclRolesMenusStatusOptions
	updated?: IsoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesMenusViewStatusAclRolesMenusOptions {
	"active" = "active",
	"passive" = "passive",
}

export enum AclRolesMenusViewStatusSysMenusOptions {
	"active" = "active",
	"passive" = "passive",
}

export enum AclRolesMenusViewStatusAclRolesOptions {
	"active" = "active",
	"passive" = "passive",
}

export enum AclRolesMenusViewStatusSysMenuItemsOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesMenusViewRecord<Tavailable_permissions = unknown, Tvalid_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	id: string
	id_role?: RecordIdString
	id_sys_menu_item: RecordIdString
	id_sys_menus?: RecordIdString
	id_sys_menus_parent?: RecordIdString
	sorder: number
	status_acl_roles: AclRolesMenusViewStatusAclRolesOptions
	status_acl_roles_menus: AclRolesMenusViewStatusAclRolesMenusOptions
	status_sys_menu_items: AclRolesMenusViewStatusSysMenuItemsOptions
	status_sys_menus: AclRolesMenusViewStatusSysMenusOptions
	title: string
	url: string
	valid_permissions?: null | Tvalid_permissions
}

export enum AppRegionsTypeOptions {
	"region:bolge" = "region:bolge",
	"province:il" = "province:il",
	"district:ilce" = "district:ilce",
	"village:koy" = "village:koy",
	"location:mevkii" = "location:mevkii",
}

export enum AppRegionsStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AppRegionsRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created?: IsoDateString
	id: string
	parent_id?: RecordIdString
	sorder: number
	status: AppRegionsStatusOptions
	title: string
	type: AppRegionsTypeOptions
	updated?: IsoDateString
}

export enum SysCompanysTypeOptions {
	"company" = "company",
	"storage" = "storage",
	"year" = "year",
}

export enum SysCompanysStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type SysCompanysRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created?: IsoDateString
	id: string
	note?: string
	parent_id?: RecordIdString
	processable?: boolean
	sorder: number
	status: SysCompanysStatusOptions
	title: string
	type?: SysCompanysTypeOptions
	updated?: IsoDateString
	value: number
}

export type SysLogsRecord = {
	content?: string
	created?: IsoDateString
	id: string
	slug?: string
	title?: string
	updated?: IsoDateString
}

export enum SysMenuItemsStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type SysMenuItemsRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created?: IsoDateString
	id: string
	note?: string
	status: SysMenuItemsStatusOptions
	title: string
	updated?: IsoDateString
	url: string
}

export enum SysMenusStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type SysMenusRecord = {
	caption: string
	created?: IsoDateString
	id: string
	parent_id?: RecordIdString
	sorder: number
	status: SysMenusStatusOptions
	sys_menu_item: RecordIdString
	title: string
	updated?: IsoDateString
}

export type SysSettingsRecord<Textra = unknown> = {
	created?: IsoDateString
	extra?: null | Textra
	id: string
	key: string
	updated?: IsoDateString
	value?: boolean
}

export type SysUsersRecord = {
	avatar?: string
	created?: IsoDateString
	default_company: RecordIdString
	default_company_storage: RecordIdString
	default_company_year: RecordIdString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	role?: RecordIdString
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type TestFormRecord = {
	created?: IsoDateString
	date_optional?: IsoDateString
	date_required: IsoDateString
	datetime_optional?: IsoDateString
	datetime_required: IsoDateString
	decimal_number_optional?: number
	decimal_number_required: number
	id: string
	integer_number_optional?: number
	integer_number_required: number
	text_optional?: string
	text_required: string
	updated?: IsoDateString
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AclAppRegionsViewResponse<Texpand = unknown> = Required<AclAppRegionsViewRecord> & BaseSystemFields<Texpand>
export type AclCompanysViewResponse<Teffective_parent_id = unknown, Texpand = unknown> = Required<AclCompanysViewRecord<Teffective_parent_id>> & BaseSystemFields<Texpand>
export type AclRolesResponse<Texpand = unknown> = Required<AclRolesRecord> & BaseSystemFields<Texpand>
export type AclRolesAppRegionsResponse<Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesAppRegionsRecord<Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AclRolesCompanysResponse<Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesCompanysRecord<Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AclRolesMenusResponse<Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesMenusRecord<Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AclRolesMenusViewResponse<Tavailable_permissions = unknown, Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesMenusViewRecord<Tavailable_permissions, Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AppRegionsResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<AppRegionsRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type SysCompanysResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<SysCompanysRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type SysLogsResponse<Texpand = unknown> = Required<SysLogsRecord> & BaseSystemFields<Texpand>
export type SysMenuItemsResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<SysMenuItemsRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type SysMenusResponse<Texpand = unknown> = Required<SysMenusRecord> & BaseSystemFields<Texpand>
export type SysSettingsResponse<Textra = unknown, Texpand = unknown> = Required<SysSettingsRecord<Textra>> & BaseSystemFields<Texpand>
export type SysUsersResponse<Texpand = unknown> = Required<SysUsersRecord> & AuthSystemFields<Texpand>
export type TestFormResponse<Texpand = unknown> = Required<TestFormRecord> & BaseSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	acl_app_regions_view: AclAppRegionsViewRecord
	acl_companys_view: AclCompanysViewRecord
	acl_roles: AclRolesRecord
	acl_roles_app_regions: AclRolesAppRegionsRecord
	acl_roles_companys: AclRolesCompanysRecord
	acl_roles_menus: AclRolesMenusRecord
	acl_roles_menus_view: AclRolesMenusViewRecord
	app_regions: AppRegionsRecord
	sys_companys: SysCompanysRecord
	sys_logs: SysLogsRecord
	sys_menu_items: SysMenuItemsRecord
	sys_menus: SysMenusRecord
	sys_settings: SysSettingsRecord
	sys_users: SysUsersRecord
	test_form: TestFormRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	acl_app_regions_view: AclAppRegionsViewResponse
	acl_companys_view: AclCompanysViewResponse
	acl_roles: AclRolesResponse
	acl_roles_app_regions: AclRolesAppRegionsResponse
	acl_roles_companys: AclRolesCompanysResponse
	acl_roles_menus: AclRolesMenusResponse
	acl_roles_menus_view: AclRolesMenusViewResponse
	app_regions: AppRegionsResponse
	sys_companys: SysCompanysResponse
	sys_logs: SysLogsResponse
	sys_menu_items: SysMenuItemsResponse
	sys_menus: SysMenusResponse
	sys_settings: SysSettingsResponse
	sys_users: SysUsersResponse
	test_form: TestFormResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'acl_app_regions_view'): RecordService<AclAppRegionsViewResponse>
	collection(idOrName: 'acl_companys_view'): RecordService<AclCompanysViewResponse>
	collection(idOrName: 'acl_roles'): RecordService<AclRolesResponse>
	collection(idOrName: 'acl_roles_app_regions'): RecordService<AclRolesAppRegionsResponse>
	collection(idOrName: 'acl_roles_companys'): RecordService<AclRolesCompanysResponse>
	collection(idOrName: 'acl_roles_menus'): RecordService<AclRolesMenusResponse>
	collection(idOrName: 'acl_roles_menus_view'): RecordService<AclRolesMenusViewResponse>
	collection(idOrName: 'app_regions'): RecordService<AppRegionsResponse>
	collection(idOrName: 'sys_companys'): RecordService<SysCompanysResponse>
	collection(idOrName: 'sys_logs'): RecordService<SysLogsResponse>
	collection(idOrName: 'sys_menu_items'): RecordService<SysMenuItemsResponse>
	collection(idOrName: 'sys_menus'): RecordService<SysMenusResponse>
	collection(idOrName: 'sys_settings'): RecordService<SysSettingsResponse>
	collection(idOrName: 'sys_users'): RecordService<SysUsersResponse>
	collection(idOrName: 'test_form'): RecordService<TestFormResponse>
}
