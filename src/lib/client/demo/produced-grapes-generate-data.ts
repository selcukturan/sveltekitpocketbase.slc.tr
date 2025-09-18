import { browser } from '$app/environment';
import type { ProducedGrapes } from './produced-grapes-schema';

export function generateProducedData(count: number) {
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
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Develler',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Süller',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Süller',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Bağpınar',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Hançalar',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Hançalar',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Üzümlü',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Selcen',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Niksar',
			village: 'Gökçeli',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Bahadınlar',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Bahadınlar',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Develler',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Mürefte',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Koruk',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Pirinçci',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Ege',
			province: 'İzmir',
			district: 'Menderes',
			village: 'Merkez',
			grape: 'Misket',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Viognier',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Cabernet Saugvignon',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Merkez',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Doğanyurt',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Kayapınar',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Nevşehir',
			district: 'Ürgüp',
			village: 'Sofular',
			grape: 'Emir',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Bekilli',
			village: 'Yeşiloba',
			grape: 'Boğazkere',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Sofuköy',
			grape: 'Gamay',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Sofuköy',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Tepte',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Mürefte',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Boğazkere',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Cabernet Franc',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Cabernet Saugvignon',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Fiano',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Grenache Noir',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Malbec',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Misket',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Pinot Noir',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Petit Verdot',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Tempranillo',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Viognier',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Cabernet Franc',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Kuntra',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Misket',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Petit Verdot',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Merkez',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Çakırlar',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Akkent',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Kara Lahana',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Zinfandel',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Ortaçeşme',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Ortaçeşme',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Ortaçeşme',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Çatalharman',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Arapgir',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Merkez',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Kuyucak',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Kayapınar',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Selcen',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Gelibolu',
			village: 'Çokal',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Ortaköy',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Saraycık',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Niksar',
			village: 'Gözpınar',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Merkez',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Ankara',
			district: 'Kalecik',
			village: 'Merkez',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Kılıçlı',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Yeniköy',
			grape: 'Cabernet Franc',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Yeniköy',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Araplı',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Araplı',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Yabanlı',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Sofuköy',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Güllü',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Salkımören',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Muratçık',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Merkez',
			grape: 'Gamay',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Diyarbakır',
			district: 'Çermik',
			village: 'Kuyu',
			grape: 'Boğazkere',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Nevşehir',
			district: 'Ürgüp',
			village: 'Karakaya',
			grape: 'Emir',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Güllü',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Haylamaz',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Haylamaz',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Yazılı',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Merkez',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Hozik',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Pağnik',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Alicante',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Ankara',
			district: 'Kalecik',
			village: 'Buğra',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Denizli',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Mürefte',
			grape: 'Gamay',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Ankara',
			district: 'Kalecik',
			village: 'Akkuzulu',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Haylamaz',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Aşağıçeşme',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Aşağıçeşme',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arguvan',
			village: 'Çakırsu',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		}
	];

	const data: ProducedGrapes[] = [];

	for (let i = 1; i <= count; i++) {
		const randomProducerName =
			producerName[Math.floor(Math.random() * producerName.length)];
		const randomProducerSurname =
			producerSurname[Math.floor(Math.random() * producerSurname.length)];
		const randomRegionAndGrape =
			regionAndGrape[Math.floor(Math.random() * regionAndGrape.length)];

		let subtotal: string = '';
		if (i % 6 === 0) {
			const subtotals = ['subtotal1', 'subtotal2', 'subtotal3'];
			subtotal = subtotals[Math.floor(Math.random() * subtotals.length)];
		}
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

		data.push({
			subtotal,
			order,
			producer,
			province,
			district,
			village,
			grape,
			grapeColor,
			quantity,
			price,
			amount
		});
	}

	return data;
}

function generateRandomId() {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < 15; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

export function generateProducedData2(count: number) {
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
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Develler',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Süller',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Süller',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Bağpınar',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Hançalar',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Hançalar',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Üzümlü',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Selcen',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Niksar',
			village: 'Gökçeli',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Bahadınlar',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Bahadınlar',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Develler',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Mürefte',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Koruk',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Merkez',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Pirinçci',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Ege',
			province: 'İzmir',
			district: 'Menderes',
			village: 'Merkez',
			grape: 'Misket',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Viognier',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Cabernet Saugvignon',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Merkez',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Doğanyurt',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Kayapınar',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Nevşehir',
			district: 'Ürgüp',
			village: 'Sofular',
			grape: 'Emir',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Bekilli',
			village: 'Yeşiloba',
			grape: 'Boğazkere',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Sofuköy',
			grape: 'Gamay',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Sofuköy',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Tepte',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Mürefte',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Boğazkere',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Cabernet Franc',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Cabernet Saugvignon',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Fiano',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Grenache Noir',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Malbec',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Misket',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Pinot Noir',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Petit Verdot',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Tempranillo',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Keklikli',
			grape: 'Viognier',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Cabernet Franc',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Kuntra',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Misket',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Petit Verdot',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Merkez',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Çakırlar',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Akkent',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Kara Lahana',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Zinfandel',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Ortaçeşme',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Ortaçeşme',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Ortaçeşme',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Çatalharman',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Arapgir',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Merkez',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Kuyucak',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Kayapınar',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Selcen',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Parmaksızlar',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Chardonnay',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Gelibolu',
			village: 'Çokal',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Ortaköy',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Saraycık',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Niksar',
			village: 'Gözpınar',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Merkez',
			grape: 'Sultaniye',
			grapeColor: 'White'
		},
		{
			region: 'İç Anadolu',
			province: 'Ankara',
			district: 'Kalecik',
			village: 'Merkez',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Kılıçlı',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Yeniköy',
			grape: 'Cabernet Franc',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Yeniköy',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Araplı',
			grape: 'Merlot',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Araplı',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Yabanlı',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Sofuköy',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Güllü',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Tokat',
			district: 'Erbaa',
			village: 'Salkımören',
			grape: 'Narince',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Muratçık',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Merkez',
			grape: 'Gamay',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Diyarbakır',
			district: 'Çermik',
			village: 'Kuyu',
			grape: 'Boğazkere',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Nevşehir',
			district: 'Ürgüp',
			village: 'Karakaya',
			grape: 'Emir',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Uşak',
			district: 'Eşme',
			village: 'Güllü',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Haylamaz',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Haylamaz',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Yazılı',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Çal',
			village: 'Merkez',
			grape: 'Çal Karası',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Elazığ',
			district: 'Merkez',
			village: 'Hozik',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Pağnik',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Çanakkale',
			district: 'Bozcaada',
			village: 'Merkez',
			grape: 'Alicante',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Ankara',
			district: 'Kalecik',
			village: 'Buğra',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Adıgüzeller',
			grape: 'Syrah',
			grapeColor: 'Red'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arapgir',
			village: 'Denizli',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		},
		{
			region: 'Marmara',
			province: 'Tekirdağ',
			district: 'Şarköy',
			village: 'Mürefte',
			grape: 'Gamay',
			grapeColor: 'Red'
		},
		{
			region: 'İç Anadolu',
			province: 'Ankara',
			district: 'Kalecik',
			village: 'Akkuzulu',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Haylamaz',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Aşağıçeşme',
			grape: 'Kalecik Karası',
			grapeColor: 'Red'
		},
		{
			region: 'İç Ege',
			province: 'Denizli',
			district: 'Güney',
			village: 'Aşağıçeşme',
			grape: 'Sauvignon Blanc',
			grapeColor: 'White'
		},
		{
			region: 'Doğu Anadolu',
			province: 'Malatya',
			district: 'Arguvan',
			village: 'Çakırsu',
			grape: 'Öküzgözü',
			grapeColor: 'Red'
		}
	];

	const data: any[] = [];

	for (let i = 1; i <= count; i++) {
		const randomProducerName =
			producerName[Math.floor(Math.random() * producerName.length)];
		const randomProducerSurname =
			producerSurname[Math.floor(Math.random() * producerSurname.length)];
		const randomRegionAndGrape =
			regionAndGrape[Math.floor(Math.random() * regionAndGrape.length)];

		const id = generateRandomId();
		const order = i;
		const kn = 0;
		const kt = '';
		const active = true;
		const purchase_date = '2025-09-18 12:00:00.000Z';
		const producer = `${randomProducerName} ${randomProducerSurname}`;
		const region = randomRegionAndGrape.region;
		const province = randomRegionAndGrape.province;
		const district = randomRegionAndGrape.district;
		const village = randomRegionAndGrape.village;
		const grape = randomRegionAndGrape.grape;
		const grape_color = randomRegionAndGrape.grapeColor;
		const calcQuantity = Math.floor(Math.random() * 10000);
		const calcPrice = parseFloat((Math.random() * 10).toFixed(2));
		const quantity = calcQuantity === 0 ? 1000 : calcQuantity;
		const price = calcPrice < 1 ? 10 : calcPrice;
		const amount = parseFloat((quantity * price).toFixed(2));

		data.push({
			id,
			order,
			kn,
			kt,
			purchase_date,
			producer,
			region,
			province,
			district,
			village,
			grape,
			grape_color,
			quantity,
			price,
			amount,
			active
		});
	}

	return data;
}
