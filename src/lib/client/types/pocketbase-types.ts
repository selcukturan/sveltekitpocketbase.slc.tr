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
	AclPermsCompany = "acl_perms_company",
	AclPermsCompanyView = "acl_perms_company_view",
	AclPermsMenu = "acl_perms_menu",
	AclPermsRegion = "acl_perms_region",
	AclPermsRegionView = "acl_perms_region_view",
	AclPermsSystem = "acl_perms_system",
	AclRoles = "acl_roles",
	AclRolesPermsCompany = "acl_roles_perms_company",
	AclRolesPermsMenu = "acl_roles_perms_menu",
	AclRolesPermsRegion = "acl_roles_perms_region",
	AppGrapes = "app_grapes",
	AppLogs = "app_logs",
	AppProducers = "app_producers",
	AppRegions = "app_regions",
	AppVineyards = "app_vineyards",
	TestForm = "test_form",
	Users = "users",
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

export enum AclPermsCompanyTypeOptions {
	"company" = "company",
	"storage" = "storage",
	"year" = "year",
}

export enum AclPermsCompanyStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclPermsCompanyRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created?: IsoDateString
	id: string
	note?: string
	parent_id?: RecordIdString
	processable?: boolean
	sorder: string
	status: AclPermsCompanyStatusOptions
	title: string
	type?: AclPermsCompanyTypeOptions
	updated?: IsoDateString
	value: number
}

export enum AclPermsCompanyViewTypeOptions {
	"company" = "company",
	"storage" = "storage",
	"year" = "year",
}
export type AclPermsCompanyViewRecord<Teffective_parent_id = unknown> = {
	caption: string
	effective_parent_id?: null | Teffective_parent_id
	id: string
	parent_id?: RecordIdString
	sorder: string
	title: string
	type?: AclPermsCompanyViewTypeOptions
	value: number
}

export enum AclPermsMenuTypeOptions {
	"app_sidebar_item" = "app_sidebar_item",
	"page_sidebar_title" = "page_sidebar_title",
	"page_sidebar_item" = "page_sidebar_item",
}

export enum AclPermsMenuStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclPermsMenuRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created?: IsoDateString
	id: string
	note?: string
	parent_id?: RecordIdString
	sorder: string
	status: AclPermsMenuStatusOptions
	title: string
	type?: AclPermsMenuTypeOptions
	updated?: IsoDateString
	url: string
}

export enum AclPermsRegionTypeOptions {
	"region:bolge" = "region:bolge",
	"province:il" = "province:il",
	"district:ilce" = "district:ilce",
	"village:koy" = "village:koy",
	"location:mevkii" = "location:mevkii",
}

export enum AclPermsRegionStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclPermsRegionRecord<Tavailable_permissions = unknown> = {
	available_permissions: null | Tavailable_permissions
	caption: string
	created?: IsoDateString
	id: string
	parent_id?: RecordIdString
	sorder: string
	status: AclPermsRegionStatusOptions
	title: string
	type: AclPermsRegionTypeOptions
	updated?: IsoDateString
}

export type AclPermsRegionViewRecord = {
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

export type AclPermsSystemRecord<Textra = unknown> = {
	created?: IsoDateString
	extra?: null | Textra
	id: string
	key: string
	updated?: IsoDateString
	value?: boolean
}

export enum AclRolesTypeOptions {
	"user" = "user",
	"admin" = "admin",
	"demo" = "demo",
	"developer" = "developer",
}

export enum AclRolesStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesRecord = {
	created?: IsoDateString
	id: string
	status: AclRolesStatusOptions
	title: string
	type?: AclRolesTypeOptions
	updated?: IsoDateString
}

export enum AclRolesPermsCompanyStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesPermsCompanyRecord<Tvalid_permissions = unknown> = {
	created?: IsoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesPermsCompanyStatusOptions
	updated?: IsoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesPermsMenuStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesPermsMenuRecord<Tvalid_permissions = unknown> = {
	created?: IsoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesPermsMenuStatusOptions
	updated?: IsoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AclRolesPermsRegionStatusOptions {
	"active" = "active",
	"passive" = "passive",
}
export type AclRolesPermsRegionRecord<Tvalid_permissions = unknown> = {
	created?: IsoDateString
	id: string
	perm: RecordIdString
	role: RecordIdString
	status: AclRolesPermsRegionStatusOptions
	updated?: IsoDateString
	valid_permissions?: null | Tvalid_permissions
}

export enum AppGrapesTestOptions {
	"1x001xl1v1c1u1d0" = "1x001xl1v1c1u1d0",
	"1x002xl1v1c1u1d0" = "1x002xl1v1c1u1d0",
	"1x003xl1v1c1u1d0" = "1x003xl1v1c1u1d0",
}
export type AppGrapesRecord = {
	created?: IsoDateString
	id: string
	test?: AppGrapesTestOptions[]
	title?: string
	updated?: IsoDateString
}

export type AppLogsRecord = {
	content?: string
	created?: IsoDateString
	id: string
	title?: string
	updated?: IsoDateString
}

export type AppProducersRecord = {
	created?: IsoDateString
	id: string
	title?: string
	updated?: IsoDateString
}

export type AppRegionsRecord = {
	created?: IsoDateString
	id: string
	title?: string
	updated?: IsoDateString
}

export type AppVineyardsRecord = {
	created?: IsoDateString
	grape_id?: RecordIdString
	id: string
	producer_id?: RecordIdString
	region_id?: RecordIdString
	title?: string
	updated?: IsoDateString
}

export type TestFormRecord = {
	created?: IsoDateString
	datetime_optional?: IsoDateString
	datetime_required: IsoDateString
	id: string
	text_optional?: string
	text_required: string
	updated?: IsoDateString
}

export type UsersRecord = {
	created?: IsoDateString
	default_company: RecordIdString
	default_company_storage: RecordIdString
	default_company_year: RecordIdString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	role?: RecordIdString
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type AclPermsCompanyResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<AclPermsCompanyRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type AclPermsCompanyViewResponse<Teffective_parent_id = unknown, Texpand = unknown> = Required<AclPermsCompanyViewRecord<Teffective_parent_id>> & BaseSystemFields<Texpand>
export type AclPermsMenuResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<AclPermsMenuRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type AclPermsRegionResponse<Tavailable_permissions = unknown, Texpand = unknown> = Required<AclPermsRegionRecord<Tavailable_permissions>> & BaseSystemFields<Texpand>
export type AclPermsRegionViewResponse<Texpand = unknown> = Required<AclPermsRegionViewRecord> & BaseSystemFields<Texpand>
export type AclPermsSystemResponse<Textra = unknown, Texpand = unknown> = Required<AclPermsSystemRecord<Textra>> & BaseSystemFields<Texpand>
export type AclRolesResponse<Texpand = unknown> = Required<AclRolesRecord> & BaseSystemFields<Texpand>
export type AclRolesPermsCompanyResponse<Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesPermsCompanyRecord<Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AclRolesPermsMenuResponse<Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesPermsMenuRecord<Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AclRolesPermsRegionResponse<Tvalid_permissions = unknown, Texpand = unknown> = Required<AclRolesPermsRegionRecord<Tvalid_permissions>> & BaseSystemFields<Texpand>
export type AppGrapesResponse<Texpand = unknown> = Required<AppGrapesRecord> & BaseSystemFields<Texpand>
export type AppLogsResponse<Texpand = unknown> = Required<AppLogsRecord> & BaseSystemFields<Texpand>
export type AppProducersResponse<Texpand = unknown> = Required<AppProducersRecord> & BaseSystemFields<Texpand>
export type AppRegionsResponse<Texpand = unknown> = Required<AppRegionsRecord> & BaseSystemFields<Texpand>
export type AppVineyardsResponse<Texpand = unknown> = Required<AppVineyardsRecord> & BaseSystemFields<Texpand>
export type TestFormResponse<Texpand = unknown> = Required<TestFormRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	acl_perms_company: AclPermsCompanyRecord
	acl_perms_company_view: AclPermsCompanyViewRecord
	acl_perms_menu: AclPermsMenuRecord
	acl_perms_region: AclPermsRegionRecord
	acl_perms_region_view: AclPermsRegionViewRecord
	acl_perms_system: AclPermsSystemRecord
	acl_roles: AclRolesRecord
	acl_roles_perms_company: AclRolesPermsCompanyRecord
	acl_roles_perms_menu: AclRolesPermsMenuRecord
	acl_roles_perms_region: AclRolesPermsRegionRecord
	app_grapes: AppGrapesRecord
	app_logs: AppLogsRecord
	app_producers: AppProducersRecord
	app_regions: AppRegionsRecord
	app_vineyards: AppVineyardsRecord
	test_form: TestFormRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	acl_perms_company: AclPermsCompanyResponse
	acl_perms_company_view: AclPermsCompanyViewResponse
	acl_perms_menu: AclPermsMenuResponse
	acl_perms_region: AclPermsRegionResponse
	acl_perms_region_view: AclPermsRegionViewResponse
	acl_perms_system: AclPermsSystemResponse
	acl_roles: AclRolesResponse
	acl_roles_perms_company: AclRolesPermsCompanyResponse
	acl_roles_perms_menu: AclRolesPermsMenuResponse
	acl_roles_perms_region: AclRolesPermsRegionResponse
	app_grapes: AppGrapesResponse
	app_logs: AppLogsResponse
	app_producers: AppProducersResponse
	app_regions: AppRegionsResponse
	app_vineyards: AppVineyardsResponse
	test_form: TestFormResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'acl_perms_company'): RecordService<AclPermsCompanyResponse>
	collection(idOrName: 'acl_perms_company_view'): RecordService<AclPermsCompanyViewResponse>
	collection(idOrName: 'acl_perms_menu'): RecordService<AclPermsMenuResponse>
	collection(idOrName: 'acl_perms_region'): RecordService<AclPermsRegionResponse>
	collection(idOrName: 'acl_perms_region_view'): RecordService<AclPermsRegionViewResponse>
	collection(idOrName: 'acl_perms_system'): RecordService<AclPermsSystemResponse>
	collection(idOrName: 'acl_roles'): RecordService<AclRolesResponse>
	collection(idOrName: 'acl_roles_perms_company'): RecordService<AclRolesPermsCompanyResponse>
	collection(idOrName: 'acl_roles_perms_menu'): RecordService<AclRolesPermsMenuResponse>
	collection(idOrName: 'acl_roles_perms_region'): RecordService<AclRolesPermsRegionResponse>
	collection(idOrName: 'app_grapes'): RecordService<AppGrapesResponse>
	collection(idOrName: 'app_logs'): RecordService<AppLogsResponse>
	collection(idOrName: 'app_producers'): RecordService<AppProducersResponse>
	collection(idOrName: 'app_regions'): RecordService<AppRegionsResponse>
	collection(idOrName: 'app_vineyards'): RecordService<AppVineyardsResponse>
	collection(idOrName: 'test_form'): RecordService<TestFormResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
