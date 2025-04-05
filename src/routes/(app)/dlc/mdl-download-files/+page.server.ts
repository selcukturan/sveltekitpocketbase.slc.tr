import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const resultList = await locals.pbClient.collection('dlcMdlFiles').getList(1, 50, {
		sort: '-created'
	});

	return {
		resultList,
		user: locals.user
	};
};

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const formData = await request.formData();
		const dlcMdlFilesRecord = formData.get('dlcMdlFilesRecord') as string;

		const records = await locals.pbClient.collection('dlcMdlRecords').getFullList({
			sort: '-MMA00_REF_NUMBER',
			filter: locals.pbClient.filter('SLC_MDL_FILES_ID.id = {:param}', { param: dlcMdlFilesRecord })
		});

		let convertedData = [];
		convertedData = records.map((item, index) => {
			let sMMA00_REF_DATE = item.MMA00_REF_DATE ? new Date(item.MMA00_REF_DATE) : null;
			let sMMA00_DATE = item.MMA00_DATE ? new Date(item.MMA00_DATE) : null;
			let sMMA01_REF_DATE = item.MMA01_REF_DATE ? new Date(item.MMA01_REF_DATE) : null;

			let sFNM00_ACC_CODE = item.FNM00_ACC_CODE ? item.FNM00_ACC_CODE : 'KRD.TANIMSIZ';
			sFNM00_ACC_CODE = sFNM00_ACC_CODE.substring(0, 3) === 'KRD' ? sFNM00_ACC_CODE : Number(sFNM00_ACC_CODE);

			return {
				YAA07_CODE: item.YAA07_CODE,
				YAA07_CODE_MH: item.YAA07_CODE_MH,
				MMA00_SER_NUMBER: item.MMA00_SER_NUMBER,
				MMA00_REF_NUMBER: item.MMA00_REF_NUMBER,
				MMA00_REF_DATE: sMMA00_REF_DATE,
				MMA00_DATE: sMMA00_DATE,
				FNY00_TYPE: item.FNY00_TYPE,
				FNM00_ACC_CODE: sFNM00_ACC_CODE,
				SDF01_SLS_COND: item.SDF01_SLS_COND,
				YAX02_CODE: item.YAX02_CODE,
				MMA00_DESC: item.MMA00_DESC,
				MMYG3_CODE: item.MMYG3_CODE,
				MMM00_ITEM_CODE: item.MMM00_ITEM_CODE,
				MMA01_DESC: item.MMA01_DESC,
				MMA01_QTY_1: item.MMA01_QTY_1,
				MMP00_WARE_CODE: item.MMP00_WARE_CODE,
				MMP01_LOCA_CODE: item.MMP01_LOCA_CODE,
				GLN00_CENTER: item.GLN00_CENTER,
				GLW00_ALOC: item.GLW00_ALOC,
				MMA01_PRICE: item.MMA01_PRICE,
				FNX10_CODE: item.FNX10_CODE,
				MMA01_NZM_AMOUNT: item.MMA01_NZM_AMOUNT,
				MMA01_DISC_1: item.MMA01_DISC_1,
				MMA01_DISC_2: item.MMA01_DISC_2,
				MMA01_DISC_3: item.MMA01_DISC_3,
				MMA01_DISC_4: item.MMA01_DISC_4,
				MMA01_DISC_5: item.MMA01_DISC_5,
				MMM00_ITEM_CODE_VC: item.MMM00_ITEM_CODE_VC,
				COUNTER_KM: item.COUNTER_KM,
				FNM80_UNVAN: item.FNM80_UNVAN,
				FNM80_TAX_DEPART: item.FNM80_TAX_DEPART,
				MMA01_REF_NUMBER: '',
				MMA01_SER_NUMBER: '',
				MMA01_REF_DATE: sMMA01_REF_DATE
			};
		});

		return { success: true, message: 'Whoops!', records: convertedData };
	}
};
