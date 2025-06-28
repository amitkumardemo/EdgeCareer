"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function RoadmapPage() {
  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRoadmap = async (e) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError('');
    setRoadmap([]);

    try {
      const response = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate roadmap');
      }

      const data = await response.json();
      setRoadmap(data);
    } catch (err) {
      console.error('Error generating roadmap:', err);
      setError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
        Learning Path Generator
      </h1>
      <p className="text-lg text-gray-400 text-center mb-10">
        Enter a topic to generate a personalized learning roadmap
      </p>
      
      <form onSubmit={generateRoadmap} className="max-w-3xl mx-auto mb-12">
        <div className="flex gap-3 w-full">
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Learn React, Master Python, Data Science Fundamentals"
            disabled={loading}
            className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Button
            type="submit"
            disabled={loading || !topic.trim()}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Roadmap'
            )}
          </Button>
        </div>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {roadmap.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Your Learning Path: {topic}
          </h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-700"></div>
            {roadmap.map((step, index) => (
              <div 
                key={step.id || index} 
                className="relative pl-16 mb-8 animate-fade-in"
                style={{
                  animationDelay: `${index * 100}ms`,
                  opacity: 0,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="absolute left-0 -translate-x-1/2 top-0 w-12 h-12 flex items-center justify-center z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold flex items-center justify-center shadow-md">
                    {index + 1}
                  </div>
                </div>
                <Card className="bg-gray-800 border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-4">{step.description}</p>
                    <div className="flex items-center text-amber-400 text-sm">
                      <span>⏱️ {step.estimated_time}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>Enter a topic above to generate your personalized learning roadmap</p>
        </div>
      )}
    </div>
  );
}