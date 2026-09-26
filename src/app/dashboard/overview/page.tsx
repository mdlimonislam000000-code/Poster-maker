'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlusCircle, FiImage, FiClock, FiArrowRight } from 'react-icons/fi';
import { authClient } from "@/lib/auth-client";

export default function DashboardOverview() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name || 'ব্যবহারকারী';

  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUserPosters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${userId}/posters`);
        const result = await response.json();

        if (result.success) {
          setPosters(result.data);
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosters();
  }, [userId]);

  // ফিল্টার করা পোস্টার হিসাব করা (যেমন: পার্টিসহ এবং টেমপ্লেট বা পার্টি ছাড়া)
  const totalPosters = posters.length;
  const partyPostersCount = posters.filter(p => {
    const data = p.formData || p;
    return data.party && data.party.trim() !== "" && data.party !== " ";
  }).length;
  
  const templateCount = totalPosters - partyPostersCount;

  // সাম্প্রতিক ৩টি পোস্টার নেওয়া
  const recentPosters = posters.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* ওয়েলকাম ব্যানার */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
            স্বাগতম, <span className="text-amber-400">{userName}</span>! 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-400">
            আপনার রাজনৈতিক পোস্টার ও ডিজাইনগুলো এক নজরে দেখতে এবং নতুন ডিজাইন তৈরি করতে ড্যাশবোর্ড ব্যবহার করুন।
          </p>
        </div>
        <Link
          href="create-poster"
          className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-md cursor-pointer"
        >
          <FiPlusCircle className="text-base" /> নতুন পোস্টার তৈরি করুন
        </Link>
      </div>

      {/* স্ট্যাটিস্টিক্স কার্ডসমূহ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center text-xl font-bold">
            <FiImage />
          </div>
          <div>
            <p className="text-xs text-slate-400">মোট সংরক্ষিত পোস্টার</p>
            <h3 className="text-xl font-bold text-white">{loading ? '...' : totalPosters}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center text-xl font-bold">
            <FiClock />
          </div>
          <div>
            <p className="text-xs text-slate-400">পার্টি সমেত পোস্টার</p>
            <h3 className="text-xl font-bold text-white">{loading ? '...' : partyPostersCount}</h3>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-400/10 text-blue-400 flex items-center justify-center text-xl font-bold">
            <FiImage />
          </div>
          <div>
            <p className="text-xs text-slate-400">খালি টেমপ্লেটসমূহ</p>
            <h3 className="text-xl font-bold text-white">{loading ? '...' : templateCount}</h3>
          </div>
        </div>
      </div>

      {/* সাম্প্রতিক পোস্টার সেকশন */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">সাম্প্রতিক ডিজাইনসমূহ</h2>
          <Link 
            href="/dashboard/my-poster" 
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition"
          >
            সব দেখুন <FiArrowRight />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">লোড হচ্ছে...</div>
        ):(
          recentPosters.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              এখনো কোনো পোস্টার তৈরি করা হয়নি। নতুন একটি তৈরি করে শুরু করুন!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentPosters.map((poster) => {
                const data = poster.formData || poster;
                const posterImage = poster.generatedImageUrl || poster.photos?.[0] || poster.photo || data.photos?.[0] || null;

                return (
                  <div key={poster._id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded font-bold uppercase">
                        {data.occasionType || 'পোস্টার'}
                      </span>
                      <span className="text-slate-400">
                        {poster.createdAt ? new Date(poster.createdAt).toLocaleDateString() : ''}
                      </span>
                    </div>

                    <div className="h-28 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center relative">
                      {posterImage ? (
                        <img src={posterImage} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-slate-600">ছবি নেই</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate">নাম: {data.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">পদবি: {data.designation}</p>
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