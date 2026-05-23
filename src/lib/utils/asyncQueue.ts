/**
 * AsyncQueue, JavaScript'in asenkron doğasında çok sık kullanılan,
 * Callback (Etkinlik tabanlı/Push) dünyası ile Generator (Akış tabanlı/Pull) dünyası arasında
 * kusursuz bir köprü (bridge) görevi gören son derece zarif bir tasarım desenidir (design pattern).
 */
export class AsyncQueue<T> {
	private queue: T[] = []; // Henüz tüketilmemiş (okunmamış) verilerin sıraya dizildiği dizi
	private resolvers: ((value: T) => void)[] = []; // Gelecekte gelecek veriyi bekleyen Promise'lerin "çözücü" fonksiyon listesi

	push(value: T) {
		// SENARYO A: Şu anda "veri bekleyen" biri (generator) var mı?
		if (this.resolvers.length > 0) {
			const resolve = this.resolvers.shift(); // Bekleme listesindeki en eski Promise çözücüyü al.
			resolve?.(value); // Vaadi (Promise) yeni veriyle çöz ve bekleyen generator'ı uyandır!
		} else {
			// SENARYO B: Kimse veri beklemiyor (tüketici henüz hazır değil veya meşgul).
			this.queue.push(value); // Veriyi daha sonra okunmak üzere kuyruk dizisine ekle.
		}
	}

	async next(): Promise<T> {
		// SENARYO A: Zaten içeride bekleyen bir veri var mı?
		if (this.queue.length > 0) {
			return this.queue.shift()!; // Sıradaki en eski veriyi kuyruktan çıkar ve anında teslim et.
		}

		// SENARYO B: Kuyruk boş, yeni bir verinin gelmesini beklemek zorundayız.
		return new Promise<T>((resolve) => {
			this.resolvers.push(resolve); // Promise'i hemen çözmek yerine, "resolve" tetikleyici fonksiyonunu listeye kaydet.
		});
	}
}
