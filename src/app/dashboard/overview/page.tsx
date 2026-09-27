'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlusCircle, FiImage, FiLayers, FiArrowRight } from 'react-icons/fi';
import { authClient } from "@/lib/auth-client";

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name || 'ব্যবহারকারী';

  const [posters, setPosters] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [postersRes, templatesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_SERVER}/api/users/${userId}/posters`),
          fetch(`${process.env.NEXT_PUBLIC_BETTER_AUTH_SERVER}/api/templates/user/${userId}`)
        ]);

        const postersResult = await postersRes.json();
        const templatesResult = await templatesRes.json();

        if (postersResult.success && Array.isArray(postersResult.data)) {
          setPosters(postersResult.data);
        }

        if (templatesResult.success && Array.isArray(templatesResult.data)) {
          setTemplates(templatesResult.data);
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);

  const totalTemplates = templates.length;
  const totalPosters = posters.length;
  const combinedTotal = totalTemplates + totalPosters;

  const combinedItems = [
    ...posters.map(p => ({ ...p, dataType: 'poster' })),
    ...templates.map(t => ({ ...t, dataType: 'template' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const recentItems = combinedItems.slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
            Welcome, <span className="text-amber-400">{userName}</span>! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            View your political posters and templates at a glance, and create new designs using the dashboard.
          </p>
        </div>
        <Link
          href="create-poster"
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
        >
          <FiPlusCircle className="text-base" />Make a New Poster 
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl font-bold">
            <FiLayers />
          </div>
          <div>
            <p className="text-xs text-slate-400">Template</p>
            <h3 className="text-xl font-bold text-white">{loading ? '...' : totalTemplates} </h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center text-xl font-bold">
            <FiImage />
          </div>
          <div>
            <p className="text-xs text-slate-400">Create Poster</p>
            <h3 className="text-xl font-bold text-white">{loading ? '...' : totalPosters} </h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-xl font-bold">
            <FiImage />
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Saved Designs</p>
            <h3 className="text-xl font-bold text-white">{loading ? '...' : combinedTotal} </h3>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recent Designs</h2>
          <Link 
            href="/dashboard/my-poster" 
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition"
          >
            View All <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Loading...</div>
        ):(
          recentItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              You haven't created any templates or posters yet. Start by creating a new design!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentItems.map((item) => {
                const data = item.formData || item;
                const itemImage = item.generatedImageUrl || item.photos?.[0] || item.photo || data.photos?.[0] || null;
                const isTemplate = item.dataType === 'template';
                const titleText = item.title || data.headlineText || data.name || 'Design';

                return (
                  <div key={item._id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase ${isTemplate ? 'bg-amber-400/10 text-amber-400' : 'bg-blue-400/10 text-blue-400'}`}>
                        {isTemplate ? (item.category || 'Template') : 'Create Poster'}
                      </span>
                      <span className="text-slate-400">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="h-28 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                      {itemImage ? (
                        <img src={itemImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-600">No Image Available</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {data.name ? `Name: ${data.name}` : `Title: ${titleText}`}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {data.designation ? `Designation: ${data.designation}` : (item.category ? `Category: ${item.category}` : '')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
}