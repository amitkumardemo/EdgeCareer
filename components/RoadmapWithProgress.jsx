'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function RoadmapWithProgress({ roadmap, topic, onClose }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [progress, setProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize completed steps from both localStorage and database
  useEffect(() => {
    if (!roadmap || roadmap.length === 0) return;

    // First, check localStorage for any saved progress
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(`roadmap-progress-${topic}`);
      if (savedProgress) {
        setCompletedSteps(JSON.parse(savedProgress));
      }
    }

    // Then, check database for completion status
    const dbCompletedSteps = {};
    roadmap.forEach(step => {
      if (step.completed) {
        dbCompletedSteps[step.id] = true;
      }
    });
    
    // Merge localStorage and database states, with database taking precedence
    setCompletedSteps(prev => ({
      ...prev,
      ...dbCompletedSteps
    }));
  }, [roadmap, topic]);

  // Calculate progress whenever completed steps change
  useEffect(() => {
    if (!roadmap || roadmap.length === 0) return;
    
    const completedCount = Object.values(completedSteps).filter(Boolean).length;
    const newProgress = Math.round((completedCount / roadmap.length) * 100);
    setProgress(newProgress);
  }, [completedSteps, roadmap]);

  const updateStepCompletion = async (stepId, completed) => {
    if (!roadmap) return;
    
    const step = roadmap.find(s => s.id === stepId);
    if (!step) return;

    setIsUpdating(true);
    
    try {
      // Update the database
      const response = await fetch(`/api/roadmaps/${step.roadmapId}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update step completion');
      }

      // Update local state
      setCompletedSteps(prev => ({
        ...prev,
        [stepId]: completed
      }));

      // Update localStorage
      if (typeof window !== 'undefined') {
        const savedProgress = JSON.parse(localStorage.getItem(`roadmap-progress-${topic}`) || '{}');
        localStorage.setItem(
          `roadmap-progress-${topic}`, 
          JSON.stringify({ ...savedProgress, [stepId]: completed })
        );
      }

    } catch (error) {
      console.error('Error updating step completion:', error);
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleStep = (stepId) => {
    const newCompletedState = !completedSteps[stepId];
    updateStepCompletion(stepId, newCompletedState);
  };

  if (!roadmap || roadmap.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <CardHeader className="sticky top-0 bg-gray-900 z-10 border-b border-gray-800">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold text-white">
              {topic} - Learning Path
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-300">Progress</span>
              <span className="text-sm font-medium text-gray-300">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-800" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {roadmap.map((step, index) => {
              const stepId = step.id || index;
              const isCompleted = !!completedSteps[stepId];
              
              return (
                <div 
                  key={stepId} 
                  className={`p-4 rounded-lg border transition-colors ${
                    isCompleted 
                      ? 'border-green-500/30 bg-green-500/5' 
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`step-${stepId}`}
                      checked={isCompleted}
                      onCheckedChange={() => toggleStep(stepId)}
                      disabled={isUpdating}
                      className={`mt-1 h-5 w-5 rounded border-gray-600 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-gray-800'
                      }`}
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`step-${stepId}`}
                        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer ${
                          isCompleted ? 'text-green-400' : 'text-white'
                        }`}
                      >
                        {step.title || `Step ${index + 1}`}
                      </label>
                      {step.description && (
                        <p className="mt-1 text-sm text-gray-400">
                          {step.description}
                        </p>
                      )}
                      {step.estimated_time && (
                        <div className="mt-2 flex items-center text-xs text-amber-400">
                          <span>⏱️ {step.estimated_time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            >
              Close
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
