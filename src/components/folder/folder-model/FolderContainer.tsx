import { Suspense, useState } from "react"

import { useThree } from "@react-three/fiber"
import { Float, Text } from "@react-three/drei"
import { A11y } from "@react-three/a11y"

import { Folder } from "./Folder"
import { FolderControls } from "../environment/folder-control/FolderControls"

import type { FolderCanvasProps } from "../FolderCanvas"

const a11yStyle = {
    width: "0px",
    height: "0px",
    border: "none"
}

export const FolderContainer = ({ data, lang }: FolderCanvasProps) => {
    const [offset, setOffset] = useState(0)

    const { size } = useThree()

    return (
        <>
            <Float
                speed={1}
                rotationIntensity={.8}
                floatIntensity={1}
                floatingRange={[.01, .02]}
            >
                <Text
                    font="https://res.cloudinary.com/dzvrnl80x/raw/upload/v1705975333/my-portfolio/rubik_rg.ttf"
                    fontSize={.1}
                    lineHeight={1.5}
                    outlineWidth={.003}
                    position={[size.width > 1000 ? -.2 : 0, size.width > 1000 ? 2.1 : 1.5, 1]}
                    rotation={[-Math.PI * 0, 0, 0]}
                    textAlign="center"
                    color="#FAFDFE"
                >
                    {lang === "en"
                        ? `Click on ${data[offset / 6].title ?? "folder name"} to open project, \nor click on play to see the video`
                        : `Klicke auf ${data[offset / 6].title ?? "Ordnernamen"}, um das Projekt zu öffnen,\noder klicke auf Play um das Video zu sehen`}
                </Text>
            </Float>
            <A11y
                role="content"
                description="Folders with introduction video in front and content about the project inside the folder"
                a11yElStyle={a11yStyle}
            >
                <Suspense fallback={null}>
                    {data?.map((folderData, index) => {
                        return (
                            <Folder
                                key={folderData.slug}
                                position={{ x: (index * 6) - offset, y: -1.5 }}
                                screenWidth={size.width}
                                title={folderData.title}
                                lang={lang}
                                urlVideo={folderData.shortclip}
                                urlProject={
                                    lang === "en"
                                        ? `/projects/${folderData.slug}`
                                        : `/projects/de/${folderData.slug}`
                                }
                            />
                        )
                    })}
                </Suspense>
            </A11y>
            <FolderControls folderCount={data?.length} offset={offset} setOffset={setOffset} screenWidth={size.width} />
        </>
    )
}