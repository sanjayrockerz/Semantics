import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/Button';
import { useDebounce } from '../lib/hooks';

interface SearchBoxProps {
  onSearch: (query: string, filters: any) => void;
  isLoading: boolean;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minScore, setMinScore] = useState(0.4);
  
  const debouncedQuery = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      onSearch(debouncedQuery, { minScore, requiredTags: [] });
    }
  }, [debouncedQuery, minScore]);

  const handleClear = () => setInputValue('');

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="relative group z-10">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-primary transition-all duration-300 group-focus-within:scale-110" />
          </div>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for emotions, scenes, objects, or actions..."
            className="relative w-full h-16 pl-14 pr-36 glass rounded-2xl text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 shadow-2xl transition-all duration-300 hover:shadow-primary/20"
          />

          <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              {inputValue && (
                  <button 
                    type="button"
                    onClick={handleClear}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                      <X className="w-4 h-4" />
                  </button>
              )}
              <div className="h-8 w-px bg-white/10" />
              <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2.5 rounded-xl transition-all duration-300 ${showFilters ? 'text-white bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/50' : 'text-zinc-400 hover:text-white hover:bg-white/10'}`}
              >
                  <SlidersHorizontal className="w-5 h-5" />
              </button>
          </div>
        </div>
      </div>

      {/* Enhanced Filters Panel */}
      {showFilters && (
        <div className="glass rounded-xl p-5 animate-slide-in shadow-xl">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm text-white font-semibold">Confidence Threshold:</span>
                </div>
                <div className="flex-1 relative">
                  <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.1" 
                      value={minScore} 
                      onChange={(e) => setMinScore(parseFloat(e.target.value))}
                      className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-primary"
                      style={{
                        background: `linear-gradient(to right, rgb(99, 102, 241) 0%, rgb(99, 102, 241) ${minScore * 100}%, rgb(63, 63, 70) ${minScore * 100}%, rgb(63, 63, 70) 100%)`
                      }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white w-14 text-right">{(minScore * 100).toFixed(0)}%</span>
                  <div className={`w-2 h-2 rounded-full ${minScore >= 0.7 ? 'bg-emerald-500' : minScore >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'} animate-pulse`}></div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};