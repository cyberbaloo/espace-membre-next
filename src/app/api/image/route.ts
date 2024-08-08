import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

// pages/api/upload.ts

import { getFileName } from "./utils";
import s3 from "@/lib/s3";
import { authOptions } from "@/utils/authoptions";

export async function DELETE(req: NextRequest) {
    const { fileRelativeIdentifier, fileReliveObjType } = await req.json();
    const session = await getServerSession(authOptions);

    if (
        !session ||
        (session.user.id !== fileRelativeIdentifier &&
            fileReliveObjType === "member" &&
            !session.user.isAdmin)
    ) {
        throw new Error(`You don't have the right to access this function`);
    }

    if (!fileRelativeIdentifier) {
        return Response.json(
            { message: "Image key is required" },
            { status: 400 }
        );
    }

    const params = {
        Key: getFileName[fileReliveObjType](fileRelativeIdentifier),
    };

    try {
        await s3.deleteObject(params).promise();
        Response.json(
            { message: "Image deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting image:", error);
        Response.json({ message: "Error deleting image" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!s3) {
        return Response.json(
            {
                error: "s3 is not defined",
            },
            {
                status: 500,
            }
        );
    }
    const { fileObjIdentifier, fileRelativeObjType, fileType, fileIdentifier } =
        await req.json();

    const session = await getServerSession(authOptions);
    console.log("LCS IMAGE 1");

    if (
        !session ||
        (session.user.id !== fileObjIdentifier &&
            fileRelativeObjType === "member" &&
            !session.user.isAdmin)
    ) {
        throw new Error(`You don't have the right to access this function`);
    }

    const s3Params = {
        Key: getFileName[fileRelativeObjType](
            fileObjIdentifier,
            fileIdentifier
        ),
        Expires: 60,
        ContentType: fileType,
    };

    try {
        const signedUrl = await s3.getSignedUrlPromise("putObject", s3Params);

        return Response.json({ signedUrl }, { status: 200 });
    } catch (error) {
        return Response.json(
            {
                error: "Failed to generate signed URL",
            },
            {
                status: 500,
            }
        );
    }
}
