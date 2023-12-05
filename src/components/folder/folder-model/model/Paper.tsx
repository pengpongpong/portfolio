import { useEffect } from "react";

import { Mesh, MeshBasicMaterial } from "three"
import { Html, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion-3d"

import type { GLTF } from 'three-stdlib'
import type { Locale } from "@utils/utils";

import { isDesktop, isIOS, isMobile, isTablet } from "react-device-detect";


type GLTFResult = GLTF & {
    nodes: {
        paper1: Mesh
    },
}

type PaperProps = {
    active: boolean,
    urlProject: string,
    screenWidth: number,
    reduceMotion?: boolean | null,
    title: string,
    lang: Locale,
    inView: boolean
}

const material = new MeshBasicMaterial({ color: "#ffffff" })

export const Paper = ({ active, inView, urlProject, screenWidth, reduceMotion, title, lang }: PaperProps) => {
    const { nodes } = useGLTF("/threejs/folder/paper1.glb") as GLTFResult;

    let positionX = 0;

    // handle iOS devices
    if (isIOS && !isTablet && isMobile) {
        switch (!!screenWidth) {
            case screenWidth === 375:   // iphone 11 pro
            case screenWidth === 430: { // iphone 14 pro max
                positionX = 0.45;
                break;
            }
            case screenWidth === 320: { // iphone 14 pro max
                positionX = 0;
                break;
            }
            default: {
                positionX = -0.35; // default
                break;
            }
        }

        // handle other devices
    } else if (isMobile && !isIOS && !isTablet) {
        switch (!!screenWidth) {
            case screenWidth === 375: { // galaxy a23
                positionX = -0.65;
                break;
            }
            case screenWidth === 427: { // xiaomi red note 11 pro
                positionX = -0.15;
                break;
            }
            default: {
                positionX = 0.05; // default
                break;
            }
        }

    } else if (isTablet || isDesktop) {
        positionX = 0.05;
    }

    // handle iOS bar -> not calculated properly in transform property of Html Drei component
    useEffect(() => {
        const paperIframe = document.querySelector(".paper > div") as HTMLDivElement

        if (paperIframe && isIOS) {
            switch (!!screenWidth) {
                case screenWidth === 375:
                case screenWidth === 430: {
                    paperIframe.style.marginTop = "-0.01rem"
                    break;
                }

                default: {
                    paperIframe.style.marginTop = "0.01rem"
                    break;
                }
            }
        }
    }, [])

    return (
        <motion.group
            animate={{
                scale: active
                    ? .95
                    : 1,
            }}
            dispose={null}>
            <mesh
                geometry={nodes.paper1.geometry}
                material={material}
                position={[0.087, 2.08, -0.026]}
                rotation={[1.571, -0.006, 0]}
            >
            </mesh>
            <mesh
                geometry={nodes.paper1.geometry}
                material={material}
                position={[0.033, 2.09, -0.025]}
                rotation={[1.572, 0.004, 0]}
            />
            <mesh
                geometry={nodes.paper1.geometry}
                material={material}
                position={[0, 2.11, -0.026]}
                rotation={[1.571, 0.021, 0]}
            />
            <motion.group
                initial={{
                    scale: reduceMotion ? 1 : 0,
                }}
                animate={reduceMotion ? "reduceMotion" : "default"}
                variants={{
                    "reduceMotion": {
                        scale: 1
                    },
                    "default": {
                        scale: active ? 1 : 0
                    }
                }}
                transition={{
                    duration: .4,
                    delay: .35
                }}
            >
                {inView
                    ? <Html
                        wrapperClass="paper"
                        occlude
                        transform
                        rotation-z={Math.PI * .5}
                        position={[
                            positionX,
                            2.15,
                            0.004
                        ]}
                        scale={.205}
                    >
                        <iframe
                            src={urlProject}
                            title={lang === "en"
                                ? `Project of ${title}`
                                : `Projekt von ${title}`} />
                    </Html>
                    : ""}
            </motion.group>
        </motion.group>
    )
}

useGLTF.preload("/threejs/folder/paper1.glb")