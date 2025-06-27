"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import Link from "next/link";
import ShinyText from "./ui/blocks/ShinyText/ShinyText";
import SplitType from "split-type";
import SplitText from "./ui/blocks/ShinyText/SplitText";
import {
  motion,
  useAnimation,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, Sparkles, Star, MousePointerClick } from "lucide-react";

// Create a reusable sequence animation component
const SequenceItem = ({ children, delay = 0, animation = "slideUp" }) => {
  const animations = {
    slideUp: {
      hidden: { y: 40, opacity: 0 },
      visible: { y: 0, opacity: 1 },
    },
    slideLeft: {
      hidden: { x: -60, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    slideRight: {
      hidden: { x: 60, opacity: 0 },
      visible: { x: 0, opacity: 1 },
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 },
    },
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
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

// Floating animation component for decorative elements
const FloatingElement = ({ children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{
        opacity: [0, 1, 0.8],
        y: [0, -15, 0],
        rotate: [0, index % 2 === 0 ? 10 : -10, 0],
      }}
      transition={{
        duration: 3 + index,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: index * 0.2,
      }}
      className="absolute pointer-events-none"
      style={{
        left: `${10 + index * 30}%`,
        top: `${20 + index * 15}%`,
      }}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  const imageRef = useRef(null);
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const controls = useAnimation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [quote, setQuote] = useState(null);
const [quoteError, setQuoteError] = useState(null);

useEffect(() => {
  async function fetchQuote() {
    try {
      const res = await fetch("https://zenquotes.io/api/today", { cache: "no-store" });
      const data = await res.json();
     setQuote(data[0]);
    } catch (error) {
      setQuoteError("Could not load today's quote.");
    }
  }

  fetchQuote();
}, []);useEffect(() => {
  async function fetchQuote() {
    try {
      const res = await fetch("/api/quote");
      const data = await res.json();
      setQuote(data);
    } catch (error) {
      setQuoteError("Could not load today's quote.");
    }
  }

  fetchQuote();
}, []);




  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const imageY = useTransform(scrollYProgress, [0, 0.5], [0, 50]);
  const imageRotate = useTransform(scrollYProgress, [0, 0.5], [0, -2]);

  // Interactive tilt effect
  const handleMouseMove = (e) => {
    if (!imageWrapperRef.current || !isHovered) return;

    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate position relative to center (values between -0.5 and 0.5)
    const relativeX = x / rect.width - 0.5;
    const relativeY = y / rect.height - 0.5;

    setMousePosition({ x: relativeX, y: relativeY });
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  useEffect(() => {
    const imageElement = imageRef.current;

    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

   useEffect(()=>{
    const text= new SplitType(".gradient-title")
    let t1=gsap.timeline()
    t1.from(".char",{ 
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    })
    t1.from("#hero-description", {
      scale:0,
      opacity: 0,
      duration: 0.5,    
      ease: "power2.out",
    })
  },[])


  // Decorative elements for visual flair
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
      {/* Decorative background elements */}
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

      {/* Floating decorative elements */}
      {decorativeElements.map((element, index) => (
        <FloatingElement key={index} index={index}>
          {element}
        </FloatingElement>
      ))}

      <div className="space-y-6 text-center">
        {/* Main content with sequence animations */}
        <div className="space-y-6 mx-auto pt-32 pb-4">
          <SequenceItem animation="slideUp" delay={0.1}>
            <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl ">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
              >
                Welcome to EdgeCareer
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="inline-block"
              >
                Your AI-Powered Career Assistant
              </motion.span>
            </h1>
          </SequenceItem>

          <SequenceItem animation="scale" delay={0.8}>
            <div className="relative">
              <ShinyText
                text="AI-powered career assistant for smarter job search, resume
                optimization, mock interviews, and industry insights."
                speed={3}
                className="mx-auto max-w-[600px] md:text-xl relative z-10 text-muted-foreground"
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
                    "{quote.q}" — <span className="font-medium">Amit Kumar, Founder of TechieHelp</span>
                  </p>
                      
                </motion.div>
              )}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-sm -z-10"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 300, opacity: 1 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </div>
          </SequenceItem>

        </div>

        <SequenceItem animation="slideUp" delay={1.0}>
          <motion.div
            className="flex justify-center space-x-4 mt-6 mb-20"
            whileInView={{
              transition: {
                staggerChildren: 0.2,
              },
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-8 relative overflow-hidden group"
                >
                  <motion.span className="relative z-10 flex items-center gap-2">
                    {BUTTONS_MENUS.GET_STARTED}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.span>
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary rounded-md -z-10"
                    initial={{ x: -100, opacity: 0.5 }}
                    whileHover={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href="/interview">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-6 py-4 border-2 border-gray-400 hover:border-gray-200 transition-all duration-300 hover:text-gray-200 hover:bg-gray-900 relative overflow-hidden"
                >
                  <motion.span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <ShinyText
                    text="Interview Prep"
                    speed={2}
                    className="text-lg font-semibold px-1 relative z-10"
                  />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </SequenceItem>

        <SequenceItem animation="slideUp" delay={1.3}>
          {/* Interactive hint to engage with the image */}
          <motion.div
            className="text-sm text-muted-foreground flex items-center justify-center gap-2 my-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 0.7 }}
          >
            <MousePointerClick className="h-4 w-4 text-primary/70" />
            <span>Hover and move your mouse over the image</span>
          </motion.div>

          {/* Improved image container with proper margins and sizing */}
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
                boxShadow: isHovered
                  ? "0 30px 60px rgba(0, 0, 0, 0.4)"
                  : "0 10px 30px rgba(0, 0, 0, 0.2)",
              }}
              transition={{
                rotateX: { duration: 0.1, type: "tween" },
                rotateY: { duration: 0.1, type: "tween" },
                boxShadow: { duration: 0.3 },
              }}
            >
              {/* Responsive image with aspect ratio preservation */}
              <div className="relative w-full aspect-video">
                <Image
                  src="/about.webp"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 60vw"
                  alt="Dashboard Preview"
                  className="object-cover transition-all duration-500"
                  priority
                />

                {/* Overlay effect on hover/scroll */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent mix-blend-overlay"
                  style={{
                    opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.3]),
                  }}
                />

                {/* Reflection effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent"
                  style={{
                    opacity: isHovered ? 0.2 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Dynamic glow effect that follows cursor */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                style={{
                  background: isHovered
                    ? `radial-gradient(circle at ${
                        (mousePosition.x + 0.5) * 100
                      }% ${
                        (mousePosition.y + 0.5) * 100
                      }%, rgba(124, 58, 237, 0.3) 0%, rgba(0, 0, 0, 0) 70%)`
                    : "none",
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Subtle pulsing glow effect */}
              <motion.div
                className="absolute inset-0 rounded-lg bg-primary/5"
                animate={{
                  boxShadow: [
                    "0 0 0 rgba(124, 58, 237, 0)",
                    "0 0 20px rgba(124, 58, 237, 0.3)",
                    "0 0 0 rgba(124, 58, 237, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </motion.div>

            {/* Interactive UI elements that float above the image */}
            <motion.div
              className="absolute -bottom-4 -right-4 md:bottom-4 md:right-0 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700/80 shadow-lg z-20 hover:border-primary/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              style={{
                transform: isHovered ? "translateZ(50px)" : "none",
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary h-5 w-5" />
                <span className="text-sm font-medium">AI-powered insights</span>
              </div>
            </motion.div>

            <motion.div
              className="absolute -top-4 -left-4 md:top-4 md:left-0 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-slate-700/80 shadow-lg z-20 hover:border-primary/40 transition-colors"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              style={{
                transform: isHovered ? "translateZ(40px)" : "none",
                transformStyle: "preserve-3d",
              }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Star className="text-yellow-500 h-5 w-5" />
                <span className="text-sm font-medium">95% Success Rate</span>
              </div>
            </motion.div>

            {/* Virtual screen glare effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl"
              style={{
                opacity: isHovered ? 0.1 : 0,
              }}
            >
              <motion.div
                className="w-[150%] h-[150%] absolute -top-1/4 -left-1/4 bg-gradient-to-br from-white via-transparent to-transparent rotate-12 opacity-70"
                animate={{
                  x: isHovered ? mousePosition.x * 100 : 0,
                  y: isHovered ? mousePosition.y * 100 : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 40,
                  damping: 10,
                }}
              />
            </motion.div>

          </div>
        </SequenceItem>

        {/* Animated highlight bar at bottom */}
        <motion.div
          className="max-w-md h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-6 rounded-full"
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.3 }}
        />
      </div>
    </section>
  );
};

export default HeroSection;
