"use client"
import React, { useEffect, useLayoutEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero";
import SplitText from "../components/ui/blocks/ShinyText/SplitText";
import ShinyText from "../components/ui/blocks/ShinyText/ShinyText";
import TestimonialCarousel from "@/components/ui/TestimonialCarousel";
import ScrollToTop from "@/components/ScrollToTop";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { features } from "@/data/features";
import { testimonial } from "@/data/testimonial";
import { faqs } from "@/data/faqs";
import { howItWorks } from "@/data/howItWorks";
import { ArrowRight, ChevronRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  useInView,
} from "framer-motion";
import { useRef } from "react";

const cardGradients = [
  "linear-gradient(to bottom right, #0e001a, #1e0033)", // Very dark purple
  "linear-gradient(to bottom right, #000d1a, #001a33)", // Very dark blue
  "linear-gradient(to bottom right, #001a0e, #00331c)", // Very dark green
  "linear-gradient(to bottom right, #1a0010, #33001e)", // Very dark magenta
  "linear-gradient(to bottom right, #1a0e00, #331c00)", // Very dark amber
  "linear-gradient(to bottom right, #0e0033, #000d33)", // Very dark purple-blue
  "linear-gradient(to bottom right, #00141a, #001a1f)", // Very dark teal
  "linear-gradient(to bottom right, #140026, #1f002b)", // Very dark violet
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

// Animated counter component
const AnimatedCounter = ({ value, text, classname }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [counter, setCounter] = React.useState(0);

  useEffect(() => {
    if (isInView) {
      let startValue = 0;
      const endValue = parseInt(value.toString().replace(/[^0-9]/g, ""));
      const duration = 2000;

      if (startValue === endValue) return;

      const increment = endValue / (duration / 16);

      const timer = setInterval(() => {
        startValue += increment;
        setCounter(Math.floor(startValue));

        if (startValue >= endValue) {
          setCounter(endValue);
          clearInterval(timer);
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`flex flex-col items-center justify-center space-y-2 ${classname} text-center`}
    >
      <h3 className="text-4xl font-bold">
        {value.toString().includes("+") ? `${counter}+` : counter}
        {value.toString().includes("%") ? "%" : ""}
        {value.toString() === "24/7" ? "24/7" : ""}
      </h3>
      <p className="text-muted-foreground">{text}</p>
    </motion.div>
  );
};


export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialRef = useRef(null);
  const faqRef = useRef(null);
  const ctaRef = useRef(null);

  const featuresFadeIn = useAnimation();
  const isFeaturesSectionInView = useInView(featuresRef, { once: true });

  useEffect(() => {
    if (isFeaturesSectionInView) {
      featuresFadeIn.start("visible");
    }
  }, [isFeaturesSectionInView, featuresFadeIn]);

  useLayoutEffect(() => {


    gsap.from("#features-title", {
      scale: 0.8,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#features-title",
        start: "top 80%",
      },
    });

    gsap.from(".feature-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".feature-card",
        start: "top 85%",
      },
    });

    // Stats number animation
    const statEls = document.querySelectorAll('.stat-number');
    statEls.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'));
      let suffix = el.textContent.replace(/\d+/g, '');
      gsap.fromTo(el, {
        innerText: 0
      }, {
        innerText: target,
        duration: 1.5,
        ease: 'power1.out',
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: el,
          start: 'top 90%'
        },
        onUpdate: function () {
          if (suffix === '+') {
            el.textContent = Math.floor(el.innerText) + '+';
          } else if (suffix === '%') {
            el.textContent = Math.floor(el.innerText) + '%';
          } else if (suffix === '/7') {
            el.textContent = Math.floor(el.innerText) + '/7';
          }
        }
      });
    });

    gsap.from("#how-section", {
      scale: 0.8,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "#how-section",
        start: "top 80%",
      },
    });
    gsap.from(".how-card", {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".how-card",
        start: "top 85%",
      },
    });
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/70 via-secondary/70 to-primary/70 z-50"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="grid-background"></div>

      <section id="hero" aria-label="Hero Section">
        <HeroSection />
      </section>

      <section
        id="features"
        className="w-full py-12 md:py-24 lg:py-32 bg-background relative overflow-hidden"
        aria-label="Platform Features"
        ref={featuresRef}
      >
        {/* Background decorations */}
        <motion.div
          className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] -z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        />

        <div className="container mx-auto px-2 md:px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {/* <motion.h2
              variants={fadeIn}
              className="text-3xl font-bold tracking-tighter text-center mb-12"
            >
              AI Features to Accelerate Your Career
            </motion.h2>
            <SplitText  /> */}
            <SplitText
              text="AI Features to Accelerate Your Career"
              className="text-5xl font-semibold text-center tracking-tighter ml-[15%] mr-auto mb-12"
              delay={100}
              duration={0.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={() => { }}
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={featuresFadeIn}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                        duration: 0.5,
                        delay: index * 0.1,
                      },
                    },
                  }}
                  className="flex"
                >
                  <motion.div
                    className="w-full h-full"
                    whileHover={{
                      scale: 1.04,
                      transition: { duration: 0.2, type: "spring", stiffness: 300 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="border border-slate-800/60 overflow-hidden shadow-lg group 
                               hover:shadow-xl hover:border-primary/30 transition-all duration-500 
                               flex flex-col h-full hover:shadow-primary/10"
                      style={{
                        background: cardGradients[index % cardGradients.length],
                        backgroundSize: "200% 200%",
                      }}
                    >
                      <CardContent className="pt-6 pb-6 text-center flex flex-col items-center h-full relative">
                        {/* Background animations */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Animated corner accent */}
                        <motion.div
                          className="absolute top-0 right-0 w-0 h-0 border-t-[80px] border-t-primary/20 border-l-[80px] border-l-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            clipPath: "polygon(100% 0, 0 0, 100% 100%)"
                          }}
                        />

                        <motion.div
                          className="absolute bottom-0 left-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:w-16 group-hover:h-16"
                        />

                        <div className="flex flex-col items-center justify-between h-full relative z-10">
                          <div className="flex flex-col items-center">
                            {/* Icon with enhanced animations */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{
                                delay: index * 0.2 + 0.2,
                                type: "spring",
                                stiffness: 200,
                              }}
                              className="text-gray-400 mb-4 bg-gradient-to-br from-primary/20 to-transparent p-4 pb-0 rounded-full relative "
                              whileHover={{
                                rotate: [0, -5, 5, -5, 0],
                                scale: 1.1,
                                transition: { duration: 0.6 }
                              }}
                            >
                              {/* Pulsing ring effect */}
                              <motion.div
                                className="absolute inset-0 rounded-full border-2 border-primary/30 pointer-events-none"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                animate={{
                                  scale: [1, 1.2, 1],
                                  opacity: [0.7, 0, 0.7],
                                }}
                                transition={{
                                  duration: 2.5,
                                  repeat: Infinity,
                                  repeatType: "loop",
                                  repeatDelay: index % 2 ? 0.5 : 1,
                                  ease: "easeInOut",
                                }}
                              />

                              {feature.icon}
                            </motion.div>

                            {/* Title with glowing effect on hover */}
                            <motion.h3
                              className="text-xl font-bold mb-3 text-gray-300 tracking-tight hover:text-white transition-colors duration-300"
                              whileHover={{
                                textShadow: "0 0 8px rgba(124, 58, 237, 0.6)"
                              }}
                            >
                              {feature.title}
                            </motion.h3>

                            {/* Description with reveal animation */}
                            <motion.p
                              className="text-white/70 line-clamp-3 text-sm group-hover:text-white/90 transition-colors duration-300"
                              initial={{ opacity: 0.8 }}
                              whileHover={{ opacity: 1 }}
                            >
                              {feature.description}
                            </motion.p>
                          </div>

                          {/* Button with enhanced hover effect */}
                          {feature.button && (
                            <motion.div
                              className="mt-6"
                              whileHover={{
                                scale: 1.05,
                                y: -3,
                                transition: {
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 10
                                }
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Link href={feature.button.link}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-200 border border-primary/50 hover:bg-primary/30 hover:text-gray-200 
                                           transition-all duration-300 relative overflow-hidden group/btn hover:border-white "
                                >
                                  <span className="relative z-10 flex items-center gap-2">
                                    {feature.button.text}
                                    <motion.svg
                                      className="w-4 h-4 opacity-0 group-hover/btn:opacity-100"
                                      initial={{ x: -10, opacity: 0 }}
                                      animate={{ x: 0, opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </motion.svg>
                                  </span>

                                  {/* Button background animation */}
                                  <motion.span
                                    className="absolute inset-0 bg-primary/20"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "0%" }}
                                    transition={{ duration: 0.3 }}
                                  />
                                </Button>
                              </Link>
                            </motion.div>
                          )}

                          {/* Animated underline */}
                          <motion.div
                            className="w-12 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent rounded-full absolute bottom-0"
                            initial={{ width: 0, opacity: 0 }}
                            whileInView={{ width: "40%", opacity: 1 }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
                            viewport={{ once: true }}
                            whileHover={{
                              width: "60%",
                              backgroundColor: "rgba(124, 58, 237, 0.6)",
                              transition: { duration: 0.3 }
                            }}
                          />
                        </div>

                        {/* Sparkle effect on hover */}
                        <motion.div
                          className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-80"
                          animate={[
                            { scale: [0, 1], opacity: [0, 0.8, 0], transition: { duration: 1.5, delay: 0.2, repeat: Infinity, repeatDelay: 3 } },
                          ]}
                        />
                        <motion.div
                          className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-60"
                          animate={[
                            { scale: [0, 1], opacity: [0, 0.6, 0], transition: { duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 2.5 } },
                          ]}
                        />
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        id="stats"
        className="w-full py-12 md:py-24 bg-muted/50 relative overflow-hidden"
        aria-label="Platform Statistics"
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-muted/0 via-primary/5 to-muted/0 z-0"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <AnimatedCounter
              value="50+"
              classname="animate-bounce"
              text="Industries Covered"
            />
            <AnimatedCounter
              value="1000+"
              classname="animate-bounce delay-500"
              text="Interview Questions"
            />
            <AnimatedCounter
              value="95%"
              classname="animate-bounce delay-1000"
              text="Success Rate"
            />
            <AnimatedCounter
              value="24/7"
              classname="animate-bounce delay-500"
              text="AI Support"
            />
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="w-full py-12 md:py-24 bg-background relative overflow-x-hidden" // Added overflow-x-hidden
        aria-label="How EdgeCareer Works"
        ref={howItWorksRef}
      >
        {/* Background decorative elements - adjust positioning to prevent overflow */}
        <motion.div
          className="absolute -z-10 w-72 h-72 rounded-full bg-primary/5 blur-[80px] opacity-70 top-20 right-0" // Changed from -right-20 to right-0
          animate={{
            x: [0, 20, 0], // Reduced movement range from 30 to 20
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute -z-10 w-96 h-96 rounded-full bg-secondary/5 blur-[100px] opacity-60 bottom-20 left-0" // Changed from -left-20 to left-0
          animate={{
            x: [0, -20, 0], // Reduced movement range from -30 to -20
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />

        <div className="container mx-auto px-4 md:px-6 relative pt-10 pb-10">
          <div className="text-center max-w-3xl mx-auto mb-6">
          <SplitText
              text="How it Works"
              className="text-5xl font-semibold text-center tracking-tighter mx-auto mr-auto mb-1"
              delay={100}
              duration={0.2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={() => { }}
            />
            <ShinyText
              text="Four simple steps to accelerate your career growth with AI-powered guidance"
              speed={3}
              className="text-muted-foreground"
            />
          </div>

          {/* Timeline with connected steps */}
          <div className="max-w-6xl mx-auto relative mt-24">
            {/* Connection line */}
            <motion.div
              className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-primary/10 via-primary/50 to-primary/10 rounded-full hidden lg:block"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true, margin: "-100px" }}
            />

            {/* Progress indicator */}
            <motion.div
              className="absolute top-8 left-0 h-1 bg-primary hidden lg:block"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 3.5, ease: "linear" }}
              viewport={{ once: true, margin: "-100px" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 50
                  }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-col items-center text-center space-y-4 relative"
                  whileHover={{ y: -8 }}
                >
                  {/* Step number indicator */}
                  <motion.div
                    className="absolute -top-12 font-bold text-5xl text-neutral-700"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2 + index * 0.15,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    viewport={{ once: true }}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Interactive icon container */}
                  <motion.div
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-background to-gray-900 border border-primary/20 flex items-center justify-center relative shadow-lg cursor-pointer z-10"
                    whileHover={{
                      scale: 1.15,
                      boxShadow: "0 0 25px rgba(124, 58, 237, 0.4)",
                      borderColor: "rgba(124, 58, 237, 0.5)"
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 15
                    }}
                  >
                    {/* Pulse effect */}
                    <motion.div
                      className="absolute inset-0  rounded-full border-2 border-yellow-500"
                      animate={{
                        boxShadow: [
                          "0 0 0 0 rgba(124, 58, 237, 0.4)",
                          "0 0 0 10px rgba(124, 58, 237, 0)"
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />

                    {/* Icon */}
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 15 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-black dark:text-white bg-gray-200 dark:bg-gray-800 rounded-full w-20 p-5 flex items-center justify-center"
                    >
                      {item.icon}
                    </motion.div>

                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="font-semibold text-xl text-black dark:text-white">
                      {item.title}
                    </h3>

                    <motion.div
                      className="h-0.5 w-12 bg-primary/50 mx-auto rounded-full"
                      initial={{ width: 0 }}
                      whileInView={{ width: 82 }}
                      transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                    />

                    {/* <motion.p 
                      className="text-muted-foreground text-sm"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      {item.description}
                    </motion.p> */}
                    <ShinyText
                      text={item.description}
                      speed={2}
                      className=" font-semibold text-sm mt-2"
                    />
                  </motion.div>

                  {/* Connection arrow to next step */}
                  {index < howItWorks.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-8 left-[60%] w-[calc(40%-10px)]" // Fixed width to prevent overflow
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.8 + index * 0.3, duration: 0.7 }}
                      viewport={{ once: true }}
                    >
                      <motion.svg
                        className="w-full h-full text-primary/40"
                        viewBox="0 0 100 40"
                        initial={{ pathLength: 0, opacity: 0.2 }}
                        whileInView={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 1 + index * 0.3, duration: 1 }}
                        viewport={{ once: true }}
                      >
                        <path
                          d="M0,20 C30,10 70,30 100,20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeDasharray="4,4"
                        />
                        <motion.path
                          d="M90,15 L100,20 L90,25"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 1.5 + index * 0.3, duration: 0.3 }}
                          viewport={{ once: true }}
                        />
                      </motion.svg>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Interactive call-to-action */}
            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              viewport={{ once: true }}
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

              {/* User interaction hint */}
              <motion.p
                className="text-muted-foreground text-sm mt-4 flex items-center justify-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 1] }}
                transition={{ delay: 2, duration: 2, repeat: 2 }}
              >
                <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                Try hovering over the steps to see details
                <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        className="w-full py-12 md:py-24 bg-muted/50 relative overflow-hidden"
        aria-label="User Testimonials"
        ref={testimonialRef}
      >
        {/* Background effects */}
        <motion.div
          className="absolute inset-0 bg-grid-small-white/[0.2] -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="absolute -z-10 w-full h-1/2 bottom-0 bg-gradient-to-t from-background/80 to-transparent"
        />

        <div className="container mx-auto px-4 md:px-6 flex justify-center items-center flex-col">
          <SplitText
            text="What Our Users Say"
            className="text-4xl px-4 py-1 font-bold mb-16 text-center"
            delay={50}
            duration={0.12}
            ease="power2.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />

          {/* Testimonial Carousel */}
          <TestimonialCarousel testimonials={testimonial} />
        </div>
      </section>

      <section
        id="faq"
        className="w-full py-12 md:py-24"
        aria-label="Frequently Asked Questions"
        ref={faqRef}
      >
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeIn} className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground">
              Find answers to common questions about our platform
            </motion.p>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, delay: index * 0.1 },
                    },
                  }}
                >
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:text-primary transition-colors">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.answer}
                      </motion.div>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section
        id="cta"
        className="w-full py-12 mb-12"
        aria-label="Call to Action"
        ref={ctaRef}
      >
        <motion.div
          className="mx-auto py-24 gradient rounded-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Animated particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: 10 + Math.random() * 20,
                height: 10 + Math.random() * 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100 - Math.random() * 100],
                x: [0, (Math.random() - 0.5) * 50],
                opacity: [0, 0.7, 0],
                scale: [0, 1 + Math.random(), 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            />
          ))}

          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto relative z-10"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl font-bold tracking-tighter text-black sm:text-4xl md:text-5xl"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              Ready to Accelerate Your Career?
            </motion.h2>

            <motion.p
              className="mx-auto max-w-[600px] text-black md:text-xl"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.2 },
                },
              }}
            >
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </motion.p>

            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { type: "spring", stiffness: 200, delay: 0.4 },
                },
              }}
            >
              <Link href="/dashboard" passHref>
                <Button
                  size="lg"
                  variant="secondary"
                  className="h-11 mt-5 relative group overflow-hidden"
                >
                  <motion.span className="relative z-10 flex items-center">
                    {BUTTONS_MENUS.START_JOURNEY}{" "}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.span>

                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "0%" }}
                    transition={{ duration: 0.4 }}
                  />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 mt-8 text-black"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="flex -space-x-1"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white/30 bg-gray-800"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  />
                ))}
              </motion.div>
              <span className="text-xs">+2300 users joined this month</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Scroll To Top Button */}
      <ScrollToTop />
    </>
  );
}
