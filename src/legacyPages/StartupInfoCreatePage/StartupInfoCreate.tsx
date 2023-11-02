"use client";
import React from "react";

import axios from "axios";
import { DBPullRequest } from "@/models/pullRequests";
import { StartupInfo } from "@/models/startup";
import routes, { computeRoute } from "@/routes/routes";
import { StartupForm } from "../../components/StartupForm/StartupForm";

export interface StartupInfoCreateProps {
    title: string;
    currentUserId: string;
    activeTab: string;
    subActiveTab: string;
    startup: StartupInfo;
    formValidationErrors: any;
    startupOptions: {
        value: string;
        label: string;
    }[];
    username: string;
    updatePullRequest?: DBPullRequest;
    isAdmin: boolean;
}

/* Pure component */
export const StartupInfoCreate = (props: StartupInfoCreateProps) => {
    const css = ".panel { overflow: hidden; width: auto; min-height: 100vh; }";

    const save = async (data) => {
        return axios
            .post(computeRoute(routes.STARTUP_POST_INFO_CREATE_FORM), {
                ...data,
            })
            .then(() => {
                window.location.replace(`/startups`);
            });
    };
    return (
        <>
            <div className="module">
                <div>
                    <small>
                        <a href="/startups">Produit</a> &gt;{" "}
                        <a href="/startups/create-form">
                            Créer une fiche produit
                        </a>
                    </small>
                </div>
                <div className="margin-top-m"></div>
                <div className="panel">
                    <h3>Créer une fiche produit</h3>
                    {!!props.updatePullRequest && (
                        <div className="notification">
                            ⚠️ Une pull request existe déjà sur cette startup.
                            Quelqu'un doit la merger pour que le changement soit
                            pris en compte.
                            <a
                                href={props.updatePullRequest.url}
                                target="_blank"
                            >
                                {props.updatePullRequest.url}
                            </a>
                            <br />
                            (la prise en compte peut prendre 10 minutes.)
                        </div>
                    )}
                    <div className="beta-banner"></div>
                    <div>
                        <StartupForm content={""} save={save} />
                    </div>
                </div>
            </div>
            <style media="screen">{css}</style>
        </>
    );
};
