import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { BaseInfoUpdate } from "@/components/BaseInfoUpdatePage";
import { getAllStartups } from "@/lib/kysely/queries";
import { getUserInfos } from "@/lib/kysely/queries/users";
import s3 from "@/lib/s3";
import { userInfosToModel } from "@/models/mapper";
import { authOptions } from "@/utils/authoptions";

export const generateMetadata = async ({
    params: { id },
}: {
    params: { id: string };
}) => {
    const dbData = await getUserInfos({ username: id });

    return {
        title: `Mise à jour des infos de ${dbData?.fullname} / Espace Membre`,
    };
};

export default async function Page({
    params: { id },
}: {
    params: { id: string };
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    if (!session.user.isAdmin) {
        redirect(`/community/${id}`);
    }
    const s3Key = `members/${id}/avatar.jpg`;
    let hasImage = false;
    try {
        const s3Object = await s3
            .getObject({
                Key: s3Key,
            })
            .promise();
        hasImage = true;
    } catch (error) {
        console.log("No image for user");
    }
    const dbData = await getUserInfos({ username: id });
    const userInfos = userInfosToModel(dbData);

    const startups = await getAllStartups();
    const startupOptions = startups.map((startup) => ({
        value: startup.uuid,
        label: startup.name || "",
    }));
    if (!userInfos) {
        redirect("/errors");
    }

    // // todo: to make TS happy
    // const domaine = userInfos.domaine as DomaineSchemaType;
    // const memberType = userInfos.member_type as MemberType;

    const props = {
        formData: {
            member: {
                ...userInfos,
            },
        },
        profileURL: hasImage ? s3Key : undefined,
        startupOptions,
        username: id,
    };

    return <BaseInfoUpdate {...props} />;
}
