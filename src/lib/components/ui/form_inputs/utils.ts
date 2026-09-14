export type FieldPathInfo = {
	namePath: string[];
	pathFieldName: string;
	pathRemoteId: string;
	pathFormFunction: string;
};

/**
 * Remote Form field `attributes.name` ('pathFieldName/pathRemoteId/pathFormFunction') yolunu ayrıştırır.
 */
export function parseNamePath(name?: string): FieldPathInfo {
	const namePath = (name ?? '').split('/');
	return {
		namePath,
		pathFieldName: namePath[0] ?? '',
		pathRemoteId: namePath[1] ?? '',
		pathFormFunction: namePath[2] ?? ''
	};
}
