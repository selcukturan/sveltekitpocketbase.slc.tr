import { browser } from '$app/environment';
import type { ProducedGrapes } from '$lib/dev/schemaProducedGrapes';
import { dev } from '$app/environment';
import { z } from 'zod';

export default class utils {
	static isFocusable(element: HTMLElement): boolean {
		const tagName = element && element.tagName ? element.tagName.toLowerCase() : '';

		return utils.isInput(element) || tagName === 'button' || tagName === 'a' || tagName === 'details' || element?.tabIndex >= 0;
	}

	static isInput(element: HTMLElement): boolean {
		const tagName = element && element.tagName ? element.tagName.toLowerCase() : '';

		return tagName === 'input' || tagName === 'select' || tagName === 'textarea' || element?.isContentEditable;
	}

	static isObject(value: unknown): boolean {
		return value !== null && typeof value === 'object' && value.constructor === Object;
	}

	static randomString(length?: number): string {
		length = length || 10;

		let result = '';
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (let i = 0; i < length; i++) {
			result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
		}

		return result;
	}

	static sentenize(str: string, stopCheck = true): string {
		if (typeof str !== 'string') {
			return '';
		}

		str = str.trim().split('_').join(' ');
		if (str === '') {
			return str;
		}

		str = str[0].toUpperCase() + str.substring(1);

		if (stopCheck) {
			// let lastChar = str[str.length - 1];
			const lastChar = str[str.length - 1];
			if (lastChar !== '.' && lastChar !== '?' && lastChar !== '!') {
				str += '.';
			}
		}

		return str;
	}

	static getDbDate(data: string): Date | undefined {
		const date = new Date(data);
		if (isNaN(date.getTime())) {
			return undefined;
		} else {
			// Türkiye UTC+3 olduğu için, input elementinden gelen tarih UTC+3'e göre ayarlanıyor.
			// const offsetInMilliseconds = date.getTimezoneOffset() * 60 * 1000;
			// value = new Date(date.getTime() - offsetInMilliseconds);
		}
		return date;
	}

	/**
	 * #####################################################################################################################3
	 * #####################################################################################################################3
	 * ############################################### SLC #################################################################3
	 * #####################################################################################################################3
	 * #####################################################################################################################3
	 */

	static isBrowser = typeof document !== 'undefined';

	static turkishLowerCase(str: string): string {
		if (typeof str !== 'string') return '';
		return str.toLocaleLowerCase('tr-TR');
	}

	static turkishUpperCase(str: string): string {
		if (typeof str !== 'string') return '';
		return str.toLocaleUpperCase('tr-TR');
	}

	static chunkArray<T>(array: T[], chunkSize: number): T[][] {
		const chunks: T[][] = [];
		for (let i = 0; i < array.length; i += chunkSize) {
			chunks.push(array.slice(i, i + chunkSize));
		}
		return chunks;
	}

	static validTC(tc: string): boolean {
		// olmali, string olmali, ilk rakam 0 olamaz, 11 karakter olmali
		if (!tc || typeof tc !== 'string' || tc[0] === '0' || tc.length !== 11) return false;

		let sum_1_3_5_7_9 = 0;
		let sum_2_4_6_8 = 0;
		let sum_first_10_char = 0;

		const impossible = ['11111111110', '22222222220', '33333333330', '44444444440', '55555555550', '66666666660', '77777777770', '88888888880', '99999999990'];

		const digits = tc.split('').map(Number);

		sum_1_3_5_7_9 = digits[0] + digits[2] + digits[4] + digits[6] + digits[8]; // 1. 3. 5. 7. ve 9. hanelerin toplami
		sum_2_4_6_8 = digits[1] + digits[3] + digits[5] + digits[7]; // 2. 4. 6. ve 8. hanelerin toplami
		sum_first_10_char = digits.slice(0, 10).reduce((acc, val) => acc + val, 0); // 10 hanenin toplami

		let mod_1 = (sum_1_3_5_7_9 * 7 - sum_2_4_6_8) % 10; // 1. 3. 5. 7. ve 9. hanelerin toplaminin 7 ile çarpimindan 2. 4. 6. ve 8. haneler cikartildiginda geriye kalan sayinin 10′a gore modu bize 10. haneyi verir.
		mod_1 = mod_1 < 0 ? mod_1 + 10 : mod_1; // mod sonucu negatif cikar ise, sonuc mod ile toplanir.( sonuc hatali cikar ise abs(10) ile topla )

		// mod_1 10. karaktere eşit olmalı
		if (mod_1 !== digits[9]) return false;

		let mod_2 = sum_first_10_char % 10; // kural 2 = 1. 2. 3. 4. 5. 6. 7. 8. 9. 10. hanelerin toplaminin 10′a gore modu bize 11. haneyi verir.
		mod_2 = mod_2 < 0 ? mod_2 + 10 : mod_2; // mod sonucu negatif cikar ise, sonuc mod ile toplanir.( sonuc hatali cikar ise abs(10) ile topla )

		// mod_2 11. karaktere esit olmali
		if (mod_2 !== digits[10]) return false;

		if (impossible.some((item) => tc === item)) {
			return false;
		}

		return true;
	}

	static validIBAN(value: string): boolean {
		if (!value || typeof value !== 'string') return false; // value null, undefined veya string degilse false doner

		let iban = false; // IBAN gecerliligini belirten degisken, baslangicta false olarak ayarlanir.
		value = value.toUpperCase().trim(); // IBAN degerini buyuk harfe cevirir ve basindaki ve sonundaki bosluklari temizler.
		if (/^TR\d{7}0[A-Z0-9]{16}$/.test(value)) {
			// IBAN formatini kontrol eder. TR ile baslamali, ardindan 7 rakam, 0 ve 16 karakter (A-Z veya 0-9) gelmelidir.
			let sayi = value.slice(4, 26) + value.slice(0, 4); // IBAN'in 4. karakterinden 26. karakterine kadar olan kismini alir ve bastaki 4 karakteri sona ekler.
			sayi = sayi.replace(/[A-Z]/g, (char) => (char.charCodeAt(0) - 55).toString()); // Harfleri sayilara donusturur. A=10, B=11, ..., Z=35.
			iban = BigInt(sayi) % 97n === 1n; // Sayiyi 97'ye boler ve kalan 1 ise IBAN gecerlidir.
		}
		return iban; // IBAN gecerliligini doner.
	}

	static generateExampleData(count: number) {
		if (!browser) return [];
		const producerName = [
			'Ahmet',
			'Mehmet',
			'Ayşe',
			'Fatma',
			'Emre',
			'Hüseyin',
			'Ali',
			'Mustafa',
			'Yusuf',
			'Hasan',
			'Murat',
			'İbrahim',
			'Osman',
			'Ramazan',
			'Süleyman',
			'Bekir',
			'Kemal',
			'Nihat',
			'Okan',
			'Ömer',
			'Uğur',
			'Veli',
			'Ziya',
			'Adem',
			'Bülent',
			'Cem',
			'Deniz',
			'Erdem',
			'Ferhat',
			'Gökhan',
			'Hakan',
			'İsmail',
			'Kadir',
			'Levent',
			'Mert',
			'Nuri',
			'Onur',
			'Pelin',
			'Rıza',
			'Seda',
			'Turan',
			'Ufuk',
			'Vedat',
			'Yıldız',
			'Zafer',
			'Aslı',
			'Bahar',
			'Ceyda',
			'Derya',
			'Ebru',
			'Fikret',
			'Gülay',
			'Hülya',
			'İpek',
			'Jale',
			'Kübra',
			'Leman',
			'Müge',
			'Nazan',
			'Oya',
			'Perihan',
			'Rukiye',
			'Sevil',
			'Tülay',
			'Ülkü',
			'Vildan',
			'Yasemin',
			'Zehra',
			'Aysun',
			'Belgin',
			'Canan',
			'Dilek',
			'Esra',
			'Filiz',
			'Gizem',
			'Hande',
			'Işıl',
			'Jülide',
			'Kadriye',
			'Lale',
			'Melike',
			'Nilgün',
			'Ozan',
			'Pınar',
			'Rabia',
			'Selin',
			'Tuğba',
			'Ümit',
			'Veli',
			'Yavuz',
			'Zeki',
			'Aylin',
			'Burak',
			'Cansu',
			'Damla',
			'Ece'
		];
		const producerSurname = [
			'Yılmaz',
			'Kaya',
			'Demir',
			'Çelik',
			'Şahin',
			'Yıldız',
			'Aydın',
			'Öztürk',
			'Arslan',
			'Doğan',
			'Kılıç',
			'Aslan',
			'Çetin',
			'Korkmaz',
			'Yıldırım',
			'Özkan',
			'Bulut',
			'Kara',
			'Koç',
			'Özer',
			'Acar',
			'Polat',
			'Güler',
			'Güzel',
			'Yalçın',
			'Güneş',
			'Bozkurt',
			'Sarıkaya',
			'Sezer',
			'Eren',
			'Yavuz',
			'Karaca',
			'Işık',
			'Akın',
			'Kurt',
			'Öztürk',
			'Erdem',
			'Koçak',
			'Dinç',
			'Can',
			'Demirel',
			'Erdoğan',
			'Korkut',
			'Sağlam',
			'Özdemir',
			'Bayram',
			'Ergün',
			'Gündüz',
			'Gül',
			'Altun',
			'Bal',
			'Şimşek',
			'Karataş',
			'Duman',
			'Taş',
			'Tunç',
			'Ekinci',
			'Tan',
			'Aksoy',
			'Çakır',
			'Köse',
			'Yalın',
			'Ünal',
			'Çakmak',
			'Baş',
			'Güney',
			'Gökmen',
			'Aksu',
			'Aktaş',
			'Şeker',
			'Tanrıverdi',
			'Bilgin',
			'Kaya',
			'Yener',
			'Alkan',
			'Kaptan',
			'Ergün',
			'Çoban',
			'Bingöl',
			'Coşkun',
			'Ak',
			'Balcı',
			'Ece',
			'Fidan',
			'Genç',
			'İnan',
			'Karaman',
			'Kılıçarslan',
			'Uçar',
			'Özgür',
			'Turhan',
			'Kaya',
			'Demirel',
			'Özgür',
			'Şeker',
			'Öztürk',
			'Yüce',
			'Sarı',
			'Koçak',
			'Özkan'
		];
		const regionAndGrape = [
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Develler', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Süller', grape: 'Çal Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Süller', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Anadolu', province: 'Tokat', district: 'Erbaa', village: 'Bağpınar', grape: 'Narince', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Hançalar', grape: 'Çal Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Hançalar', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Anadolu', province: 'Tokat', district: 'Erbaa', village: 'Üzümlü', grape: 'Narince', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Merkez', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Merkez', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Merkez', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Selcen', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Anadolu', province: 'Tokat', district: 'Niksar', village: 'Gökçeli', grape: 'Narince', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Bahadınlar', grape: 'Çal Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Bahadınlar', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Develler', grape: 'Çal Karası', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Mürefte', grape: 'Merlot', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Elazığ', district: 'Merkez', village: 'Koruk', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Merkez', grape: 'Chardonnay', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Elazığ', district: 'Merkez', village: 'Pirinçci', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Ege', province: 'İzmir', district: 'Menderes', village: 'Merkez', grape: 'Misket', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Chardonnay', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Viognier', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Cabernet Saugvignon', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Merkez', grape: 'Merlot', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Parmaksızlar', grape: 'Chardonnay', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Merlot', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Merkez', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Anadolu', province: 'Tokat', district: 'Erbaa', village: 'Doğanyurt', grape: 'Narince', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Kayapınar', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'İç Anadolu', province: 'Nevşehir', district: 'Ürgüp', village: 'Sofular', grape: 'Emir', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Bekilli', village: 'Yeşiloba', grape: 'Boğazkere', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Sofuköy', grape: 'Gamay', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Sofuköy', grape: 'Merlot', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Tepte', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Mürefte', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Boğazkere', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Cabernet Franc', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Chardonnay', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Cabernet Saugvignon', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Fiano', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Grenache Noir', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Malbec', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Merlot', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Misket', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Pinot Noir', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Petit Verdot', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Tempranillo', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Keklikli', grape: 'Viognier', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Cabernet Franc', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Kuntra', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Misket', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Petit Verdot', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Merkez', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Çakırlar', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Adıgüzeller', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Akkent', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Parmaksızlar', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Kara Lahana', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Zinfandel', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Ortaçeşme', grape: 'Chardonnay', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Ortaçeşme', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Ortaçeşme', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Elazığ', district: 'Merkez', village: 'Çatalharman', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Parmaksızlar', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Arapgir', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Merkez', village: 'Merkez', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Kuyucak', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Kayapınar', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Selcen', grape: 'Çal Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Parmaksızlar', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Adıgüzeller', grape: 'Chardonnay', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Adıgüzeller', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Gelibolu', village: 'Çokal', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Ortaköy', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Saraycık', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'İç Anadolu', province: 'Tokat', district: 'Niksar', village: 'Gözpınar', grape: 'Narince', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Merkez', grape: 'Sultaniye', grapeColor: 'White' },
			{ region: 'İç Anadolu', province: 'Ankara', district: 'Kalecik', village: 'Merkez', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Kılıçlı', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Yeniköy', grape: 'Cabernet Franc', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Yeniköy', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Araplı', grape: 'Merlot', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Araplı', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Yabanlı', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Sofuköy', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Güllü', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'İç Anadolu', province: 'Tokat', district: 'Erbaa', village: 'Salkımören', grape: 'Narince', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Elazığ', district: 'Merkez', village: 'Muratçık', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Merkez', grape: 'Gamay', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Diyarbakır', district: 'Çermik', village: 'Kuyu', grape: 'Boğazkere', grapeColor: 'Red' },
			{ region: 'İç Anadolu', province: 'Nevşehir', district: 'Ürgüp', village: 'Karakaya', grape: 'Emir', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Uşak', district: 'Eşme', village: 'Güllü', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Haylamaz', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Haylamaz', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Yazılı', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Çal', village: 'Merkez', grape: 'Çal Karası', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Elazığ', district: 'Merkez', village: 'Hozik', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Pağnik', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Çanakkale', district: 'Bozcaada', village: 'Merkez', grape: 'Alicante', grapeColor: 'Red' },
			{ region: 'İç Anadolu', province: 'Ankara', district: 'Kalecik', village: 'Buğra', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Adıgüzeller', grape: 'Syrah', grapeColor: 'Red' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arapgir', village: 'Denizli', grape: 'Öküzgözü', grapeColor: 'Red' },
			{ region: 'Marmara', province: 'Tekirdağ', district: 'Şarköy', village: 'Mürefte', grape: 'Gamay', grapeColor: 'Red' },
			{ region: 'İç Anadolu', province: 'Ankara', district: 'Kalecik', village: 'Akkuzulu', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Haylamaz', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Aşağıçeşme', grape: 'Kalecik Karası', grapeColor: 'Red' },
			{ region: 'İç Ege', province: 'Denizli', district: 'Güney', village: 'Aşağıçeşme', grape: 'Sauvignon Blanc', grapeColor: 'White' },
			{ region: 'Doğu Anadolu', province: 'Malatya', district: 'Arguvan', village: 'Çakırsu', grape: 'Öküzgözü', grapeColor: 'Red' }
		];

		const data: ProducedGrapes[] = [];

		for (let i = 1; i <= count; i++) {
			const randomProducerName = producerName[Math.floor(Math.random() * producerName.length)];
			const randomProducerSurname = producerSurname[Math.floor(Math.random() * producerSurname.length)];
			const randomRegionAndGrape = regionAndGrape[Math.floor(Math.random() * regionAndGrape.length)];

			const order = i;
			const producer = `${randomProducerName} ${randomProducerSurname}`;
			const province = randomRegionAndGrape.province;
			const district = randomRegionAndGrape.district;
			const village = randomRegionAndGrape.village;
			const grape = randomRegionAndGrape.grape;
			const grapeColor = randomRegionAndGrape.grapeColor;
			const calcQuantity = Math.floor(Math.random() * 10000);
			const calcPrice = parseFloat((Math.random() * 10).toFixed(2));
			const quantity = calcQuantity === 0 ? 1000 : calcQuantity;
			const price = calcPrice < 1 ? 10 : calcPrice;
			const amount = parseFloat((quantity * price).toFixed(2));

			data.push({ order, producer, province, district, village, grape, grapeColor, quantity, price, amount });
		}

		return data;
	}
}
