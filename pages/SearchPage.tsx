import React, { useState, useEffect } from 'react';
import { SearchBox } from '../components/SearchBox';
import { ResultCard } from '../components/ResultCard';
import { searchClips, getVideosStatus } from '../services/api';
import { SearchResponse, Video } from '../types';
import { Loader2, Film, Database, Info, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [response, setResponse] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [library, setLibrary] = useState<Video[]>([]);

  useEffect(() => {
    // Load library status
    getVideosStatus().then(setLibrary);
  }, []);

  const handleSearch = async (query: string, filters: any) => {
    setIsLoading(true);
    setLastQuery(query);
    try {
      const data = await searchClips(query, filters);
      setResponse(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const indexedCount = library.filter(v => v.status === 'ready').length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto gradient-bg">
      
      {/* Enhanced Header */}
      <div className="flex flex-col items-center mb-12 text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gradient-to-r from-primary/30 via-purple-600/30 to-pink-600/30 animate-pulse-slow"></div>
          <h1 className="relative text-5xl md:text-6xl font-black tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
              Semantic Library
            </span>
          </h1>
        </div>
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
          Discover footage using natural language. Our AI understands emotions, scenes, and context.
        </p>
        <div className="flex items-center gap-3 px-5 py-2.5 glass rounded-full shadow-xl">
           <div className="relative">
             <Database className="w-4 h-4 text-primary" />
             <div className="absolute inset-0 bg-primary blur-md opacity-50"></div>
           </div>
           <span className="text-sm font-semibold text-white">{indexedCount} Videos Indexed</span>
           {library.length > indexedCount && (
               <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse">
                 {library.length - indexedCount} Processing
               </span>
           )}
        </div>
      </div>

      <div className="sticky top-20 z-30 glass py-5 -mx-4 px-4 mb-10 shadow-2xl">
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
            <div className="relative mb-6">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <div className="absolute inset-0 blur-xl bg-primary/50 animate-pulse"></div>
            </div>
            <p className="text-lg font-medium">Scanning semantic vectors...</p>
            <p className="text-sm text-zinc-600 mt-2">Analyzing {indexedCount} video segments</p>
          </div>
        ) : response ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between px-4 py-3 glass rounded-xl text-xs font-mono shadow-lg">
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-zinc-300">QUERY: <span className="text-white font-semibold">"{lastQuery}"</span></span>
                <span className="px-2 py-1 rounded-md bg-primary/20 text-primary border border-primary/30">
                  {response.totalResults} RESULTS
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-zinc-500">PROCESSED IN <span className="text-emerald-400 font-bold">{response.executionTimeMs}ms</span></span>
              </div>
            </div>
            
            {response.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-in">
                {response.results.map((result, index) => (
                  <div key={result.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-in">
                    <ResultCard result={result} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 glass rounded-3xl border-2 border-dashed border-white/10 hover:border-primary/30 transition-colors">
                 <Film className="w-20 h-20 mx-auto text-zinc-700 mb-6 animate-float" />
                 <h3 className="text-2xl font-bold text-white mb-3">No semantic matches found</h3>
                 <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
                    We couldn't find a strong match for <span className="text-white font-semibold">"{lastQuery}"</span> in the indexed footage. Try different keywords or upload more videos.
                 </p>
              </div>
            )}
          </div>
        ) : (
           /* Enhanced Empty State */
           <div className="flex flex-col items-center justify-center py-24 text-center">
               <div className="relative p-6 rounded-3xl glass mb-6 animate-float">
                  <Info className="w-12 h-12 text-primary" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-3xl blur-xl"></div>
               </div>
               <h3 className="text-xl font-semibold text-white mb-2">Start Your Search</h3>
               <p className="text-zinc-500 mb-6 max-w-md">Enter a query to search across <span className="text-primary font-bold">{indexedCount}</span> indexed videos.</p>
               {indexedCount === 0 && (
                   <Link to="/upload" className="px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-medium hover:shadow-xl hover:shadow-primary/50 transition-all hover:scale-105">
                       Upload Your First Video
                   </Link>
               )}
           </div>
        )}
      </div>
    </div>
  );
};
