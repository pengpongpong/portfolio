import { Float, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion-3d"
import { A11y } from "@react-three/a11y";
import type { GLTF } from 'three-stdlib'

import { Close } from "../../environment/folder-control/buttons/Close";

type GLTFResult = GLTF & {
    nodes: {
        folderBack: THREE.Mesh
    },
    materials: {
        folderMaterial: THREE.MeshStandardMaterial
    }
}

type FolderBackProps = {
    screenWidth: number,
    active: boolean,
    title: string,
    setActive: (bool: boolean) => void
}

export const FolderBack = ({ screenWidth, active, title, setActive }: FolderBackProps) => {
    const { nodes, materials } = useGLTF("/threejs/folder/folderBack.glb") as GLTFResult;

    const a11yStyle = {
        position: "absolute",
        left: screenWidth > 1000 ? "32vw" : "48vw",
        top: screenWidth > 1000 ? "-1vh" : "-1vh",
        width: "0px",
        height: "0px",
        border: "none"
    }

    return (
        <motion.group dispose={null}>
            <mesh
                geometry={nodes.folderBack.geometry}
                material={materials.folderMaterial}
                rotation={[Math.PI / 2, 0, -3.139]}
            />
            <Float
                speed={1}
                rotationIntensity={.01}
                floatIntensity={1}
                floatingRange={[0.01, 0.001]}
            >
                <A11y
                    role="button"
                    description={`Close button for project ${title}`}
                    activationMsg={`Closing folder for project ${title}`}
                    actionCall={() => setActive(false)}
                    a11yElStyle={a11yStyle}
                    disabled={!active}
                >
                    <Close
                        position={[
                            screenWidth > 1000 ? -2.35 : -3.3,
                            screenWidth > 1000 ? 2 : 1.8,
                            0]}
                        scale={screenWidth > 1000 ? 1 : .7}
                        onClick={() => setActive(false)}
                        active={active}
                    />
                </A11y>
            </Float>
        </motion.group>
    )
}

useGLTF.preload("/threejs/folder/folderBack.glb")