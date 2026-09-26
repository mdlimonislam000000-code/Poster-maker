'use client';
import { useState, useEffect, useRef } from 'react';
import { FiDownload, FiLoader, FiTrash2 } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { authClient } from "@/lib/auth-client";

export default function AllContent() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || "user_limon_mia";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!userId) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);

        // একসাথে poster এবং template দুই জায়গা থেকেই ডাটা ফেচ করা হচ্ছে
        const [postersRes, templatesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${userId}/posters`),
          fetch(`http://localhost:5000/api/templates/user/${userId}`)
        ]);

        const postersData = await postersRes.json();
        const templatesData = await templatesRes.json();

        let combinedItems: any[] = [];

        // Posters যোগ করা (যদি সফল হয়)
        if (postersData.success && Array.isArray(postersData.data)) {
          const formattedPosters = postersData.data.map((p: any) => ({
            ...p,
            dataType: 'poster' // চেনার জন্য টাইপ ট্যাগ যুক্ত করা হলো
          }));
          combinedItems = [...combinedItems, ...formattedPosters];
        }

        // Templates যোগ করা (যদি সফল হয়)
        if (templatesData.success && Array.isArray(templatesData.data)) {
          const formattedTemplates = templatesData.data.map((t: any) => ({
            ...t,
            dataType: 'template' // চেনার জন্য টাইপ ট্যাগ যুক্ত করা হলো
          }));
          combinedItems = [...combinedItems, ...formattedTemplates];
        }

        // চাইলে createdAt অনুযায়ী সর্ট করে লেটেস্টগুলো আগে দেখাতে পারেন
        combinedItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setItems(combinedItems);

        if (!postersData.success && !templatesData.success) {
          setError('Data load korte somossa hoyeche.');
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError('Server connection stapon kora sombhob hoyni.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userId]);

  const handleDownload = async (itemId: string, itemName: string) => {
    const element = itemRefs.current[itemId];
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#0f172a",
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${itemName || 'design'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Download korte somossa hoyeche.");
    }
  };

  // dataType অনুযায়ী সঠিক API তে DELETE রিকোয়েস্ট পাঠানোর ফাংশন
  const handleDelete = async (itemId: string, dataType: string) => {
    const confirmMsg = dataType === 'poster' 
      ? "Apni ki nischot je ei poster-ti delete korte chan?" 
      : "Apni ki nischot je ei template-ti delete korte chan?";

    if (!confirm(confirmMsg)) return;

    try {
      setDeletingId(itemId);
      
      // dataType এর ওপর ভিত্তি করে সঠিক endpoint সিলেক্ট করা হচ্ছে
      const endpoint = dataType === 'poster' 
        ? `http://localhost:5000/api/posters/${itemId}`
        : `http://localhost:5000/api/templates/${itemId}`; // অথবা আপনার টেমপ্লেট ডিলিট রুট

      const response = await fetch(endpoint, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setItems((prev) => prev.filter((item) => item._id !== itemId));
      } else {
        alert(result.message || "Delete korte somossa hoyeche.");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Server error hoyeche.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-xs">
        <FiLoader className="animate-spin text-amber-400 text-lg" /> Shob content load hocche...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-xs text-center">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs space-y-2">
        <p>Apnar ei account-e ekhono kono poster ba template songrokkhito nei.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const data = item.formData || item;
        const itemImage = 
          item.generatedImageUrl || 
          item.photos?.[0] || 
          item.photo || 
          data.photos?.[0] || 
          null;

        const titleText = item.title || data.headlineText || data.name || 'Design';

        return (
          <div key={item._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
            
            <div 
              ref={(el) => { itemRefs.current[item._id] = el; }}
              style={{ 
                backgroundColor: "#0f172a", 
                color: "#ffffff", 
                padding: "16px", 
                borderRadius: "12px", 
                fontFamily: "sans-serif" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "10px", backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#fbbf24", padding: "2px 8px", borderRadius: "4px", fontWeight: "bold", textTransform: "uppercase" }}>
                  {item.dataType === 'poster' ? (data.occasionType || 'Poster') : (item.category || 'Template')}
                </span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Tarikh nei'}
                </span>
              </div>

              {/* Image Box */}
              <div style={{ width: "100%", height: "140px", backgroundColor: "#020617", borderRadius: "8px", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                {itemImage ? (
                  <img src={itemImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                ) : (
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Kono chobi dewa hoyni</div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px", background: "linear-gradient(to top, rgba(2, 6, 23, 0.9), transparent)" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#fde047", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    "{titleText}"
                  </h3>
                </div>
              </div>

              <div style={{ marginTop: "8px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff", margin: "0 0 4px 0" }}>
                  {data.name ? `Nam: ${data.name}` : `Title: ${item.title || 'N/A'}`}
                </h4>
                {data.designation && (
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 2px 0" }}>
                    Podobi: <span style={{ color: "#e2e8f0" }}>{data.designation}</span> {data.party ? `(${data.party})` : ''}
                  </p>
                )}
                {data.location && (
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Elaka: {data.location}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownload(item._id, titleText)}
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <FiDownload /> Download HD
              </button>

              <button
                onClick={() => handleDelete(item._id, item.dataType)}
                disabled={deletingId === item._id}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                title="Delete Item"
              >
                {deletingId === item._id ? (
                  <FiLoader className="animate-spin text-sm" />
                ) : (
                  <FiTrash2 className="text-sm" />
                )}
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}