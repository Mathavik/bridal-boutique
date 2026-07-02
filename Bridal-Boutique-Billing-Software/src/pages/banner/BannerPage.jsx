import { useRef, useState } from "react";
import api from "../../services/api";
import { ImagePlus, UploadCloud, Sparkles } from "lucide-react";

export default function BannerPage() {
  const [bannerTitle, setBannerTitle] = useState("");
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    console.log("Banner image change event:", e.target.files);
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    if (!file) {
      setPreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      console.log("Banner preview loaded");
    };
    reader.onerror = (error) => {
      console.error("Banner preview error:", error);
      setPreview("");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!bannerTitle.trim() || !title.trim() || !imageFile) {
      setMessage({ type: "error", text: "Please fill all fields and choose an image." });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("banner_title", bannerTitle.trim());
    formData.append("title", title.trim());
    formData.append("image", imageFile);

    for (const [key, value] of formData.entries()) {
      console.log("FormData entry:", key, value);
    }

    try {
      const res = await api.post("banner/add_banner.php", formData);
      console.log("Banner upload response:", res);

      if (res.data?.success) {
        setMessage({ type: "success", text: res.data.message || "Banner saved successfully." });
        setBannerTitle("");
        setTitle("");
        setImageFile(null);
        setPreview("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setMessage({ type: "error", text: res.data?.message || "Unable to save banner." });
        console.error("Banner upload failed response:", res.data);
      }
    } catch (err) {
      console.error("Banner upload exception:", err);
      setMessage({ type: "error", text: "Server error while saving banner." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 md:p-6">
      <div className="mx-auto max-w-6xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(37,99,235,0.12)] md:p-8">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
              <Sparkles size={16} />
              Banner Management
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Add a new banner for your store</h1>
            <p className="mt-1 text-sm text-slate-500">
              Upload a banner image and publish it through the existing backend API with the same blue-purple dashboard style.
            </p>
          </div>
        </div>

        {message.text ? (
          <div
            className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Banner Title</label>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="e.g. Home Banner"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Banner Subtitle / Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New Collection"
                className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-blue-500"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Banner Image</label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[20px] border border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-indigo-50 px-4 py-8 text-center transition hover:border-blue-500">
                <UploadCloud size={24} className="mb-2 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Click to upload image</span>
                <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#1f8cff] to-[#4338ca] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Banner"}
            </button>
          </form>

          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-[#1f8cff] to-[#4338ca] p-5 text-white">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <ImagePlus size={22} />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Preview</h2>
                <p className="text-sm text-white/80">Your selected banner will appear here.</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[20px] border border-white/20 bg-white/10 backdrop-blur-sm">
              {preview ? (
                <img src={preview} alt="Banner preview" className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center bg-white/10 text-center text-sm text-white/80">
                  Upload an image to preview it here.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
