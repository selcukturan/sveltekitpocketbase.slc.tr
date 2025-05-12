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
	AclPerms = "acl_perms",
	AclRoles = "acl_roles",
	AclRolesPerms = "acl_roles_perms",
	AppGrapes = "app_grapes",
	AppProducers = "app_producers",
	AppRegions = "app_regions",
	AppVineyards = "app_vineyards",
	TestForm = "test_form",
	TestView = "test_view",
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

export type AclPermsRecord = {
	created?: IsoDateString
	id: string
	key: string
	parent_id?: RecordIdString
	title: string
	type: string
	updated?: IsoDateString
	url_pathname: string
}

export type AclRolesRecord = {
	created?: IsoDateString
	id: string
	title: string
	updated?: IsoDateString
}

export enum AclRolesPermsValueOptions {
	"create" = "create",
	"read" = "read",
	"update" = "update",
	"delete" = "delete",
}
export type AclRolesPermsRecord = {
	created?: IsoDateString
	id: string
	perm?: RecordIdString
	role?: RecordIdString
	updated?: IsoDateString
	value?: AclRolesPermsValueOptions[]
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
	id: string
	text_optional?: string
	updated?: IsoDateString
}

export type TestViewRecord = {
	id: string
	main: string
	sub1: string
	sub2: string
	sub3: string
	sub4: string
	sub5: string
	sub6: string
	type: string
}

export type UsersRecord = {
	created?: IsoDateString
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
export type AclPermsResponse<Texpand = unknown> = Required<AclPermsRecord> & BaseSystemFields<Texpand>
export type AclRolesResponse<Texpand = unknown> = Required<AclRolesRecord> & BaseSystemFields<Texpand>
export type AclRolesPermsResponse<Texpand = unknown> = Required<AclRolesPermsRecord> & BaseSystemFields<Texpand>
export type AppGrapesResponse<Texpand = unknown> = Required<AppGrapesRecord> & BaseSystemFields<Texpand>
export type AppProducersResponse<Texpand = unknown> = Required<AppProducersRecord> & BaseSystemFields<Texpand>
export type AppRegionsResponse<Texpand = unknown> = Required<AppRegionsRecord> & BaseSystemFields<Texpand>
export type AppVineyardsResponse<Texpand = unknown> = Required<AppVineyardsRecord> & BaseSystemFields<Texpand>
export type TestFormResponse<Texpand = unknown> = Required<TestFormRecord> & BaseSystemFields<Texpand>
export type TestViewResponse<Texpand = unknown> = Required<TestViewRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	acl_perms: AclPermsRecord
	acl_roles: AclRolesRecord
	acl_roles_perms: AclRolesPermsRecord
	app_grapes: AppGrapesRecord
	app_producers: AppProducersRecord
	app_regions: AppRegionsRecord
	app_vineyards: AppVineyardsRecord
	test_form: TestFormRecord
	test_view: TestViewRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	acl_perms: AclPermsResponse
	acl_roles: AclRolesResponse
	acl_roles_perms: AclRolesPermsResponse
	app_grapes: AppGrapesResponse
	app_producers: AppProducersResponse
	app_regions: AppRegionsResponse
	app_vineyards: AppVineyardsResponse
	test_form: TestFormResponse
	test_view: TestViewResponse
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
	collection(idOrName: 'acl_perms'): RecordService<AclPermsResponse>
	collection(idOrName: 'acl_roles'): RecordService<AclRolesResponse>
	collection(idOrName: 'acl_roles_perms'): RecordService<AclRolesPermsResponse>
	collection(idOrName: 'app_grapes'): RecordService<AppGrapesResponse>
	collection(idOrName: 'app_producers'): RecordService<AppProducersResponse>
	collection(idOrName: 'app_regions'): RecordService<AppRegionsResponse>
	collection(idOrName: 'app_vineyards'): RecordService<AppVineyardsResponse>
	collection(idOrName: 'test_form'): RecordService<TestFormResponse>
	collection(idOrName: 'test_view'): RecordService<TestViewResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
