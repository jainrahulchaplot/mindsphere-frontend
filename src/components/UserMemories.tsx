import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from './Card';
import Button from './Button';
import CategoryChips from './CategoryChips';
import NotesTextbox from './NotesTextbox';
import { profileApi } from '../api/profileApi';

interface Memory {
  id: string;
  user_id: string;
  content: string;
  category: string;
  importance: number;
  created_at: string;
  updated_at: string;
}

interface UserMemoriesProps {
  userId: string;
}

const categories = [
  { value: 'personal', label: 'Personal' },
  { value: 'work', label: 'Work' },
  { value: 'health', label: 'Health' },
  { value: 'family', label: 'Family' },
  { value: 'hobbies', label: 'Hobbies' },
  { value: 'goals', label: 'Goals' },
  { value: 'general', label: 'General' },
];

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    personal: 'text-blue-400',
    work: 'text-indigo-400',
    health: 'text-green-400',
    family: 'text-purple-400',
    hobbies: 'text-yellow-400',
    goals: 'text-pink-400',
    general: 'text-gray-400',
  };
  return colors[category] || 'text-gray-400';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
};

export default function UserMemories({ userId }: UserMemoriesProps) {
  const [newMemory, setNewMemory] = useState({ content: '', category: 'general' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch memories
  const { data: memories, isLoading } = useQuery<Memory[]>({
    queryKey: ['user-memories', userId],
    queryFn: () => profileApi.getMemories(userId),
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 60000, // 60 seconds
    refetchOnWindowFocus: false,
  });

  // Add memory mutation
  const addMemory = useMutation({
    mutationFn: (memory: { content: string; category: string }) => 
      profileApi.addMemory(userId, memory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-memories', userId] });
      setNewMemory({ content: '', category: 'general' });
      setIsSubmitting(false);
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  // Delete memory mutation
  const deleteMemory = useMutation({
    mutationFn: (id: string) => profileApi.deleteMemory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-memories', userId] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemory.content.trim() && !addMemory.isPending && !isSubmitting) {
      setIsSubmitting(true);
      addMemory.mutate(newMemory);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          Long Term Memory About Me
        </div>
        <div className="text-center text-silver py-8">Loading memories...</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        Long Time Memory About Me
      </div>
      
      <div className="text-silver text-sm mb-4">
        Share details about yourself that I'll remember for personalized experiences.
      </div>

      {/* Add Memory Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="space-y-4">
          <CategoryChips
            categories={categories}
            selectedCategory={newMemory.category}
            onCategoryChange={(category) => setNewMemory({ ...newMemory, category })}
            label="Category"
          />
          
          <NotesTextbox
            value={newMemory.content}
            onChange={(content) => setNewMemory({ ...newMemory, content })}
            placeholder=""
            onKeyPress={handleKeyPress}
            disabled={addMemory.isPending}
            userId={userId}
          />
          
          <div className="mt-6">
            <Button
              label={addMemory.isPending || isSubmitting ? 'Saving...' : 'Save Memory'}
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
              disabled={addMemory.isPending || isSubmitting || !newMemory.content.trim()}
              isLoading={addMemory.isPending || isSubmitting}
              variant="white"
              size="md"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
            />
          </div>
        </div>
      </form>

      {/* Memories List */}
      {memories && memories.length > 0 ? (
        <div className="space-y-3">
          {memories.map((memory) => (
            <div key={memory.id} className="bg-graphite/50 border border-white/10 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-sm font-medium ${getCategoryColor(memory.category)}`}>
                  {categories.find(cat => cat.value === memory.category)?.label}
                </span>
                <button
                  onClick={() => deleteMemory.mutate(memory.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                  disabled={deleteMemory.isPending}
                >
                  Delete
                </button>
              </div>
              <p className="text-white text-sm mb-2">{memory.content}</p>
              <div className="text-xs text-silver/60">
                {formatDate(memory.created_at)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-silver">
          No memories added yet. Start by adding one above!
        </div>
      )}
    </Card>
  );
}