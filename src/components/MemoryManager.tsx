import React, { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface Memory {
  id: string;
  content: string;
  category: string;
  importance: number;
  created_at: string;
}

interface Snippet {
  id: string;
  content: string;
  created_at: string;
}

const MemoryManager: React.FC<{ userId: string }> = ({ userId }) => {
  const [memoryContent, setMemoryContent] = useState('');
  const [memoryCategory, setMemoryCategory] = useState('general');
  const [memoryImportance, setMemoryImportance] = useState(1);
  const [snippetContent, setSnippetContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  // Fetch memories
  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: ['memories', userId],
    queryFn: async () => {
      const { api } = await import('../api/client');
      const response = await api.get(`/memories`);
      return response.data;
    }
  });

  // Fetch snippets
  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: ['snippets', userId],
    queryFn: async () => {
      const { api } = await import('../api/client');
      const response = await api.get(`/snippets`);
      return response.data;
    }
  });

  // Save memory with debounce
  const saveMemory = useMutation({
    mutationFn: async (data: { content: string; category: string; importance: number }) => {
      const { api } = await import('../api/client');
      const response = await api.post('/memories', {
        ...data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories', userId] });
      setMemoryContent('');
    }
  });

  // Save snippet with debounce
  const saveSnippet = useMutation({
    mutationFn: async (content: string) => {
      const { api } = await import('../api/client');
      const response = await api.post('/snippets', {
        content
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['snippets', userId] });
      setSnippetContent('');
    }
  });

  // Debounced save functions
  const debouncedSaveMemory = useCallback(
    debounce((content: string, category: string, importance: number) => {
      if (content.trim()) {
        saveMemory.mutate({ content: content.trim(), category, importance });
      }
    }, 1000),
    [saveMemory]
  );

  const debouncedSaveSnippet = useCallback(
    debounce((content: string) => {
      if (content.trim()) {
        saveSnippet.mutate(content.trim());
      }
    }, 1000),
    [saveSnippet]
  );

  const handleMemorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (memoryContent.trim() && !isSaving) {
      setIsSaving(true);
      debouncedSaveMemory(memoryContent, memoryCategory, memoryImportance);
      setTimeout(() => setIsSaving(false), 2000); // Prevent rapid clicks
    }
  };

  const handleSnippetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (snippetContent.trim() && !isSaving) {
      setIsSaving(true);
      debouncedSaveSnippet(snippetContent);
      setTimeout(() => setIsSaving(false), 2000); // Prevent rapid clicks
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Memory & Thoughts Manager</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Memory Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Long-term Memories</h3>
          <form onSubmit={handleMemorySubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">What's on your mind? How do you feel?</label>
              <textarea
                value={memoryContent}
                onChange={(e) => setMemoryContent(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                rows={3}
                placeholder="Share a meaningful memory or thought..."
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={memoryCategory}
                  onChange={(e) => setMemoryCategory(e.target.value)}
                  className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                >
                  <option value="general">General</option>
                  <option value="wellness">Wellness</option>
                  <option value="family">Family</option>
                  <option value="work">Work</option>
                  <option value="goals">Goals</option>
                  <option value="hobbies">Hobbies</option>
                  <option value="learning">Learning</option>
                  <option value="philosophy">Philosophy</option>
                  <option value="creativity">Creativity</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Importance</label>
                <select
                  value={memoryImportance}
                  onChange={(e) => setMemoryImportance(Number(e.target.value))}
                  className="p-2 border border-gray-600 rounded bg-gray-700 text-white"
                >
                  <option value={1}>1 - Low</option>
                  <option value={2}>2</option>
                  <option value={3}>3 - Medium</option>
                  <option value={4}>4</option>
                  <option value={5}>5 - High</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={!memoryContent.trim() || isSaving || saveMemory.isPending}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {isSaving || saveMemory.isPending ? 'Saving...' : 'Save Memory'}
            </button>
          </form>
        </div>

        {/* Snippet Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Quick Thoughts</h3>
          <form onSubmit={handleSnippetSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">What's on your mind right now?</label>
              <textarea
                value={snippetContent}
                onChange={(e) => setSnippetContent(e.target.value)}
                className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
                rows={3}
                placeholder="Share a quick thought or insight..."
                maxLength={500}
              />
              <div className="text-xs text-gray-400 mt-1">
                {snippetContent.length}/500 characters
              </div>
            </div>
            <button
              type="submit"
              disabled={!snippetContent.trim() || isSaving || saveSnippet.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {isSaving || saveSnippet.isPending ? 'Saving...' : 'Save Thought'}
            </button>
          </form>
        </div>
      </div>

      {/* Display Memories and Snippets */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Memories</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {memories.slice(0, 5).map((memory) => (
              <div key={memory.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-300">{memory.content}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">{memory.category}</span>
                      <span className="text-xs text-gray-400">★{memory.importance}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Thoughts</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {snippets.slice(0, 5).map((snippet) => (
              <div key={snippet.id} className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">{snippet.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default MemoryManager;
