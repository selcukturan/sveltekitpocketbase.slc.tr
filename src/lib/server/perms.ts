// src/lib/server/permissions.ts
import { Auth } from '$lib/server/auth';

export async function checkPermission(auth: Auth, permission: string): Promise<boolean> {
	if (!auth.user) return false;

	// auth.pb kullanarak veritabanı sorguları yapabilirsiniz.
	const userPermissions = await auth.pb.collection('permissions').getList(1, 50, {
		filter: `user_id = "${auth.user.id}" && permission = "${permission}"`
	});

	return userPermissions.totalItems > 0;
}
