# .slc-development notes

# Table Parent ID System

```sql
SELECT
t1.bao00_id AS bam00_bao00_id,
t5.bao00_name_t AS bam00_bao00_bolge,
t4.bao00_name_t AS bam00_bao00_il,
t3.bao00_name_t AS bam00_bao00_ilce,
t2.bao00_name_t AS bam00_bao00_koy,
t1.bao00_name_t AS bam00_bao00_mevkii
FROM bao00 t1
LEFT JOIN bao00 t2 ON t1.bao00_parent = t2.bao00_id
LEFT JOIN bao00 t3 ON t2.bao00_parent = t3.bao00_id
LEFT JOIN bao00 t4 ON t3.bao00_parent = t4.bao00_id
LEFT JOIN bao00 t5 ON t4.bao00_parent = t5.bao00_id
```

```js
if (newToken) {
	const now = Date.now();
	const diff = newExpDate - currentExpDate;
	console.log('ExpDate1', new Date(currentExpDate), 'currentExpDate');
	console.log('ExpDate2', new Date(newExpDate), 'newExpDate');
	console.log('Bir önceki istek', diff / 1000, 'saniye önce yapılmış.');
	console.log(
		'Oturumun sonlanmasına',
		currentExpDate - now,
		'milisaniye kalmıştı. Şu an',
		newExpDate - now,
		'milisaniye kaldı. Fark',
		newExpDate - now - (currentExpDate - now),
		'milisaniye. İki istek arasındaki fark.'
	);
	// const utcFixTreeHour = 3 * 60 * 60 * 1000; // 3 saatlik farkı milisaniyeye çevir
	const utcOffset = new Date().getTimezoneOffset(); // UTC offset'i dakika cinsinden al (-180 döner Türkiye için)
	const utcOffsetMs = -utcOffset * 60 * 1000; // Milisaniyeye çevir (3 saat = 180 dakika = 10800000 milisaniye)
	const cookieExpDate = newExpDate ? new Date(newExpDate + utcOffsetMs) : undefined;

	// Debug için konsola yaz
	console.log('UTC Offset (dakika):', utcOffset);
	console.log('UTC Offset (saat):', -utcOffset / 60);
	console.log('UTC Offset (ms):', utcOffsetMs);
	const date = new Date();
	console.log('Timezone Name:', Intl.DateTimeFormat().resolvedOptions().timeZone);
	console.log('Current Local Time:', date.toLocaleString('tr-TR'));
	console.log('Current UTC Time:', date.toUTCString());
	console.log('ISO String:', date.toISOString());

	console.log('### Server Timezone Debug ###');
	console.log('Process TZ:', process.env.TZ || 'not set');
	console.log('System TZ:', Intl.DateTimeFormat().resolvedOptions().timeZone);
	const istanbulDate = new Date(newExpDate).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' });
	console.log('Istanbul Time:', istanbulDate);

	// UTC'ye göre 3 saat gerideyiz. Şimdiki zamanın 2 saat sonrası için 5 saat ekleyerek cookie süresini uzatıyoruz.
	const utcFixTreeHour = 3 * 60 * 60 * 1000;
	console.log('utcFixTreeHour', utcFixTreeHour);
	const cookieExpDate = new Date(newExpDate + utcOffsetMs);
	console.log('cookieExpDate', cookieExpDate);
}
```
