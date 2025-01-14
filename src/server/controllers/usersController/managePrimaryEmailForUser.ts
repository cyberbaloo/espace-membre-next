import { addEvent } from "@/lib/events";
import { db } from "@/lib/kysely";
import * as mattermost from "@/lib/mattermost";
import { EventCode } from "@/models/actionEvent";
import config from "@/server/config";
import betagouv from "@betagouv";
import * as utils from "@controllers/utils";

export async function managePrimaryEmailForUserApi(req, res) {
    managePrimaryEmailForUserHandler(
        req,
        res,
        () => {
            res.json({
                success: true,
            });
        },
        () => {
            res.status(500).json({
                error: req.flash("error"),
            });
        }
    );
}

export async function managePrimaryEmailForUser(req, res) {
    const { username } = req.params;
    managePrimaryEmailForUserHandler(
        req,
        res,
        () => {
            res.redirect(`/community/${username}`);
        },
        () => {
            res.redirect(`/community/${username}`);
        }
    );
}

export async function managePrimaryEmailForUserHandler(
    req,
    res,
    onSuccess,
    onError
) {
    const { username } = req.params;
    const isCurrentUser = req.auth.id === username;
    const { primaryEmail } = req.body;
    const user = await utils.userInfos({ username }, isCurrentUser);
    try {
        if (!user.authorizations.canChangeEmails) {
            throw new Error(
                `L'utilisateur n'est pas autorisé à changer l'email primaire`
            );
        }
        const isPublicServiceEmail = await utils.isPublicServiceEmail(
            primaryEmail
        );
        if (!isPublicServiceEmail) {
            throw new Error(
                `L'email renseigné n'est pas un email de service public`
            );
        }

        if (user.userInfos.primary_email?.includes(config.domain)) {
            await betagouv.createRedirection(
                user.userInfos.primary_email,
                primaryEmail,
                false
            );
            try {
                await betagouv.deleteEmail(
                    user.userInfos.primary_email.split("@")[0]
                );
            } catch (e) {
                console.log(e, "Email is possibly already deleted");
            }
        } else {
            try {
                await mattermost.getUserByEmail(primaryEmail);
            } catch {
                throw new Error(
                    `L'email n'existe pas dans mattermost, pour utiliser cette adresse comme adresse principale ton compte mattermost doit aussi utiliser cette adresse.`
                );
            }
        }
        await db
            .updateTable("users")
            .where("username", "=", username)
            .set({
                primary_email: primaryEmail,
                username,
            })
            .execute();

        await addEvent({
            action_code: EventCode.MEMBER_PRIMARY_EMAIL_UPDATED,
            created_by_username: req.auth.id,
            action_on_username: username,
            action_metadata: {
                value: primaryEmail,
                old_value: user
                    ? user.userInfos.primary_email || undefined
                    : undefined,
            },
        });
        req.flash(
            "message",
            "Ton compte email primaire a bien été mis à jour."
        );
        console.log(`${req.auth.id} a mis à jour son adresse mail primaire.`);
        onSuccess();
    } catch (err) {
        console.error(err);
        if (err instanceof Error) {
            req.flash("error", err.message);
        }
        onError();
    }
}
