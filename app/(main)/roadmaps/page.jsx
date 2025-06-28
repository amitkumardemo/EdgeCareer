"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, BookOpen, LayoutDashboard } from 'lucide-react';
import RoadmapWithProgress from '@/components/RoadmapWithProgress';

export default function RoadmapPage() {
  const [topic, setTopic] = useState('');
  const [roadmap, setRoadmap] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [error, setError] = useState('');
  const [showRoadmapViewer, setShowRoadmapViewer] = useState(false);

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
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black dark:text-white mb-4">
          Learning Path Generator
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Enter a topic to generate a personalized learning roadmap
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <Button
          onClick={() => router.push('/roadmaps/saved')}
          variant="outline"
          className="flex items-center gap-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 mx-auto text-black dark:text-white"
        >
          <BookOpen className="h-4 w-4" />
          View Saved Roadmaps
        </Button>
      </div>
      
      <form onSubmit={generateRoadmap} className="max-w-3xl mx-auto mb-12">
        <div className="flex gap-3 w-full">
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Learn React, Master Python, Data Science Fundamentals"
            disabled={loading}
            className="flex-1 bg-white border-gray-300 text-black placeholder-gray-500 focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
          />
          <Button
            type="submit"
            disabled={loading || !topic.trim()}
            className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-2.5 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none border border-black"
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
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              Your Learning Path: {topic}
            </h2>
            <Button
              onClick={async () => {
                setSaving(true);
                setSaveStatus('');
                try {
                  const response = await fetch('/api/roadmaps', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: `Learning Path: ${topic}`,
                      topic,
                      description: `A personalized learning path for ${topic}`,
                      steps: roadmap.map(step => ({
                        title: step.title,
                        description: step.description,
                        estimated_time: step.estimated_time
                      }))
                    }),
                  });

                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to save roadmap');
                  }

                  const data = await response.json();
                  setSaveStatus('Roadmap saved successfully!');
                } catch (err) {
                  console.error('Error saving roadmap:', err);
                  setSaveStatus(err.message || 'Failed to save roadmap');
                } finally {
                  setSaving(false);
                  // Clear the success message after 3 seconds
                  setTimeout(() => setSaveStatus(''), 3000);
                }
              }}
              disabled={saving || roadmap.length === 0}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Roadmap'
              )}
            </Button>
          </div>
          {saveStatus && (
            <div className={`mb-6 text-center text-sm ${saveStatus.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {saveStatus}
            </div>
          )}
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700"></div>
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
                  <div className="w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center justify-center shadow-md border border-gray-300 dark:border-gray-700">
                    {index + 1}
                  </div>
                </div>
                <Card className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-black dark:text-white">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{step.description}</p>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
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

      {showRoadmapViewer && roadmap.length > 0 && (
        <RoadmapWithProgress 
          roadmap={roadmap} 
          topic={topic} 
          onClose={() => setShowRoadmapViewer(false)} 
        />
      )}
    </div>
  );
}