"use client"
import React, { useEffect, useLayoutEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BUTTONS_MENUS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import HeroSection from "@/components/hero";
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
import { ArrowRight } from 'lucide-react';


export default function LandingPage() {
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
      <Head>
        <title>EdgeCareer - Your AI Career Coach for Smarter Job Growth</title>
        <meta
          name="description"
          content="Get personalized AI-powered career guidance, resume building, job interview practice, and tailored job opportunities with EdgeCareer."
        />
        <meta
          name="keywords"
          content="AI Career Coach, Resume Builder, Job Guidance, Interview Practice, Career Growth, EdgeCareer"
        />
        <meta name="author" content="EdgeCareer Team" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.edgecareer.com/" />
        <meta property="og:title" content="EdgeCareer - Your AI Career Coach" />
        <meta
          property="og:description"
          content="AI-driven personalized career guidance, resume reviews, and job matching."
        />
        <meta property="og:image" content="/EdgeCareers.png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="EdgeCareer - AI Career Coach" />
        <meta
          name="twitter:description"
          content="Smarter job search and resume building with AI assistance."
        />
        <meta name="twitter:image" content="/EdgeCareers.png" />

        {/* Canonical */}
        <link rel="canonical" href="https://www.edgecareer.com/" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "EdgeCareer",
              url: "https://www.edgecareer.com",
              description:
                "AI-powered career growth platform offering resume help, job recommendations, and interview preparation.",
              publisher: {
                "@type": "Organization",
                name: "EdgeCareer",
              },
            }),
          }}
        />
      </Head>

      <div className="grid-background"></div>

      <section id="hero" aria-label="Hero Section">
        <HeroSection />
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background" aria-label="Platform Features">
        <div className="container mx-auto px-4 md:px-6">

          <h2 className="text-3xl font-bold tracking-tighter text-center mb-12" id="features-title">
            Powerful Features for Your Career Growth
         
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="feature-card border-2 hover:border-primary transition-colors duration-300"
              >
                <CardContent className="pt-6 text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="stats" className="w-full py-12 md:py-24 bg-muted/50" aria-label="Platform Statistics">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold stat-number" data-target="50">0+</h3>
              <p className="text-muted-foreground">Industries Covered</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold stat-number" data-target="1000">0+</h3>
              <p className="text-muted-foreground">Interview Questions</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold stat-number" data-target="95">0%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h3 className="text-4xl font-bold stat-number" data-target="24">0/7</h3>
              <p className="text-muted-foreground">AI Support</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-12 md:py-24 bg-background" aria-label="How EdgeCareer Works">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12" id="how-section">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">
              Four simple steps to accelerate your career growth
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 how-card"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-12 md:py-24 bg-muted/50" aria-label="User Testimonials">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((testimonial, index) => (
              <Card key={index} className="bg-background">
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={testimonial.image}
                          alt={`Photo of ${testimonial.author}, ${testimonial.role} at ${testimonial.company}`}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        <p className="text-sm text-primary">{testimonial.company}</p>
                      </div>
                    </div>
                    <blockquote>
                      <p className="text-muted-foreground italic relative">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">&quot;</span>
                        {testimonial.quote}
                        <span className="text-3xl text-primary absolute -bottom-4">&quot;</span>
                      </p>
                    </blockquote>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="w-full py-12 md:py-24" aria-label="Frequently Asked Questions">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Find answers to common questions about our platform
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="cta" className="w-full" aria-label="Call to Action">
        <div className="mx-auto py-24 gradient rounded-lg">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-4xl md:text-5xl">
              Ready to Accelerate Your Career?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl">
              Join thousands of professionals who are advancing their careers
              with AI-powered guidance.
            </p>
            <Link href="/dashboard" passHref>
              <Button
                size="lg"
                variant="secondary"
                className="h-11 mt-5 animate-bounce"
              >
                {BUTTONS_MENUS.START_JOURNEY} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
