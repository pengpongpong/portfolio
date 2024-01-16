import { useState } from "react"

import { motion } from "framer-motion-3d"
import { Float, PresentationControls } from "@react-three/drei"
import { A11y } from "@react-three/a11y"

import { FolderFront } from "./model/FolderFront"
import { FolderBack } from "./model/FolderBack"
import { Paper } from "./model/Paper"

import type { ThreeEvent } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import type { Props } from "@utils/utils"

type FolderProps = {
    position: {
        x: number,
        y: number
    },
    title: string,
    urlProject: string,
    screenWidth: number,
    urlVideo: string,
} & Props

export const Folder = ({ position, title, urlProject, urlVideo, screenWidth, lang }: FolderProps) => {
    const [folderOpen, setFolderOpen] = useState(false)
    const shouldReduceMotion = useReducedMotion()


    const handleFolder = (e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()

        if (position.x === 0) {
            setFolderOpen((prev) => !prev)
        }
    }

    const a11yStyle = {
        position: "absolute",
        left: screenWidth > 1000 ? "19vw" : "45vw",
        top: screenWidth > 1000 ? "-31vh" : "-16vh",
        width: "0px",
        height: "0px",
        border: "none"
    }

    return (
        <PresentationControls
            polar={[-1.2, 1.2]} // vertical
            azimuth={[-0.9, 0.9]} // horizontal
            config={{ mass: 2, tension: 400 }}
            snap={{ mass: 4, tension: 400 }}
            enabled={!folderOpen && position.x === 0}
        >
            <Float
                speed={1}
                rotationIntensity={.5}
                floatIntensity={.1}
                floatingRange={[-.005, .005]}
                enabled={!folderOpen}
            >
                <motion.group
                    initial={{ x: position.x }}
                    animate={{ x: position.x }}
                    transition={{
                        type: "spring",
                        stiffness: shouldReduceMotion ? 2000 : 200,
                        damping: shouldReduceMotion ? 150 : 15,
                    }}
                >
                    <A11y
                        role="togglebutton"
                        description={`Open or close folder to view content for the project ${title}`}
                        activationMsg={`Opening folder for project ${title}`}
                        deactivationMsg={`Closing folder for project ${title}`}
                        actionCall={() => setFolderOpen(!folderOpen)}
                        a11yElStyle={a11yStyle}
                        disabled={position.x !== 0}
                    >
                        <motion.group
                            animate={folderOpen ? "open" : "closed"}
                            variants={{
                                "open": {
                                    rotateZ: -Math.PI * .5,
                                    rotateY: -Math.PI * 0.02,
                                    scale: screenWidth > 1050
                                        ? .63
                                        : .46,
                                    y: screenWidth > 1050
                                        ? 0
                                        : 0.05,
                                    x: screenWidth > 1050
                                        ? - 0.7
                                        : -0.93,
                                    z: 2.5,
                                },
                                "closed": {
                                    rotateZ: 0,
                                    scale: screenWidth > 1050
                                        ? .8
                                        : .45,
                                    y: screenWidth > 1050
                                        ? position.y
                                        : -1,
                                    x: 0,
                                    z: 0,
                                }
                            }}
                            transition={{
                                duration: 1,
                                ease: "easeInOut"
                            }}
                            scale={shouldReduceMotion ? 0.8 : 0.7}
                            position-y={position.y}
                            onClick={handleFolder}
                        >
                            <FolderFront
                                active={folderOpen}
                                title={title}
                                inView={position.x === 0}
                                urlVideo={urlVideo}
                                lang={lang} />
                            <FolderBack
                                active={folderOpen}
                                title={title}
                                setActive={setFolderOpen}
                                screenWidth={screenWidth} />
                            <Paper
                                active={folderOpen}
                                inView={position.x === 0}
                                title={title}
                                reduceMotion={shouldReduceMotion}
                                lang={lang}
                                urlProject={urlProject}
                                screenWidth={screenWidth}
                            />
                        </motion.group>
                    </A11y>
                </motion.group>
            </Float>
        </PresentationControls >
    )
}