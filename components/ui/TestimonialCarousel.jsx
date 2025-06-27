"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Duplicate the testimonial data to have at least 6 items
const duplicateTestimonials = (testimonials) => {
  // Return original testimonials if already enough items
  if (testimonials.length >= 6) return testimonials;
  
  // Otherwise, duplicate until we have at least 6
  const duplicated = [...testimonials];
  while (duplicated.length < 6) {
    duplicated.push(...testimonials.map(item => ({
      ...item,
      id: `${item.id || item.author}-copy-${duplicated.length}`
    })));
  }
  
  return duplicated.slice(0, 6);
};

export default function TestimonialCarousel({ testimonials }) {
  const extendedTestimonials = duplicateTestimonials(testimonials);
  const [visibleCards, setVisibleCards] = useState([0, 1, 2]);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  const [autoPlayIndex, setAutoPlayIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotation logic
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      rotateForward();
      setAutoPlayIndex((prev) => (prev + 1) % 2);
    }, 7000);
    
    return () => clearInterval(interval);
  }, [isPaused]);
  
  const rotateForward = useCallback(() => {
    setDirection(1);
    setVisibleCards(prev => {
      return prev.map(idx => (idx + 1) % extendedTestimonials.length);
    });
  }, [extendedTestimonials.length]);
  
  const rotateBackward = useCallback(() => {
    setDirection(-1);
    setVisibleCards(prev => {
      return prev.map(idx => (idx - 1 + extendedTestimonials.length) % extendedTestimonials.length);
    });
  }, [extendedTestimonials.length]);

  // Animation variants
  const cardVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    exit: (direction) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    })
  };

  return (
    <div 
      className="relative max-w-6xl mx-auto px-4" 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation buttons */}
      <Button 
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full hidden md:flex"
        onClick={rotateBackward}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm rounded-full hidden md:flex"
        onClick={rotateForward}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {/* Progress indicator */}
      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-1 bg-primary/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          key={autoPlayIndex}
        />
      </div>
      
      {/* Testimonial cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleCards.map((index, i) => (
          <AnimatePresence custom={direction} mode="popLayout" key={`position-${i}`}>
            <motion.div
              key={`testimonial-${extendedTestimonials[index].id || index}`}
              custom={direction}
              variants={cardVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="h-full"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="bg-background hover:shadow-lg transition-all duration-300 h-full border border-slate-800 hover:border-primary/30">
                <CardContent className="pt-6 h-full">
                  <div className="flex flex-col space-y-4 h-full">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden">
                        <Image
                          width={48}
                          height={48}
                          src={extendedTestimonials[index].image}
                          alt={`Photo of ${extendedTestimonials[index].author}`}
                          className="rounded-full object-cover border-2 border-primary/20"
                        />
                        <motion.div
                          className="absolute inset-0 border-2 rounded-full border-primary"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [1, 0, 1]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 1
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{extendedTestimonials[index].author}</p>
                        <p className="text-sm text-muted-foreground">{extendedTestimonials[index].role}</p>
                        <p className="text-sm text-primary">{extendedTestimonials[index].company}</p>
                      </div>
                    </div>
                    
                    <blockquote className="flex-grow">
                      <p className="text-muted-foreground italic relative leading-relaxed">
                        <span className="text-3xl text-primary absolute -top-4 -left-2">&quot;</span>
                        {extendedTestimonials[index].quote}
                        <span className="text-3xl text-primary absolute -bottom-4">&quot;</span>
                      </p>
                    </blockquote>
                    
                    {/* Rating stars */}
                    <div className="flex justify-end mt-auto">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, starIndex) => (
                          <motion.svg 
                            key={starIndex} 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-4 h-4 text-yellow-500"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + starIndex * 0.1 }}
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </motion.svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        ))}
      </div>

      {/* Mobile navigation dots */}
      <div className="md:hidden flex justify-center space-x-2 mt-6">
        <Button 
          size="sm" 
          variant="ghost"
          className="h-8 w-8 p-0 rounded-full"
          onClick={rotateBackward}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {[0, 1].map((group) => (
          <Button
            key={group}
            size="sm"
            variant={autoPlayIndex === group ? "default" : "outline"}
            className="h-2 w-2 p-0 rounded-full"
            onClick={() => setAutoPlayIndex(group)}
          />
        ))}
        
        <Button 
          size="sm" 
          variant="ghost"
          className="h-8 w-8 p-0 rounded-full"
          onClick={rotateForward}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}