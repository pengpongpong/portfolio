import { useState, useRef, useEffect } from "react";
import { setHtmlOverflow, type Locale } from "@utils/utils";

import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { CloseButton } from "@components/close-button/CloseButton";

const ErrorText = ({ text }: { text?: string }) => {
    return <span className="error">{text}</span>
}

// loading spinner
const PuffLoader = ({ size }: { size: number }) => {
    return (
        <svg width={`${size}`} height={`${size}`} viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#181d31">
            <g fill="none" fillRule="evenodd" strokeWidth="2">
                <circle cx="22" cy="22" r="1">
                    <animate attributeName="r"
                        begin="0s" dur="1.8s"
                        values="1; 20"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.165, 0.84, 0.44, 1"
                        repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity"
                        begin="0s" dur="1.8s"
                        values="1; 0"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.3, 0.61, 0.355, 1"
                        repeatCount="indefinite" />
                </circle>
                <circle cx="22" cy="22" r="1">
                    <animate attributeName="r"
                        begin="-0.9s" dur="1.8s"
                        values="1; 20"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.165, 0.84, 0.44, 1"
                        repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity"
                        begin="-0.9s" dur="1.8s"
                        values="1; 0"
                        calcMode="spline"
                        keyTimes="0; 1"
                        keySplines="0.3, 0.61, 0.355, 1"
                        repeatCount="indefinite" />
                </circle>
            </g>
        </svg>
    )
}

type ContactProps = {
    lang: Locale,
    apiData: {
        url: string,
        api: string
    }
}

export const Contact = ({ lang, apiData }: ContactProps) => {
    const [responseMessage, setResponseMessage] = useState({ showConfirmation: false, error: { message: "" } });
    const [loading, setLoading] = useState(false)

    const dialogRef = useRef<HTMLDialogElement>(null)

    // open contact form modal
    const openModal = () => {
        if (!dialogRef.current) return

        setHtmlOverflow("hidden")

        dialogRef.current.showModal()
        window.scrollTo(0, 0)
    }

    // close contact form modal
    const closeModal = () => {
        if (!dialogRef.current) return

        setHtmlOverflow("auto")

        dialogRef.current.close()
    }

    // error messages
    const errorMessage = {
        name: lang === "en"
            ? "Please enter your name"
            : "Bitte Name eintragen",
        email: lang === "en"
            ? "Invalid email"
            : "Ungültige Email",
        message: lang === "en"
            ? "Message missing"
            : "Nachricht fehlt",
    }

    // schema validation
    const schema = yup.object({
        name: yup.string().required(errorMessage.name),
        email: yup.string().email(errorMessage.email).required(errorMessage.email),
        message: yup.string().required(errorMessage.message),
    })

    // get react hook form
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        }
    })

    // submit data
    const onSubmit = handleSubmit((data) => {
        (async () => {
            setLoading(true)
            await fetch(apiData.url, {
                method: "POST", body: JSON.stringify({
                    data
                }), headers: {
                    "x-api-key": apiData.api
                }
            })
                .then(res => res.json())
                .then(result => {
                    const { message, error } = JSON.parse(result.body)

                    // handle error
                    if (error !== "false") {
                        if (message === "Invalid email") {
                            setResponseMessage({ showConfirmation: false, error: { message: lang === "en" ? "Invalid email" : "Ungültige Email" } })
                            setLoading(false)
                        } else if (message === "Required fields missing") {
                            setResponseMessage({ showConfirmation: false, error: { message: lang === "en" ? "Required fields missing" : "Bitte alle Felder ausfüllen" } })
                            setLoading(false)
                        } else {
                            setResponseMessage({ showConfirmation: false, error: { message: lang === "en" ? "Error! Please try again later" : "Fehler! Bitte später erneut versuchen" } })
                            setLoading(false)
                        }
                        // handle success
                    } else if (message === "success" && error === "false") {
                        setResponseMessage({ showConfirmation: true, error: { message: "" } })

                        setLoading(false)
                        dialogRef.current?.close()
                        reset()
                    }
                })
        })()
    })

    // hide response message after timeout
    useEffect(() => {
        if (!responseMessage.showConfirmation) return

        const html = document.querySelector("html") as HTMLHtmlElement

        const timer = setTimeout(() => {
            setResponseMessage({ showConfirmation: false, error: { message: "" } })
            html.style.overflow = "auto"
        }, 1500)

        return () => clearTimeout(timer)
    }, [responseMessage.showConfirmation])

    return (
        <>
            <div className="contact">
                <div className="container">
                    <img src="/icons/bx-at.svg" alt="at icon" />
                    <span>E-Mail</span>
                    <p>
                        {lang === "en"
                            ? "You can contact me via email"
                            : "Kontaktiere mich über Email"}
                    </p>
                    <a href="mailto:contact@tranmp.dev">
                        {lang === "en"
                            ? "Write Email"
                            : "Email schreiben"}
                    </a>
                </div>

                <div className="container">
                    <img src="/icons/bx-envelope.svg" alt="envelope icon" />
                    <span>
                        {lang === "en"
                            ? "Contact form"
                            : "Kontaktformular"}
                    </span>
                    <p>
                        {lang === "en"
                            ? "Or leave me a message and I'll reach out to you as soon as possible"
                            : "Oder hinterlasse mir eine Nachricht und ich werde mich so schnell wie möglich melden."}
                    </p>
                    <button onClick={openModal}>
                        {lang === "en"
                            ? "Fill out contact form"
                            : "Kontaktformular ausfüllen"}
                    </button>
                </div>

                <dialog ref={dialogRef}>
                    <h1>{lang === "en"
                        ? "Contact"
                        : "Kontakt"}</h1>
                    <form>
                        <CloseButton
                            onClick={closeModal}
                            ariaLabel={
                                lang === "en"
                                    ? "Close contact form"
                                    : "Schließe Kontaktformular"
                            }
                        />

                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Name"
                            autoComplete="name"
                            {...register("name")}
                        />
                        {errors?.name && <ErrorText text={errors?.name?.message} />}

                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="E-mail"
                            autoComplete="email"
                            {...register("email")}
                        />
                        {errors?.email && <ErrorText text={errors?.email?.message} />}

                        <label htmlFor="message">{lang === "en" ? "Message" : "Nachricht"}</label>
                        <textarea
                            id="message"
                            rows={12}
                            cols={3}
                            placeholder={lang === "en"
                                ? "Leave me a message!"
                                : "Hinterlasse mir eine Nachricht!"}
                            {...register("message")}
                        ></textarea>
                        {errors?.message && <ErrorText text={errors?.message?.message} />}

                        <button type="submit" className="send" data-error={`${responseMessage.error.message !== "" ? true : false}`} onClick={onSubmit}>
                            {loading
                                ? <PuffLoader size={23} />
                                : lang === "en"
                                    ? responseMessage.error.message !== "" ? responseMessage.error.message : "Send"
                                    : responseMessage.error.message !== "" ? responseMessage.error.message : "Abschicken"
                            }
                        </button>
                    </form>
                </dialog>
            </div>

            <div className="confirmation" data-success={`${responseMessage.showConfirmation}`}>
                <div className="confirmation__backdrop"></div>
                <span className="confirmation__message">{lang === "en" ? "Message Sent!" : "Nachricht gesendet!"}</span>
            </div>
        </>
    )
}