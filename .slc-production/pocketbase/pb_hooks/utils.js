// PocketBase hook yardımcıları. Hook işleyicileri ayrı kapsamda çalıştığı için her işleyici bunu require ile alır:
// const utils = require(`${__hooks}/utils.js`);

/**
 * Türkçe arama için normalize (src/lib/utils/common.ts → normalizeStringForTurkishSearch ile AYNI sonucu vermeli;
 * tests/e2e/search-label.spec.ts iki kopyayı karşılaştırır).
 * Aksanlar ayrılıp silinir (ş→s, ö→o, İ→I), küçük harfe çevrilir, sonda ı→i. Sonda ı→i yapıldığı için küçük harfe
 * çevirmenin Türkçe yerel ayarla yapılıp yapılmaması sonucu değiştirmez (hook ortamında yerel ayar yok).
 */
function normalizeSearch(value) {
	return String(value ?? '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/ı/g, 'i');
}

const hasField = (record, name) => !!record.collection().fields.getByName(name);

// İlişkili kaydın label'ı (bulunamazsa boş)
function labelOf(app, collection, id) {
	if (!id) return '';
	try {
		return app.findRecordById(collection, id).getString('label');
	} catch {
		return '';
	}
}

/**
 * Kayıt kaydedilmeden önce: label'dan search_label (label ve search_label alanı olan tüm koleksiyonlar).
 * acl_permissions'ta label ilişkilerden üretilir: "Özne · Kaynak · İşlem" (özne: rol, kullanıcı ya da Herkes).
 */
function applyLabels(app, record) {
	if (record.collection().name === 'acl_permissions') {
		const subject = labelOf(app, 'acl_roles', record.getString('role')) || labelOf(app, 'sys_users', record.getString('user')) || 'Herkes';
		const resource = labelOf(app, 'acl_resources', record.getString('resource'));
		const action = labelOf(app, 'acl_actions', record.getString('action'));
		record.set('label', [subject, resource, action].join(' · '));
	}
	if (hasField(record, 'label') && hasField(record, 'search_label')) {
		record.set('search_label', normalizeSearch(record.getString('label')));
	}
}

module.exports = {
	hello: (name) => {
		console.log('Hello ' + name);
	},
	normalizeSearch,
	applyLabels
};
