import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Card from './Card';
import Button from './Button';
import NotesTextbox from './NotesTextbox';
import { profileApi } from '../api/profileApi';

interface Snippet {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface SnippetsInputProps {
  userId: string;
}

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

export default function SnippetsInput({ userId }: SnippetsInputProps) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  // Fetch snippets
  const { data: snippets, isLoading } = useQuery<Snippet[]>({
    queryKey: ['user-snippets', userId],
    queryFn: () => profileApi.getSnippets(userId),
    enabled: !!userId,
    retry: 1,
    retryDelay: 1000,
    staleTime: 60000, // 60 seconds
    refetchOnWindowFocus: false,
  });

  // Add snippet mutation
  const addSnippet = useMutation({
    mutationFn: (snippetContent: string) => profileApi.addSnippet(userId, snippetContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-snippets', userId] });
      setContent('');
    },
  });

  // Delete snippet mutation
  const deleteSnippet = useMutation({
    mutationFn: (id: string) => profileApi.deleteSnippet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-snippets', userId] });
    },
  });

  const handleSubmit = () => {
    if (content.trim() && !addSnippet.isPending) {
      addSnippet.mutate(content);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
          My Quick Thoughts
        </div>
        <div className="text-center text-silver py-8">Loading snippets...</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="heading bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        My Quick Thoughts
      </div>
      
      <div className="text-silver text-sm mb-4">
        Share quick thoughts, ideas, or notes that I'll remember for immediate high relevance.
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <NotesTextbox
            value={content}
            onChange={setContent}
            placeholder=""
            maxLength={500}
            rows={3}
            onKeyPress={handleKeyPress}
            disabled={addSnippet.isPending}
            userId={userId}
          />
          
          <div className="mt-6">
            <Button
              type="button"
              label={addSnippet.isPending ? 'Saving...' : 'Save Snippet'}
              onClick={handleSubmit}
              disabled={addSnippet.isPending || !content.trim()}
              isLoading={addSnippet.isPending}
              variant="white"
              size="md"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
            />
          </div>
        </div>
      </form>

      {/* Snippets List */}
      {snippets && snippets.length > 0 && (
        <div className="mt-6 space-y-3">
          {/* <div className="text-indigo-400 text-sm font-medium mb-2">Recent Snippets</div> */}
          {snippets.slice(0, 5).map((snippet) => (
            <div key={snippet.id} className="bg-graphite/50 border border-white/10 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <p className="text-white text-sm flex-1">{snippet.content}</p>
                <button
                  onClick={() => deleteSnippet.mutate(snippet.id)}
                  className="text-red-400 hover:text-red-300 text-xs ml-2"
                  disabled={deleteSnippet.isPending}
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-silver/60 mt-1">
                {formatDate(snippet.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}