import { Arrow } from "./buttons/Arrow"
import { A11y } from "@react-three/a11y"

type FolderControlsProps = {
    offset: number,
    setOffset: (value: number) => void,
    folderCount: number,
    screenWidth: number
}

export const FolderControls = ({ offset, setOffset, folderCount, screenWidth }: FolderControlsProps) => {

    // move folder to right
    const addOffset = () => {
        if (offset < (folderCount - 1) * 6) { // handle limit
            setOffset(offset + 6)
        }
    }

    // move folder to left
    const reduceOffset = () => {
        if (offset >= 6) { //handle limit
            setOffset(offset - 6)
        }
    }

    const a11yStyleLeft = {
        position: "absolute",
        left: screenWidth > 1000 ? "-15vw" : "-26vw",
        top: screenWidth > 1000 ? "33vh" : "26vh",
        width: "0px",
        height: "0px",
        border: "none"
    }

    const a11yStyleRight = {
        position: "absolute",
        left: screenWidth > 1000 ? "15vw" : "29vw",
        top: screenWidth > 1000 ? "33vh" : "26vh",
        width: "0px",
        height: "0px",
        border: "none"
    }

    return (
        <>
            {offset > 0
                &&
                <A11y
                    role="button"
                    description="Move to previous folder"
                    activationMsg="Moving to previous folder"
                    actionCall={reduceOffset}
                    a11yElStyle={a11yStyleLeft}
                    disabled={offset > 0 ? false : true}
                >
                    <Arrow
                        positionX={{ lg: -1, sm: -.6 }}
                        rotationY={Math.PI * .19}
                        onClick={reduceOffset}
                    />
                </A11y>
            }

            {
                offset < (folderCount - 1) * 6
                &&
                <A11y
                    role="button"
                    description="Move to next folder"
                    activationMsg="Moving to next folder"
                    actionCall={addOffset}
                    a11yElStyle={a11yStyleRight}
                    disabled={offset < (folderCount - 1) * 6 ? false : true}
                >
                    <Arrow
                        positionX={{ lg: 1, sm: .6 }}
                        rotationY={Math.PI * 1.19}
                        onClick={addOffset}
                    />
                </A11y>
            }
        </>
    )
}