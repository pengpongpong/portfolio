import { useRef } from "react"
import { motion, useReducedMotion, useInView } from "framer-motion"
import { easeInOut } from "framer-motion/dom"

export const AboutMeImage = () => {

    const shouldReduceMotion = useReducedMotion()

    const imageRef = useRef(null)
    const isInView = useInView(imageRef)

    return (
        <div ref={imageRef}>
            <motion.img
                src="https://res.cloudinary.com/dzvrnl80x/image/upload/v1698667770/my-portfolio/portrait-about_me.webp"
                alt="profile image"
                initial={{
                    x: shouldReduceMotion ? 0 : "100vw",
                    rotate: shouldReduceMotion ? 0 : 180,
                }}
                animate={
                    shouldReduceMotion
                        ? "reducedMotion"
                        : "default"
                }
                transition={{
                    type: "spring",
                    ease: easeInOut,
                    duration: 1.5,
                }}

                variants={{
                    "reducedMotion": {
                        x: 0,
                        rotate: 0
                    },
                    "default": {
                        x: isInView ? 0 : "100vw",
                        rotate: isInView ? 0 : 180
                    }
                }}
            />
        </div>
    )
}