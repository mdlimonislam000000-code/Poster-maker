"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { 
  FiUser, 
  FiBriefcase, 
  FiUsers, 
  FiMapPin, 
  FiFileText, 
  FiImage, 
  FiArrowRight, 
  FiCheckCircle 
} from "react-icons/fi";

type PosterFormData = {
  name: string;
  designation: string;
  party: string;
  location: string;
  occasionType: string;
  headlineText: string;
};

export default function CreatePosterPage() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PosterFormData>();

  // Handle Photo Selection (Max 3 photos)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      if (selectedFiles.length + photos.length > 3) {
        alert("You can upload a maximum of 3 photos.");
        return;
      }
      setPhotos((prev) => [...prev, ...selectedFiles].slice(0, 3));
    }
  };

  // Form Submit Handler
  const onSubmit = async (data: PosterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (photos.length === 0) {
        setErrorMessage("Please upload at least 1 photo.");
        setIsSubmitting(false);
        return;
      }

      // Here we will make the backend API call (for Poster + Photos upload)
      // e.g., creating a FormData object and sending a POST request to /api/posters.
      
      console.log("Form Data:", data);
      console.log("Photos:", photos);

      // Simulation of API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to dashboard or preview page on success
      router.push("/dashboard");

    } catch (error) {
      console.error("Poster creation failed:", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white px-4 py-12 flex items-center justify-center relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="relative w-full max-w-[800px] bg-[#0b1224] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/20 bg-amber-400/[0.06] mb-3">
            <span className="text-xs font-medium text-amber-400">AI Poster Creator</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create a New Poster</h1>
          <p className="text-sm text-slate-400 mt-1">
            Fill out the form below and upload your required photos.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Applicant Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text"
                  placeholder="e.g. Md. Rahim Mia"
                  {...register("name", { required: "Name is required" })}
                  className="w-full h-[48px] rounded-xl border border-slate-700 bg-[#111a31] text-white pl-11 pr-4 text-sm outline-none focus:border-amber-400 transition-all"
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Designation</label>
              <div className="relative">
                <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text"
                  placeholder="e.g. President, Ward No. 21"
                  {...register("designation", { required: "Designation is required" })}
                  className="w-full h-[48px] rounded-xl border border-slate-700 bg-[#111a31] text-white pl-11 pr-4 text-sm outline-none focus:border-amber-400 transition-all"
                />
              </div>
              {errors.designation && <p className="mt-1 text-xs text-red-400">{errors.designation.message}</p>}
            </div>

            {/* Party / Organization */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Party / Organization</label>
              <div className="relative">
                <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text"
                  placeholder="e.g. Local Committee"
                  {...register("party", { required: "Party or organization is required" })}
                  className="w-full h-[48px] rounded-xl border border-slate-700 bg-[#111a31] text-white pl-11 pr-4 text-sm outline-none focus:border-amber-400 transition-all"
                />
              </div>
              {errors.party && <p className="mt-1 text-xs text-red-400">{errors.party.message}</p>}
            </div>

            {/* Location / Thana / Zila */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Location / Area</label>
              <div className="relative">
                <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text"
                  placeholder="e.g. Mirpur, Dhaka"
                  {...register("location", { required: "Location is required" })}
                  className="w-full h-[48px] rounded-xl border border-slate-700 bg-[#111a31] text-white pl-11 pr-4 text-sm outline-none focus:border-amber-400 transition-all"
                />
              </div>
              {errors.location && <p className="mt-1 text-xs text-red-400">{errors.location.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Occasion Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Occasion Type</label>
              <select
                {...register("occasionType", { required: true })}
                className="w-full h-[48px] rounded-xl border border-slate-700 bg-[#111a31] text-white px-4 text-sm outline-none focus:border-amber-400 transition-all"
              >
                <option value="victory-day">Mahan Bijoy Dibosh</option>
                <option value="tribute">Tribute / Mourning</option>
                <option value="election">Election Campaign</option>
                <option value="greeting">Greetings (Eid / Festival)</option>
              </select>
            </div>

            {/* Bangla Headline Text */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Bangla Headline</label>
              <div className="relative">
                <FiFileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text"
                  placeholder="e.g. মহান বিজয় দিবসের শুভেচ্ছা"
                  {...register("headlineText", { required: "Headline is required" })}
                  className="w-full h-[48px] rounded-xl border border-slate-700 bg-[#111a31] text-white pl-11 pr-4 text-sm outline-none focus:border-amber-400 transition-all"
                />
              </div>
              {errors.headlineText && <p className="mt-1 text-xs text-red-400">{errors.headlineText.message}</p>}
            </div>
          </div>

          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Upload Photos (Max 3: Leader or personal photo)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-[#111a31] hover:bg-[#16223f] transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                  <FiImage className="w-8 h-8 text-amber-400 mb-2" />
                  <p className="text-xs text-slate-300">
                    <span className="font-semibold text-amber-400">Click to select photos</span> or drag & drop
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">PNG, JPG or WEBP (Max 3 photos)</p>
                </div>
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            {/* Selected Photos Preview */}
            {photos.length > 0 && (
              <div className="flex gap-3 mt-3 flex-wrap">
                {photos.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 bg-[#16223f] px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-300">
                    <FiCheckCircle className="text-amber-400" />
                    <span>{file.name.slice(0, 15)}...</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[52px] rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                Generating Poster...
              </>
            ) : (
              <>
                Generate Poster
                <FiArrowRight className="text-lg" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}