import { CalendarSchemaType, UserSchemaType } from "@schedulers/ldap/models";

export const users: UserSchemaType[] = [
    {
        id: "thomas.rame",
        firstname: "Thomas",
        lastname: "Ramé",
    },
    {
        id: "lucas.charrier",
        firstname: "Lucas",
        lastname: "Charrier",
    },
    {
        id: "julien.bouquillon",
        firstname: "Julien",
        lastname: "Bouquillon",
    },
    {
        id: "julien.dauphant",
        firstname: "Julien",
        lastname: "Dauphant",
    },
];

export const calendars: CalendarSchemaType[] = [
    {
        id: "betagouv/events",
        name: "Événements beta.gouv",
        userIds: [
            "thomas.rame",
            "lucas.charrier",
            "julien.bouquillon",
            "julien.dauphant",
        ],
    },
    {
        id: "betagouv/transverse",
        name: "Équipe animation",
        userIds: ["thomas.rame", "lucas.charrier", "julien.bouquillon"],
    },
    {
        id: "anct/mediature",
        name: "Médiature",
        userIds: ["thomas.rame"],
    },
];
