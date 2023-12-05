import { type Locale } from "@utils/utils"

// show banner on landscape
export const ScreenRotateBanner = ({ lang, path }: { lang: Locale, path: string }) => {
    return (
        <div id="screenRotation" data-path={path}>
            <h1>
                {lang === "en"
                    ? "Please switch to portrait format"
                    : "Bitte auf Hochformat wechseln"
                }
            </h1>
        </div>
    )
}