import * as v from 'valibot';
import * as input from '#lib/app/schemas/inputs/index.js';

// sys_settings tek kayıtlı (singleton) koleksiyondur: kayıt PocketBase panelinden bir kez oluşturulur, burada yalnızca güncellenir.
export const settingsFormSchema = v.object({
	...input.Hidden('id'),
	...input.Text('application_name', { required: false, max: 100 })
});
export type SettingsFormSchemaType = v.InferOutput<typeof settingsFormSchema>;
