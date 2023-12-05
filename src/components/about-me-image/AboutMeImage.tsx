import { useEffect, useState } from "react"
import { motion, useReducedMotion, useScroll, useMotionValueEvent } from "framer-motion"
import { easeInOut } from "framer-motion/dom"

export const AboutMeImage = () => {
    const [isInView, setIsInView] = useState(false)
    const { scrollY } = useScroll()

    const shouldReduceMotion = useReducedMotion()

    // show image after timer on screen > 450
    useEffect(() => {
        if (window.innerWidth > 450) {
            const timer = setTimeout(() => {
                setIsInView(true)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [])

    // show image on scroll on screen < 450
    useMotionValueEvent(scrollY, "change", (latestScroll) => {
        // mobile 400 - 450
        if (latestScroll > 200 && window.innerWidth > 400 && window.innerWidth <= 450) {
            setIsInView(true)
        }

        // < 400
        if (latestScroll > 350 && window.innerWidth <= 400) {
            setIsInView(true)
        }
    })

    return (
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
    )
}