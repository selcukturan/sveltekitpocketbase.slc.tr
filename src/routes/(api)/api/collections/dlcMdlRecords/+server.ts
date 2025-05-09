import { json, text } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { RecordModel } from 'pocketbase';

// List/Search  (dlcMdlRecords) - /api/collections/dlcMdlRecords/records
// View         (dlcMdlRecords) - /api/collections/dlcMdlRecords/records/:id
export const GET: RequestHandler = async ({ url, locals }) => {
	const id = String(url.searchParams.get('id') ?? '0');

	let records: RecordModel[] | RecordModel = [];

	if (id) {
		// View (dlcMdlRecords) - /api/collections/dlcMdlRecords/records/:id
		records = await locals.auth.pb.collection('dlcMdlRecords').getOne(id, {
			expand: 'relField1,relField2.subRelField'
		});
	} else {
		// List/Search (dlcMdlRecords) - /api/collections/dlcMdlRecords/records

		// you can also fetch all records at once via getFullList
		records = await locals.auth.pb.collection('dlcMdlRecords').getFullList({
			sort: '-created'
		});

		// fetch a paginated records list
		/* const resultList = await locals.pbClient.collection('dlcMdlRecords').getList(1, 50, {
			filter: 'created >= "2022-01-01 00:00:00" && someField1 != someField2'
		}); */

		// or fetch only the first record that matches the specified filter
		/* const record = await locals.pbClient.collection('dlcMdlRecords').getFirstListItem('someField="test"', {
			expand: 'relField1,relField2.subRelField'
		}); */
	}

	return json(records);
	// return new Response(String(random));
};

// Create       (dlcMdlRecords)
export const POST: RequestHandler = async ({ locals }) => {
	// example create data
	const data = {
		YAA07_CODE: 'test',
		YAA07_CODE_MH: 'test',
		MMA00_SER_NUMBER: 'test',
		MMA00_REF_NUMBER: 'test',
		MMA00_REF_DATE: '2022-01-01 10:00:00.123Z',
		MMA00_DATE: '2022-01-01 10:00:00.123Z',
		FNY00_TYPE: 'test',
		FNM00_ACC_CODE: 'test',
		SDF01_SLS_COND: 'test',
		YAX02_CODE: 'test',
		MMA00_DESC: 'test',
		MMYG3_CODE: 'test',
		MMM00_ITEM_CODE: 123,
		MMA01_DESC: 'test',
		MMA01_QTY_1: 123,
		MMP00_WARE_CODE: 'test',
		MMP01_LOCA_CODE: 'test',
		GLN00_CENTER: 'test',
		GLW00_ALOC: 'test',
		MMA01_PRICE: 123,
		FNX10_CODE: 123,
		MMA01_NZM_AMOUNT: 123,
		MMA01_DISC_1: 'test',
		MMA01_DISC_2: 'test',
		MMA01_DISC_3: 'test',
		MMA01_DISC_4: 'test',
		MMA01_DISC_5: 'test',
		MMM00_ITEM_CODE_VC: 'test',
		COUNTER_KM: 'test',
		FNM80_UNVAN: 'test',
		FNM80_TAX_DEPART: 'test',
		MMA01_REF_NUMBER: 'test',
		MMA01_SER_NUMBER: 'test',
		MMA01_REF_DATE: '2022-01-01 10:00:00.123Z',
		SLC_MDL_FILES_ID: ['RELATION_RECORD_ID']
	};

	const record = await locals.auth.pb.collection('dlcMdlRecords').create(data);
	return json(record);
};

// Update       (dlcMdlRecords) - /api/collections/dlcMdlRecords/records/:id
export const PATCH: RequestHandler = async ({ url, locals }) => {
	const id = String(url.searchParams.get('id') ?? '0');

	// example update data
	const data = {
		YAA07_CODE: 'test',
		YAA07_CODE_MH: 'test',
		MMA00_SER_NUMBER: 'test',
		MMA00_REF_NUMBER: 'test',
		MMA00_REF_DATE: '2022-01-01 10:00:00.123Z',
		MMA00_DATE: '2022-01-01 10:00:00.123Z',
		FNY00_TYPE: 'test',
		FNM00_ACC_CODE: 'test',
		SDF01_SLS_COND: 'test',
		YAX02_CODE: 'test',
		MMA00_DESC: 'test',
		MMYG3_CODE: 'test',
		MMM00_ITEM_CODE: 123,
		MMA01_DESC: 'test',
		MMA01_QTY_1: 123,
		MMP00_WARE_CODE: 'test',
		MMP01_LOCA_CODE: 'test',
		GLN00_CENTER: 'test',
		GLW00_ALOC: 'test',
		MMA01_PRICE: 123,
		FNX10_CODE: 123,
		MMA01_NZM_AMOUNT: 123,
		MMA01_DISC_1: 'test',
		MMA01_DISC_2: 'test',
		MMA01_DISC_3: 'test',
		MMA01_DISC_4: 'test',
		MMA01_DISC_5: 'test',
		MMM00_ITEM_CODE_VC: 'test',
		COUNTER_KM: 'test',
		FNM80_UNVAN: 'test',
		FNM80_TAX_DEPART: 'test',
		MMA01_REF_NUMBER: 'test',
		MMA01_SER_NUMBER: 'test',
		MMA01_REF_DATE: '2022-01-01 10:00:00.123Z',
		SLC_MDL_FILES_ID: ['RELATION_RECORD_ID']
	};

	const record = await locals.auth.pb.collection('dlcMdlRecords').update(id, data);

	return json(record);
};

// Delete       (dlcMdlRecords) - /api/collections/dlcMdlRecords/records/:id
export const DELETE: RequestHandler = async ({ url, locals }) => {
	const id = String(url.searchParams.get('id') ?? '0');
	const record = await locals.auth.pb.collection('dlcMdlRecords').delete(id);
	return json(record);
};

// Realtime     (dlcMdlRecords) - /api/realtime
export const fallback: RequestHandler = async ({ request }) => {
	if (request.method === 'SSE') {
		return text(`Realtime!`);
	}
	return text(`I caught your ${request.method} request!`);
};
