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
      <div className="flex items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Your Saved Learning Paths
        </h1>
      </div>

      {selectedRoadmap && (
        <RoadmapWithProgress 
          roadmap={selectedRoadmap.steps}
          topic={selectedRoadmap.title}
          onClose={() => setSelectedRoadmap(null)}
        />
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg mb-8">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : savedRoadmaps.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-800 rounded-lg">
          <BookOpen className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-200">No saved learning paths</h3>
          <p className="mt-2 text-gray-400">
            Generate and save a learning path to see it here.
          </p>
          <Button
            onClick={() => router.push('/roadmaps')}
            className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Create New Roadmap
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedRoadmaps.map((roadmap) => (
            <Card key={roadmap.id} className="border-gray-800 bg-gray-900/50 hover:bg-gray-900/70 transition-colors">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white line-clamp-2 h-14">
                  {roadmap.title}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-400">
                  <span>{roadmap.steps.length} steps</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(roadmap.createdAt)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => loadRoadmap(roadmap)}
                    variant="outline"
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-0 text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Track Progress
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-indigo-400 hover:bg-indigo-900/20 hover:text-indigo-300"
                    onClick={() => router.push(`/roadmaps?load=${roadmap.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
