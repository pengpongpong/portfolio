import { useEffect, useRef, useState } from "react"
import { getConsentLocalStorage, setConsentLocalStorage, removeConsentLocalStorage, type Locale, setCookie, deleteCookie, getCookie, setHtmlOverflow } from "@utils/utils"
import { setOpen, useCookieModal } from "@utils/store"
import { CloseButton } from "@components/close-button/CloseButton"

import "@styles/components/cookie-banner.scss"

// set/delete functional, analytics and advertisement cookies or local storage
const setAllConsent = (functionalChecked?: boolean, analyticChecked?: boolean, advertisementChecked?: boolean) => {
    if (functionalChecked) {
        setConsentLocalStorage("consent-functional", "true")
    } else {
        removeConsentLocalStorage("consent-functional")
    };

    if (analyticChecked) {
        setCookie("consent-analytics", "true")
    } else {
        deleteCookie("consent-analytics")
    };

    if (advertisementChecked) {
        setCookie("consent-advertise", "true")
    } else {
        deleteCookie("consent-advertise")
    };
}

type CookieBannerProps = {
    lang: Locale,
    noBanner: boolean
}

export const CookieBanner = ({ lang, noBanner }: CookieBannerProps) => {
    if (noBanner) return;

    const functionalRef = useRef<HTMLInputElement>(null)
    const analyticsRef = useRef<HTMLInputElement>(null)
    const advertiseRef = useRef<HTMLInputElement>(null)

    const [consent, setConsent] = useState(true)
    const open = useCookieModal((state) => state.open)

    // set consent in modal to user settings if reload
    useEffect(() => {
        if (!functionalRef.current || !analyticsRef.current || !advertiseRef.current) return

        const consentLocal = getConsentLocalStorage("consent")

        // show cookie banner if no consent
        if (!consentLocal) {
            setConsent(false)
        } else if (consentLocal === "granted" || consentLocal === "denied" || consentLocal === "partial") {
            setConsent(true)
        }

        const functionalConsent = functionalRef.current
        const analyticsConsent = analyticsRef.current
        const advertisementConsent = advertiseRef.current

        const functionalCookie = getConsentLocalStorage("consent-functional")
        const analyticsCookie = getCookie("consent-analytics")
        const advertisementCookie = getCookie("consent-advertise")

        functionalConsent.checked = !!functionalCookie
        analyticsConsent.checked = !!analyticsCookie
        advertisementConsent.checked = !!advertisementCookie
    }, [])

    // open cookie settings
    const openModal = () => {
        setHtmlOverflow("hidden")
        setOpen(true)
    }

    // close cookie settings
    const closeModal = () => {
        setHtmlOverflow("hidden visible")
        setOpen(false)
    }

    // accept all
    const acceptConsent = () => {
        setConsentLocalStorage("consent", "granted")

        setAllConsent(true, true, true)
        setConsent(true)
    }

    // save user settings
    const saveSettingConsent = () => {
        if (!functionalRef.current || !analyticsRef.current || !advertiseRef.current) return

        const functionalConsentChecked = functionalRef.current.checked
        const analyticsConsentChecked = analyticsRef.current.checked
        const advertisementConsentChecked = advertiseRef.current.checked

        setConsentLocalStorage("consent", "partial")

        setAllConsent(functionalConsentChecked, analyticsConsentChecked, advertisementConsentChecked)
    }

    // deny all
    const denyConsent = () => {
        setConsentLocalStorage("consent", "denied")

        setAllConsent(false, false, false)
    }

    const bannerText =
        lang === "en"
            ? {
                privacyAnchor: "Data privacy",
                buttons: {
                    settings: "Settings",
                    accept: "Accept",
                    deny: "Deny",
                    saveSettings: "Save Settings",
                },
                modal: {
                    headline: "Cookie Settings",
                    consent: {
                        requiredHead: "Required Cookies",
                        requiredText: "Required cookies help make a website usable by enabling basic functions such as page navigation and access to secure areas of the website. Without these cookies, the website cannot function properly.",
                        functionalHead: "Preference Cookies",
                        functionalText: "Preference cookies allow a website to store information that changes the behavior or appearance of the website, such as your preferred language.",
                        analyticsHead: "Analytics Cookies",
                        analyticsText: "Analytics cookies help us understand how visitors interact with websites by collecting and reporting information anonymously.",
                        advertiseHead: "Advertising Cookies",
                        advertiseText: "This website only uses an advertising cookie for Google Analytics. This cookie helps us analyze user interactions with ads and measure the effectiveness of our advertising campaigns. No personal data is collected or shared.",
                    }
                }
            }
            : {
                privacyAnchor: "Datenschutz",
                buttons: {
                    settings: "Einstellung",
                    accept: "Akzeptiere",
                    deny: "Ablehnen",
                    saveSettings: "Speichere Einstellung",
                },
                modal: {
                    headline: "Cookie Einstellung",
                    consent: {
                        requiredHead: "Erforderliche Cookies",
                        requiredText: "Erforderliche Cookies helfen dabei, eine Website nutzbar zu machen, indem sie grundlegende Funktionen wie die Seitennavigation und den Zugang zu sicheren Bereichen der Website ermöglichen. Ohne diese Cookies kann die Website nicht richtig funktionieren.",
                        functionalHead: "Präferenz Cookies",
                        functionalText: "Mit Hilfe von Präferenz-Cookies kann eine Website Informationen speichern, die das Verhalten oder das Aussehen der Website verändern, z. B. Ihre bevorzugte Sprache.",
                        analyticsHead: "Analyse Cookies",
                        analyticsText: "Analytics-Cookies uns zu verstehen, wie Besucher mit Websites interagieren, indem sie Informationen anonym sammeln und melden.",
                        advertiseHead: "Werbe Cookies",
                        advertiseText: "Diese Website verwendet ausschließlich ein Werbe-Cookie für Google Analytics. Dieses Cookie hilft uns, die Interaktionen der Benutzer mit Anzeigen zu analysieren und die Wirksamkeit unserer Werbekampagnen zu messen. Keine personenbezogenen Daten werden erfasst oder weitergegeben.",
                    }
                }
            }

    return (
        <>
            <div className="cookiebanner" data-consent={`${consent}`}>
                <a href={lang === "en" ? "/privacy" : "/datenschutz"}>{bannerText.privacyAnchor}</a>
                <span>{lang === "en"
                    ? "This site uses cookies for a better experience. By using this website, you agree to the website's cookie policy."
                    : "Diese Seite verwendet Cookies für ein besseres Erlebnis. Durch die Nutzung dieser Website stimmen Sie der Cookie-Richtlinie der Website zu."
                }</span>
                <div>
                    <button onClick={openModal}>{bannerText.buttons.settings}</button>
                    <button onClick={acceptConsent}>{bannerText.buttons.accept}</button>
                </div>
            </div>

            <div data-open={`${open}`} id="backdrop"></div>

            <div className="modal" data-open={`${open}`}>
                <dialog open={open}>
                    <CloseButton
                        onClick={closeModal}
                        ariaLabel={
                            lang === "en"
                                ? "Close cookie settings"
                                : "Schließe Cookie Einstellung"
                        }
                    />
                    <h1>{bannerText.modal.headline}</h1>

                    <form>
                        <fieldset>
                            <label htmlFor="requiredCookies" style={{ cursor: "auto" }} >
                                <span>{bannerText.modal.consent.requiredHead}</span>
                                <input type="checkbox" id="requiredCookies" defaultChecked disabled />
                            </label>
                            <p>{bannerText.modal.consent.requiredText}</p>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="functionalConsent">
                                <span>{bannerText.modal.consent.functionalHead}</span>
                                <input type="checkbox" id="functionalConsent" ref={functionalRef} />
                            </label>
                            <p>{bannerText.modal.consent.functionalText}</p>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="analyticsConsent">
                                <span>{bannerText.modal.consent.analyticsHead}</span>
                                <input type="checkbox" id="analyticsConsent" ref={analyticsRef} />
                            </label>
                            <p>{bannerText.modal.consent.analyticsText}</p>
                        </fieldset>

                        <fieldset>
                            <label htmlFor="advertiseConsent">
                                <span>{bannerText.modal.consent.advertiseHead}</span>
                                <input type="checkbox" id="advertiseConsent" ref={advertiseRef} />
                            </label>
                            <p>{bannerText.modal.consent.advertiseText}</p>
                        </fieldset>

                        <div className="buttons">
                            <button onClick={denyConsent}>{bannerText.buttons.deny}</button>
                            <button onClick={saveSettingConsent}>{bannerText.buttons.saveSettings}</button>
                            <button onClick={acceptConsent}>{bannerText.buttons.accept}</button>
                        </div>
                    </form>
                </dialog>
            </div>
        </>
    )
}