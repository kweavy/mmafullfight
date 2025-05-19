'use client';

import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        className={`category-button ${
          selectedCategory === 'all'
            ? 'bg-[#E50914] text-white hover:bg-[#E50914]/90'
            : 'border-white/20 bg-transparent text-white hover:bg-white/10'
        }`}
        onClick={() => onSelectCategory('all')}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          className={`category-button ${
            selectedCategory === category
              ? 'bg-[#E50914] text-white hover:bg-[#E50914]/90'
              : 'border-white/20 bg-transparent text-white hover:bg-white/10'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}