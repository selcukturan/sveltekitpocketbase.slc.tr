import * as v from 'valibot';

export const loginSchema = v.object({
	email: v.pipe(v.string('invalid_data'), v.email('invalid_email'), v.nonEmpty('email_required')),
	_password: v.pipe(v.string('invalid_data'), v.nonEmpty('password_required'))
});
export type LoginSchemaType = v.InferOutput<typeof loginSchema>;
