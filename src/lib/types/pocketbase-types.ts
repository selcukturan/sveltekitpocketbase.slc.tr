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
	CrudRelationMultiple = "crud_relation_multiple",
	CrudRelationSingle = "crud_relation_single",
	SysCompanys = "sys_companys",
	SysLogs = "sys_logs",
	SysMenuItems = "sys_menu_items",
	SysMenus = "sys_menus",
	SysSettings = "sys_settings",
	SysUsers = "sys_users",
	TestDatatable = "test_datatable",
	TestForm = "test_form",
	TestSelectbox = "test_selectbox",
	TestSubtotal = "test_subtotal",
	TestSubtotalView = "test_subtotal_view",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
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
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
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
	"developer" = "developer",
}

export enum AclRolesStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesRecord = {
	caption: string
	created: IsoAutoDateString
	id: string
	status: AclRolesStatusOptions
	title: string
	type: AclRolesTypeOptions
	updated: IsoAutoDateString
}

export enum AclRolesAppRegionsStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesAppRegionsRecord<Tvalid_permissions = unknown> = {
	created: IsoAutoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesAppRegionsStatusOptions
	updated: IsoAutoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesCompanysStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesCompanysRecord<Tvalid_permissions = unknown> = {
	created: IsoAutoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesCompanysStatusOptions
	updated: IsoAutoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesMenusStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesMenusRecord<Tvalid_permissions = unknown> = {
	created: IsoAutoDateString
	id: string
	menu: RecordIdString
	role: RecordIdString
	status: AclRolesMenusStatusOptions
	updated: IsoAutoDateString
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
	created: IsoAutoDateString
	id: string
	parent_id?: RecordIdString
	sorder: number
	status: AppRegionsStatusOptions
	title: string
	type: AppRegionsTypeOptions
	updated: IsoAutoDateString
}

export type CrudRelationMultipleRecord = {
	caption?: string
	created: IsoAutoDateString
	id: string
	title?: string
	updated: IsoAutoDateString
}

export type CrudRelationSingleRecord = {
	caption?: string
	created: IsoAutoDateString
	id: string
	title?: string
	updated: IsoAutoDateString
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
	created: IsoAutoDateString
	id: string
	note?: string
	parent_id?: RecordIdString
	processable?: boolean
	sorder: number
	status: SysCompanysStatusOptions
	title: string
	type?: SysCompanysTypeOptions
	updated: IsoAutoDateString
	value: number
}

export type SysLogsRecord = {
	caption?: string
	content?: string
	created: IsoAutoDateString
	id: string
	slug?: string
	title?: string
	updated: IsoAutoDateString
}

export enum SysMenuItemsStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type SysMenuItemsRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created: IsoAutoDateString
	id: string
	note?: string
	status: SysMenuItemsStatusOptions
	title: string
	updated: IsoAutoDateString
	url: string
}

export enum SysMenusStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type SysMenusRecord = {
	caption: string
	created: IsoAutoDateString
	id: string
	parent_id?: RecordIdString
	sorder: number
	status: SysMenusStatusOptions
	sys_menu_item: RecordIdString
	title: string
	updated: IsoAutoDateString
}

export type SysSettingsRecord<Textra = unknown> = {
	created: IsoAutoDateString
	extra?: null | Textra
	id: string
	key: string
	updated: IsoAutoDateString
	value?: boolean
}

export type SysUsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
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
	updated: IsoAutoDateString
	verified?: boolean
}

export enum TestDatatableSelectSingleOptions {
	"windows" = "windows",
	"mac" = "mac",
	"linux" = "linux",
}

export enum TestDatatableSelectMultipleOptions {
	"html" = "html",
	"css" = "css",
	"js" = "js",
}
export type TestDatatableRecord = {
	active?: boolean
	amount?: number
	bool?: boolean
	caption?: string
	created: IsoAutoDateString
	district?: string
	email?: string
	grape?: string
	grape_color?: string
	id: string
	kn?: number
	kt?: IsoDateString
	multiple_files?: FileNameString[]
	order?: number
	price?: number
	province?: string
	purchase_date?: IsoDateString
	quantity?: number
	region?: string
	relation_multiple?: RecordIdString[]
	relation_single?: RecordIdString
	select_multiple?: TestDatatableSelectMultipleOptions[]
	select_relation?: RecordIdString
	select_single?: TestDatatableSelectSingleOptions
	single_file?: FileNameString
	textarea?: HTMLString
	title?: string
	updated: IsoAutoDateString
	url?: string
	village?: string
}

export type TestFormRecord = {
	created: IsoAutoDateString
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
	updated: IsoAutoDateString
}

export enum TestSelectboxStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type TestSelectboxRecord = {
	caption?: string
	created: IsoAutoDateString
	id: string
	status?: TestSelectboxStatusOptions
	title?: string
	updated: IsoAutoDateString
}

export type TestSubtotalRecord = {
	created: IsoAutoDateString
	id: string
	kg?: number
	kn?: number
	kt?: IsoDateString
	note?: string
	producer?: string
	region?: string
	updated: IsoAutoDateString
}

export type TestSubtotalViewRecord<Tkg = unknown, Tkn = unknown, Tkt = unknown, Tnote = unknown, Tproducer = unknown, Tregion = unknown, Tsubtotal = unknown> = {
	id: string
	kg?: null | Tkg
	kn?: null | Tkn
	kt?: null | Tkt
	note?: null | Tnote
	producer?: null | Tproducer
	region?: null | Tregion
	subtotal?: null | Tsubtotal
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
export type CrudRelationMultipleResponse<Texpand = unknown> = Required<CrudRelationMultipleRecord> & BaseSystemFields<Texpand>
export type CrudRelationSingleResponse<Texpand = unknown> = Required<CrudRelationSingleRecord> & BaseSystemFields<Texpand>
export type SysCompanysResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<SysCompanysRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type SysLogsResponse<Texpand = unknown> = Required<SysLogsRecord> & BaseSystemFields<Texpand>
export type SysMenuItemsResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<SysMenuItemsRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type SysMenusResponse<Texpand = unknown> = Required<SysMenusRecord> & BaseSystemFields<Texpand>
export type SysSettingsResponse<Textra = unknown, Texpand = unknown> = Required<SysSettingsRecord<Textra>> & BaseSystemFields<Texpand>
export type SysUsersResponse<Texpand = unknown> = Required<SysUsersRecord> & AuthSystemFields<Texpand>
export type TestDatatableResponse<Texpand = unknown> = Required<TestDatatableRecord> & BaseSystemFields<Texpand>
export type TestFormResponse<Texpand = unknown> = Required<TestFormRecord> & BaseSystemFields<Texpand>
export type TestSelectboxResponse<Texpand = unknown> = Required<TestSelectboxRecord> & BaseSystemFields<Texpand>
export type TestSubtotalResponse<Texpand = unknown> = Required<TestSubtotalRecord> & BaseSystemFields<Texpand>
export type TestSubtotalViewResponse<Tkg = unknown, Tkn = unknown, Tkt = unknown, Tnote = unknown, Tproducer = unknown, Tregion = unknown, Tsubtotal = unknown, Texpand = unknown> = Required<TestSubtotalViewRecord<Tkg, Tkn, Tkt, Tnote, Tproducer, Tregion, Tsubtotal>> & BaseSystemFields<Texpand>

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
	crud_relation_multiple: CrudRelationMultipleRecord
	crud_relation_single: CrudRelationSingleRecord
	sys_companys: SysCompanysRecord
	sys_logs: SysLogsRecord
	sys_menu_items: SysMenuItemsRecord
	sys_menus: SysMenusRecord
	sys_settings: SysSettingsRecord
	sys_users: SysUsersRecord
	test_datatable: TestDatatableRecord
	test_form: TestFormRecord
	test_selectbox: TestSelectboxRecord
	test_subtotal: TestSubtotalRecord
	test_subtotal_view: TestSubtotalViewRecord
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
	crud_relation_multiple: CrudRelationMultipleResponse
	crud_relation_single: CrudRelationSingleResponse
	sys_companys: SysCompanysResponse
	sys_logs: SysLogsResponse
	sys_menu_items: SysMenuItemsResponse
	sys_menus: SysMenusResponse
	sys_settings: SysSettingsResponse
	sys_users: SysUsersResponse
	test_datatable: TestDatatableResponse
	test_form: TestFormResponse
	test_selectbox: TestSelectboxResponse
	test_subtotal: TestSubtotalResponse
	test_subtotal_view: TestSubtotalViewResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
