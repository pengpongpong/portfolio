import { useState } from "react";

import { useGLTF, useCursor } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion-3d"

import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        Plane: THREE.Mesh
    }
}
type CloseProps = {
    active: boolean,
    position: [number, number, number],
    scale: number,
    onClick: () => void
}

// close button for closing active folder
export function Close({ active, position, scale, onClick }: CloseProps) {
    const { nodes }: any = useGLTF("https://res.cloudinary.com/dzvrnl80x/image/upload/v1700073787/my-portfolio/threejs-models/controls/close.glb") as GLTFResult;
    const [hovered, setHover] = useState(false)

    // handle cursor on hover
    useCursor(hovered)

    return (
        <>
            <AnimatePresence>
                {active &&
                    <motion.group
                        position={position}
                        scale={scale}
                        onClick={onClick}
                        onPointerOver={() => {
                            if (!hovered) {
                                setHover(true)
                            }
                        }}
                        onPointerOut={() => {
                            if (hovered) {
                                setHover(false)
                            }
                        }}
                        dispose={null}>
                        <motion.mesh
                            geometry={nodes.Close.geometry}
                            position={[0, 2.823, 0]}
                            rotation={[Math.PI * 1.1, -Math.PI * 0.35, 0]}
                        >
                            <motion.meshStandardMaterial
                                name="closeMaterial"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: {
                                        delay: .7
                                    }
                                }}
                                transition={{
                                    ease: "easeInOut",
                                    delay: .1
                                }}
                                exit={{ opacity: 0 }}
                                color={
                                    hovered
                                        ? "#9BBEC8"
                                        : "#ECF9FF"
                                }
                            />
                        </motion.mesh>
                    </motion.group>
                }
            </AnimatePresence>
        </>
    );
}