"use client";
import React, { useState, useRef } from "react";
import { FiStar, FiUploadCloud, FiCheckCircle, FiArrowRight, FiRefreshCw, FiDownload, FiZoomIn, FiX, FiSave } from "react-icons/fi";
import { toPng } from "html-to-image";
import { authClient } from "@/lib/auth-client";

interface CreatePosterPageProps {
  userId?: string; 
}

export default function CreatePosterPage({}: CreatePosterPageProps) {
  const { data: session } = authClient.useSession();
  const user_Id = session?.user?.id || "user_limon_mia";

  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    party: "",
    location: "",
    occasionType: "মহান বিজয় দিবস",
    headlineText: "",
  });

  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const posterRef1 = useRef<HTMLDivElement>(null);
  const posterRef2 = useRef<HTMLDivElement>(null);
  const posterRef3 = useRef<HTMLDivElement>(null);

  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [previewPosterData, setPreviewPosterData] = useState<{ id: number; title: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (uploadedPhotos.length + files.length > 3) {
      alert("You can upload a maximum of 3 photos.");
      return;
    }

    setIsUploading(true);
    const newPhotos: string[] = [];
    let processedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          newPhotos.push(uploadEvent.target.result as string);
        }
        processedCount++;
        if (processedCount === files.length) {
          setUploadedPhotos((prev) => [...prev, ...newPhotos]);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const savePosterToDatabase = async (posterPayload: any, posterNumber: number) => {
    try {
      setSavingId(posterNumber);
      const response = await fetch("http://localhost:5000/api/posters/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(posterPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert("Failed to save poster to collection!");
        console.error("Failed to save poster to collection:", result.message);
      } else {
        alert("Poster successfully saved to your collection!");
        console.log("Poster successfully saved to collection!", result.data);
      }
    } catch (error) {
      console.error("Error saving poster:", error);
      alert("An error occurred while saving the poster.");
    } finally {
      setSavingId(null);
    }
  };

  const handleCreatePoster = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.occasionType || !formData.headlineText) {
      alert("Please fill in all required fields including the headline text.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
    }, 800);
  };

  const handleDownloadAndSave = async (ref: React.RefObject<HTMLDivElement | null>, id: number, layoutName: string) => {
    const element = ref.current;
    if (!element) {
      alert("Poster element not found!");
      return;
    }

    try {
      setDownloadingId(id);
      
      await new Promise((resolve) => setTimeout(resolve, 300));

      const generatedImageUrl = await toPng(element, { cacheBust: true, pixelRatio: 3 });
      
      const link = document.createElement("a");
      link.href = generatedImageUrl;
      link.download = `poster-${layoutName}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const posterDataPayload = {
        userId: user_Id,
        formData: formData,
        photos: uploadedPhotos,
        generatedImageUrl: generatedImageUrl,
        layoutTheme: layoutName,
        createdAt: new Date().toISOString(),
      };

      await savePosterToDatabase(posterDataPayload, id);

    } catch (error) {
      console.error("Download & Save error:", error);
      alert("Failed to process poster. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSaveOnly = async (ref: React.RefObject<HTMLDivElement | null>, id: number, layoutName: string) => {
    const element = ref.current;
    if (!element) {
      alert("Poster element not found!");
      return;
    }

    try {
      setSavingId(id);
      
      await new Promise((resolve) => setTimeout(resolve, 300));

      const generatedImageUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
      
      const posterDataPayload = {
        userId: user_Id,
        formData: formData,
        photos: uploadedPhotos,
        generatedImageUrl: generatedImageUrl,
        layoutTheme: layoutName,
        createdAt: new Date().toISOString(),
      };

      await savePosterToDatabase(posterDataPayload, id);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save poster.");
    } finally {
      setSavingId(null);
    }
  };

  const handleReset = () => {
    setIsGenerated(false);
    setIsGenerating(false);
    setUploadedPhotos([]);
  };

  const getEventText2 = () => {
    if (formData.occasionType.includes("বিজয়")) {
      return "১৯৭১ সালের ১৬ ডিসেম্বর লাখো শহীদের রক্তে ভেজা লাল-সবুজের পতাকায় অর্জিত হয়েছে আমাদের স্বাধীনতা। বিজয়ের এই মহান দিনে দেশের সার্বভৌমত্ব রক্ষায় যুবসমাজকে ঐক্যবদ্ধ হয়ে কাজ করার আহ্বান জানাচ্ছি।";
    } else if (formData.occasionType.includes("শোক")) {
      return "জাতীয় এই শোকাবহ দিনে গভীর শ্রদ্ধার সাথে স্মরণ করছি ইতিহাসের শ্রেষ্ঠ সন্তানদের। তাদের আদর্শ ও আত্মত্যাগের চেতনাকে বুকে ধারণ করে সামনের দিকে এগিয়ে যাওয়ার অঙ্গীকার করছি।";
    } else if (formData.occasionType.includes("নির্বাচন")) {
      return "জনগণের অধিকার প্রতিষ্ঠা, আইনের শাসন ও এলাকার সার্বিক উন্নয়ন নিশ্চিত করতে আপনার একটি ভোট অত্যন্ত মূল্যবান। সৎ ও যোগ্য নেতৃত্ব নির্বাচনে আমাদের সাথে থাকুন।";
    }
    return "উৎসবের এই আনন্দঘন মুহূর্তে আপনার ও আপনার পরিবারের সুখ, শান্তি ও সমৃদ্ধি কামনা করছি। পারস্পরিক সৌহার্দ্য ও ভ্রাতৃত্বের বন্ধন আরও সুদৃঢ় হোক।";
  };

  const getEventText3 = () => {
    if (formData.occasionType.includes("বিজয়")) {
      return "নেতৃত্ব মানে কেবল ক্ষমতা নয়, নেতৃত্ব হলো ত্যাগের মাধ্যমে মানুষের নিঃস্বার্থ সেবা করা। আপনাদের অকৃত্রিম ভালোবাসা ও আস্থায় আমরা ধন্য। আসুন দেশ ও দশের কল্যাণে এক কাতারে দাঁড়াই।";
    } else if (formData.occasionType.includes("শোক")) {
      return "শোককে শক্তিতে রূপান্তর করে জনগণের অধিকার আদায়ের সংগ্রামে আমাদের আন্দোলন অবিচল থাকবে। শহীদদের আত্মত্যাগ বৃথা যেতে দেবো না— এটাই আজকের দিনের শপথ।";
    } else if (formData.occasionType.includes("নির্বাচন"))  {
      return "পরিবর্তন, সুশাসন ও উন্নয়নের ধারা বজায় রাখতে সাধারণ মানুষের পাশে থেকে কাজ করার দৃঢ় প্রত্যয় ব্যক্ত করছি। আপনাদের দোয়া ও সহযোগিতা একান্ত কামনা করছি।";
    }
    return "ভ্রাতৃত্বের মহিমায় উদ্ভাসিত হোক আমাদের চারপাশ। সমাজের প্রতিটি মানুষ শান্তিতে ও নিরাপদে বসবাস করুক— এই আমাদের চিরন্তন প্রত্যাশা ও কামনা।";
  };

  return (
    <div className="bg-gray-950">
      <main className="max-w-6xl mx-auto p-6 bg-black text-white rounded-3xl shadow-2xl my-12">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-amber-400 flex items-center justify-center gap-2">
            <FiStar /> Event-Optimized AI Poster Generator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate your posters, preview them, and download or save to your collection.
          </p>
        </div>

        {!isGenerating && !isGenerated && (
          <form onSubmit={handleCreatePoster} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full h-[46px] rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full h-[46px] rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Party / Organization</label>
                <input
                  type="text"
                  name="party"
                  value={formData.party}
                  onChange={handleChange}
                  className="w-full h-[46px] rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Location (area / Upazila)</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full h-[46px] rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Occasion Type</label>
                <select
                  name="occasionType"
                  value={formData.occasionType}
                  onChange={handleChange}
                  className="w-full h-[46px] rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm outline-none focus:border-amber-400"
                >
                  <option value="মহান বিজয় দিবস">মহান বিজয় দিবস</option>
                  <option value="শোক ও স্মরণ দিবস">শোক ও স্মরণ দিবস</option>
                  <option value="নির্বাচনী প্রচার">নির্বাচনী প্রচার</option>
                  <option value="শুভেচ্ছা (ঈদ/উৎসব)">শুভেচ্ছা (ঈদ/উৎসব)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Headline Text (বাংলা হেডলাইন) *</label>
                <input
                  type="text"
                  name="headlineText"
                  required
                  value={formData.headlineText}
                  onChange={handleChange}
                  className="w-full h-[46px] rounded-xl border border-slate-700 bg-slate-950 px-4 text-sm outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Upload Photos maximum 3.
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-950 hover:bg-slate-900 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <FiUploadCloud className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-xs text-slate-300 font-medium">
                      {isUploading ? "Processing..." : "Click to upload photos"}
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedPhotos.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {uploadedPhotos.map((_, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
                      <FiCheckCircle className="text-amber-400" />
                      <span>Photo {index + 1} uploaded</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full h-[54px] rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
            >
              Generate Posters
              <FiArrowRight className="text-lg" />
            </button>
          </form>
        )}

        {isGenerating && (
          <div className="py-16 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-base font-bold text-amber-400">Generating posters...</h3>
          </div>
        )}

        {isGenerated && !isGenerating && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
              <span className="text-xs text-amber-400 font-bold uppercase">Posters Generated Successfully! Choose to Download or Save.</span>
              <button
                onClick={handleReset}
                className="text-xs text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <FiRefreshCw /> Edit Details / Reset
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
             
              {/* ================= POSTER 1 ================= */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">Golden theme</span>
                
                <div 
                  onClick={() => setPreviewPosterData({ id: 1, title: "স্টাইল ১: গোল্ডেন-এমেরাল্ড থিম" })}
                  className="cursor-pointer group relative transition-transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-emerald-400/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center z-10">
                    <span className="bg-slate-950 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                      <FiZoomIn /> Click to Preview
                    </span>
                  </div>

                  <div
                    ref={posterRef1}
                    className="w-[280px] h-[420px] bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 border-2 border-emerald-400 p-2.5 flex flex-col justify-between text-white shadow-xl text-left"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    <div className="w-full h-34 rounded-lg overflow-hidden border-2 border-emerald-400 bg-slate-800 shadow-md">
                      {uploadedPhotos.length > 0 ? (
                        <img src={uploadedPhotos[0]} alt="Leader" className="w-full h-full object-cover" crossOrigin="anonymous" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400 bg-slate-950/60">ছবি নেই</div>
                      )}
                    </div>

                    <div className="text-center my-0.5">
                      <span className="text-[9.5px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                        {formData.occasionType}
                      </span>
                      <h2 className="text-[11px] font-extrabold text-emerald-300 mt-1 leading-snug">"{formData.headlineText}"</h2>
                    </div>

                    <div className="bg-slate-900/90 border border-emerald-400/30 p-2 rounded-lg text-[8px] text-slate-200 leading-tight">
                      <p className="font-bold text-emerald-400 mb-0.5">মূলবার্তা:</p>
                      ১৯৭১ সালের রক্তক্ষয়ী সংগ্রাম ও লাখো শহীদের আত্মত্যাগের বিনিময়ে অর্জিত লাল-সবুজের পতাকা আজ বিশ্বমঞ্চে গৌরবের প্রতীক। এই বিশেষ দিনে দেশবাসীকে জানাই আন্তরিক শুভেচ্ছা।
                    </div>

                    <div className="bg-slate-950/95 border border-emerald-400/50 p-2 rounded-lg text-center space-y-0.5">
                      <h1 className="text-[12px] font-black text-emerald-400">{formData.name}</h1>
                      <p className="text-[9px] font-semibold text-slate-200">{formData.designation} — {formData.party}</p>
                      <p className="text-[8px] text-slate-400">এলাকা: {formData.location}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-[280px]">
                  <button
                    onClick={() => handleDownloadAndSave(posterRef1, 1, "emerald-theme")}
                    disabled={downloadingId === 1 || savingId === 1}
                    className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <FiDownload /> {downloadingId === 1 ? "Processing..." : "Download & Save"}
                  </button>
                  <button
                    onClick={() => handleSaveOnly(posterRef1, 1, "emerald-theme")}
                    disabled={savingId === 1 || downloadingId === 1}
                    title="Save to Database"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-emerald-400/50 hover:bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <FiSave className="text-sm" />
                  </button>
                </div>
              </div>

              {/* ================= POSTER 2 ================= */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-cyan-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">Violate theme</span>
                
                <div 
                  onClick={() => setPreviewPosterData({ id: 2, title: "স্টাইল ২: ভায়োলেট-সিয়ান থিম" })}
                  className="cursor-pointer group relative transition-transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-cyan-400/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center z-10">
                    <span className="bg-slate-950 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                      <FiZoomIn /> Click to Preview
                    </span>
                  </div>

                  <div
                    ref={posterRef2}
                    className="w-[280px] h-[420px] bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border-2 border-cyan-400 p-2.5 flex flex-col justify-between text-white shadow-xl text-left"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    <div className="text-center bg-cyan-500 text-slate-950 py-1 px-2 rounded-md font-black text-[10px] uppercase tracking-wider">
                      ★ {formData.occasionType} ★
                    </div>

                    <div className="text-center bg-slate-900/90 p-1.5 rounded-lg border border-cyan-400/30">
                      <h2 className="text-[11px] font-extrabold text-cyan-300 leading-snug">"{formData.headlineText}"</h2>
                    </div>

                    <div className="bg-slate-900/90 border border-cyan-400/30 p-1.5 rounded-lg text-[7.5px] text-slate-200 leading-tight">
                      <p className="font-bold text-cyan-400">★ বাণী:</p>
                      <p>{getEventText2()}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-32 h-36 rounded-lg overflow-hidden border-2 border-cyan-400 bg-slate-800 shrink-0 shadow-lg">
                        {uploadedPhotos.length > 0 ? (
                          <img src={uploadedPhotos[0]} alt="Leader" className="w-full h-full object-cover" crossOrigin="anonymous" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[8.5px] text-slate-400 bg-slate-950/60">ছবি নেই</div>
                        )}
                      </div>
                      <div className="flex-1 bg-slate-950/95 border border-cyan-400/50 p-2 rounded-lg space-y-0.5">
                        <h1 className="text-[11px] font-black text-cyan-400">{formData.name}</h1>
                        <p className="text-[8.5px] font-semibold text-slate-200">{formData.designation}</p>
                        <p className="text-[7.5px] text-cyan-200">{formData.party}</p>
                        <p className="text-[7.5px] text-slate-400">{formData.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-[280px]">
                  <button
                    onClick={() => handleDownloadAndSave(posterRef2, 2, "cyan-theme")}
                    disabled={downloadingId === 2 || savingId === 2}
                    className="flex-1 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <FiDownload /> {downloadingId === 2 ? "Processing..." : "Download & Save"}
                  </button>
                  <button
                    onClick={() => handleSaveOnly(posterRef2, 2, "cyan-theme")}
                    disabled={savingId === 2 || downloadingId === 2}
                    title="Save to Database"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-cyan-400/50 hover:bg-slate-800 text-cyan-400 font-bold text-xs flex items-center justify-center transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <FiSave className="text-sm" />
                  </button>
                </div>
              </div>

              {/* ================= POSTER 3 ================= */}
              <div className="flex flex-col items-center space-y-3">
                <span className="text-xs font-bold text-amber-400 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">Amber theme</span>
                
                <div 
                  onClick={() => setPreviewPosterData({ id: 3, title: "স্টাইল ৩: অরেঞ্জ-অ্যাম্বার থিম" })}
                  className="cursor-pointer group relative transition-transform hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 bg-amber-400/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity flex items-center justify-center z-10">
                    <span className="bg-slate-950 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                      <FiZoomIn /> Click to Preview
                    </span>
                  </div>

                  <div
                    ref={posterRef3}
                    className="w-[280px] h-[420px] relative border-2 border-amber-400 rounded-lg overflow-hidden shadow-xl text-left"
                    style={{ fontFamily: "sans-serif" }}
                  >
                    <div className="absolute inset-0 w-full h-full z-0">
                      {uploadedPhotos.length > 0 ? (
                        <img src={uploadedPhotos[0]} alt="Leader Background" className="w-full h-full object-cover" crossOrigin="anonymous" />
                      ) : (
                        <div className="w-full h-full bg-slate-950 flex items-center justify-center text-xs text-slate-500">ছবি নেই</div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50"></div>
                    </div>

                    <div className="relative z-10 w-full h-full p-2.5 flex flex-col justify-between text-white">
                      <div className="space-y-1">
                        <span className="inline-block text-[9px] uppercase tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-black">
                          {formData.occasionType}
                        </span>
                        <h2 className="text-[11px] font-extrabold text-amber-300 leading-snug drop-shadow">
                          "{formData.headlineText}"
                        </h2>
                      </div>

                      <div className="bg-slate-900/85 backdrop-blur-xs border-l-3 border-amber-400 p-1.5 rounded-r-lg text-[7.5px] text-slate-200 leading-tight">
                        <p className="font-bold text-amber-400">★ অঙ্গীকার:</p>
                        <p>{getEventText3()}</p>
                      </div>

                      <div className="bg-slate-950/90 backdrop-blur-xs border border-amber-400/40 p-2 rounded-lg text-center space-y-0.5">
                        <h1 className="text-[11.5px] font-black text-amber-400">{formData.name}</h1>
                        <p className="text-[8.5px] font-semibold text-slate-200">{formData.designation}, {formData.party}</p>
                        <p className="text-[7.5px] text-slate-400">{formData.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-[280px]">
                  <button
                    onClick={() => handleDownloadAndSave(posterRef3, 3, "amber-theme")}
                    disabled={downloadingId === 3 || savingId === 3}
                    className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <FiDownload /> {downloadingId === 3 ? "Processing..." : "Download & Save"}
                  </button>
                  <button
                    onClick={() => handleSaveOnly(posterRef3, 3, "amber-theme")}
                    disabled={savingId === 3 || downloadingId === 3}
                    title="Save to Database"
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-amber-400/50 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center transition-all shadow cursor-pointer disabled:opacity-50"
                  >
                    <FiSave className="text-sm" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* FULLSCREEN PREVIEW MODAL */}
        {previewPosterData && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-amber-400/50 rounded-3xl p-6 max-w-lg w-full text-center relative shadow-2xl space-y-4">
              <button
                onClick={() => setPreviewPosterData(null)}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 text-amber-400 p-2 rounded-full transition cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
              
              <h3 className="text-lg font-black text-amber-400">{previewPosterData.title}</h3>
              <p className="text-xs text-slate-400">পোস্টারটি প্রিভিউ মোডে দেখতে পাচ্ছেন। নিচের বাটন দিয়ে ডাউনলোড বা সেভ করতে পারবেন।</p>

              <div className="flex justify-center py-2 overflow-auto max-h-[65vh]">
                {previewPosterData.id === 1 && (
                  <div className="transform scale-110 origin-top">
                    <div className="w-[280px] h-[420px] bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-900 border-2 border-emerald-400 p-2.5 flex flex-col justify-between text-white text-left shadow-xl">
                      <div className="w-full h-34 rounded-lg overflow-hidden border-2 border-emerald-400 bg-slate-800">
                        {uploadedPhotos.length > 0 ? <img src={uploadedPhotos[0]} alt="Leader" className="w-full h-full object-cover" crossOrigin="anonymous" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">ছবি নেই</div>}
                      </div>
                      <div className="text-center my-0.5">
                        <span className="text-[9.5px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">{formData.occasionType}</span>
                        <h2 className="text-[11px] font-extrabold text-emerald-300 mt-1 leading-snug">"{formData.headlineText}"</h2>
                      </div>
                      <div className="bg-slate-900/90 border border-emerald-400/30 p-2 rounded-lg text-[8px] text-slate-200 leading-tight">
                        <p className="font-bold text-emerald-400 mb-0.5">মূলবার্তা:</p>
                        ১৯৭১ সালের রক্তক্ষয়ী সংগ্রাম ও লাখো শহীদের আত্মত্যাগের বিনিময়ে অর্জিত লাল-সবুজের পতাকা আজ বিশ্বমঞ্চে গৌরবের প্রতীক। এই বিশেষ দিনে দেশবাসীকে জানাই আন্তরিক শুভেচ্ছা।
                      </div>
                      <div className="bg-slate-950/95 border border-emerald-400/50 p-2 rounded-lg text-center space-y-0.5">
                        <h1 className="text-[12px] font-black text-emerald-400">{formData.name}</h1>
                        <p className="text-[9px] font-semibold text-slate-200">{formData.designation} — {formData.party}</p>
                        <p className="text-[8px] text-slate-400">এলাকা: {formData.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                {previewPosterData.id === 2 && (
                  <div className="transform scale-110 origin-top">
                    <div className="w-[280px] h-[420px] bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 border-2 border-cyan-400 p-2.5 flex flex-col justify-between text-white text-left shadow-xl">
                      <div className="text-center bg-cyan-500 text-slate-950 py-1 px-2 rounded-md font-black text-[10px] uppercase tracking-wider">★ {formData.occasionType} ★</div>
                      <div className="text-center bg-slate-900/90 p-1.5 rounded-lg border border-cyan-400/30">
                        <h2 className="text-[11px] font-extrabold text-cyan-300 leading-snug">"{formData.headlineText}"</h2>
                      </div>
                      <div className="bg-slate-900/90 border border-cyan-400/30 p-1.5 rounded-lg text-[7.5px] text-slate-200 leading-tight">
                        <p className="font-bold text-cyan-400">★ বাণী:</p>
                        <p>{getEventText2()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-36 rounded-lg overflow-hidden border-2 border-cyan-400 bg-slate-800 shrink-0">
                          {uploadedPhotos.length > 0 ? <img src={uploadedPhotos[0]} alt="Leader" className="w-full h-full object-cover" crossOrigin="anonymous" /> : <div className="w-full h-full flex items-center justify-center text-[8.5px] text-slate-400">ছবি নেই</div>}
                        </div>
                        <div className="flex-1 bg-slate-950/95 border border-cyan-400/50 p-2 rounded-lg space-y-0.5">
                          <h1 className="text-[11px] font-black text-cyan-400">{formData.name}</h1>
                          <p className="text-[8.5px] font-semibold text-slate-200">{formData.designation}</p>
                          <p className="text-[7.5px] text-cyan-200">{formData.party}</p>
                          <p className="text-[7.5px] text-slate-400">{formData.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {previewPosterData.id === 3 && (
                  <div className="transform scale-110 origin-top">
                    <div className="w-[280px] h-[420px] relative border-2 border-amber-400 rounded-lg overflow-hidden text-left shadow-xl">
                      <div className="absolute inset-0 w-full h-full z-0">
                        {uploadedPhotos.length > 0 ? <img src={uploadedPhotos[0]} alt="Leader" className="w-full h-full object-cover" crossOrigin="anonymous" /> : <div className="w-full h-full bg-slate-950"></div>}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/50"></div>
                      </div>
                      <div className="relative z-10 w-full h-full p-2.5 flex flex-col justify-between text-white">
                        <div className="space-y-1">
                          <span className="inline-block text-[9px] uppercase tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md font-black">{formData.occasionType}</span>
                          <h2 className="text-[11px] font-extrabold text-amber-300 leading-snug drop-shadow">"{formData.headlineText}"</h2>
                        </div>
                        <div className="bg-slate-900/85 backdrop-blur-xs border-l-3 border-amber-400 p-1.5 rounded-r-lg text-[7.5px] text-slate-200 leading-tight">
                          <p className="font-bold text-amber-400">★ অঙ্গীকার:</p>
                          <p>{getEventText3()}</p>
                        </div>
                        <div className="bg-slate-950/90 backdrop-blur-xs border border-amber-400/40 p-2 rounded-lg text-center space-y-0.5">
                          <h1 className="text-[11.5px] font-black text-amber-400">{formData.name}</h1>
                          <p className="text-[8.5px] font-semibold text-slate-200">{formData.designation}, {formData.party}</p>
                          <p className="text-[7.5px] text-slate-400">{formData.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    if (previewPosterData.id === 1) handleDownloadAndSave(posterRef1, 1, "emerald-theme");
                    if (previewPosterData.id === 2) handleDownloadAndSave(posterRef2, 2, "cyan-theme");
                    if (previewPosterData.id === 3) handleDownloadAndSave(posterRef3, 3, "amber-theme");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow cursor-pointer"
                >
                  <FiDownload /> Download & Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}