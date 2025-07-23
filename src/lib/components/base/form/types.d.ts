// https://github.com/matheustavarestrindade/svelte-valibot-form/blob/main/src/lib/components/ValibotForm.svelte
import type { ErrorMessage, InferInput, InferOutput, ObjectEntries, ObjectIssue, ObjectSchema } from 'valibot';

export type GenericValibotObject = ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>;

export type PartialSchemaError<Schema extends GenericValibotObject> = Partial<{
	[K in keyof InferInput<Schema>]?: string | undefined;
}>;

/* type PartialSchemaDefaultValues<Schema extends GenericValibotObject> = Partial<{
	[K in keyof InferInput<Schema>]: InferOutput<Schema>[K];
}>;

export interface ValibotErrorContext<Schema extends GenericValibotObject> {
	errors?: PartialSchemaError<Schema>;
	defaultValues?: PartialSchemaDefaultValues<Schema>;
}

export type ValibotErrorKey<Schema extends GenericValibotObject> = keyof InferInput<Schema>; */
