"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import Link from "next/link";
import SplitType from "split-type";
import { scale } from "framer-motion";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

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

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl gradient-title " >
            Welcome to EdgeCareer
            <br />
            Your AI-Powered Career Assistant
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl" id="hero-description">
            AI-powered career assistant for smarter job search, resume optimization, mock interviews, and industry insights.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              {BUTTONS_MENUS.GET_STARTED}
            </Button>
          </Link>
          <Link href="/interview">
            <Button size="lg" variant="outline" className="px-8">
              {BUTTONS_MENUS.INTERVIEW_PREP}
            </Button>
          </Link>
        </div>
        <div className="hero-image-wrapper mt-5 md:mt-0">
          <div ref={imageRef} className="hero-image">
            <Image
              src="/about.webp"
              width={1280}
              height={720}
              alt="Dashboard Preview"
              className="rounded-lg shadow-2xl border mx-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
