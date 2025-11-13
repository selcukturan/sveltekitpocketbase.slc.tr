import { command, form, getRequestEvent, query } from '$app/server';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import {
	redirect,
	type Invalid,
	type RemoteCommand,
	type RemoteForm,
	type RemoteFormInput,
	type RemoteQueryFunction,
	type RequestEvent
} from '@sveltejs/kit';

const LOGINPAGE = '/login';

function isStandardSchema(schema: unknown): schema is StandardSchemaV1 {
	return typeof schema === 'object' && schema !== null && '~standard' in schema;
}

// -------------------------------------------------------------------------------------------------
// guardedQuery: Remote Query with auth guard
// -------------------------------------------------------------------------------------------------

export function guardedQuery<Schema extends StandardSchemaV1, Output>(
	schema: Schema,
	fn: (
		output: StandardSchemaV1.InferOutput<Schema>,
		auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }
	) => Promise<Output>
): RemoteQueryFunction<StandardSchemaV1.InferInput<Schema>, Promise<Output>>;

export function guardedQuery<Output>(
	fn: (auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }) => Promise<Output>
): RemoteQueryFunction<void, Promise<Output>>;

export function guardedQuery<Schema extends StandardSchemaV1, Output>(
	schemaOrFn: Schema | ((auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }) => Promise<Output>),
	maybeFn?: (
		output: StandardSchemaV1.InferOutput<Schema>,
		auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }
	) => Promise<Output>
) {
	// Handle the case with schema parameter (first overload)
	if (isStandardSchema(schemaOrFn) && typeof maybeFn === 'function') {
		return query(schemaOrFn, (output) => {
			const event = getRequestEvent();
			if (!event.locals.user) redirect(302, LOGINPAGE);
			return maybeFn(output, { user: event.locals.user, event });
		});
	}

	// Handle the case where there's no schema parameter (second overload)
	if (typeof schemaOrFn === 'function' && !maybeFn) {
		return query(() => {
			const event = getRequestEvent();
			if (!event.locals.user) redirect(302, LOGINPAGE);
			return schemaOrFn({ user: event.locals.user, event });
		});
	}

	throw new Error('Invalid arguments');
}

// -------------------------------------------------------------------------------------------------
// guardedForm: Remote Form with auth guard
// -------------------------------------------------------------------------------------------------

export function guardedForm<Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>, Output>(
	schema: Schema,
	fn: (
		output: StandardSchemaV1.InferOutput<Schema>,
		auth: {
			user: NonNullable<App.Locals['user']>;
			event: RequestEvent;
			invalid: Invalid<StandardSchemaV1.InferInput<Schema>>;
		}
	) => Promise<Output>
): RemoteForm<StandardSchemaV1.InferInput<Schema>, Output>;

export function guardedForm<Input extends RemoteFormInput, Output>(
	schema: 'unchecked',
	fn: (
		output: Input,
		auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent; invalid: Invalid<Input> }
	) => Promise<Output>
): RemoteForm<Input, Output>;

export function guardedForm<Output>(
	fn: (auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent; invalid: Invalid<void> }) => Promise<Output>
): RemoteForm<void, Output>;

export function guardedForm<
	Schema extends StandardSchemaV1<RemoteFormInput, Record<string, unknown>>,
	Input extends RemoteFormInput,
	Output
>(
	schemaOrFn:
		| 'unchecked'
		| Schema
		| ((auth: {
				user: NonNullable<App.Locals['user']>;
				event: RequestEvent;
				invalid: Invalid<void>;
		  }) => Promise<Output>),
	maybeFn?:
		| ((
				output: StandardSchemaV1.InferOutput<Schema>,
				auth: {
					user: NonNullable<App.Locals['user']>;
					event: RequestEvent;
					invalid: Invalid<StandardSchemaV1.InferInput<Schema>>;
				}
		  ) => Promise<Output>)
		| ((
				input: Input,
				auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent; invalid: Invalid<Input> }
		  ) => Promise<Output>)
) {
	// Handle the case with schema parameter (first overload)
	if (isStandardSchema(schemaOrFn) && typeof maybeFn === 'function') {
		const fn = maybeFn as (
			output: StandardSchemaV1.InferOutput<Schema>,
			auth: {
				user: NonNullable<App.Locals['user']>;
				event: RequestEvent;
				invalid: Invalid<StandardSchemaV1.InferInput<Schema>>;
			}
		) => Promise<Output>;
		return form(schemaOrFn, async (output, invalid) => {
			const event = getRequestEvent();
			if (!event.locals.user) redirect(302, LOGINPAGE);
			return await fn(output, { invalid, user: event.locals.user, event });
		});
	}

	// Handle the case with unchecked schema parameter (second overload)
	if (typeof schemaOrFn === 'string' && typeof maybeFn === 'function') {
		const fn = maybeFn as (
			input: Input,
			auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent; invalid: Invalid<Input> }
		) => Promise<Output>;
		return form(schemaOrFn, async (input: Input, invalid) => {
			const event = getRequestEvent();
			if (!event.locals.user) redirect(302, LOGINPAGE);
			return await fn(input, { invalid, user: event.locals.user, event });
		});
	}

	// Handle the case where there's no schema parameter (third overload)
	if (typeof schemaOrFn === 'function' && !maybeFn) {
		return form(async (invalid) => {
			const event = getRequestEvent();
			if (!event.locals.user) redirect(302, LOGINPAGE);
			return await schemaOrFn({ invalid, user: event.locals.user, event });
		});
	}

	throw new Error('Invalid arguments');
}

// -------------------------------------------------------------------------------------------------
// guardedCommand: Remote Command with auth guard
// -------------------------------------------------------------------------------------------------

export function guardedCommand<Schema extends StandardSchemaV1, Output>(
	schema: Schema,
	fn: (
		output: StandardSchemaV1.InferOutput<Schema>,
		auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }
	) => Promise<Output>
): RemoteCommand<StandardSchemaV1.InferInput<Schema>, Promise<Output | { redirect: string }>>;

export function guardedCommand<Input, Output>(
	fn: (input: Input, auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }) => Promise<Output>
): RemoteCommand<Input, Promise<Output | { redirect: string }>>;

export function guardedCommand<Schema extends StandardSchemaV1, Input, Output>(
	schemaOrFn:
		| Schema
		| ((input: Input, auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }) => Promise<Output>),
	maybeFn?: (
		output: StandardSchemaV1.InferOutput<Schema>,
		auth: { user: NonNullable<App.Locals['user']>; event: RequestEvent }
	) => Promise<Output>
) {
	// Handle the case with schema parameter (first overload)
	if (isStandardSchema(schemaOrFn) && typeof maybeFn === 'function') {
		return command(schemaOrFn, async (output) => {
			const event = getRequestEvent();
			if (!event.locals.user) return { redirect: LOGINPAGE };
			return await maybeFn(output, { user: event.locals.user, event });
		});
	}

	// Handle the case where there's no schema parameter (second overload)
	if (typeof schemaOrFn === 'function' && !maybeFn) {
		return command('unchecked', async (input: Input) => {
			const event = getRequestEvent();
			if (!event.locals.user) return { redirect: LOGINPAGE };
			return await schemaOrFn(input, { user: event.locals.user, event });
		});
	}

	throw new Error('Invalid arguments');
}
