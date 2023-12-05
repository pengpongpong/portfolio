import { Suspense, useState } from "react"
import { useProgress } from "@react-three/drei";
import { Loading } from "@components/loading/Loading";
import { CanvasContainer } from "@components/canvas/CanvasContainer";
import { Particles } from "./Particles";

import { A11yAnnouncer, A11y } from "@react-three/a11y";

import type { Locale } from "@utils/utils";

const a11yStyle = {
	width: "0px",
	height: "0px",
	border: "none"
}

const ParticlesCanvas = ({ lang }: { lang: Locale }) => {
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
				flat
				camera={{
					fov: 45,
					near: 0.1,
					far: 50,
				}}
				style={{
					width: "100vw",
					height: "100vh",
					position: "absolute",
					top: 0,
					left: 0,
					zIndex: 0,
					userSelect: "none",
					overscrollBehavior: "contain"
				}}
				id="particleCanvas"
				onCreated={handleCreated}
			>
				<A11y
					role="content"
					description={lang === "en"
						? "Text in the form of particles: Welcome I'm Phuong"
						: "Text in Form von Partikeln: Welcome, I'm Phuong"
					}
					a11yElStyle={a11yStyle}
				>
					<Suspense fallback={null}>
						<Particles />
					</Suspense>
				</A11y>
			</CanvasContainer>
			<A11yAnnouncer />
		</>
	)
}

export default ParticlesCanvas