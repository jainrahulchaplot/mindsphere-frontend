import React from 'react';

interface CategoryChipsProps {
  categories: Array<{
    value: string;
    label: string;
  }>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function CategoryChips({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  label = "Category",
  disabled = false
}: CategoryChipsProps) {
  return (
    <div className="space-y-2">
      <div className="subtle text-indigo-300">{label}</div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Category selection">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-3 py-1.5 rounded-xl border border-white/20 text-xs transition-all ${
              selectedCategory === category.value
                ? 'opacity-100 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border-indigo-400/50' 
                : 'opacity-70 hover:opacity-90'
            }`}
            aria-pressed={selectedCategory === category.value}
            disabled={disabled}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
}
