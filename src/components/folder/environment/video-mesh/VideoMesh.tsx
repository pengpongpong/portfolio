import { memo, useCallback, useEffect, useState } from "react";

import { Shape, ShapeGeometry } from "three";
import { useVideoTexture } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";

import { A11y } from "@react-three/a11y";

type VideoMeshProps = {
    url: string,
    inView: boolean,
    title: string
}

const shape = new Shape();

const x = 0;
const y = 0;

shape.moveTo(x - .2, y - .15);
shape.lineTo(x + .2, y - .15);
shape.lineTo(x, y + .2);

const TriangleGeometry = new ShapeGeometry(shape);

const a11yStyle = {
    width: "15px",
    height: "15px",
    border: "none"
}

export const VideoMesh = memo(({ url, inView, title }: VideoMeshProps) => {
    const [pause, setPause] = useState(true)

    const texture = useVideoTexture(url, {
        muted: true,
        loop: true,
        start: false,
        crossOrigin: "anonymous",
        playsInline: true,
        disablePictureInPicture: true,
        controls: false,
    })

    // pause if out of view
    useEffect(() => {
        if (!inView) {
            texture.source.data.pause();
            setPause(true)
        }
    }, [inView])

    // start/pause video
    const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation()

        if (texture.source.data.paused && inView) {
            texture.source.data.play();
            setPause(false)
        } else {
            texture.source.data.pause();
            setPause(true)
        }
    }, [texture.source.data.paused, inView])

    // start/pause video a11y
    const handleClickA11y = useCallback(() => {
        if (texture.source.data.paused && inView) {
            texture.source.data.play();
            setPause(false)
        } else {
            texture.source.data.pause();
            setPause(true)
        }
    }, [texture.source.data.paused, inView])

    return (
        <group
            position={[0, 2.08, 0.13]}
            rotation={[0.05, 0, 0]}
            onClick={handleClick}
        >
            <mesh>
                <planeGeometry args={[5.7, 3.7]} />
                <meshBasicMaterial
                    map={texture}
                    toneMapped={true} />
            </mesh>
            <A11y
                role="button"
                description={`Start or pause ${title} video`}
                activationMsg={pause ? `Starting ${title} video` : `Pausing ${title} video`}
                actionCall={handleClickA11y}
                a11yElStyle={a11yStyle}
                disabled={!inView}
            >
                <mesh
                    position={[0, 0, 0.01]}
                    rotation={[0, 0, -Math.PI * .5]}
                    geometry={TriangleGeometry}
                    onClick={handleClick}
                    visible={pause}
                >
                    <meshBasicMaterial color={"#ECF9FF"} />
                </mesh>
            </A11y>

        </group>
    )
})