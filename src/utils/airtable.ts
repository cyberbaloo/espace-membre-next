import { Formation, formationSchema } from "@/models/formation";
import { FieldSet, Record } from "airtable";

export const airtableRecordToFormation = (
    record: Record<FieldSet>
): Formation => {
    const image = record.fields["Image"];

    const item = {
        id: record.fields["Record ID"],
        airtable_id: record.fields["Record ID"],
        description: record.fields["Description"],
        name: record.fields["Formation"],
        imageUrl: image ? image[0].thumbnails.full.url : undefined,
        created_at: new Date(record.fields["Created"] as string), // Make sure this is the correct field for "created_at"
        formation_date: new Date(record.fields["Début"] as string),
        formation_type: record.fields["formationTypeName"]
            ? (record.fields["formationTypeName"] as string[])[0]
            : undefined,
        formation_type_airtable_id: record.fields["formationType"]
            ? (record.fields["formationType"] as string[])[0]
            : undefined,
        is_embarquement: record.fields["embarquement"] === "true",
        audience: record.fields["Audience"],
        category: record.fields["Catégorie"],
        start: new Date(record.fields["Début"] as string),
        end: new Date(record.fields["Fin"] as string),
        animatorEmail: record.fields["Email organisateur"]
            ? record.fields["Email organisateur"]
            : undefined,
        googleAgendaEvent: record.fields["Google Calendar Event ID"],
        startDate: new Date(record.fields["Début"] as string),
        startTime: record.fields["Heure début"],
        inscriptionLink: record.fields["preselectedInscriptionLink"],
        availableSeats: record.fields["Place restantes en chiffre"],
        maxSeats: record.fields["Max participants"],
        // Make sure to adjust all other fields similarly
    };

    return formationSchema.parse(item);
};
