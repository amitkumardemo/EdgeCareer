"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import Link from "next/link";
import ShinyText from "./ui/blocks/ShinyText/ShinyText";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles, Star, MousePointerClick } from "lucide-react";

// Sequential animation wrapper
const SequenceItem = ({ children, delay = 0, animation = "slideUp" }) => {
  const animations = {
    slideUp: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
    scale: { hidden: { scale: 0.8, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  };

  return (
    <motion.div
      variants={animations[animation]}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
    >
      {children}
    </motion.div>
  );
};

// Fixed positions for decorative floating elements (deterministic)
const positions = [
  { left: "10%", top: "20%" },
  { left: "30%", top: "40%" },
  { left: "60%", top: "25%" },
  { left: "80%", top: "50%" },
];

const FloatingElement = ({ children, index }) => {
  const pos = positions[index % positions.length];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.8],
        y: [0, -15, 0],
        rotate: [0, index % 2 === 0 ? 10 : -10, 0],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: index * 0.2,
      }}
      className="absolute pointer-events-none"
      style={{
        left: pos.left,
        top: pos.top,
      }}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [quote, setQuote] = useState(null);

  // fetch quote through server API to avoid CORS
  useEffect(() => {
    async function fetchQuote() {
      try {
        const res = await fetch("/api/quote", { cache: "no-store" });
        const data = await res.json();
        setQuote(data);
      } catch (error) {
        console.log("Failed to fetch quote");
      }
    }
    fetchQuote();
  }, []);

  const { scrollYProgress } = useScroll(
    containerRef.current
      ? { target: containerRef, offset: ["start start", "end start"] }
      : {}
  );

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5], [0, -2]);

  const handleMouseMove = (e) => {
    if (!imageWrapperRef.current || !isHovered) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const relativeX = e.clientX / rect.width - 0.5;
    const relativeY = e.clientY / rect.height - 0.5;
    setMousePosition({ x: relativeX, y: relativeY });
  };

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const decorativeElements = [
    <Sparkles key={1} className="text-primary w-6 h-6 opacity-60" />,
    <Star key={2} className="text-yellow-500 w-5 h-5 opacity-70" />,
    <Sparkles key={3} className="text-sky-400 w-7 h-7 opacity-50" />,
    <Star key={4} className="text-primary w-4 h-4 opacity-60" />,
  ];

  return (
    <section
      className="w-full pt-32 md:pt-36 pb-24 relative overflow-hidden"
      ref={containerRef}
    >
      {/* Decorative glows */}
      <motion.div
        className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-24 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl -z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      {decorativeElements.map((el, i) => (
        <FloatingElement key={i} index={i}>
          {el}
        </FloatingElement>
      ))}

      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto pt-32 pb-4">
          <SequenceItem animation="slideUp" delay={0.1}>
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl">
              Welcome to EdgeCareer
              <br />
              <span className="inline-block">Your AI-Powered Career Assistant</span>
            </h1>
          </SequenceItem>

          <SequenceItem animation="scale" delay={0.8}>
            <div className="relative">
              <ShinyText
                text="AI-powered career assistant for smarter job search, resume optimization, mock interviews, and industry insights."
                speed={3}
                className="mx-auto max-w-[600px] md:text-xl text-muted-foreground"
              />
              {quote && (
                <motion.div
                  className="mt-6 text-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <div className="text-sm font-semibold text-primary flex justify-center items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4" />
                    Quote of the Day
                  </div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    "{quote.q}" — <span className="font-medium">{quote.a}</span>
                  </p>
                </motion.div>
              )}
            </div>
          </SequenceItem>
        </div>

        {/* Buttons */}
        <SequenceItem animation="slideUp" delay={1.0}>
          <div className="flex justify-center space-x-4 mt-6 mb-20">
            <Link href="/dashboard">
              <Button size="lg" className="px-8 relative overflow-hidden group">
                {BUTTONS_MENUS.GET_STARTED}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/interview">
              <Button
                size="lg"
                variant="outline"
                className="px-6 py-4 border-2 border-gray-400 hover:border-gray-200 transition-all duration-300 hover:text-gray-200 hover:bg-gray-900"
              >
                <ShinyText text="Interview Prep" speed={2} className="text-lg font-semibold px-1" />
              </Button>
            </Link>
          </div>
        </SequenceItem>

        {/* Interactive image */}
        <SequenceItem animation="slideUp" delay={1.3}>
          <motion.div
            className="text-sm text-muted-foreground flex items-center justify-center gap-2 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.7 }}
          >
            <MousePointerClick className="h-4 w-4 text-primary/70" />
            <span>Hover and move your mouse over the image</span>
          </motion.div>

          <div
            className="hero-image-wrapper md:mt-4 relative max-w-5xl mx-auto px-6 md:px-12"
            ref={imageWrapperRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
              setIsHovered(false);
              setMousePosition({ x: 0, y: 0 });
            }}
          >
            <motion.div
              ref={imageRef}
              className="hero-image relative z-10 overflow-hidden rounded-xl border border-slate-800/80"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                scale: imageScale,
                opacity: imageOpacity,
                y: imageY,
                rotateX: isHovered ? mousePosition.y * 10 : 0,
                rotateY: isHovered ? -mousePosition.x * 10 : 0,
                rotate: imageRotate,
                transformStyle: "preserve-3d",
                perspective: 1000,
              }}
            >
              <div className="relative w-full aspect-video">
                <Image
                  src="/about.webp"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                  alt="Dashboard Preview"
                  className="object-cover transition-all duration-500"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </SequenceItem>
      </div>
    </section>
  );
};

export default HeroSection;
