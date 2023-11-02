"use client";
import React, { useEffect, useState } from "react";
import MemberPage, {
    MemberPageProps,
} from "@/components/MemberPage/MemberPage";
import routes, { computeRoute } from "@/routes/routes";
import axios from "axios";

export default function Page({ params }: { params: { id: string } }) {
    // const session = await getServerSession();

    const [data, setData] = useState({});
    const [isLoading, setLoading] = useState(true);
    useEffect(() => {
        axios
            .get(
                computeRoute(
                    routes.GET_USER_API.replace(":username", params.id)
                ),
                {
                    withCredentials: true,
                }
            )
            .then((res) => {
                console.log(res.data);
                setData(res.data);
                setLoading(false);
            });
    }, [params.id]);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No profile data</p>;
    // const props = await getUser({ id: params.id }) //props
    return <MemberPage {...(data as MemberPageProps)} />;
}