import db from ".";
import { Formation } from "@/models/formation";

interface CreateFormationProps
    extends Omit<
        Formation,
        | "id"
        | "created_at"
        | "updated_at"
        | "name"
        | "description"
        | "id"
        | "airtable_id"
        | "formation_date"
        | "is_embarquement"
        | "inscriptionLink"
        | "availableSeats"
    > {}
interface UpdateFormationProps
    extends Partial<
        Omit<
            Formation,
            | "id"
            | "created_at"
            | "updated_at"
            | "name"
            | "description"
            | "id"
            | "airtable_id"
            | "formation_date"
            | "is_embarquement"
            | "inscriptionLink"
            | "availableSeats"
        >
    > {}

export const createFormation = (
    props: CreateFormationProps
): Promise<Formation> => {
    return db("formations")
        .insert({
            ...props,
        })
        .returning("*")
        .then((res) => res[0]);
};

export const updateFormation = async (
    props: UpdateFormationProps,
    id: string
): Promise<void> => {
    console.log(props, id);
    await db("formations")
        .update({
            ...props,
        })
        .where({
            id,
        });
    return;
};

export const getFormation = (
    props: { airtable_id: string } | { id: string }
): Promise<Formation | undefined> => {
    return db("formations")
        .where({ ...props })
        .first();
};
