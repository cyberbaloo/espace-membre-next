import { z } from "zod";

import { incubatorSchema } from "@/models/incubator";

export const incubatorUpdateSchema = z.object({
    title: incubatorSchema.shape.title,
    owner_id: incubatorSchema.shape.owner_id,
    contact: incubatorSchema.shape.contact,
    ghid: incubatorSchema.shape.ghid,
    address: incubatorSchema.shape.address,
    website: incubatorSchema.shape.website,
    github: incubatorSchema.shape.github,
    description: incubatorSchema.shape.description,
    short_description: incubatorSchema.shape.short_description,
});

export type incubatorUpdateSchemaType = z.infer<typeof incubatorUpdateSchema>;
