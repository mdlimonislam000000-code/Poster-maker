'use client';
import { useState, useEffect, useRef } from 'react';
import { FiDownload, FiLoader, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import { authClient } from "@/lib/auth-client";

export default function AllContent() {
  const router = useRouter();
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

        const [postersRes, templatesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/users/${userId}/posters`),
          fetch(`http://localhost:5000/api/templates/user/${userId}`)
        ]);

        const postersData = await postersRes.json();
        const templatesData = await templatesRes.json();

        let combinedItems: any[] = [];

        if (postersData.success && Array.isArray(postersData.data)) {
          const formattedPosters = postersData.data.map((p: any) => ({
            ...p,
            dataType: 'poster'
          }));
          combinedItems = [...combinedItems, ...formattedPosters];
        }

        if (templatesData.success && Array.isArray(templatesData.data)) {
          const formattedTemplates = templatesData.data.map((t: any) => ({
            ...t,
            dataType: 'template'
          }));
          combinedItems = [...combinedItems, ...formattedTemplates];
        }

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

  const handleReuse = (dataType: string, itemId: string) => {
    if (dataType === 'template') {
      router.push(`/templates`);
    } else {
      router.push(`/create-poster`);
    }
  };

  const handleDelete = async (itemId: string, dataType: string) => {
    const confirmMsg = dataType === 'poster' 
      ? "Apni ki nischot je ei poster-ti delete korte chan?" 
      : "Apni ki nischot je ei template-ti delete korte chan?";

    if (!confirm(confirmMsg)) return;

    try {
      setDeletingId(itemId);
      const endpoint = dataType === 'poster' 
        ? `http://localhost:5000/api/posters/${itemId}`
        : `http://localhost:5000/api/templates/${itemId}`;

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
        const itemImage = item.generatedImageUrl;

        const titleText = item.title || data.headlineText || data.name || 'Design Title';
        const isTemplate = item.dataType === 'template';

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
                  {isTemplate ? (item.category || 'Template') : (data.occasionType || 'Poster')}
                </span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Tarikh nei'}
                </span>
              </div>

              {/* Poster Box - height বাড়িয়ে দিয়ে full দেখানোর ব্যবস্থা করা হয়েছে */}
              <div style={{ width: "100%", height: "380px", backgroundColor: "#020617", borderRadius: "8px", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {itemImage ? (
                  <img src={itemImage} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "contain" }} crossOrigin="anonymous" />
                ) : (
                  <div style={{ fontSize: "11px", color: "#64748b" }}>Kono chobi dewa hoyni</div>
                )}
              </div>

              {/* Title */}
              <div className="mt-3 text-center">
                <h3 className="text-sm font-bold text-amber-400 truncate">
                  {titleText}
                </h3>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownload(item._id, titleText)}
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
              >
                <FiDownload /> Download
              </button>

              <button
                onClick={() => handleReuse(item.dataType, item._id)}
                className="py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                title="Reuse Design"
              >
                <FiRefreshCw /> Reuse
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