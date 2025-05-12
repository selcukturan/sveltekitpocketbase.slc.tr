import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const schema = zfd.formData({
	text_optional: zfd.text(z.string().optional())
});

export type Schema = z.infer<typeof schema>;
