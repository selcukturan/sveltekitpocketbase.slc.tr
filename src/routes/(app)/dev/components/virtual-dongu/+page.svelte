<script lang="ts">
	import { Head, Page, Header, Main, Footer } from '$lib/components/base/templates';
	import { tick } from 'svelte';

	type DataType = { [key: string]: string | number | boolean | Date | null | undefined };
	type ColumnType = { label: string; field: string };

	let data: DataType[] = $state([
		{ sira: '1', id: '31153', mustahsil: 'ABDULLAH GEREN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '65000' },
		{ sira: '2', id: '31208', mustahsil: 'ABDULLAH KISAÇ', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '91874,75' },
		{ sira: '3', id: '31155', mustahsil: 'ABDULLAH KISAÇ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '50000' },
		{ sira: '4', id: '31237', mustahsil: 'ABDULLAH KISAÇ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '50000' },
		{ sira: '5', id: '31219', mustahsil: 'ABDURAHMAN SEVEN', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '20000' },
		{ sira: '6', id: '31195', mustahsil: 'ABDURAHMAN SEVEN', tip: 'AVANS_IADE', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '-20000' },
		{ sira: '7', id: '31120', mustahsil: 'AHMET ATEŞDEMİR', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '150000' },
		{ sira: '8', id: '31112', mustahsil: 'AHMET KARADENİZ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '4900' },
		{ sira: '9', id: '31194', mustahsil: 'AHMET TANRIKUT', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '35000' },
		{ sira: '10', id: '31030', mustahsil: 'AKIN TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '70000' },
		{ sira: '11', id: '31028', mustahsil: 'ALİ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '15000' },
		{ sira: '12', id: '31250', mustahsil: 'ALİ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{
			sira: '13',
			id: '31061',
			mustahsil: 'ALİ BEKTAŞ (KORUK)',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '20000'
		},
		{ sira: '14', id: '31233', mustahsil: 'ALİ BERBEROĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '15', id: '31039', mustahsil: 'ALİ ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '70000' },
		{ sira: '16', id: '31086', mustahsil: 'ALİ ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '17', id: '31247', mustahsil: 'ALİ ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '18', id: '31059', mustahsil: 'ALİ EROL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '19', id: '31107', mustahsil: 'ALİ GÜLER', tip: 'AVANS_ODEME', bolge: 'EGE', il: 'IZMIR', ilce: 'MENDERES', tutar: '50000' },
		{ sira: '20', id: '31040', mustahsil: 'ALİ RIZA BOZ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '21', id: '31243', mustahsil: 'ALİ YAKICI', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '100000' },
		{ sira: '22', id: '31110', mustahsil: 'ATANUR ACAR', tip: 'AVANS_ODEME', bolge: 'IC ANADOLU', il: 'TOKAT', ilce: 'NIKSAR', tutar: '35000' },
		{ sira: '23', id: '31143', mustahsil: 'AYHAN FİDAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '600000' },
		{ sira: '24', id: '31174', mustahsil: 'AYŞE ÇOBAN (SB)', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '115000' },
		{ sira: '25', id: '31184', mustahsil: 'AYŞE ÇOBAN (SB)', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '115000' },
		{ sira: '26', id: '31199', mustahsil: 'AYŞE ZEYTİN', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '543,52' },
		{ sira: '27', id: '31239', mustahsil: 'BAYRAM KIZILBÜK', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '5000' },
		{ sira: '28', id: '31215', mustahsil: 'BEKİR DÖNMEZ', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '50000' },
		{ sira: '29', id: '31205', mustahsil: 'BEKİR KÖSE', tip: 'DEVIR', bolge: 'IC ANADOLU', il: 'ANKARA', ilce: 'KALECIK', tutar: '11655,04' },
		{ sira: '30', id: '31176', mustahsil: 'BİLAL AHLAT', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '31', id: '31187', mustahsil: 'BİLAL AHLAT', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '32', id: '31067', mustahsil: 'BİLAL ALTINTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '33', id: '31098', mustahsil: 'BİLAL ALTINTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '34', id: '31252', mustahsil: 'BİLAL ALTINTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '35', id: '31096', mustahsil: 'BİNALİ KÖSE', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '36', id: '31037', mustahsil: 'BİNALİ KÖSE', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '45000' },
		{ sira: '37', id: '31248', mustahsil: 'BİNALİ KÖSE', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '15000' },
		{ sira: '38', id: '31214', mustahsil: 'BÜLENT AYAN (DEN)', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'BEKILLI', tutar: '49966,78' },
		{ sira: '39', id: '31114', mustahsil: 'BÜLENT AYAN (DEN)', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'BEKILLI', tutar: '50000' },
		{ sira: '40', id: '31027', mustahsil: 'BÜLENT BATURAY', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '41', id: '31095', mustahsil: 'BÜLENT BATURAY', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '42', id: '31251', mustahsil: 'BÜLENT BATURAY', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '43', id: '31200', mustahsil: 'CAFER BOZKURT', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '7000' },
		{ sira: '44', id: '31033', mustahsil: 'CELAL POLAT', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '45', id: '31118', mustahsil: 'CEMAL ERÖZMEN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '200000' },
		{ sira: '46', id: '31102', mustahsil: 'CEMAL GÖNÜLTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '47', id: '31152', mustahsil: 'CEYLAN BEYDEMİR', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'BEKILLI', tutar: '50000' },
		{ sira: '48', id: '31201', mustahsil: 'CUMA ELBİR', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '49', id: '31057', mustahsil: 'CUMA ELBİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '15000' },
		{ sira: '50', id: '31080', mustahsil: 'DİREN DİLEK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{
			sira: '51',
			id: '31058',
			mustahsil: 'DOĞAN EROL(ELA)',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '25000'
		},
		{ sira: '52', id: '31170', mustahsil: 'DURMUŞ TOSUN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'BOZCAADA', tutar: '50000' },
		{ sira: '53', id: '31210', mustahsil: 'EMİN ARSLAN', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '-4708,04' },
		{ sira: '54', id: '31197', mustahsil: 'EMİN ARSLAN', tip: 'UZUM_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '4708,04' },
		{ sira: '55', id: '31151', mustahsil: 'ERCAN BERBEROĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '200000' },
		{ sira: '56', id: '31068', mustahsil: 'ERDİNÇ ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '100000' },
		{ sira: '57', id: '31099', mustahsil: 'ERDİNÇ ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '110000' },
		{ sira: '58', id: '31077', mustahsil: 'ERDOĞAN KUTLU', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '100000' },
		{ sira: '59', id: '31025', mustahsil: 'ERHAN DÖRÜCÜ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '80000' },
		{ sira: '60', id: '31074', mustahsil: 'ERHAN DÖRÜCÜ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '61', id: '31202', mustahsil: 'ERHAN ŞENOL', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '2000' },
		{ sira: '62', id: '31207', mustahsil: 'ERMAN KARABIYIK', tip: 'DEVIR', bolge: 'IC ANADOLU', il: 'TOKAT', ilce: 'ERBAA', tutar: '17443,08' },
		{ sira: '63', id: '31111', mustahsil: 'ERMAN KARABIYIK', tip: 'AVANS_ODEME', bolge: 'IC ANADOLU', il: 'TOKAT', ilce: 'ERBAA', tutar: '100000' },
		{ sira: '64', id: '31225', mustahsil: 'ERMAN KARABIYIK', tip: 'AVANS_ODEME', bolge: 'IC ANADOLU', il: 'TOKAT', ilce: 'ERBAA', tutar: '200000' },
		{ sira: '65', id: '31154', mustahsil: 'FATMA BOYACI', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '15000' },
		{ sira: '66', id: '31218', mustahsil: 'FAZİLET AVCI', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '300000' },
		{ sira: '67', id: '31115', mustahsil: 'FERHAT AKKEYİK', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '150000' },
		{ sira: '68', id: '31123', mustahsil: 'FERUDUN YARMAZ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '250000' },
		{
			sira: '69',
			id: '31104',
			mustahsil: 'FİKRİ DEMİREL',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'MALATYA',
			ilce: 'ARAPGIR',
			tutar: '100000'
		},
		{ sira: '70', id: '31052', mustahsil: 'FUAT TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '71', id: '31262', mustahsil: 'GİZEM KIZILHİSAR', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '70000' },
		{ sira: '72', id: '31079', mustahsil: 'GÖZDE ÖZDEMİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '73', id: '31257', mustahsil: 'GÜLGÜN KÜLKÖYLÜ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '90000' },
		{
			sira: '74',
			id: '31072',
			mustahsil: 'GÜLHANIM BEKTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '20000'
		},
		{ sira: '75', id: '31066', mustahsil: 'GÜLTEN CÜVELEK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '76', id: '31160', mustahsil: 'GÜNAY DİKİCİ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '100000' },
		{ sira: '77', id: '31076', mustahsil: 'GÜRKAN BEKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '25000' },
		{ sira: '78', id: '31055', mustahsil: 'GÜVEN ELBİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '79', id: '31092', mustahsil: 'GÜZEL GÜNDOĞDU', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '35000' },
		{ sira: '80', id: '31216', mustahsil: 'HAKAN KESGİN', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '5000' },
		{ sira: '81', id: '31069', mustahsil: 'HAKAN TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '25000' },
		{ sira: '82', id: '31091', mustahsil: 'HAKAN TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '25000' },
		{ sira: '83', id: '31254', mustahsil: 'HAKAN TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '84', id: '31206', mustahsil: 'HALİL BERÇİN', tip: 'DEVIR', bolge: 'IC ANADOLU', il: 'NEVSEHIR', ilce: 'URGUP', tutar: '2500' },
		{ sira: '85', id: '31122', mustahsil: 'HALİL DALCA', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '120000' },
		{
			sira: '86',
			id: '31145',
			mustahsil: 'HALİL İBRAHİM KÜLKÖYLÜ (AHMET)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '100000'
		},
		{ sira: '87', id: '31063', mustahsil: 'HANIM DEMİRALP', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '88', id: '31064', mustahsil: 'HASAN DEMİRALP', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '89', id: '31223', mustahsil: 'HASAN DEMİRALP', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '90', id: '31048', mustahsil: 'HASAN ERTÜRK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '91', id: '31261', mustahsil: 'HASAN ESMER', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '100000' },
		{ sira: '92', id: '31166', mustahsil: 'HASAN ŞARBAK', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'USAK', ilce: 'ESME', tutar: '150000' },
		{
			sira: '93',
			id: '31148',
			mustahsil: 'HASAN YILDIRIM(BEKİLLİ)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'BEKILLI',
			tutar: '90000'
		},
		{ sira: '94', id: '31167', mustahsil: 'HAYATİ ÇAMUR', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'BOZCAADA', tutar: '30000' },
		{ sira: '95', id: '31172', mustahsil: 'HAYATİ ÇAMUR', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'BOZCAADA', tutar: '20000' },
		{ sira: '96', id: '31056', mustahsil: 'HIDIR AYDOĞAN', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '97', id: '31054', mustahsil: 'HIDIR ELBİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '98', id: '31029', mustahsil: 'HIDIR EROL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '99', id: '31203', mustahsil: 'HIDIR ŞENOL', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '3000' },
		{ sira: '100', id: '31034', mustahsil: 'HIDIR TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '8000' },
		{ sira: '101', id: '31217', mustahsil: 'HURİYE KÖSECİ', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '20000' },
		{ sira: '102', id: '31196', mustahsil: 'HURİYE KÖSECİ', tip: 'AVANS_VIRMAN', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '-20000' },
		{
			sira: '103',
			id: '31070',
			mustahsil: 'HÜSEYİN ALTINTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '40000'
		},
		{
			sira: '104',
			id: '31253',
			mustahsil: 'HÜSEYİN ALTINTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '20000'
		},
		{ sira: '105', id: '31228', mustahsil: 'HÜSEYİN BERBEROĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{
			sira: '106',
			id: '31126',
			mustahsil: 'HÜSEYİN ÇİRKİN (HABİB)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '250000'
		},
		{
			sira: '107',
			id: '31144',
			mustahsil: 'HÜSEYİN ÇİRKİN(MEHMET)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '200000'
		},
		{ sira: '108', id: '31083', mustahsil: 'HÜSEYİN ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '35000' },
		{
			sira: '109',
			id: '31041',
			mustahsil: 'HÜSEYİN DİLEK',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '150000'
		},
		{
			sira: '110',
			id: '31224',
			mustahsil: 'HÜSEYİN DİLEK',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '100000'
		},
		{ sira: '111', id: '31043', mustahsil: 'HÜSEYİN KÜÇÜK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '112', id: '31121', mustahsil: 'HÜSEYİN ÖZBİLEN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '400000' },
		{ sira: '113', id: '31235', mustahsil: 'HÜSNÜ ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '114', id: '31093', mustahsil: 'İBRAHİM ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '60000' },
		{ sira: '115', id: '31169', mustahsil: 'İBRAHİM KUŞ', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'GELIBOLU', tutar: '200000' },
		{ sira: '116', id: '31171', mustahsil: 'İBRAHİM KUŞ', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'GELIBOLU', tutar: '200000' },
		{ sira: '117', id: '31116', mustahsil: 'İBRAHİM PALAZ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '200000' },
		{ sira: '118', id: '31175', mustahsil: 'İHSAN TAŞKIRAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '75000' },
		{ sira: '119', id: '31185', mustahsil: 'İHSAN TAŞKIRAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '75000' },
		{ sira: '120', id: '31220', mustahsil: 'İSMAİL AYDEMİR', tip: 'DEVIR', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'ECEABAT', tutar: '1212,94' },
		{ sira: '121', id: '31024', mustahsil: 'İSMAİL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '85000' },
		{ sira: '122', id: '31082', mustahsil: 'İSMAİL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '123', id: '31249', mustahsil: 'İSMAİL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '124', id: '31241', mustahsil: 'KADİR ÖZMUTLU', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '100000' },
		{ sira: '125', id: '31035', mustahsil: 'KEMAL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '60000' },
		{ sira: '126', id: '31047', mustahsil: 'KENAN KÖSE', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '127', id: '31060', mustahsil: 'KUMRU ŞENOL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{
			sira: '128',
			id: '31081',
			mustahsil: 'LEVENT BATURAY',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '15000'
		},
		{ sira: '129', id: '31162', mustahsil: 'LEVENT YUMAKLI', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '35000' },
		{ sira: '130', id: '31141', mustahsil: 'MAHMUT KILIÇARSLAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '200000' },
		{ sira: '131', id: '31182', mustahsil: 'MEDİHA KAYIŞOĞLU', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '70000' },
		{ sira: '132', id: '31192', mustahsil: 'MEDİHA KAYIŞOĞLU', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '133', id: '31181', mustahsil: 'MEHMET ALİ OCAK', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '30000' },
		{ sira: '134', id: '31190', mustahsil: 'MEHMET ALİ OCAK', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '30000' },
		{ sira: '135', id: '31134', mustahsil: 'MEHMET BAHÇIVANOĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '136', id: '31065', mustahsil: 'MEHMET ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '100000' },
		{ sira: '137', id: '31085', mustahsil: 'MEHMET ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '138', id: '31119', mustahsil: 'MEHMET KESGİN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '100000' },
		{ sira: '139', id: '31234', mustahsil: 'MEHMET KESGİN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '40000' },
		{ sira: '140', id: '31209', mustahsil: 'MEHMET KIZILBÜK', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '-4425' },
		{ sira: '141', id: '31198', mustahsil: 'MEHMET KIZILBÜK', tip: 'UZUM_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '4425' },
		{
			sira: '142',
			id: '31032',
			mustahsil: 'MEMET ALTUNTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '25000'
		},
		{
			sira: '143',
			id: '31222',
			mustahsil: 'MEMET ALTUNTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '15000'
		},
		{ sira: '144', id: '31136', mustahsil: 'MERAL GÜRHAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '80000' },
		{ sira: '145', id: '31204', mustahsil: 'MERT ELBİR', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '1000' },
		{ sira: '146', id: '31221', mustahsil: 'MESUT ÇOBAN(MUR)', tip: 'DEVIR', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '110000' },
		{
			sira: '147',
			id: '31191',
			mustahsil: 'MESUT ÇOBAN(MUR)',
			tip: 'AVANS_ODEME',
			bolge: 'MARMARA',
			il: 'TEKIRDAG',
			ilce: 'SARKOY',
			tutar: '300000'
		},
		{ sira: '148', id: '31075', mustahsil: 'MİKTAT EROL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '5000' },
		{ sira: '149', id: '31260', mustahsil: 'MUSTAFA AKSOY', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '150', id: '31242', mustahsil: 'MUSTAFA AVKIRAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '110000' },
		{ sira: '151', id: '31177', mustahsil: 'MUSTAFA ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '150000' },
		{ sira: '152', id: '31186', mustahsil: 'MUSTAFA ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '150000' },
		{ sira: '153', id: '31213', mustahsil: 'MUSTAFA GEDİK', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '1000' },
		{ sira: '154', id: '31142', mustahsil: 'MUSTAFA GÖNEN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '250000' },
		{
			sira: '155',
			id: '31046',
			mustahsil: 'MUSTAFA ÖZDEMİR(ELAZIĞ)',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '30000'
		},
		{
			sira: '156',
			id: '31022',
			mustahsil: 'MUSTAFA TURAN',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'DIYARBAKIR',
			ilce: 'CERMIK',
			tutar: '500000'
		},
		{
			sira: '157',
			id: '31132',
			mustahsil: 'MUSTAFA YARMAZ (HABİB)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '150000'
		},
		{
			sira: '158',
			id: '31161',
			mustahsil: 'MUSTAFA YARMAZ (HABİB)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '30000'
		},
		{ sira: '159', id: '31173', mustahsil: 'MUZAFFER ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '160', id: '31183', mustahsil: 'MUZAFFER ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{
			sira: '161',
			id: '31051',
			mustahsil: 'MÜSLİM ÖZDEMİR',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '10000'
		},
		{ sira: '162', id: '31053', mustahsil: 'MÜSLÜM ELBİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '163', id: '31165', mustahsil: 'NAİME KUMRU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'USAK', ilce: 'ESME', tutar: '100000' },
		{ sira: '164', id: '31137', mustahsil: 'NAZİF BİLMEZ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '120000' },
		{ sira: '165', id: '31168', mustahsil: 'NECDET DUVAR', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'GELIBOLU', tutar: '120000' },
		{ sira: '166', id: '31178', mustahsil: 'NEDRET KILIÇ', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '200000' },
		{ sira: '167', id: '31179', mustahsil: 'NEHİR ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '130000' },
		{ sira: '168', id: '31188', mustahsil: 'NEHİR ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '130000' },
		{ sira: '169', id: '31193', mustahsil: 'NEHİR ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '100000' },
		{ sira: '170', id: '31045', mustahsil: 'NEVZİYE İRTÜK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '15000' },
		{
			sira: '171',
			id: '31050',
			mustahsil: 'NUSRET ERASLAN',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '50000'
		},
		{ sira: '172', id: '31038', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '70000' },
		{ sira: '173', id: '31090', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '174', id: '31094', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '175', id: '31097', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '176', id: '31246', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '70000' },
		{
			sira: '177',
			id: '31036',
			mustahsil: 'OKTAY ÖZDEMİR',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '100000'
		},
		{
			sira: '178',
			id: '31044',
			mustahsil: 'ONUR ASLAN(ELA)',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '10000'
		},
		{ sira: '179', id: '31138', mustahsil: 'OSMAN BURKAY', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '85000' },
		{ sira: '180', id: '31139', mustahsil: 'OSMAN KIZILOĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '25000' },
		{ sira: '181', id: '31163', mustahsil: 'OSMAN KÖSELİ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '35000' },
		{
			sira: '182',
			id: '31105',
			mustahsil: 'OSMAN ÖZTÜRK',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'MALATYA',
			ilce: 'ARAPGIR',
			tutar: '35000'
		},
		{ sira: '183', id: '31212', mustahsil: 'ÖMER AYHANCI (DEN)', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '10699,97' },
		{ sira: '184', id: '31113', mustahsil: 'ÖMER AYHANCI (DEN)', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '100000' },
		{ sira: '185', id: '31236', mustahsil: 'ÖMER AYHANCI (DEN)', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '50000' },
		{
			sira: '186',
			id: '31078',
			mustahsil: 'ÖNDER AKAGÜNDÜZ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '10000'
		},
		{ sira: '187', id: '31159', mustahsil: 'ÖZAY FİDAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '188', id: '31140', mustahsil: 'ÖZAY MELER', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '500000' },
		{ sira: '189', id: '31259', mustahsil: 'ÖZCAN ERTAŞ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '60000' },
		{ sira: '190', id: '31124', mustahsil: 'ÖZCAN MELER', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '600000' },
		{ sira: '191', id: '31230', mustahsil: 'ÖZCAN MELER', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '250000' },
		{ sira: '192', id: '31147', mustahsil: 'ÖZKAN BEYDEMİR', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'BEKILLI', tutar: '35000' },
		{ sira: '193', id: '31149', mustahsil: 'RAHMİ GERMİŞ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '194', id: '31238', mustahsil: 'RAMAZAN UZUN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '20000' },
		{ sira: '195', id: '31158', mustahsil: 'RAZİYE TAŞAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '80000' },
		{ sira: '196', id: '31211', mustahsil: 'RİFAT GİRESUN', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '1023' },
		{
			sira: '197',
			id: '31150',
			mustahsil: 'SABAHADDİN DUTARKAN',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '200000'
		},
		{ sira: '198', id: '31125', mustahsil: 'SADIK MELER', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '700000' },
		{ sira: '199', id: '31226', mustahsil: 'SADIK MELER', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '300000' },
		{ sira: '200', id: '31240', mustahsil: 'SAFVET ORHAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '30000' }
	]);
	let columns: ColumnType[] = $state([
		{ field: 'sira', label: 'Sıra' },
		{ field: 'id', label: 'ID' },
		{ field: 'mustahsil', label: 'Mustahsil' },
		{ field: 'tip', label: 'Tip' },
		{ field: 'bolge', label: 'Bölge' },
		{ field: 'il', label: 'İl' },
		{ field: 'ilce', label: 'İlçe' },
		{ field: 'tutar', label: 'Tutar' }
	]);

	let data1: DataType[] = $state([
		{
			sira: '93',
			id: '31148',
			mustahsil: 'HASAN YILDIRIM(BEKİLLİ)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'BEKILLI',
			tutar: '90000'
		},
		{ sira: '94', id: '31167', mustahsil: 'HAYATİ ÇAMUR', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'BOZCAADA', tutar: '30000' },
		{ sira: '95', id: '31172', mustahsil: 'HAYATİ ÇAMUR', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'BOZCAADA', tutar: '20000' },
		{ sira: '96', id: '31056', mustahsil: 'HIDIR AYDOĞAN', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '97', id: '31054', mustahsil: 'HIDIR ELBİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '50000' },
		{ sira: '98', id: '31029', mustahsil: 'HIDIR EROL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '99', id: '31203', mustahsil: 'HIDIR ŞENOL', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '3000' },
		{ sira: '100', id: '31034', mustahsil: 'HIDIR TOKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '8000' },
		{ sira: '101', id: '31217', mustahsil: 'HURİYE KÖSECİ', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '20000' },
		{ sira: '102', id: '31196', mustahsil: 'HURİYE KÖSECİ', tip: 'AVANS_VIRMAN', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '-20000' },
		{
			sira: '103',
			id: '31070',
			mustahsil: 'HÜSEYİN ALTINTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '40000'
		},
		{
			sira: '104',
			id: '31253',
			mustahsil: 'HÜSEYİN ALTINTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '20000'
		},
		{ sira: '105', id: '31228', mustahsil: 'HÜSEYİN BERBEROĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{
			sira: '106',
			id: '31126',
			mustahsil: 'HÜSEYİN ÇİRKİN (HABİB)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '250000'
		},
		{
			sira: '107',
			id: '31144',
			mustahsil: 'HÜSEYİN ÇİRKİN(MEHMET)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '200000'
		},
		{ sira: '108', id: '31083', mustahsil: 'HÜSEYİN ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '35000' },
		{
			sira: '109',
			id: '31041',
			mustahsil: 'HÜSEYİN DİLEK',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '150000'
		},
		{
			sira: '110',
			id: '31224',
			mustahsil: 'HÜSEYİN DİLEK',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '100000'
		},
		{ sira: '111', id: '31043', mustahsil: 'HÜSEYİN KÜÇÜK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '10000' },
		{ sira: '112', id: '31121', mustahsil: 'HÜSEYİN ÖZBİLEN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '400000' },
		{ sira: '113', id: '31235', mustahsil: 'HÜSNÜ ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '114', id: '31093', mustahsil: 'İBRAHİM ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '60000' },
		{ sira: '115', id: '31169', mustahsil: 'İBRAHİM KUŞ', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'GELIBOLU', tutar: '200000' },
		{ sira: '116', id: '31171', mustahsil: 'İBRAHİM KUŞ', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'GELIBOLU', tutar: '200000' },
		{ sira: '117', id: '31116', mustahsil: 'İBRAHİM PALAZ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '200000' },
		{ sira: '118', id: '31175', mustahsil: 'İHSAN TAŞKIRAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '75000' },
		{ sira: '119', id: '31185', mustahsil: 'İHSAN TAŞKIRAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '75000' },
		{ sira: '120', id: '31220', mustahsil: 'İSMAİL AYDEMİR', tip: 'DEVIR', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'ECEABAT', tutar: '1212,94' },
		{ sira: '121', id: '31024', mustahsil: 'İSMAİL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '85000' },
		{ sira: '122', id: '31082', mustahsil: 'İSMAİL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '123', id: '31249', mustahsil: 'İSMAİL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '124', id: '31241', mustahsil: 'KADİR ÖZMUTLU', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '100000' },
		{ sira: '125', id: '31035', mustahsil: 'KEMAL ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '60000' },
		{ sira: '126', id: '31047', mustahsil: 'KENAN KÖSE', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '127', id: '31060', mustahsil: 'KUMRU ŞENOL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{
			sira: '128',
			id: '31081',
			mustahsil: 'LEVENT BATURAY',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '15000'
		},
		{ sira: '129', id: '31162', mustahsil: 'LEVENT YUMAKLI', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '35000' },
		{ sira: '130', id: '31141', mustahsil: 'MAHMUT KILIÇARSLAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '200000' },
		{ sira: '131', id: '31182', mustahsil: 'MEDİHA KAYIŞOĞLU', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '70000' },
		{ sira: '132', id: '31192', mustahsil: 'MEDİHA KAYIŞOĞLU', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '133', id: '31181', mustahsil: 'MEHMET ALİ OCAK', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '30000' },
		{ sira: '134', id: '31190', mustahsil: 'MEHMET ALİ OCAK', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '30000' },
		{ sira: '135', id: '31134', mustahsil: 'MEHMET BAHÇIVANOĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '136', id: '31065', mustahsil: 'MEHMET ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '100000' },
		{ sira: '137', id: '31085', mustahsil: 'MEHMET ÇOK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '138', id: '31119', mustahsil: 'MEHMET KESGİN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '100000' },
		{ sira: '139', id: '31234', mustahsil: 'MEHMET KESGİN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '40000' },
		{ sira: '140', id: '31209', mustahsil: 'MEHMET KIZILBÜK', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '-4425' },
		{ sira: '141', id: '31198', mustahsil: 'MEHMET KIZILBÜK', tip: 'UZUM_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '4425' },
		{
			sira: '142',
			id: '31032',
			mustahsil: 'MEMET ALTUNTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '25000'
		},
		{
			sira: '143',
			id: '31222',
			mustahsil: 'MEMET ALTUNTAŞ',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '15000'
		},
		{ sira: '144', id: '31136', mustahsil: 'MERAL GÜRHAN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '80000' },
		{ sira: '145', id: '31204', mustahsil: 'MERT ELBİR', tip: 'DEVIR', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '1000' },
		{ sira: '146', id: '31221', mustahsil: 'MESUT ÇOBAN(MUR)', tip: 'DEVIR', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '110000' },
		{
			sira: '147',
			id: '31191',
			mustahsil: 'MESUT ÇOBAN(MUR)',
			tip: 'AVANS_ODEME',
			bolge: 'MARMARA',
			il: 'TEKIRDAG',
			ilce: 'SARKOY',
			tutar: '300000'
		},
		{ sira: '148', id: '31075', mustahsil: 'MİKTAT EROL', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '5000' },
		{ sira: '149', id: '31260', mustahsil: 'MUSTAFA AKSOY', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '50000' },
		{ sira: '150', id: '31242', mustahsil: 'MUSTAFA AVKIRAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '110000' },
		{ sira: '151', id: '31177', mustahsil: 'MUSTAFA ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '150000' },
		{ sira: '152', id: '31186', mustahsil: 'MUSTAFA ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '150000' },
		{ sira: '153', id: '31213', mustahsil: 'MUSTAFA GEDİK', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '1000' },
		{ sira: '154', id: '31142', mustahsil: 'MUSTAFA GÖNEN', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '250000' },
		{
			sira: '155',
			id: '31046',
			mustahsil: 'MUSTAFA ÖZDEMİR(ELAZIĞ)',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '30000'
		},
		{
			sira: '156',
			id: '31022',
			mustahsil: 'MUSTAFA TURAN',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'DIYARBAKIR',
			ilce: 'CERMIK',
			tutar: '500000'
		},
		{
			sira: '157',
			id: '31132',
			mustahsil: 'MUSTAFA YARMAZ (HABİB)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '150000'
		},
		{
			sira: '158',
			id: '31161',
			mustahsil: 'MUSTAFA YARMAZ (HABİB)',
			tip: 'AVANS_ODEME',
			bolge: 'IC EGE',
			il: 'DENIZLI',
			ilce: 'GUNEY',
			tutar: '30000'
		},
		{ sira: '159', id: '31173', mustahsil: 'MUZAFFER ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{ sira: '160', id: '31183', mustahsil: 'MUZAFFER ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '50000' },
		{
			sira: '161',
			id: '31051',
			mustahsil: 'MÜSLİM ÖZDEMİR',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '10000'
		},
		{ sira: '162', id: '31053', mustahsil: 'MÜSLÜM ELBİR', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '20000' },
		{ sira: '163', id: '31165', mustahsil: 'NAİME KUMRU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'USAK', ilce: 'ESME', tutar: '100000' },
		{ sira: '164', id: '31137', mustahsil: 'NAZİF BİLMEZ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '120000' },
		{ sira: '165', id: '31168', mustahsil: 'NECDET DUVAR', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'CANAKKALE', ilce: 'GELIBOLU', tutar: '120000' },
		{ sira: '166', id: '31178', mustahsil: 'NEDRET KILIÇ', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '200000' },
		{ sira: '167', id: '31179', mustahsil: 'NEHİR ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '130000' },
		{ sira: '168', id: '31188', mustahsil: 'NEHİR ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '130000' },
		{ sira: '169', id: '31193', mustahsil: 'NEHİR ÇOBAN', tip: 'AVANS_ODEME', bolge: 'MARMARA', il: 'TEKIRDAG', ilce: 'SARKOY', tutar: '100000' },
		{ sira: '170', id: '31045', mustahsil: 'NEVZİYE İRTÜK', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '15000' },
		{
			sira: '171',
			id: '31050',
			mustahsil: 'NUSRET ERASLAN',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '50000'
		},
		{ sira: '172', id: '31038', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '70000' },
		{ sira: '173', id: '31090', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '174', id: '31094', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '30000' },
		{ sira: '175', id: '31097', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '40000' },
		{ sira: '176', id: '31246', mustahsil: 'OĞUZ AKTAŞ', tip: 'AVANS_ODEME', bolge: 'DOGU ANADOLU', il: 'ELAZIG', ilce: 'MERKEZ', tutar: '70000' },
		{
			sira: '177',
			id: '31036',
			mustahsil: 'OKTAY ÖZDEMİR',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '100000'
		},
		{
			sira: '178',
			id: '31044',
			mustahsil: 'ONUR ASLAN(ELA)',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'ELAZIG',
			ilce: 'MERKEZ',
			tutar: '10000'
		},
		{ sira: '179', id: '31138', mustahsil: 'OSMAN BURKAY', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '85000' },
		{ sira: '180', id: '31139', mustahsil: 'OSMAN KIZILOĞLU', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '25000' },
		{ sira: '181', id: '31163', mustahsil: 'OSMAN KÖSELİ', tip: 'AVANS_ODEME', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'GUNEY', tutar: '35000' },
		{
			sira: '182',
			id: '31105',
			mustahsil: 'OSMAN ÖZTÜRK',
			tip: 'AVANS_ODEME',
			bolge: 'DOGU ANADOLU',
			il: 'MALATYA',
			ilce: 'ARAPGIR',
			tutar: '35000'
		},
		{ sira: '183', id: '31212', mustahsil: 'ÖMER AYHANCI (DEN)', tip: 'DEVIR', bolge: 'IC EGE', il: 'DENIZLI', ilce: 'CAL', tutar: '10699,97' }
	]);

	let tableElement: HTMLTableElement | undefined = $state(undefined);
	let rowHeight = $state(35);
	let tableHeight = $state(0);
	let startRowIndex = $state(0);
	let endRowIndex = $state(0);
	let overscan = $state(4); // Overscan satır sayısı
	let visibleRows: DataType[] = $derived.by(() => {
		return data.slice(startRowIndex, endRowIndex).map((row, index) => {
			return {
				...row,
				sysOriginalIndex: startRowIndex + index
			};
		});
	});

	let firstVisibleRowTopOffset = 0; // ilk görünen satırın üstten olan mesafesini temsil eder.

	async function refresh(data: DataType[], tableHeight: number, rowHeight: number, overscan: number) {
		if (!tableElement) return;

		const { scrollTop } = tableElement;
		await tick();

		let contentHeight = firstVisibleRowTopOffset - scrollTop;
		let currentIndex = startRowIndex;

		while (contentHeight < tableHeight && currentIndex < data.length) {
			if (!visibleRows?.[currentIndex - startRowIndex]) {
				endRowIndex = currentIndex + 1 + overscan; // visibleRows recalculated
				await tick();
			}
			contentHeight += rowHeight;
			currentIndex += 1;
		}

		endRowIndex = currentIndex + overscan; // visibleRows recalculated
	}

	async function handleScroll() {
		if (!tableElement) return;

		let offsetLeft = tableElement.scrollLeft;
		let offset = tableElement.scrollTop;
		let start = 0;
		let end = data.length - 1;
		let currentOffset = 0;

		// startRowIndex
		while (start <= end) {
			console.log('object');
			currentOffset += rowHeight;
			if (currentOffset > offset) {
				startRowIndex = Math.max(0, start - overscan); // visibleRows recalculated
				firstVisibleRowTopOffset = currentOffset;
				break;
			}
			start += 1;
		}
		// endRowIndex
		while (start <= end) {
			console.log('object');
			start += 1;
			if (currentOffset > offset + tableHeight) break;
			currentOffset += rowHeight;
		}
		endRowIndex = Math.min(data.length, start + overscan); // visibleRows recalculated

		await tick();
		tableElement.scrollTo(offsetLeft, offset);
	}

	$effect(() => {
		if (tableElement) refresh(data, tableHeight, rowHeight, overscan);
	});
</script>

<Head>
	<title>Virtual Table - SLC Web Applications</title>
	<meta name="description" content="Virtual Table - SLC Web Applications" />
</Head>

<Page>
	<Header class="flex gap-10 border-b bg-surface-50">
		<p>Header</p>
	</Header>
	<Main>
		<table
			bind:this={tableElement}
			bind:offsetHeight={tableHeight}
			onscroll={handleScroll}
			class="grid h-full w-full overflow-auto bg-surface-50"
			style:grid-template-rows={`repeat(1, ${rowHeight}px) repeat(${data?.length}, ${rowHeight}px) repeat(1, ${rowHeight}px)`}
			style:grid-template-columns={`100px 100px 200px 150px 150px 100px 100px 100px`}
		>
			<thead class="contents">
				<tr class="contents bg-surface-50" data-index="1" style:--slc-grid-row-start="1">
					{#each columns as col, ci}
						<th
							style:grid-row-start="var(--slc-grid-row-start)"
							class="sticky top-0 z-[4] select-none overflow-hidden border-b border-r bg-surface-100 px-2 outline-none duration-100 hover:bg-surface-200 [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0"
						>
							{col.label}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody class="contents">
				{#each visibleRows as row, ri}
					<tr
						class="contents bg-surface-50"
						style:--slc-grid-row-start={row?.sysOriginalIndex !== null && row?.sysOriginalIndex !== undefined ? +row.sysOriginalIndex + 2 : undefined}
					>
						{#each columns as col, ci}
							<td
								data-originalrowindex={row?.sysOriginalIndex !== null && row?.sysOriginalIndex !== undefined ? +row.sysOriginalIndex + 2 : undefined}
								style:grid-row-start="var(--slc-grid-row-start)"
								class="relative z-[2] overflow-hidden border-b border-r bg-inherit p-0 px-2 outline-none slc-select-none focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-primary-500 [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0"
							>
								{row[col.field]}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
			<tfoot class="contents">
				<tr
					class="contents bg-surface-50"
					data-index={data && data.length > 0 ? data.length + 2 : 2}
					style:--slc-grid-row-start={data && data.length > 0 ? data.length + 2 : 2}
				>
					{#each columns as col, ci}
						<th
							style:grid-row-start="var(--slc-grid-row-start)"
							class="sticky bottom-0 z-[4] overflow-hidden border-b border-r border-solid border-surface-300 bg-surface-100 px-2 outline-none slc-select-none [&:nth-last-child(1)]:border-l [&:nth-last-child(2)]:border-r-0"
						>
							{col.field}
						</th>
					{/each}
				</tr>
			</tfoot>
		</table>
	</Main>
	<Footer class="flex gap-10 border-t bg-surface-50">
		<button onclick={() => (data = data1)}>Data</button>

		<button onclick={() => (rowHeight = 95)}>Row95</button>
		<button onclick={() => (rowHeight = 4)}>Row4</button>
		<button onclick={() => (rowHeight = 35)}>Row35</button>
	</Footer>
</Page>
