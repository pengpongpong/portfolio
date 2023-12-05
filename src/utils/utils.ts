type ConsentType = "consent" | "consent-required" | "consent-functional" | "consent-analytics" | "consent-advertise"
type Consent = "granted" | "partial" | "denied" | "true" | "false"

export type Locale = "en" | "de"

export type Props = {
    lang: Locale
}

// set local storage
export const setConsentLocalStorage = (consent: ConsentType, value: Consent) => {
    return localStorage.setItem(consent, value)
}

// get local storage
export const getConsentLocalStorage = (consent: ConsentType) => {
    return localStorage.getItem(consent)
}
// remove local storage
export const removeConsentLocalStorage = (consent: ConsentType) => {
    return localStorage.removeItem(consent)
}

// set cookie
export const setCookie = (item: ConsentType, value: Consent) => {
    if (!window) return console.error("no window defined")

    return document.cookie = `${item}=${value}; max-age=31536000;Secure;SameSite=Strict`
}

// get cookie
export const getCookie = (item: ConsentType) => {
    if (!window) return console.error("no window defined")

    return document.cookie.split("; ")
        .find((row) => row.startsWith(item + "="))
        ?.split("=")[1]
}

// delete cookie
export const deleteCookie = (item: ConsentType) => {
    if (!window) return console.error("no window defined")

    return document.cookie = item + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
}

export const setHtmlOverflow = (state: string) => {
    const html = document.querySelector("html") as HTMLHtmlElement
    if (!html) return

    html.style.overflow = state
}
