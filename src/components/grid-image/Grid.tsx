import { useEffect, useMemo } from "react"
import { useThree } from "@react-three/fiber"

import Sketch from "./Sketch"

export type GridData = {
    grid: number,
    strength: number,
    relaxation: number
}

const data = {
    grid: 300,
    strength: 0.1,
    relaxation: .9
}

const xl1_Screen = 2000
const xl_Screen = 1600
const lgScreen = 1200
const mdScreen2 = 1000
const mdScreen = 750
const sm2_Screen = 500
const sm_Screen = 420

export const Grid = ({ url }: { url: string }) => {
    const { gl, size } = useThree()

    const sizes = useMemo(() => {
        return size
    }, [size.width, size.height])

    let gridCanvasWidth = "60vw"
    let gridCanvasHeight = "34vh"

    const screenWidth = window.innerWidth;

    // handle canvas size based on screen size
    switch (!!screenWidth) {
        case screenWidth > xl_Screen && screenWidth <= xl1_Screen: { // 1600 - 2000
            gridCanvasWidth = "55vw"
            gridCanvasHeight = "30vh"
            break;
        }

        case screenWidth > lgScreen && screenWidth <= xl_Screen: { // 1200 - 1600
            gridCanvasWidth = "65vw"
            gridCanvasHeight = "29vh"
            break;
        }

        case screenWidth > mdScreen2 && screenWidth <= lgScreen: { // 1000 - 1200
            gridCanvasWidth = "70vw"
            gridCanvasHeight = "25vh"
            break;
        }

        case screenWidth > mdScreen && screenWidth <= mdScreen2: { // 750 - 1000
            gridCanvasWidth = "90vw"
            gridCanvasHeight = "24vh"
            break;
        }
        case screenWidth > sm2_Screen && screenWidth <= mdScreen: { // 500 - 750
            - 750
            gridCanvasWidth = "100vw"
            gridCanvasHeight = "22vh"
            break;
        }
        case screenWidth > sm_Screen && screenWidth <= sm2_Screen: { // < 500

            gridCanvasWidth = "100vw"
            gridCanvasHeight = "17vh"
            break;
        }

        case screenWidth <= sm_Screen: { // < 420
            gridCanvasWidth = "100vw"
            gridCanvasHeight = "15.5vh"
            break;
        }
    }

    useEffect(() => {
        const sketch = new Sketch({
            renderer: gl,
            size: sizes,
            data,
            url,
        });

        // set canvas size
        document.body.style.setProperty("--gridCanvasWidth", gridCanvasWidth)
        document.body.style.setProperty("--gridCanvasHeight", gridCanvasHeight)
    }, [gridCanvasWidth, gridCanvasHeight])

    return (
        null
    )
}