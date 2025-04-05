import type { Actions, PageServerLoad } from './$types';
import { PB_BACKEND_URL } from '$env/static/private';
import { read, utils } from 'xlsx';

export const load: PageServerLoad = async ({ locals }) => {
	const resultList = await locals.pbClient.collection('dlcMdlFiles').getList(1, 50, {
		sort: '-created'
	});
	return {
		resultList,
		user: locals.auth.user
	};
};

const convertExcelDateToJSDate = (excelDate: number): Date => {
	return new Date((excelDate - (25567 + 2)) * 86400 * 1000);
};

const convertExcelDateToString = (excelDate: number): string => {
	if (!excelDate || isNaN(excelDate)) return '';
	const date = convertExcelDateToJSDate(excelDate);
	if (isNaN(date.getTime())) return '';
	return date.toISOString();
};

export const actions: Actions = {
	default: async ({ locals, request, fetch }) => {
		const formData = await request.formData();
		const dlcMdlFilesRecord = formData.get('dlcMdlFilesRecord') as string;
		const dlcMdlDate = formData.get('dlcMdlDate') as string;
		const dlcMdlDateFormatted = new Date(dlcMdlDate).toISOString();

		const filesRecord = await locals.pbClient.collection('dlcMdlFiles').getOne(dlcMdlFilesRecord);

		const deletedRecord = await locals.pbClient.collection('dlcMdlRecords').getFullList({
			filter: locals.pbClient.filter('SLC_MDL_FILES_ID.id = {:param}', { param: dlcMdlFilesRecord })
		});
		deletedRecord.forEach(async (record: any) => {
			await locals.pbClient.collection('dlcMdlRecords').delete(record.id);
		});

		const naAccCode = {
			AYYI: '15294',
			LEON: '15287',
			OZCE: '15288',
			YITE: '15289',
			SETU: '15296',
			AKGO: '15713',
			OZYA: '15714',
			SUAY: '15844',
			BAAV: '15899',
			ADAY: '16083',
			FAIL: '19820',
			ALKE: '20461',
			FECA: '29292',
			HUSA: '40754',
			ALCA: '42969',
			YUAK: '40716',
			OZKU: '40718',
			TAIN: '40717',
			ISAY: '15504',
			ZIRA: 'KRD.TANIMSIZ'
		};

		const kkAccCode = {
			AYYI: 'KRD.000.003',
			LEON: 'KRD.000.004',
			OZCE: 'KRD.000.001',
			YITE: 'KRD.000.005',
			SETU: 'KRD.TANIMSIZ',
			AKGO: 'KRD.000.009',
			OZYA: 'KRD.000.014',
			SUAY: 'KRD.000.006',
			BAAV: 'KRD.000.011',
			ADAY: 'KRD.000.007',
			FAIL: 'KRD.000.013',
			ALKE: 'KRD.TANIMSIZ',
			FECA: 'KRD.000.002',
			HUSA: 'KRD.TANIMSIZ',
			ALCA: 'KRD.TANIMSIZ',
			YUAK: 'KRD.TANIMSIZ',
			OZKU: 'KRD.TANIMSIZ',
			TAIN: 'KRD.TANIMSIZ',
			ISAY: 'KRD.TANIMSIZ',
			ZIRA: 'KRD.111.001'
		};

		// Tek bir MDL dosyasi islemleri
		for (const fileName of filesRecord.mdlFiles) {
			const fileNameParts = fileName.split('_');
			const fileId = fileNameParts[fileNameParts.length - 1].replace('.xlsx', '').replace('.XLSX', '');

			const getFile = `${PB_BACKEND_URL}/api/files/dlcMdlFiles/${filesRecord.id}/${fileName}`;
			const file = await fetch(getFile);
			if (!file.ok) {
				throw new Error('Network response was not ok');
			}

			const fileData = await file.arrayBuffer();
			const workbook = read(fileData);
			const firstSheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[firstSheetName];
			const sheetJsonData = utils.sheet_to_json(worksheet);
			const convertedSheetJsonData = sheetJsonData.map((row: any) => ({
				...row,
				EVRAK_TARIHI: convertExcelDateToString(row.EVRAK_TARIHI)
			}));

			const mdlFileName = convertedSheetJsonData[35].ACIKLAMA ? convertedSheetJsonData[35].ACIKLAMA : 'ERROR|mdlFileName'; // mdlFileName = 241023SETU_NAMDL or 240901ZIRAAT_KKMDL
			const mdlSum = convertedSheetJsonData[37].TUTAR ? convertedSheetJsonData[37].TUTAR : 0; // mdlSum = 1234.56
			const mdlDescription = convertedSheetJsonData[37].ACIKLAMA ? convertedSheetJsonData[37].ACIKLAMA : 'ERROR|mdlDescription'; // mdlDescription = 241023SETU_NAMDL | MDL Toplamı: 1234.56 | 1234.56 Masraf
			const accName = mdlFileName.substring(6, 10); // SETU
			const nakkName = mdlFileName.substring(11, 13); // NA or KK
			let fCount = 0;
			let mCount = 0;
			let gCount = 0;

			// MDL dosyasindaki her bir satir icin
			convertedSheetJsonData.forEach(async (row: any) => {
				const rowEVRAKTARIHI = row.EVRAK_TARIHI ? row.EVRAK_TARIHI : '';
				if (rowEVRAKTARIHI !== '') {
					const rowTUTAR = row.TUTAR ? row.TUTAR : 0;
					const rowMASRAFMERKEZI = row.MASRAF_MERKEZI ? row.MASRAF_MERKEZI.trim() : 'ERROR|rowMASRAFMERKEZI';
					const rowSERVISKODU = row.SERVIS_KODU ? row.SERVIS_KODU : 0;
					const rowEVRAKISMI = row.EVRAK_ISMI ? row.EVRAK_ISMI.trim() : 'ERROR|rowEVRAKISMI';
					const rowACIKLAMA = row.ACIKLAMA ? row.ACIKLAMA.trim() : 'ERROR|rowACIKLAMA';

					let mdlMMA00REFNUMBER = '';
					const mdlRowType = row.A ? row.A.trim().toUpperCase() : ''; // F, M, G or BOS
					const mdlMMYG3CODE = mdlRowType === 'F' ? 'A6' : mdlRowType === 'M' ? 'A4' : mdlRowType === 'G' ? 'A8' : 'P0';
					const mdlMMA00DATE = mdlRowType === '' ? dlcMdlDateFormatted : rowEVRAKTARIHI;
					if (mdlRowType === 'F') {
						fCount++;
						mdlMMA00REFNUMBER = `BAG_${fileId}${mdlRowType}${fCount}`;
					} else if (mdlRowType === 'M') {
						mCount++;
						mdlMMA00REFNUMBER = `BAG_${fileId}${mdlRowType}${mCount}`;
					} else if (mdlRowType === 'G') {
						gCount++;
						mdlMMA00REFNUMBER = `BAG_${fileId}${mdlRowType}${gCount}`;
					} else {
						mdlMMA00REFNUMBER = `BAG_${fileId}`;
					}

					const data = {
						YAA07_CODE: '000',
						YAA07_CODE_MH: '000',
						MMA00_SER_NUMBER: 'AA',
						MMA00_REF_NUMBER: mdlMMA00REFNUMBER,
						MMA00_REF_DATE: mdlMMA00DATE,
						MMA00_DATE: mdlMMA00DATE,
						FNY00_TYPE: 'HR',
						FNM00_ACC_CODE: nakkName === 'NA' ? naAccCode[accName as keyof typeof naAccCode] : kkAccCode[accName as keyof typeof kkAccCode],
						SDF01_SLS_COND: '',
						YAX02_CODE: 'TL',
						MMA00_DESC: `${mdlFileName} | MDL Toplamı: ${mdlSum.toFixed(2)} | ${mdlDescription} Masraf`,
						MMYG3_CODE: mdlMMYG3CODE,
						MMM00_ITEM_CODE: rowSERVISKODU,
						MMA01_DESC: `${rowEVRAKISMI} | ${rowACIKLAMA}`,
						MMA01_QTY_1: 1,
						MMP00_WARE_CODE: '',
						MMP01_LOCA_CODE: '',
						GLN00_CENTER: rowMASRAFMERKEZI,
						GLW00_ALOC: '',
						MMA01_PRICE: parseFloat(rowTUTAR.toFixed(2)),
						FNX10_CODE: 20,
						MMA01_NZM_AMOUNT: 0,
						MMA01_DISC_1: '',
						MMA01_DISC_2: '',
						MMA01_DISC_3: '',
						MMA01_DISC_4: '',
						MMA01_DISC_5: '',
						MMM00_ITEM_CODE_VC: '',
						COUNTER_KM: '',
						FNM80_UNVAN: '',
						FNM80_TAX_DEPART: '',
						MMA01_REF_NUMBER: 'this_id',
						MMA01_SER_NUMBER: 'AA',
						MMA01_REF_DATE: rowEVRAKTARIHI,
						SLC_MDL_FILES_ID: dlcMdlFilesRecord
					};

					await locals.pbClient.collection('dlcMdlRecords').create(data, { requestKey: null });
				}
			});
		}

		return { success: false, message: 'Whoops!' };
	}
};
