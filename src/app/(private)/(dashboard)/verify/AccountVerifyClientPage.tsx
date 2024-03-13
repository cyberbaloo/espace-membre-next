"use client";
import React from "react";

import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Checkbox from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import RadioButtons from "@codegouvfr/react-dsfr/RadioButtons";
import Select from "@codegouvfr/react-dsfr/Select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, useWatch } from "react-hook-form";

import { CreateMemberType } from "../community/create/CommunityCreateMemberPage";
import { MissionsEditor } from "@/components/BaseInfoUpdatePage/MissionsEditor";
import CitySelect from "@/components/CitySelect";
import CommunicationEmailSelect from "@/components/CommunicationEmailSelect";
import GenderSelect from "@/components/GenderSelect";
import SESelect from "@/components/SESelect";
import { userStatusOptions } from "@/frontConfig";
import { GenderCode, statusOptions } from "@/models/dbUser";
import {
    DOMAINE_OPTIONS,
    Domaine,
    completeMemberSchema,
    completeMemberSchemaType,
    memberSchema,
    memberSchemaType,
} from "@/models/member";
import { Status, missionSchema } from "@/models/mission";
import { useSession } from "@/proxies/next-auth";
import routes, { computeRoute } from "@/routes/routes";

// data from secretariat API
export interface AccountVerifyClientPageProps {
    startupOptions: {
        value: string;
        label: string;
    }[];
    formData: completeMemberSchemaType;
}

const postMemberData = async ({ values, sessionUsername }) => {
    try {
        const response = await fetch(
            computeRoute(routes.ACCOUNT_UPDATE_INFO_API).replace(
                ":username",
                sessionUsername
            ),
            {
                method: "PUT", // Specify the method
                body: JSON.stringify(values), // Convert the values object to JSON
                headers: {
                    "Content-Type": "application/json", // Specify the content type
                },
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const { username, message } = await response.json(); // Destructure the data from the response

        return { username, message }; // Return the username and message
    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        throw error; // Rethrow the error to be handled by the caller
    }
};

export default function AccountVerifyClientPage(
    props: AccountVerifyClientPageProps
) {
    const defaultValues: completeMemberSchemaType = {
        ...props.formData,
    };
    const {
        register,
        handleSubmit,
        formState: { errors, isDirty, isSubmitting, isValid },
        setValue,
        control,
    } = useForm<completeMemberSchemaType>({
        resolver: zodResolver(completeMemberSchema),
        mode: "onChange",
        defaultValues,
    });

    const session = useSession();

    const [alertMessage, setAlertMessage] = React.useState<{
        title: string;
        message: NonNullable<React.ReactNode>;
        type: "success" | "warning";
    } | null>();
    const [isSaving, setIsSaving] = React.useState(false);

    const onSubmit = async (input: completeMemberSchemaType) => {
        console.log("LCS HANDLE SUBMIT 0");
        if (isSaving) {
            return;
        }
        if (!isValid) {
            console.log("invalid");
            return;
        }
        setIsSaving(true);
        setAlertMessage(null);
        try {
            const { message } = await postMemberData({
                values: input,
                sessionUsername: session.data?.user?.name as string,
            });
            setAlertMessage({
                title: `Modifications enregistrées`,
                message,
                type: "success",
            });
        } catch (e: any) {
            // todo: sentry
            console.log(e);
            setAlertMessage({
                title: "Erreur",
                //@ts-ignore
                message: e.response?.data?.message || e.message,
                type: "warning",
            });
            //e.response.data.fieldErrors;
            setIsSaving(false);
            if (e.errors) {
                control.setError("root", {
                    //@ts-ignore
                    message: Object.values(e.errors).join("\n"),
                });
            }
        }
        document.body.scrollIntoView();
        setIsSaving(false);
    };

    const handleCitySelect = (newValue) => {
        if (newValue.isOSM) {
            setValue(`osm_city`, JSON.stringify(newValue), {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(`workplace_insee_code`, "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setValue(`workplace_insee_code`, newValue.value, {
                shouldValidate: true,
                shouldDirty: true,
            });
            setValue(`osm_city`, "", {
                shouldValidate: true,
                shouldDirty: true,
            });
        }
    };

    // const email = useWatch({
    //     control,
    //     name: `email`,
    // });
    // // Convertir la valeur de date en format de chaîne requis par l'input de type date

    // const isEmailBetaAsked = useWatch({
    //     control,
    //     name: `isEmailBetaAsked`,
    // });

    // const communication_email = useWatch({
    //     control,
    //     name: `communication_email`,
    // });
    console.log(errors);
    return (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}
                aria-label="Modifier mes informations"
            >
                <Input
                    label="Prénom Nom"
                    nativeInputProps={{
                        placeholder: "ex: HOPPER",
                        ...register("fullname"),
                    }}
                    state={errors.fullname ? "error" : "default"}
                    stateRelatedMessage={errors.fullname?.message}
                />
                <Input
                    label="Email"
                    nativeInputProps={{
                        placeholder: "ex: grace.hopper@gmail.com",
                        ...register("email"),
                    }}
                    state={errors.email ? "error" : "default"}
                    stateRelatedMessage={errors.email?.message}
                />
                {/* <Checkbox
                    hintText="L'adresse @beta.gouv.fr est obligatoire si
                                tu ne possédes pas déjà une adresse d'une
                                structure publique (@pole-emploi.fr,
                                @culture.gouv.fr...)"
                    options={[
                        {
                            label: "Je souhaite une adresse @beta.gouv.fr",
                            nativeInputProps: {
                                ...register("isEmailBetaAsked"),
                            },
                        },
                    ]}
                    state={errors["isEmailBetaAsked"] ? "error" : "default"}
                    stateRelatedMessage={errors.isEmailBetaAsked?.message}
                /> */}
                {/* {!!isEmailBetaAsked && (
                    <CommunicationEmailSelect
                        label="Tes préférences de communication"
                        hint="Sur quel email préfères-tu recevoir les
                                        communications beta.gouv.fr ? (Newsletter,
                                        Rappel de mise-à-jour de tes info, ...) Tu
                                        pourras changer ultérieurement."
                        email={email}
                        defaultValue={communication_email}
                        state={errors.communication_email ? "error" : "default"}
                        stateRelatedMessage={
                            errors.communication_email?.message
                        }
                        onChange={(e) => {
                            setValue("communication_email", e.value);
                        }}
                    />
                )} */}
                <h3>Mission</h3>
                <Select
                    label="Domaine"
                    nativeSelectProps={{
                        ...register(`domaine`),
                    }}
                    state={errors.domaine ? "error" : "default"}
                    stateRelatedMessage={errors.domaine?.message}
                >
                    <option value="">Domaine:</option>
                    {DOMAINE_OPTIONS.map((domaine) => (
                        <option key={domaine.key} value={domaine.name}>
                            {domaine.name}
                        </option>
                    ))}
                </Select>
                <MissionsEditor
                    control={control}
                    setValue={setValue}
                    register={register}
                    startupOptions={props.startupOptions}
                    errors={errors.missions || []}
                />
                <h3>Sur l'annuaire</h3>
                <Input
                    label="Courte bio"
                    nativeInputProps={{
                        placeholder: "ex: Grace",
                        ...register("bio"),
                    }}
                    state={errors.bio ? "error" : "default"}
                    stateRelatedMessage={errors.bio?.message}
                />
                <Input
                    label="Site personnel"
                    nativeInputProps={{
                        placeholder: "ex: HOPPER",
                        ...register("link"),
                    }}
                    state={errors.link ? "error" : "default"}
                    stateRelatedMessage={errors.link?.message}
                />
                <h3>Droits Github</h3>
                <Input
                    label="Github"
                    hintText="Indispensable pour les devs"
                    nativeInputProps={{
                        placeholder: "ex: HOPPER",
                        ...register("github"),
                    }}
                    state={errors.github ? "error" : "default"}
                    stateRelatedMessage={errors.github?.message}
                />
                <h3>Informations statistiques</h3>
                <p>
                    Cette information servent uniquement à des fins statistiques
                    pour l'observatoire de la communauté. Elles sont
                    anonymisées.
                </p>
                <GenderSelect
                    label="Genre"
                    nativeSelectProps={{
                        ...register("gender"),
                    }}
                    state={errors.gender ? "error" : "default"}
                    stateRelatedMessage={errors.gender?.message}
                />
                <CitySelect
                    onChange={handleCitySelect}
                    placeholder={"Commune ou code postal"}
                    state={errors.workplace_insee_code ? "error" : "default"}
                    stateRelatedMessage={errors.workplace_insee_code?.message}
                    defaultValue={""}
                />
                {/* <RadioButtons
                    legend="Statut legal de ton entreprise (obligatoire)"
                    options={statusOptions.map((legal_status) => ({
                        label: legal_status.name,
                        nativeInputProps: {
                            type: "radio",
                            // name: "legal_status",
                            value: legal_status.key,
                            // onChange: handleLegalStatusChange,
                            // checked:
                            //     legal_status.key ===
                            //     state.formData.legal_status,
                            // required: true,
                            ...register("legal_status"),
                            onChange: (e) => {
                                console.log(e.currentTarget.value)
                                setValue("leval_status", e.currentTarget.value)
                            }
                        },
                    }))}
                    state={errors.legal_status ? "error" : "default"}
                    stateRelatedMessage={errors.legal_status?.message}
                /> */}
                <Select
                    label="Statut"
                    nativeSelectProps={{
                        ...register(`legal_status`),
                    }}
                >
                    <option value="">Statut:</option>
                    {statusOptions.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.name}
                        </option>
                    ))}
                </Select>{" "}
                <Input
                    label="TJM moyen HT (si tu es indépendant)"
                    hintText="Cette information est utilisée uniquement pour
                                    faire des statistiques. Elle n'est pas affichée."
                    nativeInputProps={{
                        ...register("tjm", { valueAsNumber: true }),
                        type: "number",
                        // onChange: (e) => {
                        //     console.log(
                        //         typeof e.currentTarget.value,
                        //         parseInt(e.currentTarget.value)
                        //     );
                        //     setValue("tjm", parseInt(e.currentTarget.value));
                        // },
                    }}
                    state={errors.tjm ? "error" : "default"}
                    stateRelatedMessage={errors.tjm?.message}
                />
                <Input
                    label="Nombre de jours moyen travaillés par semaine"
                    hintText="Tu pourras changer plus tard"
                    nativeInputProps={{
                        ...register("average_nb_of_days", {
                            valueAsNumber: true,
                        }),

                        type: "number",
                        // defaultValue: state.formData.average_nb_of_days || 0,
                        // id: "averageNbOfDays",
                        // name: "average_nb_of_days",
                        // type: "number",
                        // step: "0.5",
                        // placeholder: "Nombre de jours moyen",
                        // min: 0,
                        // max: 5,
                    }}
                    state={errors.average_nb_of_days ? "error" : "default"}
                    stateRelatedMessage={errors.average_nb_of_days?.message}
                />
                <Button
                    className={fr.cx("fr-mt-3w")}
                    children={
                        isSubmitting
                            ? `Mise à jour en cours...`
                            : `Mettre à jour mes informations`
                    }
                    nativeButtonProps={{
                        type: "submit",
                        disabled: !isDirty || isSubmitting,
                    }}
                />
            </form>
        </>
    );
}
