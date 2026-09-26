'use client';
import { FiArrowRight, FiCheckCircle, FiShield, FiStar } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function HeroSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  const userName = user?.name ;
  const userParty = user?.party ;
  const userDistrict = user?.district ;
  const userImage = user?.image;
  const firstLetter = userName ? userName.charAt(0) : 'উ';

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28 px-6">

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        <div className="lg:col-span-7 space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-amber-400/30 px-4 py-2 rounded-full text-xs font-bold text-amber-400 shadow-inner">
            <FiStar className="text-sm animate-pulse text-amber-400" />
            <span>এআই প্রযুক্তিতে মুহূর্তেই তৈরি করুন প্রফেশনাল পোস্টার</span>
          </div>

          {/* প্রধান শিরোনাম */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            আপনার রাজনৈতিক ও সামাজিক প্রচার হোক <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">আরও আকর্ষণীয়</span>
          </h1>

          {/* সাব-টাইটেল বা বিবরণ */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            মহান বিজয় দিবস, নির্বাচনী প্রচার কিংবা যেকোনো সামাজিক অনুষ্ঠানে নাম, ছবি এবং মনমুগ্ধকর ডিজাইন দিয়ে মাত্র এক ক্লিকেই তৈরি করুন প্রফেশনাল ইভেন্ট পোস্টার। কোনো ডিজাইন দক্ষতার প্রয়োজন নেই!
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#create-poster"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              make a free poster
              <FiArrowRight className="text-lg" />
            </a>
            <a
              href="#live-preview"
              className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              Live Preview
            </a>
          </div>

          <div className="pt-6 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-amber-400 text-base shrink-0" />
              <span>কোনো সাইন-আপ ফি লাগবে না</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-amber-400 text-base shrink-0" />
              <span>১০০% সিকিউর ও নিরাপদ</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <div className="flex text-amber-400">
                <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
              </div>
              <span className="font-bold text-slate-200">৪.৯/৫ রেটিং</span>
            </div>
          </div>

        </div>

        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-sm">

            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl blur-xl opacity-20 -rotate-3"></div>
            
            <div className="relative bg-slate-900 border-2 border-amber-400/50 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Live Preview</span>
              </div>

              <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-4 text-center space-y-3">
                <div className="w-20 h-20 mx-auto rounded-full border-2 border-amber-400 overflow-hidden bg-slate-800 shadow-md flex items-center justify-center">
                  {userImage ? (
                    <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-amber-400 uppercase">{firstLetter}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-400">{userName}</h3>
                  <p className="text-[10px] text-slate-300">{userParty} — {userDistrict}</p>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-amber-400/20 text-[10px] text-slate-300">
                  &quot;মহান বিজয় দিবসের আন্তরিক শুভেচ্ছা ও অভিনন্দন&quot;
                </div>
              </div>

              <div className="text-center pt-1">
                <span className="text-[11px] text-slate-400 font-medium">✨ মুহূর্তেই ডাউনলোড করুন এইচডি কোয়ালিটি ইমেজ</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}