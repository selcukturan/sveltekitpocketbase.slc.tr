// src/lib/server/permissions.ts
import { Auth } from '$lib/server/auth';

export async function checkPermission(auth: Auth, permission: string): Promise<boolean> {
	if (!auth.user) return false;

	// auth.pb kullanarak veritabanı sorguları yapabilirsiniz.
	const userPermissions = await auth.pb.collection('permissions').getList(1, 50, {
		filter: `user_id = "${auth.user.id}" && permission = "${permission}"`
	});

	const testUserGroupPermission = {
		company: {
			company1: {
				access: true,
				storage: {
					storage1: {
						access: true
					},
					storage2: {
						access: true
					}
				},
				year: {
					year1: {
						access: true
					},
					year2: {
						access: true
					}
				}
			},
			company2: {
				access: true,
				storage: {
					storage1: {
						access: true
					},
					storage2: {
						access: true
					}
				},
				year: {
					year1: {
						access: true
					},
					year2: {
						access: true
					}
				}
			}
		},
		menu: {
			'/': {
				permission: ['read', 'write']
			},
			'/settings': {
				permission: ['read']
			},
			'/admin': {
				permission: ['read', 'write', 'delete']
			},
			'/admin/users': {
				permission: ['read', 'write']
			}
		}
	};

	return userPermissions.totalItems > 0;
}
