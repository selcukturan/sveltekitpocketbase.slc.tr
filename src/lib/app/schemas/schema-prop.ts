import type { ErrorMessage, ObjectEntries, ObjectIssue, ObjectSchema } from 'valibot';

type GenericValibotObject = ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>;

export type SchemaProp = GenericValibotObject;
