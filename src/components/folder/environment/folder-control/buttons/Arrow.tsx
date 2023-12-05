import { useState } from "react";

import { useThree } from "@react-three/fiber";
import { useGLTF, useCursor } from "@react-three/drei";
import { motion } from "framer-motion-3d";

import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        arrowSingle: THREE.Mesh
    }
}

type ArrowProps = {
    positionX: { lg: number, sm: number },
    rotationY: number,
    onClick: () => void,
}

// arrow mesh as button
export const Arrow = ({ positionX, rotationY, onClick }: ArrowProps) => {
    const { nodes } = useGLTF("https://res.cloudinary.com/dzvrnl80x/image/upload/v1700077557/my-portfolio/threejs-models/controls/arrow_flat_single.glb") as GLTFResult;
    const [hovered, setHover] = useState(false)
    const { size } = useThree()
    
    // handle cursor on hover
    useCursor(hovered)

    return (

        <motion.group
            position-x={size.width > 1000 ? positionX.lg : positionX.sm}
            position-y={size.width > 1000 ? -1.8 : -1.4}
            position-z={1}
            rotation-y={Math.PI * .31}
            scale={1}
            onPointerMove={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            onClick={onClick}
            dispose={null} >
            <motion.mesh
                geometry={nodes.arrowSingle.geometry}
                position={[0, -0.005, 0.063]}
                rotation={[0, rotationY, Math.PI * .5]}
            >
                <meshStandardMaterial
                    color={
                        hovered
                            ? "#9BBEC8"
                            : "#ECF9FF"
                    }
                />
            </motion.mesh>
        </motion.group >
    );
}