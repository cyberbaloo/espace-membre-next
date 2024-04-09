import z from "zod";

export const LdapUserSchema = z.object({
    dn: z.string(),
    objectClass: z.literal("inetOrgPerson"),
    cn: z.string(),
    givenName: z.string(),
    sn: z.string(),
});
export type LdapUserSchemaType = z.infer<typeof LdapUserSchema>;

export const LdapCalendarSchema = z.object({
    dn: z.string(),
    objectClass: z.literal("groupOfNames"),
    cn: z.string(),
    description: z.string(),
    member: z.string().or(z.array(z.string())),
});
export type LdapCalendarSchemaType = z.infer<typeof LdapCalendarSchema>;

export const UserSchema = z.object({
    id: z
        .string()
        .min(1)
        .max(100)
        .regex(new RegExp("^[a-z0-9]+(?:[-.][a-z0-9]+)*$")), // So `jean-pierre.doe` is valid
    firstname: z.string(),
    lastname: z.string(),
    initialTemporaryPassword: z.string().optional(),
});
export type UserSchemaType = z.infer<typeof UserSchema>;

export const LiteUserSchema = UserSchema.pick({
    id: true,
    firstname: true,
    lastname: true,
});
export type LiteUserSchemaType = z.infer<typeof LiteUserSchema>;

export const CalendarSchema = z.object({
    id: z
        .string()
        .min(1)
        .max(100)
        .regex(new RegExp("^[a-z0-9]+(?:[-./][a-z0-9]+)*$")), // So `startup/project-a` is valid
    name: z.string(),
    userIds: z.array(z.string()),
});
export type CalendarSchemaType = z.infer<typeof CalendarSchema>;

export const LiteCalendarSchema = CalendarSchema;
export type LiteCalendarSchemaType = z.infer<typeof LiteCalendarSchema>;
