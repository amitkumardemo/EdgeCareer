"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * SequenceAnimation - Renders children with staggered animation effects
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child elements to animate
 * @param {string} [props.animation="slideInUp"] - Animation type: "slideInUp", "slideInLeft", "slideInRight", "fadeIn", "scaleUp"
 * @param {number} [props.staggerDelay=0.1] - Delay between each child animation (seconds)
 * @param {number} [props.initialDelay=0] - Initial delay before first animation (seconds)
 * @param {number} [props.duration=0.5] - Duration of each animation (seconds)
 * @param {boolean} [props.once=true] - Whether to animate only once when in view
 */
export default function SequenceAnimation({
  children,
  animation = "slideInUp",
  staggerDelay = 0.1,
  initialDelay = 0,
  duration = 0.5,
  once = true,
}) {
  const [animationVariants, setAnimationVariants] = useState({});

  useEffect(() => {
    // Define different animation variants
    const variants = {
      slideInUp: {
        hidden: { y: 50, opacity: 0 },
        visible: { y: 0, opacity: 1 },
      },
      slideInLeft: {
        hidden: { x: -50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      },
      slideInRight: {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      },
      fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      scaleUp: {
        hidden: { scale: 0.8, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
      },
    };

    setAnimationVariants(variants[animation] || variants.slideInUp);
  }, [animation]);

  // Early return if no animation variants are set yet
  if (!Object.keys(animationVariants).length) return <>{children}</>;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      transition={{ staggerChildren: staggerDelay, delayChildren: initialDelay }}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={animationVariants}
              transition={{ duration }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}