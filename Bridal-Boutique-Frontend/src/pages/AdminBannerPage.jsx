import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

export default function AdminBannerPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    category_name: "",
    image: null,
  });
  const [previewUrl, setPreviewUrl] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(true);
  const [categoryError, setCategoryError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoryLoading(true);
      setCategoryError("");
      try {
        const response = await axios.get(`${API_BASE}/category/get_active_category.php`);
        const categoryList = response?.data?.data || [];
        setCategories(categoryList);
        if (categoryList.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category_id: String(categoryList[0].id),
            category_name: categoryList[0].name,
          }));
        }
      } catch (err) {
        console.error(err);
        setCategoryError("Unable to load categories. Please try again.");
      } finally {
        setCategoryLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const selectedCategoryName = useMemo(() => {
    return categories.find((category) => String(category.id) === String(formData.category_id))?.name || "";
  }, [categories, formData.category_id]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim() || !formData.description.trim() || !formData.image || !formData.category_id) {
      setError("Please fill the title, description, choose a category, and upload an image.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("banner_title", "spotlight");
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("category_id", formData.category_id);
      payload.append("category_name", selectedCategoryName);
      payload.append("image", formData.image);

      const response = await axios.post(`${API_BASE}/banner/add_banner.php`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.data?.success) {
        setSuccess("Banner saved successfully.");
        setFormData({
          title: "",
          description: "",
          category_id: formData.category_id,
          category_name: selectedCategoryName,
          image: null,
        });
        setPreviewUrl("");
      } else {
        setError(response?.data?.message || "Unable to save banner.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Network error while saving banner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f2] px-4 py-28 text-gray-700 md:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl rounded-3xl border border-[#e8dcc8] bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[4px] text-[#a97c50]">Banner Management</p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Create Spotlight Banner</h1>
          </div>
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-full border border-[#a97c50] px-5 py-2 text-sm font-semibold text-[#a97c50] transition hover:bg-[#a97c50] hover:text-white"
          >
            Back to Home
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Banner Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#a97c50]"
                placeholder="Crafted For Celebration"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Banner Description</label>
              <textarea
                rows="4"
                value={formData.description}
                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#a97c50]"
                placeholder="Beautiful bridal styles inspired by our latest collection."
              />
            </div>

          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">Banner Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-dashed border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Category Dropdown</label>
              <select
                value={formData.category_id}
                onChange={(event) => setFormData((prev) => ({ ...prev, category_id: event.target.value, category_name: event.target.selectedOptions[0]?.text || "" }))}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#a97c50]"
              >
                <option value="" disabled>
                  {categoryLoading ? "Loading categories..." : "Select a category"}
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categoryError ? <p className="mt-2 text-sm text-red-600">{categoryError}</p> : null}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#eee4d4] bg-[#fcfaf5] p-4">
              <p className="mb-3 text-sm font-medium">Image Preview</p>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-64 w-full rounded-xl object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 text-sm text-gray-500">
                  Preview will appear here after upload.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}
            {success ? <p className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">{success}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-[#a97c50] px-8 py-3 text-sm font-semibold uppercase tracking-[2px] text-white transition hover:bg-[#8c6539] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
