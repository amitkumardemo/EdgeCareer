'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowLeft, LayoutDashboard } from 'lucide-react';
import RoadmapWithProgress from '@/components/RoadmapWithProgress';
import { Loader2, ExternalLink } from 'lucide-react';

export default function SavedRoadmapsPage() {
  const router = useRouter();
  const [savedRoadmaps, setSavedRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      console.log('Fetching roadmaps...');
      try {
        const response = await fetch('/api/roadmaps');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', errorText);
          throw new Error(`Failed to load saved roadmaps: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Roadmaps data:', data);
        setSavedRoadmaps(data);
      } catch (err) {
        console.error('Error loading roadmaps:', err);
        setError(`Failed to load saved roadmaps: ${err.message}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center mb-10 text-center">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="self-start mb-4 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-black dark:text-white">
          Your Saved Learning Paths
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View and manage your saved learning paths
        </p>
      </div>

      {selectedRoadmap && (
        <RoadmapWithProgress 
          roadmap={selectedRoadmap.steps}
          topic={selectedRoadmap.title}
          onClose={() => setSelectedRoadmap(null)}
        />
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
        </div>
      ) : savedRoadmaps.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-black dark:text-white">No saved learning paths</h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Generate and save a learning path to see it here.
          </p>
          <Button
            onClick={() => router.push('/roadmaps')}
            className="mt-6 bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 border border-black dark:border-white"
          >
            Create New Roadmap
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedRoadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-black dark:text-white line-clamp-2 h-14">
                  {roadmap.title}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>{roadmap.steps.length} steps</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(roadmap.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => loadRoadmap(roadmap)}
                  variant="outline"
                  className="w-full border border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Track Progress
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
