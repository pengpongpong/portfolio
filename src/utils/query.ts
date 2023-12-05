import { sanityClient } from "sanity:client";
import groq from "groq";
import type { Locale } from "./utils";

export type Props = {
    projectData: {
        year: Date;
        title: string;
        subTitle?: string;
        subTitleDE?: string;
        type?: string;
        typeDE?: string;
        slug: string;
        data?: {
            role: string;
            responsibility: string;
            url: string;
            about: string;
        };
        dataDE?: {
            role: string;
            responsibility: string;
            url: string;
            about: string;
        };
        stack: {
            title: string;
        }[];
        shortclip: string;
    };
};

// get preview data projects 
export const queryPreviewProjects = async () => {
    const query = groq`*[_type == "project"]{
        title,
        year,
        "slug": slug.current,
        "shortclip": shortclip.asset->url,
    } | order(year desc)`

    return await sanityClient.fetch(query)
}

// get data projects
export const queryProjects = async (lang: Locale) => {
    if (lang === "de") {
        const query = groq`*[_type == "project"]{
            year,
            title,
            subTitleDE,
            typeDE,
            "slug": slug.current,
            dataDE,
            stack[]->{title},
        } | order(year desc)`

        return await sanityClient.fetch(query)
    } else {
        const query = groq`*[_type == "project"]{
            year,
            title,
            subTitle,
            type,
            "slug": slug.current,
            data,
            stack[]->{title},
        } | order(year desc)`

        return await sanityClient.fetch(query)
    }
}
