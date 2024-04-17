"use client";
import React from "react";

import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup";
import { Input } from "@codegouvfr/react-dsfr/Input";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface Props {
    errors: any[];
    messages: string;
    domain: string;
    next: string;
}

/* Pure component */
export const LoginPage = function (props: Props) {
    const [formErrors, setFormErrors] = React.useState<string>();
    const [email, setEmail] = React.useState("");
    const [isSaving, setIsSaving] = React.useState<boolean>(false);
    const [alertMessage, setAlertMessage] = React.useState<{
        message: string;
        type: "success" | "warning";
        description?: string;
    } | null>();

    const sendLogin = async (event: { preventDefault: () => void }) => {
        if (isSaving) {
            return;
        }
        event.preventDefault();
        setFormErrors("");
        setIsSaving(true);
        setAlertMessage(null);
        try {
            const data = await signIn("email", { email, redirect: false });
            console.log(data);
            setIsSaving(false);

            if (data && data.error) {
                setIsSaving(false);
                setFormErrors(data.error);
            } else if (data && data.ok && !data.error) {
                setAlertMessage({
                    message:
                        "Un email avec un lien de connexion a été envoyé à ton adresse.",
                    type: "success",
                });
            }
        } catch (e) {
            setIsSaving(false);

            console.log("LCS ERROR", e);
        }
    };

    return (
        <>
            <div className={fr.cx("fr-grid-row", "fr-m-4w")}>
                {!!alertMessage && (
                    <Alert
                        className="fr-mb-8v"
                        severity={alertMessage.type}
                        closable={false}
                        description={alertMessage.description}
                        title={alertMessage.message}
                    />
                )}

                <div className={fr.cx("fr-col-md-6")}>
                    <h1
                        className={fr.cx("fr-mb-1v")}
                        style={{
                            color: "var(--text-action-high-blue-france)",
                        }}
                    >
                        Espace membre
                    </h1>
                    <p
                        className={fr.cx("fr-text--bold", "fr-text--bold")}
                        style={{
                            color: "var(--text-action-high-blue-france)",
                        }}
                    >
                        de la communauté beta.gouv.fr
                    </p>
                    <ul style={{ listStyleType: "none" }}>
                        <li>
                            <span
                                style={{
                                    color: "var(--text-action-high-blue-france)",
                                    marginRight: "1rem",
                                }}
                            >
                                ✔
                            </span>{" "}
                            pour gérer ses{" "}
                            <strong>informations personnelles</strong>
                        </li>
                        <li>
                            <span
                                style={{
                                    color: "var(--text-action-high-blue-france)",
                                    marginRight: "1rem",
                                }}
                            >
                                ✔
                            </span>{" "}
                            pour publier sa <strong>fiche produit</strong>
                        </li>
                        <li>
                            <span
                                style={{
                                    color: "var(--text-action-high-blue-france)",
                                    marginRight: "1rem",
                                }}
                            >
                                ✔
                            </span>{" "}
                            pour <strong>se former</strong> et accéder aux{" "}
                            <strong>actualités</strong>
                        </li>
                    </ul>
                    <img
                        src="/static/images/home-illustration.png"
                        alt=""
                        width={300}
                    />
                </div>
                <div className={fr.cx("fr-col-md-6")}>
                    <form
                        onSubmit={sendLogin}
                        method="POST"
                        id="login_form"
                        style={{
                            padding: "4rem",
                            backgroundColor:
                                fr.colors.decisions.background.alt.blueFrance
                                    .default,
                        }}
                    >
                        <fieldset
                            className="fr-fieldset"
                            id="login-1760-fieldset"
                            aria-labelledby="login-1760-fieldset-legend login-1760-fieldset-messages"
                        >
                            <legend
                                className="fr-fieldset__legend"
                                id="login-1760-fieldset-legend"
                            >
                                <h3>Me connecter</h3>
                            </legend>
                            {!!props.messages.length && (
                                <div
                                    className="notification"
                                    dangerouslySetInnerHTML={{
                                        __html: props.messages,
                                    }}
                                ></div>
                            )}
                        </fieldset>
                        <Input
                            hintText="Email en @beta.gouv.fr ou email secondaire"
                            label="Mon email"
                            nativeInputProps={{
                                type: "email",
                                placeholder: "prenom.nom@beta.gouv.fr",
                                onChange: (e) => setEmail(e.target.value),
                                required: true,
                            }}
                            state={formErrors ? "error" : "default"}
                            stateRelatedMessage={formErrors}
                        />
                        <ButtonsGroup
                            buttons={[
                                {
                                    children: isSaving
                                        ? "Envoi du lien de connexion..."
                                        : "Recevoir le lien de connexion",
                                    onClick: () => {},
                                    disabled: isSaving,
                                    type: "submit",
                                },
                            ]}
                        />
                        <hr />
                        <h4 className={fr.cx("fr-mb-1w")}>Besoin d'aide ?</h4>
                        <p className={fr.cx("fr-text--xs")}>
                            Si tu n'arrives pas à te connecter, consulte cette
                            page pour savoir ce qu'il se passe :{" "}
                            <Link href="/keskispasse">/keskispasse</Link>
                        </p>
                    </form>
                </div>
            </div>
            <div
                className={fr.cx("fr-grid-row")}
                style={{ border: "1px solid #ccc", width: "100%" }}
            >
                <div className={fr.cx("fr-col-md-12", "fr-p-2w")}>
                    <h3>Accueillir une nouvelle recrue ?&nbsp;👋</h3>
                    <p className="fr-text--sm">
                        La création d'une nouvelle fiche membre doit être
                        initiée <strong>par une personne déjà membre</strong> de
                        la communauté beta.gouv.fr.
                    </p>
                </div>
            </div>
        </>
    );
};
