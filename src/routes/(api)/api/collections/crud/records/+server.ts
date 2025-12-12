import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RecordModel } from 'pocketbase';

// List/Search  (crud) - /api/collections/crud/records
// View         (crud) - /api/collections/crud/records/:id
export const GET: RequestHandler = async ({ url, locals }) => {
	const id = String(url.searchParams.get('id') ?? '0');

	let records: RecordModel[] | RecordModel = [];
	records = await locals.pb.collection('test_selectbox').getFullList({
		sort: '-created'
	});

	/* if (id) {
		// View (crud) - /api/collections/crud/records/:id
		records = await locals.pb.collection('test_selectbox').getOne(id, {
			expand: 'relField1,relField2.subRelField'
		});
	} else {
		// List/Search (crud) - /api/collections/crud/records
		records = await locals.pb.collection('test_selectbox').getFullList({
			sort: '-created'
		});
	} */

	return json(records);
	// return new Response(String(random));
};

// Create       (crud) - /api/collections/crud/records
export const POST: RequestHandler = async ({ locals }) => {
	const data = {
		field1: 'test',
		field2: 'test'
	};

	const record = await locals.pb.collection('crud').create(data);
	return json(record);
};

// Update       (crud) - /api/collections/crud/records/:id
export const PATCH: RequestHandler = async ({ url, locals }) => {
	const id = String(url.searchParams.get('id') ?? '0');

	const data = {
		field1: 'test-2',
		field2: 'test-2'
	};

	const record = await locals.pb.collection('crud').update(id, data);

	return json(record);
};

// Delete       (crud) - /api/collections/crud/records/:id
export const DELETE: RequestHandler = async ({ url, locals }) => {
	const id = String(url.searchParams.get('id') ?? '0');
	const record = await locals.pb.collection('crud').delete(id);
	return json(record);
};

// Realtime     (crud) - /api/realtime
export const fallback: RequestHandler = async ({ request }) => {
	if (request.method === 'SSE') {
		return text(`Realtime!`);
	}
	return text(`I caught your ${request.method} request!`);
};
