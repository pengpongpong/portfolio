import { useEffect, type ReactNode } from "react";

import { setOpen } from "@utils/store";
import { setHtmlOverflow } from "@utils/utils";

import "@styles/components/cookie-modal-button.scss"

// button to open cookie modal
export const CookieModalButton = ({ children }: { children: ReactNode }) => {

    const openModal = () => {
        setHtmlOverflow("hidden")
        window.scrollTo(0, 0)
        setOpen(true)
    }

    // close with Esc
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setHtmlOverflow("hidden visible")
                setOpen(false)
            }
        }

        window.addEventListener("keydown", handleKey)

        return () => removeEventListener("keydown", handleKey)
    }, [])

    return (
        <button className="cookie-modal-button" onClick={openModal}>{children}</button>
    )
}