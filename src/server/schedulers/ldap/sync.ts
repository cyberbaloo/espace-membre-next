import { Attribute, Change, Client, DN, InvalidCredentialsError } from "ldapts";
import {
    CalendarSchemaType,
    LdapCalendarSchema,
    LdapUserSchema,
    LiteCalendarSchema,
    LiteCalendarSchemaType,
    LiteUserSchema,
    LiteUserSchemaType,
    UserSchemaType,
} from "@schedulers/ldap/models";
import { formatDiffResultLog, getDiff } from "@schedulers/ldap/helpers";

export async function syncLdapEntitiesFromDatabase() {
    // TODO: ... get from database

    await syncLdapEntities([], []);
}

export async function syncLdapEntities(
    users: UserSchemaType[],
    calendars: CalendarSchemaType[]
) {
    const client = new Client({
        url: `ldaps://${process.env.LDAP_HOST}`,
        timeout: 0,
        connectTimeout: 0,
        tlsOptions: {
            minVersion: "TLSv1.2",
        },
        strictDN: true,
    });

    try {
        await client.bind(
            process.env.LDAP_USER || "",
            process.env.LDAP_PASSWORD || ""
        );

        const organizationDN = new DN({
            ou: "betagouv",
        });
        if (
            typeof process.env.LDAP_ROOT_NODE_DN === "string" &&
            !!process.env.LDAP_ROOT_NODE_DN
        ) {
            process.env.LDAP_ROOT_NODE_DN.split(",").forEach((rdn: string) => {
                const [key, value] = rdn.split("=");

                organizationDN.addPairRDN(key, value);
            });
        }

        // [WORKAROUND] `.clone()` not working properly https://github.com/ldapts/ldapts/issues/149
        const usersDN = new DN({ ou: "users" }).addRDNs(organizationDN);
        const calendarsDN = new DN({ ou: "calendars" }).addRDNs(organizationDN);

        const wantedLiteUsers = new Map<
            LiteUserSchemaType["id"],
            LiteUserSchemaType
        >();
        users.forEach((user) => {
            wantedLiteUsers.set(
                user.id,
                LiteUserSchema.parse({
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                })
            );
        });

        const wantedLiteCalendars = new Map<
            LiteCalendarSchemaType["id"],
            LiteCalendarSchemaType
        >();
        calendars.forEach((calendar) => {
            wantedLiteCalendars.set(
                calendar.id,
                LiteCalendarSchema.parse({
                    id: calendar.id,
                    name: calendar.name,
                    userIds: calendar.userIds,
                })
            );
        });

        const ldapUsersResult = await client.search(usersDN, {
            scope: "one",
        });

        const ldapLiteUsers: typeof wantedLiteUsers = new Map();
        for (const entry of ldapUsersResult.searchEntries) {
            const entryUser = LdapUserSchema.parse(entry);

            ldapLiteUsers.set(
                entryUser.cn,
                LiteUserSchema.parse({
                    id: entryUser.cn,
                    firstname: entryUser.givenName,
                    lastname: entryUser.sn,
                })
            );
        }

        const ldapCalendarsResult = await client.search(calendarsDN, {
            scope: "one",
        });

        const ldapLiteCalendars: typeof wantedLiteCalendars = new Map();
        for (const entry of ldapCalendarsResult.searchEntries) {
            const entryCalendar = LdapCalendarSchema.parse(entry);

            const memberDNs =
                typeof entryCalendar.member === "string"
                    ? [entryCalendar.member]
                    : entryCalendar.member;

            ldapLiteCalendars.set(
                entryCalendar.cn,
                LiteCalendarSchema.parse({
                    id: entryCalendar.cn,
                    name: entryCalendar.description,
                    userIds: memberDNs.map((memberDN) => {
                        // No library way to parse the DN with `DN` class
                        return memberDN.split(",")[0].substring("cn=".length);
                    }),
                })
            );
        }

        const usersDiffResult = getDiff(ldapLiteUsers, wantedLiteUsers);
        const calendarsDiffResult = getDiff(
            ldapLiteCalendars,
            wantedLiteCalendars
        );

        console.log(
            `synchronizing users into the LDAP (${formatDiffResultLog(
                usersDiffResult
            )})`
        );
        console.log(
            `synchronizing calendars into the LDAP (${formatDiffResultLog(
                calendarsDiffResult
            )})`
        );

        console.log(usersDiffResult);
        console.log(calendarsDiffResult);

        // To not mess with association with add/delete in the right order (calendars use users)
        // 1. Remove calendars first, then users
        // 2. Update users
        // 3. Add users first, then calendars
        // 4. Update calendars (after since it may rely on removed or added users)

        for (const deletedLiteCalendar of calendarsDiffResult.removed) {
            const calendarDN = new DN({ cn: deletedLiteCalendar.id }).addRDNs(
                calendarsDN
            );

            await client.del(calendarDN);
        }

        for (const deletedLiteUser of usersDiffResult.removed) {
            const userDN = new DN({ cn: deletedLiteUser.id }).addRDNs(usersDN);

            await client.del(userDN);
        }

        for (const updatedLiteUser of usersDiffResult.updated) {
            const userDN = new DN({ cn: updatedLiteUser.id }).addRDNs(usersDN);

            await client.modify(userDN, [
                new Change({
                    operation: "replace",
                    modification: new Attribute({
                        type: "givenName",
                        values: [updatedLiteUser.firstname],
                    }),
                }),
                new Change({
                    operation: "replace",
                    modification: new Attribute({
                        type: "sn",
                        values: [updatedLiteUser.lastname],
                    }),
                }),
                // TODO: initial password?
            ]);
        }

        for (const addedLiteUser of usersDiffResult.added) {
            const userDN = new DN({ cn: addedLiteUser.id }).addRDNs(usersDN);

            await client.add(userDN, {
                cn: addedLiteUser.id,
                objectclass: ["inetOrgPerson"],
                givenName: addedLiteUser.firstname,
                surname: addedLiteUser.lastname,
                // TODO: initial password?
            });
        }

        for (const addedLiteCalendar of calendarsDiffResult.added) {
            const calendarDN = new DN({ cn: addedLiteCalendar.id }).addRDNs(
                calendarsDN
            );

            await client.add(calendarDN, {
                cn: addedLiteCalendar.id,
                objectclass: ["groupOfNames"],
                description: addedLiteCalendar.name,
                member: addedLiteCalendar.userIds.map((userId) => {
                    return new DN({ cn: userId }).addRDNs(usersDN).toString();
                }),
            });
        }

        for (const updatedLiteCalendar of calendarsDiffResult.updated) {
            const calendarDN = new DN({ cn: updatedLiteCalendar.id }).addRDNs(
                calendarsDN
            );

            await client.modify(calendarDN, [
                new Change({
                    operation: "replace",
                    modification: new Attribute({
                        type: "description",
                        values: [updatedLiteCalendar.name],
                    }),
                }),
                new Change({
                    operation: "replace",
                    modification: new Attribute({
                        type: "member",
                        values: updatedLiteCalendar.userIds.map((userId) => {
                            return new DN({ cn: userId })
                                .addRDNs(usersDN)
                                .toString();
                        }),
                    }),
                }),
            ]);
        }

        console.log(`synchronizations have been done with success`);
    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            console.log(error);
        }

        throw error;
    } finally {
        await client.unbind();
    }
}
