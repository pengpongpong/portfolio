import { Suspense } from "react";

import { BufferGeometry, Material, MeshBasicMaterial, SphereGeometry } from "three";
import { useGLTF, Text } from "@react-three/drei";
import { motion } from "framer-motion-3d";

import type { GLTF } from 'three-stdlib'
import { VideoMesh } from "@components/folder/environment/video-mesh/VideoMesh";
import type { Locale } from "@utils/utils";


type GLTFResult = GLTF & {
    nodes: {
        folderFront: THREE.Mesh
    },
    materials: {
        folderMaterial: THREE.MeshStandardMaterial
    }
}

type FolderFrontProps = {
    title: string,
    active: boolean,
    inView: boolean,
    urlVideo: string,
    lang: Locale
}

type LoadingDotsProps = {
    delay: number,
    positionX: number,
    material: Material,
    sphereGeometry: BufferGeometry
}

// animated dots for loading text
const LoadingDots = ({ delay, positionX, material, sphereGeometry }: LoadingDotsProps) => {
    return (
        <motion.mesh
            geometry={sphereGeometry}
            material={material}
            position-x={positionX}
            initial={{
                scale: 0,
            }}
            animate={{
                scale: [0, 1, 0],
            }}
            transition={{
                duration: 1.5,
                delay,
                repeatType: "loop",
                repeat: Infinity,
            }}
        >
        </motion.mesh>
    )
}

// loading text for suspense
const LoadingText = ({ lang }: { lang: Locale }) => {
    const material = new MeshBasicMaterial({ color: "#fafdfe" })
    const sphereGeometry = new SphereGeometry(0.04)

    return (
        <group>
            <Text
                font="https://res.cloudinary.com/dzvrnl80x/raw/upload/v1705975333/my-portfolio/rubik_rg.ttf"
                fontSize={.4}
                position={[0, 2.45, 0.18]}
                rotation={[0.05, 0, 0]}
                textAlign="center"
                color={"#fafdfe"}
            >{lang === "en" ? "Loading video" : "Ladet Video"}</Text>
            <motion.group
                position={[1.5, 2.35, 0.18]}
            >

                <LoadingDots
                    material={material}
                    sphereGeometry={sphereGeometry}
                    delay={0}
                    positionX={0}
                />

                <LoadingDots
                    material={material}
                    sphereGeometry={sphereGeometry}
                    delay={.2}
                    positionX={.15}
                />

                <LoadingDots
                    material={material}
                    sphereGeometry={sphereGeometry}
                    delay={.4}
                    positionX={.3}
                />

            </motion.group>
        </group>
    )
}

export const FolderFront = ({ title, active, inView, urlVideo, lang }: FolderFrontProps) => {
    const { nodes, materials } = useGLTF("/threejs/folder/folderFront.glb") as GLTFResult;

    return (
        <motion.group
            animate={active ? "active" : "rest"}
            variants={{
                "active": {
                    rotateX: Math.PI * .8
                },
                "rest": {
                    rotateX: 0
                }
            }}
            position={[0, .01, 0]}
            transition={{
                stiffness: 260,
                damping: 20,
                duration: 1,
                delay: active ? 0 : 0
            }}
        >
            <motion.mesh
                geometry={nodes.folderFront.geometry}
                material={materials.folderMaterial}
                position={[0, -0.001, 0.02]}
                rotation={[1.62, 0, 0]}
            />

            <Suspense fallback={<LoadingText lang={lang} />}>
                {urlVideo ? <VideoMesh url={urlVideo} inView={inView} title={title} /> : null}
            </Suspense>

            <Text
                font="https://res.cloudinary.com/dzvrnl80x/raw/upload/v1705975333/my-portfolio/rubik_rg.ttf"
                fontSize={.20}
                position={[1.9, 4.28, 0.24]}
                textAlign="center"
                color={"#fafdfe"}
            >{title}</Text>
        </motion.group>
    )
}

useGLTF.preload("/threejs/folder/folderFront.glb")