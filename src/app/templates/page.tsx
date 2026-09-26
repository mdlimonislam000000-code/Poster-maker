"use client";

import { useState, useRef } from "react";
import { FiLayout, FiX, FiDownload, FiUpload, FiZoomIn, FiZoomOut, FiRefreshCw, FiMaximize2, FiCheck } from "react-icons/fi";
import * as htmlToImage from "html-to-image";
import { authClient } from "@/lib/auth-client";

export default function UniversalPosterMaker() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingTemplate, setPendingTemplate] = useState<any>(null);
  const posterRef = useRef<HTMLDivElement>(null);

  const { data: session } = authClient.useSession();
  const user_Id = session?.user?.id;

  const [editableTexts, setEditableTexts] = useState({
    headline: "",
    subHeadline: "",
    description: "",
    name: "আপনার নাম এখানে",
    designation: "পদবী ও সংগঠনের নাম \ এলাকা বা শাখার নাম",
  });

  const templates = [
    {
      id: "1",
      title: "Golden Victory Day Theme",
      category: "victory",
      defaultHeadline: "মহান বিজয় দিবস",
      defaultSubHeadline: "“মহান বিজয় দিবসের আন্তরিক শুভেচ্ছা ও অভিনন্দন”",
      defaultDesc: "অঙ্গীকার: দেশের স্বাধীনতা ও সার্বভৌমত্ব রক্ষায় এবং সাধারণ মানুষের কল্যাণে ঐক্যবদ্ধভাবে কাজ করার দৃঢ় প্রত্যয়।",
      borderColor: "#f59e0b",
      badgeBg: "#f59e0b",
      badgeText: "#000000",
      accentColor: "#fbbf24",
      gradient: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
    },
    {
      id: "2",
      title: "Emerald Ramadan Theme",
      category: "festival",
      defaultHeadline: "পবিত্র মাহে রমজান",
      defaultSubHeadline: "“আত্মশুদ্ধি, সংযম ও ইবাদতের পবিত্র মাস”",
      defaultDesc: "বাণী: সিয়াম সাধনার মাধ্যমে আমাদের অন্তরের সব কালিমা দূর করে মানবকল্যাণে কাজ করার মাস হলো রমজান।",
      borderColor: "#10b981",
      badgeBg: "#10b981",
      badgeText: "#000000",
      accentColor: "#34d399",
      gradient: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(2,44,34,0.6) 60%, transparent 100%)",
    },
    {
      id: "3",
      title: "Royal Indigo Election Campaign Theme",
      category: "campaign",
      defaultHeadline: "আসন্ন নির্বাচন ২০২৬",
      defaultSubHeadline: "“উন্নয়ন, শান্তি ও সাম্যের পক্ষে ঐক্যবদ্ধ হোন”",
      defaultDesc: "প্রত্যাশা: জনগণের মৌলিক অধিকার রক্ষা এবং এলাকার সার্বিক উন্নয়নে সততা ও নিষ্ঠার সাথে কাজ করা।",
      borderColor: "#6366f1",
      badgeBg: "#6366f1",
      badgeText: "#ffffff",
      accentColor: "#818cf8",
      gradient: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(30,27,75,0.6) 60%, transparent 100%)",
    },
    {
      id: "4",
      title: "Crimson Red Condolence and Remembrance Theme",
      category: "condolence",
      defaultHeadline: "গভীর শোক ও শ্রদ্ধাঞ্জলি",
      defaultSubHeadline: "“স্মরণে ও শ্রদ্ধায় আমরা চিরকৃতজ্ঞ”",
      defaultDesc: "স্মৃতিচারণ: মহান এই দিনে জাতির শ্রেষ্ঠ সন্তানদের অবদান শ্রদ্ধাভরে স্মরণ করছি এবং তাদের বিদেহী আত্মার শান্তি কামনা করি।",
      borderColor: "#f43f5e",
      badgeBg: "#e11d48",
      badgeText: "#ffffff",
      accentColor: "#fb7185",
      gradient: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(76,5,25,0.6) 60%, transparent 100%)",
    }
  ];

  const filteredTemplates = selectedCategory === "all"
    ? templates
    : templates.filter(t => t.category === selectedCategory);

  const handleUseTemplateClick = (tpl: any) => {
    setPendingTemplate(tpl);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && pendingTemplate) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setUserPhoto(uploadEvent.target.result as string);
          setZoomLevel(1);
          setImagePosition({ x: 0, y: 0 });
          setActiveTemplate(pendingTemplate);
          setEditableTexts({
            headline: pendingTemplate.defaultHeadline,
            subHeadline: pendingTemplate.defaultSubHeadline,
            description: pendingTemplate.defaultDesc,
            name: "আপনার নাম এখানে",
            designation: "পদবী ও সংগঠনের নাম / এলাকা বা শাখার নাম",
          });
          setIsModalOpen(true);
          setSaveSuccess(false);
        }
      };

      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, field: string) => {
    setEditableTexts(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownloadAndSave = async () => {
    if (posterRef.current && activeTemplate) {
      try {
        setIsSaving(true);
        const dataUrl = await htmlToImage.toPng(posterRef.current, {
          cacheBust: true,
          quality: 0.95
        });

        const response = await fetch("http://localhost:5000/api/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user_Id ,
            title: activeTemplate.title,
            category: activeTemplate.category,
            defaultHeadline: editableTexts.headline,
            defaultSubHeadline: editableTexts.subHeadline,
            defaultDesc: editableTexts.description,
            borderColor: activeTemplate.borderColor,
            badgeBg: activeTemplate.badgeBg,
            badgeText: activeTemplate.badgeText,
            accentColor: activeTemplate.accentColor,
            gradient: activeTemplate.gradient,
            generatedImageUrl: dataUrl,
          }),
        });

        const result = await response.json();
        if (result.success || response.ok) {
          setSaveSuccess(true);
        }

        const link = document.createElement("a");
        link.download = `poster-${activeTemplate?.id || "custom"}.png`;
        link.href = dataUrl;
        link.click();

      } catch (err) {
        console.error("Poster save or download failed:", err);
        alert("Sorry, poster save or download failed.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-white p-6 md:p-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-white/10 pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <FiLayout className="text-amber-400" /> Universal Poster Maker
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Universal template poster maker you can use for any occasion.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Themes" },
              { id: "victory", label: "Victory Day" },
              { id: "festival", label: "Ramadan & Festivals" },
              { id: "campaign", label: "Election & Campaign" },
              { id: "condolence", label: "Condolence & Remembrance" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-amber-400 text-slate-950 shadow"
                    : "bg-neutral-900 text-slate-300 hover:bg-neutral-800 border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((tpl) => (
            <div
              key={tpl.id}
              className="bg-[#121824] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-4 shadow-xl hover:border-amber-400/50 transition-all group"
            >
              <div
                className="w-full h-72 rounded-xl flex flex-col justify-between p-3 text-center relative overflow-hidden shadow-2xl bg-cover bg-center"
                style={{
                  border: `2px solid ${tpl.borderColor}`,
                  backgroundImage: `url('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80')`
                }}
              >
                <div className="absolute inset-0" style={{ background: tpl.gradient }}></div>
                <div className="relative z-10 space-y-1">
                  <span
                    className="inline-block font-black text-[9px] py-0.5 px-2.5 rounded-full shadow"
                    style={{ backgroundColor: tpl.badgeBg, color: tpl.badgeText }}
                  >
                    {tpl.defaultHeadline}
                  </span>
                  <p className="text-[9px] font-semibold leading-tight" style={{ color: tpl.accentColor }}>{tpl.defaultSubHeadline}</p>
                </div>
                <div className="relative z-10 bg-black/70 p-2 rounded-lg border border-white/10 text-[8px] text-slate-300 text-left">
                  <p className="line-clamp-3">{tpl.defaultDesc}</p>
                </div>
                <div className="relative z-10 bg-black/90 p-1.5 rounded-lg border border-white/10 text-center">
                  <p className="text-[10px] font-bold text-white">আপনার নাম</p>
                  <p className="text-[7px] text-slate-400">আপনার পদবী ও পরিচয়</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-white line-clamp-1">{tpl.title}</h3>
                <button
                  onClick={() => handleUseTemplateClick(tpl)}
                  className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
                >
                  Use Template  <FiUpload size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && activeTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-[#121824] border border-white/15 rounded-3xl max-w-5xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold text-white">Picture Zoom and Customization</h2>
                <p className="text-xs text-slate-400">{activeTemplate.title} (Double click to zoom)</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white bg-neutral-900 p-2.5 rounded-full cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-5 bg-[#0b0f17] p-5 rounded-2xl border border-white/10">
                <div className="space-y-2 border-b border-white/10 pb-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FiZoomIn size={14} /> Picture Zoom & Position
                    </label>
                    <button
                      onClick={() => { setZoomLevel(1); setImagePosition({ x: 0, y: 0 }); }}
                      className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <FiRefreshCw size={10} /> Reset
                    </button>
                  </div>

                  <div className="flex items-center gap-3 pt-1">
                    <FiZoomOut className="text-slate-400" size={14} />
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.05"
                      value={zoomLevel}
                      onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                    <FiZoomIn className="text-slate-400" size={14} />
                  </div>
                  <p className="text-[10px] text-slate-500">Tip: Double-click the preview image to see it in full-screen.</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">Customize Poster Text</label>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Main Headline</label>
                    <input
                      type="text"
                      value={editableTexts.headline}
                      onChange={(e) => handleTextChange(e, 'headline')}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs font-bold focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Sub heading</label>
                    <input
                      type="text"
                      value={editableTexts.subHeadline}
                      onChange={(e) => handleTextChange(e, 'subHeadline')}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-slate-200 text-xs focus:border-amber-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Main Description</label>
                    <textarea
                      value={editableTexts.description}
                      onChange={(e) => handleTextChange(e, 'description')}
                      className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-slate-300 text-xs resize-none focus:border-amber-400 outline-none"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={editableTexts.name}
                        onChange={(e) => handleTextChange(e, 'name')}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-white text-xs font-bold focus:border-amber-400 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Designation & Identity</label>
                      <textarea
                        value={editableTexts.designation}
                        onChange={(e) => handleTextChange(e, 'designation')}
                        className="w-full p-2.5 rounded-lg bg-neutral-900 border border-white/10 text-amber-300 text-xs resize-none focus:border-amber-400 outline-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-start sticky top-8 h-fit">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <FiMaximize2 size={12} /> Live Preview
                </span>

                <div
                  ref={posterRef}
                  id="poster-box"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onDoubleClick={() => setIsFullscreen(true)}
                  className="w-80 h-[480px] rounded-2xl flex flex-col justify-between p-4 text-center relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none bg-black"
                  style={{ border: `2px solid ${activeTemplate.borderColor}` }}
                >
                  {userPhoto && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <img
                        src={userPhoto}
                        alt="User"
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-75"
                        style={{
                          transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`
                        }}
                      />
                    </div>
                  )}

                  <div className="absolute inset-0 pointer-events-none" style={{ background: activeTemplate.gradient }}></div>

                  <div className="relative z-10 space-y-2 mt-2 pointer-events-none">
                    <span
                      className="inline-block font-black text-sm py-1 px-3 rounded-full shadow-lg"
                      style={{ backgroundColor: activeTemplate.badgeBg, color: activeTemplate.badgeText }}
                    >
                      {editableTexts.headline}
                    </span>
                    <p className="text-xs font-bold px-2 leading-snug" style={{ color: activeTemplate.accentColor }}>
                      {editableTexts.subHeadline}
                    </p>
                  </div>

                  <div className="relative z-10 p-3 rounded-xl border border-white/15 text-[11px] text-slate-200 text-left shadow-lg pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <p className="leading-relaxed">{editableTexts.description}</p>
                  </div>

                  <div className="relative z-10 p-3 rounded-xl border border-white/20 shadow-2xl text-center mt-auto pointer-events-none" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
                    <p className="text-sm font-black text-white">{editableTexts.name}</p>
                    <p className="text-[10px] font-medium whitespace-pre-line mt-1" style={{ color: activeTemplate.accentColor }}>
                      {editableTexts.designation}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full mt-5">
                  <button
                    onClick={handleDownloadAndSave}
                    disabled={isSaving}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    <FiDownload size={16} /> {isSaving ? "Saving Your Photo..." : "Save and Download Poster"}
                  </button>

                  {saveSuccess && (
                    <p className="text-[11px] text-emerald-400 text-center flex items-center justify-center gap-1 font-semibold">
                      <FiCheck size={14} /> Successfully saved
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFullscreen && activeTemplate && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-lg p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white bg-neutral-900 hover:bg-neutral-800 p-3 rounded-full cursor-pointer shadow-xl transition-colors"
          >
            <FiX size={22} />
          </button>

          <p className="text-xs text-amber-400 mb-4 font-semibold">Live Preview</p>

          <div
            className="w-[360px] h-[540px] md:w-[420px] md:h-[630px] rounded-3xl flex flex-col justify-between p-6 text-center relative overflow-hidden shadow-2xl bg-black"
            style={{ border: `2px solid ${activeTemplate.borderColor}` }}
          >
            {userPhoto && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img
                  src={userPhoto}
                  alt="User Full"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover absolute inset-0"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`
                  }}
                />
              </div>
            )}

            <div className="absolute inset-0 pointer-events-none" style={{ background: activeTemplate.gradient }}></div>

            <div className="relative z-10 space-y-3 mt-2">
              <span
                className="inline-block font-black text-base py-1.5 px-5 rounded-full shadow-lg"
                style={{ backgroundColor: activeTemplate.badgeBg, color: activeTemplate.badgeText }}
              >
                {editableTexts.headline}
              </span>
              <p className="text-sm font-bold px-2 leading-snug" style={{ color: activeTemplate.accentColor }}>
                {editableTexts.subHeadline}
              </p>
            </div>

            <div className="relative z-10 p-4 rounded-xl border border-white/15 text-xs text-slate-200 text-left shadow-lg" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
              <p className="leading-relaxed">{editableTexts.description}</p>
            </div>

            <div className="relative z-10 p-4 rounded-xl border border-white/20 shadow-2xl text-center mt-auto" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
              <p className="text-base font-black text-white">{editableTexts.name}</p>
              <p className="text-xs font-medium whitespace-pre-line mt-1" style={{ color: activeTemplate.accentColor }}>
                {editableTexts.designation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}