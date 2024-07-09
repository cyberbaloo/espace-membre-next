import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { StartupFiles } from "@/components/StartupFiles";
import { authOptions } from "@/utils/authoptions";
import { routeTitles } from "@/utils/routes/routeTitles";
import { getStartupFiles } from "@/app/api/startups/get-startup-files";
import { getStartup } from "@/app/api/startups/actions";

type Props = {
    params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    // read route params
    const id = params.id;
    return {
        title: `${routeTitles.startupDocs(id)} / Espace Membre`,
    };
}

export default async function Page(props) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }
    const uuid = props.params.id;

    const startup = await getStartup({ uuid });
    const files = await getStartupFiles({ uuid });

    return (
        <div>
            <h1>Fichiers de {startup.name}</h1>
            <StartupFiles startup={startup} files={files} />
        </div>
    );
}
