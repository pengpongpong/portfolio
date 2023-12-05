import type { Locale } from "@utils/utils"
import "@styles/components/footer.scss"

const Footer = ({ lang, path }: { lang: Locale, path?: string }) => {
    return (
        <footer data-path={path}>
            <span>&copy; 2023 - TMP</span>
            <a
                href={lang === "en" ? "/privacy" : "datenschutz"}
                aria-label={lang === "en" ? "Go to Data privacy page" : "Gehe zur Datenschutz Seite"}
            >
                {lang === "en" ? "Data privacy" : "Datenschutz"}
            </a>
        </footer>
    )
}

export default Footer