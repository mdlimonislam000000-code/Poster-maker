'use client';
import { useState } from 'react';
import { FiGrid, FiFileText, FiLayers } from 'react-icons/fi';
import AllContent from '@/components/AllContent';
import YourPosters from '@/components/YourPosters';
import Templates from '@/components/Tamplates';

function YourPostersContent() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-3">
      <h3 className="text-base font-bold text-amber-400">Your Posters Section</h3>
      <p className="text-xs text-slate-400">Ekhane kebol apnar nijer banano poster gulo thakbe.</p>
    </div>
  );
}

function TemplatesContent() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-300 space-y-3">
      <h3 className="text-base font-bold text-amber-400">Templates Section</h3>
      <p className="text-xs text-slate-400">Ekhane shob pre-built templates gulo show korbe.</p>
    </div>
  );
}

export default function MyPosterPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'your-posters' | 'templates'>('all');

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-amber-400">My Poster Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage your designs cleanly using separate components.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FiGrid /> All
          </button>
          <button
            onClick={() => setActiveTab('your-posters')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'your-posters'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FiFileText /> Your Posters
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-amber-400 text-slate-950 shadow'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FiLayers /> Templates
          </button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'all' && <AllContent />}
        {activeTab === 'your-posters' && <YourPosters />}
        {activeTab === 'templates' && <Templates />}
      </div>
    </div>
  );
}