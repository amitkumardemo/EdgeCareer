"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import Link from "next/link";
import SplitType from "split-type";
import { Briefcase, FileText, Lightbulb, Mic } from "lucide-react";

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

  useEffect(() => {
    const text = new SplitType(".gradient-title");
    let t1 = gsap.timeline();
    t1.from(".char", {
      y: 50,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
    });
    t1.from("#hero-description", {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  const features = [
    {
      icon: <FileText className="text-primary w-6 h-6" />,
      title: "Tailored Resumes",
      desc: "Get AI-optimized resumes that match job descriptions perfectly.",
    },
    {
      icon: <Mic className="text-primary w-6 h-6" />,
      title: "Mock Interviews",
      desc: "Simulate real interviews with AI-driven questions and feedback.",
    },
    {
      icon: <Lightbulb className="text-primary w-6 h-6" />,
      title: "Career Insights",
      desc: "Stay informed with personalized job market and industry trends.",
    },
    {
      icon: <Briefcase className="text-primary w-6 h-6" />,
      title: "Smart Job Matching",
      desc: "Leverage AI to find job opportunities that suit your skills and goals.",
    },
  ];

  return (
    <section className="w-full pt-36 md:pt-48 pb-16">
      <div className="text-center space-y-6">
        <div className="space-y-6 mx-auto">
          <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl xl:text-6xl gradient-title">
            Welcome to EdgeCareer
            <br />
            Your AI-Powered Career Assistant
          </h1>

          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">

            AI-powered career assistant for smarter job search, resume
            optimization, mock interviews, and industry insights.


          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl" id="hero-description">

            Smarter job search, resume optimization, interview practice, and industry insights—powered by AI.


            AI-powered career assistant for smarter job search, resume optimization, mock interviews, and industry insights.

          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">

            <Button
              size="lg"
              className="px-8 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-primary/90"
            >
              Get Started
            </Button>
          </Link>
          <Link href="/interview">
            <Button
              size="lg"
              variant="outline"
              className="px-8 transition-transform duration-200 ease-in-out transform hover:scale-105 hover:bg-accent hover:text-primary"
            >
              Interview Prep

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

        {/* Feature Highlights */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
          {features.map((feat, index) => (
            <div
              key={index}
              className="rounded-xl border p-5 shadow hover:shadow-lg transition duration-300 bg-card"
            >
              <div className="mb-3">{feat.icon}</div>
              <h3 className="font-semibold text-lg mb-1">{feat.title}</h3>
              <p className="text-muted-foreground text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>

        <div className="hero-image-wrapper mt-10 md:mt-14">
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
