"use client";

import React from "react";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import axios from "axios";
import Link from "next/link";
import {
    ReactTabulator,
    ColumnDefinition,
    reactFormatter,
} from "react-tabulator";

import { CommunityProps } from ".";
import { CompetencesEditor } from "../BaseInfoUpdatePage/CompetencesEditor";
import DomaineSelect from "../DomaineSelect";
import MemberStatusSelect from "../MemberStatusSelect";
import SEIncubateurSelect from "../SEIncubateurSelect";
import SEPhaseSelect from "../SEPhaseSelect";
import SESelect from "../SESelect";

import "react-tabulator/lib/styles.css"; // required styles
import "react-tabulator/lib/css/tabulator.min.css"; // theme
import { computeRoute } from "@/routes/routes";

function EmailLink(props: any) {
    const cellValue = props.cell._cell.value; //|| "Edit | Show";
    return <a href={`mailto:${cellValue}`}>{cellValue}</a>;
}

function MemberLink(props: any) {
    const cellValue = props.cell._cell.value; //|| "Edit | Show";
    const username = props.cell._cell.row.data.username;
    return <Link href={`/community/${username}`}>{cellValue}</Link>;
}

const columns: ColumnDefinition[] = [
    {
        title: "email",
        field: "primary_email",
        width: 150,
        formatter: reactFormatter(<EmailLink />),
    },
    {
        title: "fullname",
        field: "fullname",
        width: 150,
        formatter: reactFormatter(<MemberLink />),
        // (props) => (
        //     <Link href={`/community/xxx`}>{props.cellValue}</Link>
        // )),
    },
    { title: "startups", field: "startups", hozAlign: "center" },
    { title: "domaine", field: "domaine", hozAlign: "center" },
];

const css = ".panel { min-height: 400px; }"; // to have enough space to display dropdown

/* Pure component */
export const CommunityFilterMembers = (props: CommunityProps) => {
    const [state, setState] = React.useState<any>({
        selectedName: "",
        ...props,
        users: [],
    });

    const onClickSearch = async () => {
        const domaines = (state.domaines || []).map((d) => d.id).join(",");
        const competences = (state.competences || []).join(",");
        const incubators = (state.incubators || [])
            .map((d) => d.value)
            .join(",");
        const startups = (state.startups || []).map((d) => d.value).join(",");
        const memberStatus = (state.memberStatus || [])
            .map((d) => d.id)
            .join(",");
        const startupPhases = (state.startupPhases || [])
            .map((d) => d.id)
            .join(",");
        const params = {
            domaines,
            incubators,
            startups,
            memberStatus,
            startupPhases,
            competences,
        };
        const queryParamsString = Object.keys(params)
            .map((key) => key + "=" + encodeURIComponent(params[key]))
            .join("&");
        const data = await axios
            .get(computeRoute(`/api/members?${queryParamsString}`), {
                withCredentials: true,
            })
            .then((response) => response.data);
        setState({
            ...state,
            users: data.users,
        });
    };

    function exportToCsv(filename, rows) {
        const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
        const header = Object.keys(rows[0]);
        const csv = [
            header.join(";"), // header row first
            ...rows.map((row) =>
                header
                    .map((fieldName) =>
                        JSON.stringify(row[fieldName], replacer)
                    )
                    .join(";")
            ),
        ].join("\r\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        if (navigator["msSaveBlob"]) {
            // IE 10+
            navigator["msSaveBlob"](blob, filename);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
                // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    const onClickDownload = async () => {
        exportToCsv("users.csv", state.users);
    };

    return (
        <>
            <div>
                <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                    <div className="fr-col-12">
                        <h3>Filtrer les membres</h3>
                    </div>
                </div>
                <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                    <div className="fr-col-6">
                        <SEIncubateurSelect
                            isMulti={true}
                            label={"Incubateurs"}
                            incubatorOptions={props.incubatorOptions}
                            onChange={(e, incubators) => {
                                setState({
                                    ...state,
                                    incubators,
                                });
                            }}
                        />
                    </div>
                    <div className="fr-col-6">
                        <SESelect
                            label={"Produits"}
                            placeholder={"Sélectionne un ou plusieurs produits"}
                            isMulti={true}
                            startups={props.startupOptions}
                            onChange={(startups) => {
                                setState({
                                    ...state,
                                    startups,
                                });
                            }}
                        />
                    </div>
                </div>
                <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--center">
                    <div className="fr-col-6">
                        <DomaineSelect
                            label={"Domaines"}
                            onChange={(e, domaines) =>
                                setState({
                                    ...state,
                                    domaines,
                                })
                            }
                        />
                    </div>
                    <div className="fr-col-6">
                        <MemberStatusSelect
                            label={"Membres"}
                            onChange={(e, memberStatus) =>
                                setState({
                                    ...state,
                                    memberStatus,
                                })
                            }
                        />
                    </div>
                </div>
                <div className="fr-grid-row fr-grid-row--gutters">
                    <div className="fr-col-6">
                        <SEPhaseSelect
                            label={"Phases"}
                            isMulti={true}
                            onChange={(e, startupPhases) =>
                                setState({
                                    ...state,
                                    startupPhases,
                                })
                            }
                        />
                    </div>
                    <div className="fr-col-6">
                        <label className="fr-label">Compétences</label>
                        <CompetencesEditor
                            placeholder="Sélectionne une ou plusieurs compétences"
                            defaultValue={[]}
                            onChange={(e, competences) => {
                                setState({
                                    ...state,
                                    competences,
                                });
                            }}
                        />
                    </div>
                </div>
                <br />
                <ButtonsGroup
                    buttons={[
                        {
                            children: "Chercher",
                            nativeButtonProps: {
                                onClick: onClickSearch,
                            },
                        },
                        {
                            children: "Télécharger",
                            nativeButtonProps: {
                                onClick: onClickDownload,
                                disabled: !state.users.length,
                            },
                            priority: "secondary",
                        },
                    ]}
                    inlineLayoutWhen="md and up"
                />
                <br />
                <br />
                <ReactTabulator
                    data-instance={"user-table"}
                    columns={columns}
                    data={state.users}
                    options={{ pagination: "local", paginationSize: 50 }}
                />
                <br />
                <br />
            </div>
        </>
    );
};
