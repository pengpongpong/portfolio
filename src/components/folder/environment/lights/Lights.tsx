export const Lights = () => {

    return (
        <>
            <directionalLight position={[2, 2, 2]} intensity={3}  />
            <ambientLight intensity={1} />
        </>
    )
}