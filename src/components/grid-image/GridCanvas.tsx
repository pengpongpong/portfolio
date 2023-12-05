import { Suspense, useState } from "react"

import { useProgress } from "@react-three/drei"
import { Loading } from "@components/loading/Loading"
import { CanvasContainer } from "@components/canvas/CanvasContainer"
import { Grid } from "./Grid"

import { A11yAnnouncer, A11y } from "@react-three/a11y"

import type { Locale } from "@utils/utils"

type GridCanvasProps = {
    url: string,
    lang: Locale
}


const a11yStyle = {
    width: "0px",
    height: "0px",
    border: "none"
}

export const GridCanvas = ({ url, lang }: GridCanvasProps) => {
    const { progress } = useProgress()
    const [loaded, setLoaded] = useState(false)

	// handle loaded on created
    const handleCreated = () => {
        setLoaded(true)
    }

    return (
        <>
            <Loading progress={progress} lang={lang} loaded={loaded} />
            <CanvasContainer
                style={{
                    width: "var(--gridCanvasWidth)",
                    height: "var(--gridCanvasHeight)",
                    margin: "2rem auto",
                    position: "relative",
                    top: 0,
                    left: 0,
                    zIndex: 1,
                }}
                data-loaded={loaded}
                id="gridCanvas"
                onCreated={handleCreated}
            >
                <A11y
                    role="content"
                    description={lang === "en"
                        ? "Photo about me on a worktable coming in as animation in grid style"
                        : "Foto von mir auf einem Arbeitstisch, das als Animation im Rasterstil erscheint"
                    }
                    a11yElStyle={a11yStyle}
                >
                    <Suspense fallback={null}>
                        <Grid url={url} />
                    </Suspense>
                </A11y>
            </CanvasContainer>
            <A11yAnnouncer />
        </>
    )
}