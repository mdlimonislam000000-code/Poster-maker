'use client';
import { useState, useEffect, useRef } from 'react';
import { FiDownload, FiLoader, FiTrash2 } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import { authClient } from "@/lib/auth-client";

export default function AllContent() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || "user_limon_mia";

  const [posters, setPosters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const posterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (!userId) return;

    const fetchUserPosters = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/users/${userId}/posters`);
        const result = await response.json();

        if (result.success) {
          setPosters(result.data);
        } else {
          setError(result.message || 'Failed to load posters');
        }
      } catch (err) {
        console.error("Error fetching posters:", err);
        setError('Server connection stapon kora sombhob hoyni.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPosters();
  }, [userId]);

  const handleDownload = async (posterId: string, posterName: string) => {
    const element = posterRefs.current[posterId];
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
      link.download = `${posterName || 'poster'}-design.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Poster download korte somossa hoyeche.");
    }
  };

  // Delete API call korar function
  const handleDelete = async (posterId: string) => {
    if (!confirm("Apni ki nischot je ei poster-ti delete korte chan?")) return;

    try {
      setDeletingId(posterId);
      const response = await fetch(`http://localhost:5000/api/posters/${posterId}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        // UI theke poster remove kora holo
        setPosters((prev) => prev.filter((p) => p._id !== posterId));
      } else {
        alert(result.message || "Poster delete korte somossa hoyeche.");
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
        <FiLoader className="animate-spin text-amber-400 text-lg" /> Poster shomuh load hocche...
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

  if (posters.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs space-y-2">
        <p>Apnar ei account-e ekhono kono poster songrokkhito nei.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posters.map((poster) => {
        const data = poster.formData || poster;
        
        const posterImage = 
          poster.generatedImageUrl || 
          poster.photos?.[0] || 
          poster.photo || 
          data.photos?.[0] || 
          null;

        return (
          <div key={poster._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-md flex flex-col justify-between">
            
            <div 
              ref={(el) => { posterRefs.current[poster._id] = el; }}
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
                  {data.occasionType || 'Poster'}
                </span>
                <span style={{ fontSize: "10px", color: "#94a3b8" }}>
                  {poster.createdAt ? new Date(poster.createdAt).toLocaleDateString() : 'Tarikh nei'}
                </span>
              </div>

              {/* Poster Image Box */}
              <div style={{ width: "100%", height: "140px", backgroundColor: "#020617", borderRadius: "8px", overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                {posterImage ? (
                  <img src={posterImage} alt="Poster Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} crossOrigin="anonymous" />
                ) : (
                  <div style={{ fontSize: "10px", color: "#64748b" }}>Kono chobi dewa hoyni</div>
                )}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "8px", background: "linear-gradient(to top, rgba(2, 6, 23, 0.9), transparent)" }}>
                  <h3 style={{ fontSize: "12px", fontWeight: "bold", color: "#fde047", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    "{data.headlineText || 'Swagotam'}"
                  </h3>
                </div>
              </div>

              <div style={{ marginTop: "8px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: "bold", color: "#ffffff", margin: "0 0 4px 0" }}>Nam: {data.name}</h4>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 2px 0" }}>
                  Podobi: <span style={{ color: "#e2e8f0" }}>{data.designation}</span> ({data.party})
                </p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Elaka: {data.location}</p>
              </div>
            </div>

            {/* Action Buttons (Download & Delete) */}
            <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownload(poster._id, data.name)}
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <FiDownload /> Download HD
              </button>

              <button
                onClick={() => handleDelete(poster._id)}
                disabled={deletingId === poster._id}
                className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs flex items-center justify-center transition cursor-pointer disabled:opacity-50"
                title="Delete Poster"
              >
                {deletingId === poster._id ? (
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