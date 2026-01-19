import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, Upload, Aperture, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
      isActive 
        ? "bg-gradient-to-r from-primary/20 to-purple-600/20 text-white shadow-lg shadow-primary/20 border border-primary/30" 
        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
    );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-br from-primary to-purple-600 p-2 rounded-xl animate-float">
                <Aperture className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-300">
                Semantic Footage
              </span>
              <span className="text-[10px] text-zinc-500 font-medium tracking-wider uppercase">AI-Powered Discovery</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <NavLink to="/" className={navItemClass}>
              <Search className="w-4 h-4" />
              <span>Search</span>
            </NavLink>
            <NavLink to="/upload" className={navItemClass}>
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </NavLink>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="relative group/avatar">
               <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-md opacity-0 group-hover/avatar:opacity-50 transition-opacity"></div>
               <div className="relative w-9 h-9 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white border-2 border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform">
                 <Sparkles className="w-4 h-4" />
               </div>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};