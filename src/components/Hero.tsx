'use client';
import { FiArrowRight, FiCheckCircle, FiShield, FiStar } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

export default function HeroSection() {
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  const userName = user?.name || "John Doe";
  const userParty = user?.party || "Political Activist";
  const userDistrict = user?.district || "Dhaka";
  const userImage = user?.image;
  const firstLetter = userName ? userName.charAt(0) : 'U';

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8">

      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column - Text Content */}
        <div className="lg:col-span-7 space-y-5 text-left">
          
          <div className="inline-flex items-center gap-2 bg-slate-900 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400 shadow-inner">
            <FiStar className="text-sm animate-pulse text-amber-400" />
            <span>Generate Professional Posters Instantly with AI</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Elevate Your Political & Social Campaigns <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Effortlessly</span>
          </h1>

          {/* Subtitle / Description */}
          <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl">
            Create stunning event posters, campaign materials, and festival greetings in just one click using personalized photos, titles, and layouts. No design skills required!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href="#create-poster"
              className="px-6.5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
            >
              Make a Free Poster
              <FiArrowRight className="text-base" />
            </a>
            <a
              href="#live-preview"
              className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              Live Preview
            </a>
          </div>

          {/* Highlights */}
          <div className="pt-5 border-t border-slate-900 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-amber-400 text-sm shrink-0" />
              <span>No Sign-up Fee</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShield className="text-amber-400 text-sm shrink-0" />
              <span>100% Secure</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <div className="flex text-amber-400 text-xs">
                <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
              </div>
              <span className="font-bold text-slate-200">4.9/5 Rating</span>
            </div>
          </div>

        </div>

        {/* Right Column - Live Preview Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-xs">

            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-3xl blur-xl opacity-20 -rotate-3"></div>
            
            <div className="relative bg-slate-900 border border-amber-400/40 rounded-2xl p-4 shadow-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Live Preview</span>
              </div>

              <div className="bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3 text-center space-y-2.5">
                <div className="w-16 h-16 mx-auto rounded-full border-2 border-amber-400 overflow-hidden bg-slate-800 shadow-md flex items-center justify-center">
                  {userImage ? (
                    <img src={userImage} alt={userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-amber-400 uppercase">{firstLetter}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-black text-amber-400">{userName}</h3>
                  <p className="text-[10px] text-slate-300">{userParty} — {userDistrict}</p>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-amber-400/20 text-[10px] text-slate-300">
                  &quot;Warm greetings on the occasion of Victory Day.&quot;
                </div>
              </div>

              <div className="text-center pt-0.5">
                <span className="text-[10px] text-slate-400 font-medium">✨ Download High-Quality HD Posters Instantly</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}