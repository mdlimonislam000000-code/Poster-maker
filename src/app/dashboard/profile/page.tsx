'use client';
import { useState, useEffect } from 'react';
import { FiMail, FiShield, FiEdit3, FiCheck, FiLoader, FiUser, FiMapPin, FiFlag } from 'react-icons/fi';
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    role: '',
    district: '',
    party: ''
  });

  useEffect(() => {
    if (session?.user) {
      setUser((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSuccessMessage('প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-400 gap-2 text-xs">
        <FiLoader className="animate-spin text-amber-400 text-xl" /> প্রোফাইল লোড হচ্ছে...
      </div>
    );
  }

  // নামের প্রথম অক্ষর দিয়ে এভাটর তৈরি
  const firstLetter = user.name ? user.name.charAt(0) : 'উ';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* পেজ হেডার */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-wide">User Profile</h2>
          <p className="text-xs text-slate-400 mt-0.5">আপনার ব্যক্তিগত তথ্য এবং রাজনৈতিক পরিচয় পরিচালনা করুন</p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-lg backdrop-blur-md animate-fade-in">
          <FiCheck className="text-base font-bold" /> {successMessage}
        </div>
      )}

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden">

        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-800/80 pb-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-xl">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-black text-3xl uppercase">
                {firstLetter}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-lg text-xs shadow">
              <FiShield />
            </div>
          </div>
          
          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold text-white tracking-wide">{user.name || 'নাম পাওয়া যায়নি'}</h3>
            <p className="text-xs text-amber-400 font-semibold inline-flex items-center gap-1 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              <FiShield className="text-xs" /> {user.role}
            </p>
          </div>
        </div>

        {!isEditing ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/60 rounded-2xl p-4 transition-all space-y-1.5 group">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 group-hover:text-amber-400 transition">
                  <FiMail className="text-amber-400/80" /> ইমেইল ঠিকানা
                </span>
                <p className="text-slate-200 font-semibold text-sm truncate">{user.email || 'ইমেইল নেই'}</p>
              </div>

              <div className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/60 rounded-2xl p-4 transition-all space-y-1.5 group">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 group-hover:text-amber-400 transition">
                  <FiFlag className="text-amber-400/80" /> দল / সংগঠন
                </span>
                <p className="text-slate-200 font-semibold text-sm truncate">{user.party}</p>
              </div>

              <div className="bg-slate-950/40 hover:bg-slate-950/70 border border-slate-800/60 rounded-2xl p-4 transition-all space-y-1.5 group sm:col-span-2">
                <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 group-hover:text-amber-400 transition">
                  <FiMapPin className="text-amber-400/80" /> এলাকা / থানা
                </span>
                <p className="text-slate-200 font-semibold text-sm">{user.district}</p>
              </div>

            </div>

          </div>
        ) : (
          /* এডিট ফরম */
          <form onSubmit={handleSave} className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">নাম</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">ইমেইল</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <FiMail />
                  </span>
                  <input
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">দল / সংগঠন</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <FiFlag />
                  </span>
                  <input
                    type="text"
                    value={user.party}
                    onChange={(e) => setUser({ ...user, party: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">এলাকা / থানা</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 pointer-events-none">
                    <FiMapPin />
                  </span>
                  <input
                    type="text"
                    value={user.district}
                    onChange={(e) => setUser({ ...user, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-amber-400 transition shadow-inner"
                  />
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
}