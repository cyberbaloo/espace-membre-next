import { getAllChannels } from "@/lib/mattermost";
import config from "@/server/config";
import { format } from "date-fns/format";

export async function getResources(req, res) {
    let channels = await getAllChannels(config.mattermostTeamId);
    channels = channels.map((channel) => ({
        ...channel,
        last_post_at: `le ${format(
            new Date(channel.last_post_at),
            "dd/MM/yyyy"
        )}`,
    }));
    res.render("resource", {
        title: "Ressources",
        activeTab: "resources",
        currentUserId: req.auth.id,
        channels,
        errors: req.flash("error"),
        messages: req.flash("message"),
        isAdmin: config.ESPACE_MEMBRE_ADMIN.includes(req.auth.id),
        investigationReportsIframeURL: config.investigationReportsIframeURL,
    });
}
