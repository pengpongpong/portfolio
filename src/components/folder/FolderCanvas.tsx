import { useState } from "react";
import { useProgress } from "@react-three/drei";
import { Loading } from "@components/loading/Loading";

import { CanvasContainer } from "@components/canvas/CanvasContainer"
import { FolderContainer } from "./folder-model/FolderContainer";
import { Lights } from "./environment/lights/Lights";

import { type Scene, Color } from "three";
import type { Props } from "@utils/query";
import type { Locale } from "@utils/utils";

import { A11yAnnouncer } from '@react-three/a11y'

export type FolderCanvasProps = {
  data: Props["projectData"][],
  lang: Locale
}

export const FolderCanvas = ({ data, lang }: FolderCanvasProps) => {
  const { progress } = useProgress()
  const [loaded, setLoaded] = useState(false)

	// handle loaded on created and set background color
  const handleCreated = ({ scene }: { scene: Scene }) => {
    scene.background = new Color("#181D31")

    setLoaded(true)
  }

  return (
    <>
      <Loading progress={progress} lang={lang} lightColor loaded={loaded} />

      <CanvasContainer
        flat
        camera={{
          fov: 45,
          near: 0.1,
          far: 10,
          position: [0, 0, 7],
        }}
        style={{
          width: "100vw",
          position: "absolute",
          height: "calc(100% - 6rem)",
          top: "6rem",
          left: 0,
          right: 0,
          zIndex: 1,
        }}
        onCreated={handleCreated}
        id="folderCanvas"
      >
        <Lights />
        <FolderContainer data={data} lang={lang} />
      </CanvasContainer>
      <A11yAnnouncer />
    </>
  )
}